
import React, { useState } from 'react';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  items: PortfolioItem[];
}

const Portfolio: React.FC<PortfolioProps> = ({ items }) => {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Portrait', 'Magazine', 'Nature', 'Neo-Andean'];

  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs uppercase tracking-[0.3em] px-4 py-2 border-b-2 transition-all ${
              filter === cat ? 'border-pink-500 text-pink-400' : 'border-transparent text-pink-100/50 hover:text-pink-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, idx) => (
          <div 
            key={item.id} 
            className={`relative group overflow-hidden glass-panel flex flex-col ${
              idx % 4 === 0 ? 'md:col-span-2 md:flex-row' : ''
            }`}
          >
            <div className={`overflow-hidden ${idx % 4 === 0 ? 'md:w-1/2' : 'w-full'} relative`}>
              <img 
                src={item.url} 
                alt={item.title}
                className="w-full h-full object-cover aspect-[4/5] filter brightness-90 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0221] to-transparent opacity-60" />
            </div>
            
            <div className={`p-8 flex flex-col justify-center ${idx % 4 === 0 ? 'md:w-1/2' : 'w-full'}`}>
              <span className="text-[10px] text-cyan-400 tracking-[0.4em] uppercase mb-2 font-bold">{item.category}</span>
              <h3 className="text-3xl font-syne font-black mb-4 vapor-text leading-tight">{item.title}</h3>
              <p className="text-pink-100/60 font-serif italic text-sm leading-relaxed mb-6">{item.description}</p>
              <div className="mt-auto flex justify-between items-center text-[10px] uppercase tracking-widest text-pink-500/50">
                <span>Ref: {item.id.padStart(4, '0')}</span>
                <span>{item.date}</span>
              </div>
            </div>

            {/* Neo-Andean Accent */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
