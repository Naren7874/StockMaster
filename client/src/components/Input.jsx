import React from 'react';
import { clsx } from 'clsx';

const Input = ({
    label,
    error,
    className,
    id,
    icon: Icon,
    ...props
}) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={clsx("w-full", className)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
                <input
                    id={inputId}
                    className={clsx(
                        "block w-full rounded-lg border-slate-200 bg-white text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm",
                        Icon ? "pl-10" : "pl-3",
                        "py-2.5", // Taller input for better touch target
                        error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-200",
                        props.disabled && "bg-slate-50 text-slate-500 cursor-not-allowed"
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
