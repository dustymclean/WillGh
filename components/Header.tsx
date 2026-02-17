
import React, { useState, useEffect } from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  isSyncing: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, isSyncing, isAuthenticated, onLogout }) => {
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 20) + 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { label: string; value: View }[] = [
    { label: 'Echoes', value: 'home' },
    { label: 'Archive', value: 'portfolio' },
    { label: 'Vault', value: 'vault' },
    { label: 'Inquiry', value: 'booking' as View },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-pink-500/30">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="cursor-pointer group flex items-center gap-3" onClick={() => setView('home')}>
          <div className={`w-10 h-10 rounded-full group-hover:rotate-180 transition-transform duration-700 gemstone-glow flex items-center justify-center bg-gradient-to-br ${isSyncing ? 'from-pink-500 to-orange-400' : 'from-cyan-400 to-pink-500'}`}>
             <div className="w-4 h-4 bg-black/40 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter vapor-text uppercase italic leading-none">Will Ghrigsby</h1>
            <div className="text-[8px] uppercase tracking-[0.4em] text-cyan-400/60 font-mono mt-1">
              NODE-ANDES // {latency}ms
            </div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setView(item.value)}
              className={`text-[10px] uppercase tracking-[0.3em] transition-all duration-300 hover:text-cyan-300 ${
                currentView === item.value ? 'text-pink-400 font-bold' : 'text-pink-100/70'
              }`}
            >
              {item.label}
              {currentView === item.value && (
                <span className="block h-[1px] bg-cyan-400 mt-1 animate-pulse" />
              )}
            </button>
          ))}
          
          {isAuthenticated && (
            <button 
              onClick={onLogout}
              className="ml-4 px-3 py-1 border border-pink-500/40 text-pink-500 text-[9px] uppercase tracking-[0.2em] hover:bg-pink-500 hover:text-white transition-all rounded gemstone-glow"
            >
              Lock Terminal
            </button>
          )}
        </nav>

        <div className="lg:hidden flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-pink-500 animate-ping' : 'bg-green-500'}`} />
        </div>
      </div>
    </header>
  );
};

export default Header;
