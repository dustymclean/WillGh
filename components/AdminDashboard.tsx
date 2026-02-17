
import React, { useState, useEffect, useRef } from 'react';
import { PortfolioItem, Booking, View, Contract } from '../types';
import { TransactionLog } from '../services/SovereigntyGateway';

interface AdminDashboardProps {
  portfolio: PortfolioItem[];
  setPortfolio: (items: PortfolioItem[]) => void;
  bookings: Booking[];
  contracts: Contract[];
  setView: (view: View) => void;
  onLogout: () => void;
  logs: TransactionLog[];
  updateBookings?: (bookings: Booking[]) => void;
  updateSingleBooking?: (booking: Booking) => void;
}

type AdminTab = 'overview' | 'vaults';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    portfolio, bookings, contracts, setView, onLogout, logs, updateBookings, updateSingleBooking 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showFullLogs, setShowFullLogs] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved'>('idle');
  const [connectionHealth, setConnectionHealth] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const revenue = contracts.reduce((acc, curr) => acc + (curr.signed ? curr.totalValue : 0), 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionHealth(prev => Math.max(92, Math.min(100, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateBooking = async (updated: Booking) => {
    setSyncStatus('syncing');
    
    // Prefer granular row sync if available to minimize database bandwidth
    if (updateSingleBooking) {
      await updateSingleBooking(updated);
    } else if (updateBookings) {
      const next = bookings.map(b => b.id === updated.id ? updated : b);
      await updateBookings(next);
    }
    
    setSyncStatus('saved');
    setTimeout(() => setSyncStatus('idle'), 3000);
    setSelectedBooking(updated);
  };

  const createManualVault = async () => {
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: 'NEW CLIENT ARCHIVE',
      email: 'identity@sovereign.node',
      date: new Date().toISOString().split('T')[0],
      package: 'Bespoke Artifacts',
      status: 'pending',
      images: [],
      notes: ''
    };
    
    // Immediate Granular Persistence
    if (updateSingleBooking) {
      await updateSingleBooking(newBooking);
    } else if (updateBookings) {
      updateBookings([newBooking, ...bookings]);
    }
    
    setSelectedBooking(newBooking);
    setActiveTab('vaults');
  };

  const purgeAllArtifacts = () => {
    if (!selectedBooking) return;
    if (window.confirm("CRITICAL: Wipe entire vault archive? This cannot be undone.")) {
      handleUpdateBooking({
        ...selectedBooking,
        images: []
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedBooking || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const fileList = Array.from(files) as File[];
    const totalFiles = fileList.length;
    const newImages: string[] = [];

    for (let i = 0; i < totalFiles; i++) {
      const file = fileList[i];
      const reader = new FileReader();
      
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newImages.push(base64);
      setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    const existingImages = selectedBooking.images || [];
    const updatedBooking = {
      ...selectedBooking,
      images: [...existingImages, ...newImages]
    };

    await handleUpdateBooking(updatedBooking);

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const markAsDelivered = () => {
    if (!selectedBooking) return;
    handleUpdateBooking({
      ...selectedBooking,
      status: 'delivered',
      vaultKey: selectedBooking.id
    });
  };

  const latestLog = logs[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 relative text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-5xl font-syne font-black uppercase italic tracking-tighter vapor-text leading-none">Command Center</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-cyan-400 text-[10px] tracking-[0.4em] uppercase font-bold">Node Sync Protocol Active</span>
            <div className="h-px w-8 bg-white/20" />
            <span className={`text-[9px] font-mono ${connectionHealth > 95 ? 'text-green-500' : 'text-orange-400'}`}>PING: {connectionHealth}%</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setView('magazine-editor')} className="px-4 py-2 border border-orange-400/50 text-orange-400 text-[9px] uppercase tracking-widest hover:bg-orange-400/10 transition-all font-black">Editorial Lab</button>
          <button onClick={() => setView('deals')} className="px-4 py-2 border border-pink-500/50 text-pink-400 text-[9px] uppercase tracking-widest hover:bg-pink-500/10 transition-all font-black">Deal Maker</button>
          <button onClick={onLogout} className="px-4 py-2 bg-pink-600 border border-pink-500 text-white text-[9px] uppercase tracking-widest hover:brightness-110 transition-all font-black shadow-lg shadow-pink-500/20">Lock Terminal</button>
        </div>
      </div>

      <div className="flex gap-12 border-b border-white/5">
        <button 
          onClick={() => { setActiveTab('overview'); setSelectedBooking(null); }}
          className={`pb-4 text-[11px] uppercase tracking-[0.4em] font-black transition-all ${activeTab === 'overview' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-white/30 hover:text-white'}`}
        >
          System Overview
        </button>
        <button 
          onClick={() => { setActiveTab('vaults'); setSelectedBooking(null); }}
          className={`pb-4 text-[11px] uppercase tracking-[0.4em] font-black transition-all ${activeTab === 'vaults' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-white/30 hover:text-white'}`}
        >
          Vault Orchestration
        </button>
      </div>

      {selectedBooking ? (
        <div className="glass-panel p-8 border-t-2 border-cyan-400 animate-in slide-in-from-bottom-4 duration-500 relative">
          <div className="absolute top-4 right-8 flex items-center gap-3">
             {syncStatus === 'syncing' && (
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
                 <span className="text-[8px] font-mono text-pink-500 uppercase tracking-widest">Transmitting to Node...</span>
               </div>
             )}
             {syncStatus === 'saved' && (
               <div className="flex items-center gap-2 text-green-500">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                 </svg>
                 <span className="text-[8px] font-mono uppercase tracking-widest">Vault Synced</span>
               </div>
             )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div className="flex-grow">
              <button onClick={() => setSelectedBooking(null)} className="text-[10px] uppercase tracking-widest text-pink-400 mb-6 hover:text-white transition-colors block">← Return to sovereign Archive</button>
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center gemstone-glow flex-shrink-0">
                    <span className="text-xl font-black text-white">{selectedBooking.images?.length || 0}</span>
                 </div>
                 <div>
                   <h3 className="text-4xl font-syne font-black uppercase italic tracking-tighter vapor-text leading-none">{selectedBooking.name}</h3>
                   <p className="text-[10px] text-cyan-400 uppercase tracking-widest mt-2">Frequency: {selectedBooking.email} // ID: {selectedBooking.id}</p>
                 </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-black border-2 ${selectedBooking.status === 'delivered' ? 'border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]'}`}>
                {selectedBooking.status === 'delivered' ? 'SEALED' : 'PENDING'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 border border-white/10 space-y-6 bg-white/5">
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-pink-400 font-bold border-b border-white/5 pb-2 flex justify-between">
                  <span>Vault Identity Terminal</span>
                  <span className="text-[8px] opacity-30 font-mono">AUTO_SAVE: ON</span>
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-white/40 block mb-2">Bespoke Project Name</label>
                    <input 
                      className="w-full bg-black/60 border border-white/10 p-4 text-xs text-white focus:border-cyan-400 outline-none font-mono uppercase"
                      value={selectedBooking.name}
                      onChange={e => handleUpdateBooking({...selectedBooking, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-white/40 block mb-2">Client Frequency (Email)</label>
                    <input 
                      className="w-full bg-black/60 border border-white/10 p-4 text-xs text-cyan-400 focus:border-cyan-400 outline-none font-mono"
                      value={selectedBooking.email}
                      onChange={e => handleUpdateBooking({...selectedBooking, email: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] uppercase tracking-widest text-white/40 block mb-2">Transmission Date</label>
                      <input 
                        type="date"
                        className="w-full bg-black/60 border border-white/10 p-4 text-xs text-white focus:border-cyan-400 outline-none [color-scheme:dark]"
                        value={selectedBooking.date}
                        onChange={e => handleUpdateBooking({...selectedBooking, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[8px] uppercase tracking-widest text-white/40 block mb-2">Service Package</label>
                      <input 
                        className="w-full bg-black/60 border border-white/10 p-4 text-xs text-white focus:border-cyan-400 outline-none font-mono uppercase"
                        value={selectedBooking.package}
                        onChange={e => handleUpdateBooking({...selectedBooking, package: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 border border-white/10 space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold border-b border-white/5 pb-2">Client Communications History</h4>
                <textarea 
                  className="w-full bg-black/60 border border-white/10 p-4 text-[11px] text-pink-100 focus:border-pink-500 outline-none h-48 custom-scrollbar leading-relaxed"
                  value={selectedBooking.notes || ''}
                  placeholder="Record all signal exchanges and creative preferences..."
                  onChange={e => handleUpdateBooking({...selectedBooking, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="glass-panel p-6 border border-cyan-400/30 bg-black/40 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-cyan-400/30 shadow-[0_0_10px_cyan] animate-[scan_4s_infinite]" />
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold">Artifact Archive Upload Terminal</h4>
                  <button 
                    onClick={purgeAllArtifacts}
                    disabled={!selectedBooking.images || selectedBooking.images.length === 0}
                    className="text-[8px] uppercase tracking-widest text-red-400 hover:text-white transition-colors disabled:opacity-20 font-black"
                  >
                    Purge All Node Artifacts
                  </button>
                </div>
                
                <div 
                  className="w-full h-44 border-2 border-dashed border-cyan-400/20 hover:border-cyan-400/60 transition-colors flex flex-col items-center justify-center cursor-pointer group bg-cyan-400/5 relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="text-center space-y-3 relative z-10 px-8 w-full">
                      <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white animate-pulse">Broadcasting Batch Data...</div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300 shadow-[0_0_8px_cyan]" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <div className="text-[9px] font-mono text-cyan-400 tracking-widest">{uploadProgress}% TRANSMITTED</div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full border border-cyan-400/30 flex items-center justify-center mb-4 group-hover:bg-cyan-400 group-hover:text-black transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors text-center">
                        Select Multiple Artifacts<br/>
                        <span className="text-[8px] tracking-[0.1em] opacity-60">BATCH UPLOAD SUPPORTED</span>
                      </p>
                      <p className="text-[8px] text-pink-500/40 uppercase mt-2 font-mono tracking-tighter">Direct Persistent Database Injection</p>
                    </>
                  )}
                  <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-6 max-h-[350px] overflow-y-auto custom-scrollbar p-1">
                  {(selectedBooking.images || []).map((img, i) => (
                    <div key={i} className="aspect-square relative group border border-white/10 overflow-hidden bg-white/5 gemstone-glow hover:border-cyan-400 transition-colors">
                      <img src={img} className="w-full h-full object-cover" alt="Artifact" />
                      <button 
                        onClick={() => handleUpdateBooking({...selectedBooking, images: selectedBooking.images?.filter((_, idx) => idx !== i)})}
                        className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-black uppercase text-white transition-opacity"
                      >
                        Purge
                      </button>
                    </div>
                  ))}
                  {(!selectedBooking.images || selectedBooking.images.length === 0) && (
                    <div className="col-span-full h-32 flex flex-col items-center justify-center opacity-20 border border-dashed border-white/10 italic text-[10px] uppercase tracking-[0.5em]">
                       Archive Node Empty
                    </div>
                  )}
                </div>

                <div className="pt-8">
                  <div className="glass-panel p-6 border border-cyan-400/20 bg-cyan-400/5 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-1">Decryption Key</div>
                      <div className="text-xl font-mono font-black text-pink-400 tracking-[0.2em]">{selectedBooking.vaultKey || 'NOT_YET_ISSUED'}</div>
                    </div>
                    <button 
                      onClick={markAsDelivered}
                      disabled={selectedBooking.status === 'delivered' || (selectedBooking.images?.length || 0) === 0}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-pink-600 text-white font-black uppercase tracking-[0.3em] gemstone-glow disabled:grayscale disabled:opacity-20 transition-all text-[10px] relative z-10"
                    >
                      {selectedBooking.status === 'delivered' ? 'VAULT SEALED' : 'SEAL & BROADCAST'}
                    </button>
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(90deg,transparent_95%,rgba(0,255,249,0.4)_95%)] bg-[length:50px_100%] animate-[scan_10s_linear_infinite]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'vaults' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-widest vapor-text italic leading-tight">Sovereign Node Archives</h3>
              <p className="text-[10px] text-pink-400 uppercase tracking-widest mt-1">Direct Database Management Portal</p>
            </div>
            <button 
              onClick={createManualVault}
              className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 uppercase text-[10px] font-black tracking-[0.2em] hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,249,0.2)]"
            >
              + Create Client Vault
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(b => (
              <div 
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="glass-panel p-6 border border-white/5 bg-black/40 hover:border-cyan-400/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center gemstone-glow opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-black text-white">{b.images?.length || 0}</span>
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border-2 ${b.status === 'delivered' ? 'border-green-500 text-green-500' : 'border-orange-500 text-orange-400'}`}>
                    {b.status}
                  </div>
                </div>
                <h4 className="text-xl font-black uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors truncate">{b.name}</h4>
                <div className="text-[10px] text-pink-100/40 uppercase tracking-widest mb-4 font-mono">{b.email}</div>
                <div className="flex justify-between items-center pt-5 border-t border-white/5 mt-4">
                  <span className="text-[10px] font-mono text-white/30">{b.date}</span>
                  <span className="text-[9px] font-black uppercase text-pink-500 tracking-widest group-hover:translate-x-2 transition-transform">Configure Portal →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-8 border-l-4 border-cyan-500 shadow-[0_0_20px_rgba(0,255,249,0.1)]">
              <p className="text-[10px] text-pink-400 uppercase tracking-widest mb-2 font-black">Archive Density</p>
              <h4 className="text-4xl font-black font-syne">{portfolio.length} ITEMS</h4>
            </div>
            <div className="glass-panel p-8 border-l-4 border-pink-500">
              <p className="text-[10px] text-pink-400 uppercase tracking-widest mb-2 font-black">Frequency Channels</p>
              <h4 className="text-4xl font-black font-syne">{bookings.length} CLIENTS</h4>
            </div>
            <div className="glass-panel p-8 border-l-4 border-orange-500">
              <p className="text-[10px] text-pink-400 uppercase tracking-widest mb-2 font-black">Total Revenue</p>
              <h4 className="text-4xl font-black font-syne">${revenue}</h4>
            </div>
            <div className="glass-panel p-8 border-l-4 border-purple-500">
              <p className="text-[10px] text-pink-400 uppercase tracking-widest mb-2 font-black">System Status</p>
              <h4 className="text-3xl font-black font-syne text-cyan-400 uppercase italic">Nominal</h4>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-500 ${showFullLogs ? 'h-72' : 'h-10'} glass-panel border-t-2 border-cyan-500/50 flex flex-col bg-[#0d0221]/95`}>
        <div className="h-10 px-6 flex items-center justify-between cursor-pointer hover:bg-cyan-500/5" onClick={() => setShowFullLogs(!showFullLogs)}>
          <div className="flex items-center gap-4 overflow-hidden">
            <div className={`w-2 h-2 rounded-full ${latestLog?.status === 'SYNCING' ? 'bg-pink-500 animate-ping' : (latestLog?.status === 'ERROR' ? 'bg-red-500' : 'bg-green-500')}`} />
            <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-[0.3em] whitespace-nowrap">
              {latestLog ? `[${latestLog.timestamp}] ${latestLog.method} ${latestLog.endpoint} -- STATUS: ${latestLog.status}` : 'CLOUD PERSISTENCE LAYER READY'}
            </span>
          </div>
          <button className="text-[9px] text-pink-400 uppercase tracking-[0.4em] font-black border-l border-white/10 pl-4 hover:text-white">
            {showFullLogs ? 'CLOSE' : 'DEBUG_LOGS'}
          </button>
        </div>
        
        {showFullLogs && (
          <div className="flex-grow overflow-y-auto p-4 font-mono text-[10px] space-y-2 custom-scrollbar bg-black/60">
            {logs.map(log => (
              <div key={log.id} className={`flex gap-4 border-b border-white/5 py-2 ${log.status === 'SYNCING' ? 'text-pink-400' : (log.status === 'ERROR' ? 'text-red-400' : 'text-cyan-100/60')}`}>
                <span className="opacity-40">[{log.timestamp}]</span>
                <span className={`font-bold w-14 ${log.method === 'POST' ? 'text-orange-400' : 'text-cyan-300'}`}>{log.method}</span>
                <span className="flex-grow tracking-wider">{log.endpoint}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black ${log.status === 'SUCCESS' ? 'bg-green-900/20 text-green-400' : 'bg-pink-900/20 text-pink-400'}`}>{log.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
