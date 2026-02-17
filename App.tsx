
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import MagazineView from './components/MagazineView';
import MagazineEditor from './components/MagazineEditor';
import BookingView from './components/BookingView';
import AdminDashboard from './components/AdminDashboard';
import CullingSuite from './components/CullingSuite';
import DealMaker from './components/DealMaker';
import ClientVault from './components/ClientVault';
import VaporBackground from './components/VaporBackground';
import TerminalLock from './components/TerminalLock';
import { db, TransactionLog } from './services/SovereigntyGateway';
import { PortfolioItem, View, Booking, Contract } from './types';

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { id: '1', url: 'https://picsum.photos/seed/neo1/800/1200', title: 'Andean Geometric 01', category: 'Neo-Andean', description: 'A study in geometric balance.', date: '2026-03-15' },
  { id: '2', url: 'https://picsum.photos/seed/vapor1/800/1200', title: 'Sunset Echo', category: 'Portrait', description: 'Nostalgic portrait.', date: '2026-03-10' },
  { id: '3', url: 'https://picsum.photos/seed/mag1/800/1200', title: 'Vogue: Neon Dream', category: 'Magazine', description: 'Editorial cover.', articleBody: 'The neon lights of the high Andes reflect a digital future we were promised in 1995. This spread explores the intersection of traditional weaving patterns and the glitch-aesthetics of early internet culture.', date: '2026-03-05' },
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('terminal_auth') === 'true';
  });
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<TransactionLog[]>([]);

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    db.setLogCallback(setLogs);
    
    const init = async () => {
      setIsLoading(true);
      const [p, b, c] = await Promise.all([
        db.fetchData('portfolio', INITIAL_PORTFOLIO),
        db.fetchData('bookings', []),
        db.fetchData('contracts', [])
      ]);
      setPortfolio(p);
      setBookings(b);
      setContracts(c);
      setIsLoading(false);

      // Setup Real-time Node Subscriptions
      db.subscribe('portfolio', (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setPortfolio(prev => {
            const exists = prev.find(i => i.id === payload.new.id);
            if (exists) return prev.map(i => i.id === payload.new.id ? payload.new : i);
            return [payload.new, ...prev];
          });
        }
      });

      db.subscribe('bookings', (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setBookings(prev => {
            const exists = prev.find(b => b.id === payload.new.id);
            if (exists) return prev.map(b => b.id === payload.new.id ? payload.new : b);
            return [payload.new, ...prev];
          });
        }
      });

      db.subscribe('contracts', (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setContracts(prev => {
            const exists = prev.find(c => c.id === payload.new.id);
            if (exists) return prev.map(c => c.id === payload.new.id ? payload.new : c);
            return [payload.new, ...prev];
          });
        }
      });
    };
    init();
  }, []);

  /**
   * Enhanced Sync Protocol: Handles both full-table syncs and granular row syncs
   */
  const syncToCloud = async (table: string, data: any) => {
    setIsSyncing(true);
    try {
        await db.saveData(table, data);
    } catch (err) {
        console.error("Critical Uplink Failure:", err);
    } finally {
        setIsSyncing(false);
    }
  };

  const updatePortfolio = (newItems: PortfolioItem[]) => {
    setPortfolio(newItems);
    syncToCloud('portfolio', newItems);
  };

  const updateSinglePortfolioItem = (item: PortfolioItem) => {
    setPortfolio(prev => prev.map(i => i.id === item.id ? item : i));
    syncToCloud('portfolio', item); // Granular Row Sync
  };

  const updateBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    syncToCloud('bookings', newBookings);
  };

  const updateSingleBooking = (booking: Booking) => {
    setBookings(prev => prev.map(b => b.id === booking.id ? booking : b));
    syncToCloud('bookings', booking); // Granular Row Sync
  };

  const addBooking = (booking: Booking) => {
    const updated = [booking, ...bookings];
    setBookings(updated);
    syncToCloud('bookings', booking); // Only transmit the new row
  };

  const addContract = (contract: Contract) => {
    const updated = [contract, ...contracts];
    setContracts(updated);
    syncToCloud('contracts', contract); // Only transmit the new row
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('terminal_auth');
    setView('home');
  };

  const handleAuth = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('terminal_auth', 'true');
      setView('admin');
    }
  };

  const renderView = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-t-2 border-cyan-400 rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.5em] text-pink-400 animate-pulse">Establishing Secure Node Connection...</p>
      </div>
    );

    const isProtected = ['admin', 'culling', 'deals', 'magazine-editor'].includes(view);
    if (isProtected && !isAuthenticated) {
      return <TerminalLock onAuth={handleAuth} />;
    }

    switch (view) {
      case 'home': return <Home onExplore={() => setView('portfolio')} onMagazine={() => setView('magazine')} />;
      case 'portfolio': return <Portfolio items={portfolio} />;
      case 'magazine': return <MagazineView items={portfolio.filter(i => i.category === 'Magazine' || i.category === 'Neo-Andean')} />;
      case 'magazine-editor': return <MagazineEditor items={portfolio} onSave={updateSinglePortfolioItem} onBack={() => setView('admin')} />;
      case 'booking': return <BookingView onBook={addBooking} />;
      case 'admin': return (
        <AdminDashboard 
          portfolio={portfolio} 
          setPortfolio={updatePortfolio} 
          bookings={bookings} 
          updateBookings={updateBookings}
          updateSingleBooking={updateSingleBooking}
          setView={setView} 
          contracts={contracts} 
          onLogout={handleLogout}
          logs={logs}
        />
      );
      case 'culling': return (
        <CullingSuite 
          onSave={(items) => { 
            const updated = [...items, ...portfolio];
            updatePortfolio(updated); 
            setView('portfolio'); 
          }} 
        />
      );
      case 'deals': return <DealMaker onSave={addContract} onBack={() => setView('admin')} />;
      case 'vault': return <ClientVault bookings={bookings} />;
      default: return <Home onExplore={() => setView('portfolio')} onMagazine={() => setView('magazine')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-cyan-500 selection:text-white">
      <VaporBackground />
      <Header 
        currentView={view} 
        setView={setView} 
        isSyncing={isSyncing} 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-20 relative z-10">
        {renderView()}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 z-[100] glass-panel border-t border-pink-500/20 bg-[#0d0221]/80 backdrop-blur-md overflow-hidden">
        <div className="container mx-auto px-6 h-12 flex items-center justify-center relative">
          <p className="text-[10px] uppercase tracking-[0.5em] text-pink-100/40 font-serif italic text-center select-none max-w-2xl px-8">
            The lens is a gemstone that refracts time into a digital echo
            <span 
              onClick={() => setView('admin')} 
              className="cursor-default hover:text-cyan-400 transition-colors duration-500 inline-block px-1"
            >.</span>
          </p>

          <div className="absolute right-6 hidden md:flex items-center gap-4 opacity-30">
            <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-pink-500 animate-ping' : 'bg-green-500'}`} />
            <span className="text-[8px] font-mono tracking-widest uppercase">Node Sync Active</span>
          </div>

          <div className="absolute left-6 hidden md:block opacity-20 text-[8px] font-mono tracking-widest uppercase italic">
            &copy; 2026 Will Ghrigsby
          </div>
        </div>
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,2px_100%]" />
      </footer>
    </div>
  );
};

export default App;
