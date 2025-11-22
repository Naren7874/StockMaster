import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8">
            <div className="h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Search Bar - Hidden on mobile for now to save space */}
                    <div className="hidden md:flex items-center relative max-w-md w-full">
                        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                    <div className="flex items-center gap-3 pl-1">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500">{user?.role || 'Staff'}</p>
                        </div>
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="text-sm font-semibold text-blue-700">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
