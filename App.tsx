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
import { PortfolioItem, View, Booking, Contract, Transaction, Task } from './types';

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { id: '1', url: 'https://picsum.photos/seed/neo1/800/1200', title: 'Andean Geometric 01', category: 'Neo-Andean', description: 'A study in geometric balance.', date: '2026-03-15' },
  { id: '2', url: 'https://picsum.photos/seed/vapor1/800/1200', title: 'Sunset Echo', category: 'Portrait', description: 'Nostalgic portrait.', date: '2026-03-10' },
  { id: '3', url: 'https://picsum.photos/seed/mag1/800/1200', title: 'Vogue: Neon Dream', category: 'Magazine', description: 'Editorial cover.', articleBody: 'The neon lights of the high Andes reflect a digital future we were promised in 1995.', date: '2026-03-05' },
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('terminal_auth') === 'true';
  });
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<TransactionLog[]>([]);

  // Sovereign Node State Modules
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]); // "Clients"
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // "Sovereign Ledger"
  const [tasks, setTasks] = useState<Task[]>([]); // "To-Do List"

  useEffect(() => {
    db.setLogCallback(setLogs);
    
    /**
     * INITIALIZATION PROTOCOL
     * Fetches all studio data and establishes Real-time subscriptions.
     */
    const init = async () => {
      setIsLoading(true);
      try {
        const [p, b, c, t, ts] = await Promise.all([
          db.fetchData('portfolio', INITIAL_PORTFOLIO),
          db.fetchData('bookings', []),
          db.fetchData('contracts', []),
          db.fetchData('transactions', []),
          db.fetchData('tasks', []) // Fetching the new Task/To-Do data
        ]);

        setPortfolio(p);
        setBookings(b);
        setContracts(c);
        setTransactions(t);
        setTasks(ts);

        // Establish Secure Real-time Node Subscriptions
        const tables = ['portfolio', 'bookings', 'contracts', 'transactions', 'tasks'];
        const setters = [setPortfolio, setBookings, setContracts, setTransactions, setTasks];

        tables.forEach((table, index) => {
          db.subscribe(table, (payload) => handleSub(payload, setters[index]));
        });

      } catch (err) {
        console.error("Critical Node Handshake Failure:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  /**
   * Universal Handshake Handler: Updates state based on database events
   */
  const handleSub = (payload: any, setter: any) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      setter((prev: any[]) => {
        const exists = prev.find(i => i.id === payload.new.id);
        if (exists) return prev.map(i => i.id === payload.new.id ? payload.new : i);
        return [payload.new, ...prev];
      });
    } else if (payload.eventType === 'DELETE') {
      setter((prev: any[]) => prev.filter(i => i.id !== payload.old.id));
    }
  };

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

  // --- Persistent State Handlers ---

  const updateSinglePortfolioItem = (item: PortfolioItem) => {
    setPortfolio(prev => {
      const exists = prev.find(i => i.id === item.id);
      return exists ? prev.map(i => i.id === item.id ? item : i) : [item, ...prev];
    });
    syncToCloud('portfolio', item);
  };

  const updateSingleBooking = (booking: Booking) => {
    setBookings(prev => {
      const exists = prev.find(b => b.id === booking.id);
      return exists ? prev.map(b => b.id === booking.id ? booking : b) : [booking, ...prev];
    });
    syncToCloud('bookings', booking);
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    syncToCloud('transactions', t);
  };

  const updateSingleTask = (task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      return exists ? prev.map(t => t.id === task.id ? task : t) : [task, ...prev];
    });
    syncToCloud('tasks', task);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    syncToCloud('tasks', tasks.filter(t => t.id !== id));
  };

  const addContract = (contract: Contract) => {
    setContracts(prev => [contract, ...prev]);
    syncToCloud('contracts', contract);
    
    // Auto-generate Ledger entry for new deals
    addTransaction({
      id: `tx_deal_${contract.id}`,
      date: contract.date,
      amount: contract.totalValue,
      category: 'Session',
      description: `Sealed Contract: ${contract.clientName}`,
      status: 'pending'
    });
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
      case 'magazine-editor': return <MagazineEditor items={portfolio} onSaveItem={updateSinglePortfolioItem} onBack={() => setView('admin')} />;
      case 'booking': return <BookingView onBook={updateSingleBooking} />;
      case 'admin': return (
        <AdminDashboard 
          portfolio={portfolio} 
          bookings={bookings} // Clients
          contracts={contracts} 
          transactions={transactions} // Sovereign Ledger
          tasks={tasks} // To-Do List
          updateSingleBooking={updateSingleBooking}
          addTransaction={addTransaction}
          updateSingleTask={updateSingleTask}
          deleteTask={deleteTask}
          setView={setView} 
          onLogout={handleLogout}
          logs={logs}
        />
      );
      case 'culling': return (
        <CullingSuite 
          onSave={(items) => { 
            items.forEach(updateSinglePortfolioItem);
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