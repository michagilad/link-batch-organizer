
import React from 'react';

interface ResultCardProps {
  title: string;
  items: string[];
}

const ResultCard: React.FC<ResultCardProps> = ({ title, items }) => {
  const handleExportCSV = () => {
    if (items.length === 0) return;
    
    // Create CSV content
    const csvContent = items.join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-indigo-100 text-sm font-semibold px-3 py-1 rounded-full">
            {items.length} items
          </span>
          <button
            onClick={handleExportCSV}
            disabled={items.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-semibold px-3 py-1 rounded-full transition-colors duration-200"
            title="Export to CSV"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="h-64 overflow-y-auto pr-2 bg-slate-800 rounded-md">
        {items.length > 0 ? (
          <ul className="space-y-2 p-2">
            {items.map((item, index) => (
              <li key={index} className="bg-slate-700/50 p-3 rounded-md text-slate-300 truncate transition-colors hover:bg-slate-700">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            <p>No unique items found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
