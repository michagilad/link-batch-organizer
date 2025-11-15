import React from 'react';
import { WarningIcon } from './Icons';

interface ListInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  itemCount: number;
  duplicates: string[];
}

const ListInput: React.FC<ListInputProps> = ({ label, value, onChange, placeholder, itemCount, duplicates }) => {
  const hasDuplicates = duplicates.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2 gap-2">
        <label htmlFor={label} className="font-semibold text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
            {hasDuplicates && (
              <span 
                className="flex items-center bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full" 
                title={`Found ${duplicates.length} duplicate item(s).`}
              >
                <WarningIcon />
                {duplicates.length} {duplicates.length === 1 ? 'Duplicate' : 'Duplicates'}
              </span>
            )}
            <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
        </div>
      </div>
      <textarea
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={10}
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200 resize-y text-slate-200"
      />
      {hasDuplicates && (
        <div className="mt-3 bg-yellow-900/40 border border-yellow-800/60 rounded-lg p-3 animate-fade-in">
          <h4 className="font-semibold text-yellow-300 mb-2 text-sm">Duplicate Items Found:</h4>
          <ul className="space-y-1 text-sm max-h-24 overflow-y-auto pr-2">
            {duplicates.map((item, index) => (
              <li key={index} className="text-yellow-400 font-mono bg-slate-800/50 px-2 py-1 rounded truncate">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListInput;