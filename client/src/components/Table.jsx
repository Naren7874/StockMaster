import React from 'react';

const Table = ({ columns, data, onRowClick, isLoading, emptyMessage = "No data found" }) => {
    if (isLoading) {
        return (
            <div className="w-full h-48 flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-48 flex items-center justify-center text-gray-500 border rounded-lg bg-gray-50">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={`px-6 py-3 ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr
                            key={row.id || rowIdx}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`bg-white border-b hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                        >
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className={`px-6 py-4 ${col.className || ''}`}>
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
