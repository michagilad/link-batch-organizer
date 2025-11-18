import React, { useState, useCallback, useMemo } from 'react';
import { ListIcon, CompareIcon, WarningIcon } from './ListComparatorIcons';

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

const ListComparator: React.FC = () => {
  const [listA, setListA] = useState<string>('');
  const [listB, setListB] = useState<string>('');
  const [uniqueToListA, setUniqueToListA] = useState<string[]>([]);
  const [uniqueToListB, setUniqueToListB] = useState<string[]>([]);
  const [commonItems, setCommonItems] = useState<string[]>([]);
  const [hasCompared, setHasCompared] = useState<boolean>(false);

  const processList = (list: string): string[] => 
    list.split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);

  const itemsA = useMemo(() => processList(listA), [listA]);
  const itemsB = useMemo(() => processList(listB), [listB]);

  const findDuplicates = (items: string[]): string[] => {
    const counts = new Map<string, number>();
    items.forEach(item => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });
    
    const duplicates: string[] = [];
    counts.forEach((count, item) => {
      if (count > 1) {
        duplicates.push(item);
      }
    });

    return duplicates;
  };

  const duplicatesInA = useMemo(() => findDuplicates(itemsA), [itemsA]);
  const duplicatesInB = useMemo(() => findDuplicates(itemsB), [itemsB]);

  const handleCompare = useCallback(() => {
    const setA = new Set(itemsA);
    const setB = new Set(itemsB);

    const onlyInA = itemsA.filter(item => !setB.has(item));
    const onlyInB = itemsB.filter(item => !setA.has(item));
    const inBoth = itemsA.filter(item => setB.has(item));

    setUniqueToListA(Array.from(new Set(onlyInA)));
    setUniqueToListB(Array.from(new Set(onlyInB)));
    setCommonItems(Array.from(new Set(inBoth)));
    setHasCompared(true);
  }, [itemsA, itemsB]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 p-3 rounded-xl mb-4">
              <ListIcon />
          </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          List Comparator
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
          Find the symmetric difference between two lists. See which items are unique to each list instantly.
        </p>
      </header>

      <main className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ListInput
            label="List 1"
            value={listA}
            onChange={(e) => setListA(e.target.value)}
            placeholder="Paste your first list here, one item per line..."
            itemCount={itemsA.length}
            duplicates={duplicatesInA}
          />
          <ListInput
            label="List 2"
            value={listB}
            onChange={(e) => setListB(e.target.value)}
            placeholder="Paste your second list here, one item per line..."
            itemCount={itemsB.length}
            duplicates={duplicatesInB}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleCompare}
            disabled={!listA && !listB}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-200"
          >
            <CompareIcon />
            Compare Lists
          </button>
        </div>

        {hasCompared && (
           <div className="mt-12 animate-fade-in">
              <h2 className="text-2xl font-bold text-center text-slate-100 mb-8">Comparison Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <ResultCard title="Only in List 1" items={uniqueToListA} />
                  <ResultCard title="Only in List 2" items={uniqueToListB} />
                  <ResultCard title="In Both Lists" items={commonItems} />
              </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListComparator;

