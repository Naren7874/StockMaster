import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { ArrowLeft, Edit, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    const [reorderModalOpen, setReorderModalOpen] = useState(false);
    const [reorderData, setReorderData] = useState({ transaction: null, suggestedQty: 0 });
    const [editQty, setEditQty] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productData, stockData] = await Promise.all([
                    api.getProduct(id),
                    api.getProductStock(id)
                ]);
                setProduct(productData);
                setStock(stockData);
            } catch (error) {
                console.error('Failed to load product details', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleReorder = async (warehouseId) => {
        try {
            const data = await api.createReorder(id, warehouseId);
            setReorderData(data);
            setEditQty(data.suggestedQty);
            setReorderModalOpen(true);
        } catch (error) {
            alert('Failed to initiate reorder');
        }
    };

    const confirmReorder = async () => {
        try {
            if (editQty !== reorderData.suggestedQty) {
                // Update transaction if quantity changed
                await api.updateTransaction(reorderData.transaction.id, {
                    items: [{ productId: id, quantity: parseInt(editQty) }]
                });
            }
            await api.completeTransaction(reorderData.transaction.id);
            setReorderModalOpen(false);
            // Refresh data
            const [productData, stockData] = await Promise.all([
                api.getProduct(id),
                api.getProductStock(id)
            ]);
            setProduct(productData);
            setStock(stockData);
            alert('Reorder completed successfully');
        } catch (error) {
            alert('Failed to complete reorder');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const totalStock = stock.reduce((acc, s) => acc + s.quantity, 0);
    const stockStatus = totalStock === 0 ? 'OUT_OF_STOCK' : totalStock <= product.minStock ? 'LOW_STOCK' : 'OK';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/products')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-mono">{product.sku}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                        </div>
                    </div>
                </div>
                <Button onClick={() => navigate(`/products/${id}/edit`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Product
                </Button>
            </div>

            {/* Product Info Card */}
            <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Price</label>
                        <div className="text-2xl font-semibold">${product.price?.toFixed(2)}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Total Stock</label>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold">{totalStock} {product.uom}</span>
                            {stockStatus === 'LOW_STOCK' && (
                                <span className="badge badge-warning flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Low Stock
                                </span>
                            )}
                            {stockStatus === 'OUT_OF_STOCK' && (
                                <span className="badge badge-error flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Out of Stock
                                </span>
                            )}
                            {stockStatus === 'OK' && (
                                <span className="badge badge-success flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> In Stock
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div>
                            <span className={`badge ${product.isActive ? 'badge-success' : 'badge-neutral'}`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                {product.description && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="mt-2 text-gray-700">{product.description}</p>
                    </div>
                )}
            </div>

            {/* Stock Availability Table */}
            <div className="card p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Stock Availability per Location
                    </h3>
                </div>
                <table className="table w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left p-4">Warehouse</th>
                            <th className="text-left p-4">Location</th>
                            <th className="text-right p-4">Quantity</th>
                            <th className="text-center p-4">Status</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stock.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                <td className="p-4 font-medium">{item.warehouse.name}</td>
                                <td className="p-4 text-gray-500">{item.location?.name || 'General Stock'}</td>
                                <td className="p-4 text-right font-mono">
                                    {item.quantity} {product.uom}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`badge ${item.quantity > 0 ? 'badge-success' : 'badge-neutral'}`}>
                                        {item.quantity > 0 ? 'Available' : 'Empty'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {item.quantity < product.minStock && (
                                        <Button size="sm" variant="outline" onClick={() => handleReorder(item.warehouseId)}>
                                            Reorder
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {stock.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No stock recorded for this product.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reorder Modal */}
            {reorderModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Confirm Reorder</h3>
                        <p className="mb-4 text-gray-600">
                            Suggested quantity based on minimum stock level ({product.minStock}).
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                className="input w-full"
                                value={editQty}
                                onChange={(e) => setEditQty(e.target.value)}
                                min="1"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setReorderModalOpen(false)}>Cancel</Button>
                            <Button onClick={confirmReorder}>Confirm & Order</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
