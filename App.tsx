import React, { useState } from 'react';
import BatchOrganizer from './components/BatchOrganizer';
import ListComparator from './components/ListComparator';

type Tab = 'batcher' | 'comparator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('batcher');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white flex flex-col items-center p-4 font-sans">
      {/* Tab Navigation */}
      <nav className="w-full max-w-7xl mt-6 mb-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700 inline-flex gap-2 shadow-lg">
          <button
            onClick={() => setActiveTab('batcher')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'batcher'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
            }`}
          >
            Batch Organizer
          </button>
          <button
            onClick={() => setActiveTab('comparator')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'comparator'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/50'
            }`}
          >
            List Comparator
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="w-full flex-1">
        {activeTab === 'batcher' && <BatchOrganizer />}
        {activeTab === 'comparator' && <ListComparator />}
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 mb-8 text-gray-600 text-sm">
        <p>Powered by React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
