import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, title, description, action }) => {
    return (
        <div className={clsx("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
            {(title || description || action) && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
                        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
