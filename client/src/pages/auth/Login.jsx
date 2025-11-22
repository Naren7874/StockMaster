import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Package, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { accessToken, user } = await api.login({ email, password });
            login(accessToken, user);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">StockMaster</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={Mail}
                                placeholder="you@example.com"
                                required
                            />

                            <div className="space-y-1">
                                <Input
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={Lock}
                                    placeholder="••••••••"
                                    required
                                />
                                <div className="flex items-center justify-end">
                                    <Link to="/reset-otp" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Login failed</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full group" size="lg" isLoading={loading}>
                                Sign in
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-2 text-slate-500">Don't have an account?</span>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Feature */}
            <div className="hidden lg:block relative w-0 flex-1">
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-900 opacity-90" />
                    <img
                        className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Warehouse"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center px-20 text-white">
                        <h2 className="text-4xl font-bold mb-6">Manage your inventory with confidence</h2>
                        <p className="text-lg text-blue-100 max-w-md leading-relaxed">
                            Track stock levels, manage warehouses, and process transactions in real-time with our advanced inventory management system.
                        </p>

                        <div className="mt-12 grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">10k+</h3>
                                <p className="text-blue-200">Products Tracked</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">99.9%</h3>
                                <p className="text-blue-200">Uptime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
