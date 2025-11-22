import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Map, Plus, Trash2, Warehouse } from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.getLocations();
            setLocations(data);
        } catch (error) {
            console.error('Failed to fetch locations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createLocation(formData);
            setIsModalOpen(false);
            setFormData({ name: '' });
            fetchData();
        } catch (error) {
            alert('Failed to create location');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this location?')) return;
        try {
            await api.deleteLocation(id);
            fetchData();
        } catch (error) {
            alert('Failed to delete');
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                    <p className="text-gray-500">Manage geographic locations (Cities, Regions)</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map(location => (
                    <div key={location.id} className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Map className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">{location.name}</h3>
                            </div>
                            <button onClick={() => handleDelete(location.id)} className="text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Warehouses</h4>
                            {location.warehouses && location.warehouses.length > 0 ? (
                                <div className="space-y-2">
                                    {location.warehouses.map(wh => (
                                        <div key={wh.id} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                                            <Warehouse className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{wh.name}</span>
                                            <span className="text-xs text-gray-500 ml-auto font-mono">{wh.shortcode}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No warehouses in this location</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Location"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Location Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., New York, London"
                        required
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Location
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Locations;
