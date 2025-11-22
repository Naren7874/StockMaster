import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useNavigate } from 'react-router-dom';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.deleteProduct(id);
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: 'Name', accessor: 'name', className: 'font-medium text-gray-900' },
        { header: 'SKU', accessor: 'sku' },
        { header: 'Category', accessor: 'category' },
        { header: 'Price', accessor: 'price', render: (row) => `$${row.price}` },
        {
            header: 'Stock', accessor: 'stock', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.currentStock <= row.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {row.currentStock}
                </span>
            )
        },
        {
            header: 'Actions', render: (row) => (
                <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/products/${row.id}/edit`); }} className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="p-1 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500">Manage your inventory items</p>
                </div>
                <Button onClick={() => navigate('/products/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 input w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
            </div>

            <Table
                columns={columns}
                data={filteredProducts}
                isLoading={loading}
                onRowClick={(row) => navigate(`/products/${row.id}`)}
            />
        </div>
    );
};

export default ProductsList;
