import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, RefreshCw } from 'lucide-react';

const NewTransaction = () => {
    const navigate = useNavigate();

    const options = [
        {
            title: 'Receipt (In)',
            description: 'Receive stock from suppliers',
            icon: ArrowDownLeft,
            color: 'bg-green-100 text-green-600',
            path: '/operations/receipts/new'
        },
        {
            title: 'Delivery (Out)',
            description: 'Send stock to customers',
            icon: ArrowUpRight,
            color: 'bg-blue-100 text-blue-600',
            path: '/operations/deliveries/new'
        },
        {
            title: 'Transfer',
            description: 'Move stock between warehouses',
            icon: ArrowRightLeft,
            color: 'bg-purple-100 text-purple-600',
            path: '/operations/transfers/new'
        },
        {
            title: 'Adjustment',
            description: 'Correct stock discrepancies',
            icon: RefreshCw,
            color: 'bg-orange-100 text-orange-600',
            path: '/operations/adjustments/new'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Transaction</h1>
            <p className="text-gray-500 mb-8">Select the type of transaction you want to create</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {options.map((option) => (
                    <button
                        key={option.title}
                        onClick={() => navigate(option.path)}
                        className="flex items-start p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all text-left group"
                    >
                        <div className={`p-3 rounded-lg mr-4 ${option.color}`}>
                            <option.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {option.title}
                            </h3>
                            <p className="text-gray-500 mt-1">{option.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NewTransaction;
