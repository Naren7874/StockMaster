import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import {
    TrendingUp,
    AlertTriangle,
    ArrowDownLeft,
    ArrowUpRight,
    Package,
    Clock,
    MoreVertical
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { format } from 'date-fns';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        warehouseId: 'ALL',
        category: 'ALL',
        status: 'ALL',
        type: 'ALL'
    });

    useEffect(() => {
        loadStats();
    }, [filters]);

    const loadStats = async () => {
        try {
            const data = await api.getDashboardStats(filters);
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-12"><Loader size="lg" /></div>;
    if (!stats) return <div className="text-center py-12 text-slate-500">Failed to load dashboard data.</div>;

    const StatCard = ({ title, value, icon: Icon, trend, color }) => (
        <Card className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {trend}
                    </span>
                    <span className="text-slate-400 ml-2">vs last month</span>
                </div>
            )}
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of your inventory performance</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="input w-auto"
                        value={filters.warehouseId}
                        onChange={(e) => setFilters({ ...filters, warehouseId: e.target.value })}
                    >
                        <option value="ALL">All Warehouses</option>
                        {/* Ideally populate from API */}
                    </select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-blue-500"
                    trend="+12%"
                />
                <StatCard
                    title="Low Stock Items"
                    value={stats.lowStockCount}
                    icon={AlertTriangle}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Pending Receipts"
                    value={stats.pendingReceipts}
                    icon={ArrowDownLeft}
                    color="bg-green-500"
                />
                <StatCard
                    title="Pending Deliveries"
                    value={stats.pendingDeliveries}
                    icon={ArrowUpRight}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2" title="Stock Movement Trends">
                    <div className="h-80 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Mon', in: 40, out: 24 },
                                { name: 'Tue', in: 30, out: 13 },
                                { name: 'Wed', in: 20, out: 98 },
                                { name: 'Thu', in: 27, out: 39 },
                                { name: 'Fri', in: 18, out: 48 },
                                { name: 'Sat', in: 23, out: 38 },
                                { name: 'Sun', in: 34, out: 43 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="in" stroke="#2563eb" fillOpacity={1} fill="url(#colorIn)" strokeWidth={2} />
                                <Area type="monotone" dataKey="out" stroke="#ef4444" fillOpacity={1} fill="url(#colorOut)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card title="Recent Activity">
                    <div className="space-y-6 mt-4">
                        {stats.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className={`p-2 rounded-full shrink-0 ${activity.type === 'IN' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'OUT' ? 'bg-blue-100 text-blue-600' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {activity.type === 'IN' ? <ArrowDownLeft className="w-4 h-4" /> :
                                        activity.type === 'OUT' ? <ArrowUpRight className="w-4 h-4" /> :
                                            <Clock className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                        {activity.items[0]?.product.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {activity.type} • {activity.items[0]?.quantity} units
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap">
                                    {format(new Date(activity.date), 'MMM d')}
                                </span>
                            </div>
                        ))}
                        {stats.recentActivity.length === 0 && (
                            <p className="text-center text-slate-500 text-sm py-4">No recent activity</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
