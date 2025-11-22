import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ArrowLeft } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        minStock: ''
    });

    useEffect(() => {
        if (id) {
            const loadProduct = async () => {
                try {
                    const product = await api.getProduct(id);
                    setFormData({
                        name: product.name,
                        sku: product.sku,
                        category: product.category || '',
                        price: product.price || 0,
                        minStock: product.minStock || 0
                    });
                } catch (error) {
                    console.error('Failed to load product');
                }
            };
            loadProduct();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                minStock: parseInt(formData.minStock)
            };

            if (id) {
                await api.updateProduct(id, data);
            } else {
                await api.createProduct(data);
            }
            navigate('/products');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">{id ? 'Edit Product' : 'New Product'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
                <Input
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="SKU"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                    />
                    <Input
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <Input
                        label="Min Stock Level"
                        type="number"
                        min="0"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        {id ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
