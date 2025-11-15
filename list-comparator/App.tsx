import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import ListInput from './components/ListInput';
import ResultCard from './components/ResultCard';
import { CompareIcon } from './components/Icons';

const App: React.FC = () => {
  const [listA, setListA] = useState<string>('');
  const [listB, setListB] = useState<string>('');
  const [uniqueToListA, setUniqueToListA] = useState<string[]>([]);
  const [uniqueToListB, setUniqueToListB] = useState<string[]>([]);
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

    setUniqueToListA(Array.from(new Set(onlyInA)));
    setUniqueToListB(Array.from(new Set(onlyInB)));
    setHasCompared(true);
  }, [itemsA, itemsB]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ResultCard title="Only in List 1" items={uniqueToListA} />
                    <ResultCard title="Only in List 2" items={uniqueToListB} />
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;