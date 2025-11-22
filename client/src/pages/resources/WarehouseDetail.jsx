import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { ArrowLeft, Save, Warehouse } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

const WarehouseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({ name: '', shortcode: '', locationId: '', capacity: 0 });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [warehouses, locs] = await Promise.all([
                    api.getWarehouses(),
                    api.getLocations()
                ]);
                const warehouse = warehouses.find(w => w.id === id);
                if (warehouse) {
                    setFormData({
                        name: warehouse.name,
                        shortcode: warehouse.shortcode,
                        locationId: warehouse.locationId,
                        capacity: warehouse.capacity
                    });
                }
                setLocations(locs);
            } catch (error) {
                console.error('Failed to load data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Note: api.updateWarehouse is not implemented yet in api.js or backend.
        // For now, we'll just simulate or alert.
        // Ideally we should implement PUT /warehouses/:id
        alert('Update functionality to be implemented in backend');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/warehouses')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Edit Warehouse</h1>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <div className="p-4 bg-blue-50 rounded-xl">
                        <Warehouse className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                        <p className="text-gray-500 font-mono">{formData.shortcode}</p>
                    </div>
                </div>

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
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    />

                    <div className="flex justify-end pt-4">
                        <Button type="submit">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WarehouseDetail;
