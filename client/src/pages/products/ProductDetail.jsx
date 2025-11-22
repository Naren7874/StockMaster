import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { ArrowLeft, Edit, Package, AlertTriangle, CheckCircle, TrendingDown, Box, DollarSign, AlertOctagon } from 'lucide-react';
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
                <Button onClick={() => navigate('/products')} className="mt-4">Go Back</Button>
            </div>
        </div>
    );

    const totalStock = stock.reduce((acc, s) => acc + s.quantity, 0);
    const isLowStock = totalStock < product.minStock;
    const isOutOfStock = totalStock === 0;

    // Dynamic Theme Colors
    const themeColor = isOutOfStock ? 'red' : isLowStock ? 'orange' : 'blue';
    const bgColor = isOutOfStock ? 'bg-red-50' : isLowStock ? 'bg-orange-50' : 'bg-gray-50';
    const borderColor = isOutOfStock ? 'border-red-200' : isLowStock ? 'border-orange-200' : 'border-gray-200';

    return (
        <div className={`min-h-screen pb-12 transition-colors duration-500 ${bgColor}`}>
            {/* Top Navigation Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/products')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h1>
                            <span className="text-xs text-gray-500 font-mono">{product.sku}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isLowStock && (
                            <span className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                <AlertOctagon className="w-4 h-4" />
                                {isOutOfStock ? 'Out of Stock' : 'Low Stock Alert'}
                            </span>
                        )}
                        <Button variant="outline" onClick={() => navigate(`/products/${id}/edit`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Hero Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Price Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Unit Price</p>
                            <p className="text-2xl font-bold text-gray-900">${product.price?.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Total Stock Card */}
                    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${isLowStock ? borderColor : 'border-gray-100'} flex items-center gap-4 relative overflow-hidden`}>
                        {isLowStock && <div className={`absolute inset-0 opacity-5 ${isOutOfStock ? 'bg-red-500' : 'bg-orange-500'}`}></div>}
                        <div className={`p-3 rounded-xl ${isLowStock ? (isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600') : 'bg-blue-50 text-blue-600'} z-10`}>
                            <Box className="w-6 h-6" />
                        </div>
                        <div className="z-10">
                            <p className="text-sm font-medium text-gray-500">Total Stock</p>
                            <div className="flex items-baseline gap-1">
                                <p className={`text-2xl font-bold ${isLowStock ? (isOutOfStock ? 'text-red-600' : 'text-orange-600') : 'text-gray-900'}`}>
                                    {totalStock}
                                </p>
                                <span className="text-sm text-gray-500">{product.uom}</span>
                            </div>
                        </div>
                    </div>

                    {/* Min Stock Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Min Stock Level</p>
                            <p className="text-2xl font-bold text-gray-900">{product.minStock} <span className="text-sm text-gray-400 font-normal">{product.uom}</span></p>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${product.isActive ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-500'}`}>
                            {product.isActive ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className={`text-lg font-bold ${product.isActive ? 'text-teal-700' : 'text-gray-600'}`}>
                                {product.isActive ? 'Active Product' : 'Inactive'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Description & Details */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">About Product</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                                    <p className="text-gray-900 font-medium">{product.category || 'Uncategorized'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                                        {product.description || 'No description available.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stock Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    Stock by Location
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Warehouse</th>
                                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {stock.map((item) => {
                                            const isItemLow = Number(item.quantity) < Number(product.minStock);
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-6 font-medium text-gray-900">{item.warehouse.name}</td>
                                                    <td className="py-4 px-6 text-gray-500 text-sm">{item.location?.name || 'General Stock'}</td>
                                                    <td className="py-4 px-6 text-right font-mono font-medium text-gray-900">
                                                        {item.quantity} <span className="text-gray-400 text-xs">{product.uom}</span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.quantity > 0
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {item.quantity > 0 ? 'Available' : 'Empty'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        {isItemLow && (
                                                            <button
                                                                onClick={() => handleReorder(item.warehouseId)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                                            >
                                                                Reorder
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {stock.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-12 text-center text-gray-500">
                                                    No stock recorded for this product.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reorder Modal - Premium Design */}
            {reorderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setReorderModalOpen(false)}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
                        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Confirm Reorder
                            </h3>
                            <button onClick={() => setReorderModalOpen(false)} className="text-white/80 hover:text-white">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                <p className="text-sm text-indigo-800 font-medium">
                                    Suggested Quantity Calculation
                                </p>
                                <p className="text-xs text-indigo-600 mt-1">
                                    Based on Minimum Stock ({product.minStock}) × 2 - Current Stock
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reorder Quantity
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        className="block w-full rounded-xl border-gray-300 pl-4 pr-12 py-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={editQty}
                                        onChange={(e) => setEditQty(e.target.value)}
                                        min="1"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">{product.uom}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    className="flex-1 bg-white py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => setReorderModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 bg-indigo-600 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={confirmReorder}
                                >
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
