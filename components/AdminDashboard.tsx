import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { SovereigntyDashboard } from './SovereigntyDashboard'; // Assuming we kept this modular
import type { 
  RevenueMetric, 
  ArchiveMetric, 
  Vault, 
  Booking, 
  AdminTab 
} from '../types';

/**
 * SOVEREIGN INTELLIGENCE HUB (Local Ollama Node)
 */
const IntelligenceHub: React.FC = () => {
  const [localSignal, setLocalSignal] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const invokeLocalNode = async (prompt: string) => {
    setIsSynthesizing(true);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt: `System: You are a Neo-Andean Vaporwave curator. Signal: ${prompt}`,
          stream: false
        })
      });
      const data = await response.json();
      setLocalSignal(data.response);
    } catch (err) {
      setLocalSignal("OFFLINE: Ensure Ollama is running (OLLAMA_ORIGINS='*').");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="glass-panel p-8 border-t-2 border-pink-500 bg-black/40 rounded-lg animate-in fade-in zoom-in duration-300">
      <h3 className="text-3xl font-black uppercase italic vapor-text mb-4">Sovereign Intelligence</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
             Local Node: {isSynthesizing ? "PROCESSING..." : "MISTRAL-7B"}
           </p>
           <textarea 
             className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs text-white font-mono h-24 focus:border-pink-500 outline-none"
             placeholder="Enter signal for analysis..."
             onChange={(e) => setLocalSignal(e.target.value)}
           />
           <button 
             onClick={() => invokeLocalNode("Draft a poetic email for a new Neo-Andean portrait client.")}
             disabled={isSynthesizing}
             className="w-full py-4 border border-cyan-400 text-cyan-400 uppercase text-[10px] font-black tracking-widest hover:bg-cyan-400 hover:text-black transition-all"
           >
             Synthesize Signal
           </button>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 font-mono text-[11px] text-pink-100 leading-relaxed italic min-h-[150px]">
          {localSignal || "Awaiting Node Transmission..."}
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN ADMIN DASHBOARD HUB
 */
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for immediate visualization (Replace with Supabase fetch)
  const stats = {
    revenue: {
      totalRevenue: 12500,
      clearedRevenue: 10200,
      pendingRevenue: 2300,
      categoryBreakdown: { 'Portrait': 8000, 'Magazine': 3000, 'Prints': 1500 }
    },
    archive: { unitCount: vaults.length || 0, densityScore: 68 },
    channels: ['WhatsApp', 'Email', 'Instagram', 'Vault']
  };

  useEffect(() => {
    const fetchVaults = async () => {
      const { data } = await supabase.from('vaults').select('*').order('created_at', { ascending: false });
      if (data) setVaults(data);
      setLoading(false);
    };
    fetchVaults();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono selection:bg-pink-500">
      {/* Header & Global Status */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase italic">Sovereign Node v1.0</h1>
          <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase">Operator: Dusty McLean // WillGh Photography</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/50 text-green-500 text-[9px] uppercase font-bold">Systems: Nominal</div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/50 text-blue-500 text-[9px] uppercase font-bold">Net: Encrypted</div>
        </div>
      </header>

      {/* Navigation Matrix */}
      <nav className="flex gap-4 mb-8 border-b border-zinc-900 pb-4 overflow-x-auto">
        {(['overview', 'vaults', 'intelligence'] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 uppercase text-[10px] font-black tracking-widest transition-all ${
              activeTab === tab 
              ? 'bg-white text-black' 
              : 'text-zinc-500 hover:text-white border border-zinc-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Dynamic Content Frame */}
      <main className="transition-all duration-500">
        {activeTab === 'overview' && (
          <SovereigntyDashboard 
            revenue={stats.revenue} 
            channels={stats.channels} 
            archive={stats.archive} 
          />
        )}

        {activeTab === 'vaults' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-left-4">
            {vaults.map((vault) => (
              <div key={vault.id} className="p-4 border border-zinc-800 bg-zinc-900/50 hover:border-gold transition-colors">
                <p className="text-[10px] text-gold uppercase font-bold mb-1">{vault.vault_key}</p>
                <h4 className="text-lg font-bold truncate">{vault.client_name}</h4>
                <p className="text-[10px] text-zinc-500 mb-4">{vault.client_email}</p>
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                  <span className={vault.status === 'active' ? 'text-green-500' : 'text-red-500'}>
                    {vault.status}
                  </span>
                  <span className="text-zinc-400">{vault.images.length} Artifacts</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'intelligence' && <IntelligenceHub />}
      </main>

      {/* Footer Signal */}
      <footer className="mt-24 pt-8 border-t border-zinc-900 flex justify-between items-center opacity-30">
        <p className="text-[9px] uppercase tracking-widest">© 2026 Ole Brook Web Services</p>
        <p className="text-[9px] uppercase tracking-widest">Signal Latency: 14ms</p>
      </footer>
    </div>
  );
};