
import React from 'react';
import { ListIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="text-center">
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
  );
};

export default Header;
