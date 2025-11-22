import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Warehouse, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useNavigate } from 'react-router-dom';

const Warehouses = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', shortcode: '', locationId: '', capacity: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [w, l] = await Promise.all([
                api.getWarehouses(),
                api.getLocations()
            ]);
            setWarehouses(w);
            setLocations(l);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createWarehouse({
                ...formData,
                capacity: parseInt(formData.capacity || 0)
            });
            setIsModalOpen(false);
            setFormData({ name: '', shortcode: '', locationId: '', capacity: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create warehouse');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Warehouses</h1>
                    <p className="text-gray-500">Manage your storage facilities</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Warehouse
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {warehouses.map(warehouse => (
                    <div key={warehouse.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Warehouse className="w-6 h-6 text-blue-600" />
                            </div>
                            <button
                                onClick={() => navigate(`/warehouses/${warehouse.id}`)}
                                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-xs font-mono font-bold rounded-full transition-colors"
                            >
                                {warehouse.shortcode}
                            </button>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{warehouse.name}</h3>
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                            <MapPin className="w-4 h-4 mr-1" />
                            {warehouse.location?.name || 'Unknown Location'}
                        </div>
                        <div className="pt-4 border-t flex justify-between items-center">
                            <span className="text-xs text-gray-400">Capacity: {warehouse.capacity}</span>
                            <button
                                onClick={() => navigate(`/warehouses/${warehouse.id}`)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                                <Edit className="w-3 h-3" /> Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Warehouse"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Warehouse Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Shortcode"
                        value={formData.shortcode}
                        onChange={(e) => setFormData({ ...formData, shortcode: e.target.value })}
                        placeholder="e.g., NY-01"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                        <select
                            className="input w-full"
                            value={formData.locationId}
                            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                            required
                        >
                            <option value="">Select Location</option>
                            {locations.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Warehouse
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Warehouses;
