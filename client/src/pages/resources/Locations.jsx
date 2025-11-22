import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Map, Plus, Trash2 } from 'lucide-react';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', warehouseId: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [l, w] = await Promise.all([
                api.getLocations(),
                api.getWarehouses()
            ]);
            setLocations(l);
            setWarehouses(w);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createLocation(formData);
            setIsModalOpen(false);
            setFormData({ name: '', warehouseId: '' });
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

    const columns = [
        { header: 'Name', accessor: 'name', className: 'font-medium' },
        { header: 'Warehouse', accessor: 'warehouse', render: (row) => row.warehouse?.name },
        {
            header: 'Actions', render: (row) => (
                <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-red-50 rounded text-red-500">
                    <Trash2 className="w-4 h-4" />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                    <p className="text-gray-500">Manage specific aisles, racks, and bins</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                </Button>
            </div>

            <Table columns={columns} data={locations} isLoading={loading} />

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
                        placeholder="e.g., Aisle 1, Rack B"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Warehouse</label>
                        <select
                            className="input w-full"
                            value={formData.warehouseId}
                            onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                            required
                        >
                            <option value="">Select Warehouse</option>
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>
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
