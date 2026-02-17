import React, { useState } from 'react';
import type { RevenueMetric, ArchiveMetric, Booking } from '../types';

interface DashboardProps {
  revenue: RevenueMetric;
  channels: any[]; // Or link to ContactChannel
  archive: ArchiveMetric;
}

export const SovereigntyDashboard = ({ revenue, channels, archive }: DashboardProps) => {
  const [activeDetail, setActiveDetail] = useState<string | null>(null);

  return (
    <div className="p-6 bg-zinc-950 text-white font-mono rounded-lg border border-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* ARCHIVE DENSITY */}
        <button 
          onClick={() => setActiveDetail('archive')}
          className="p-6 border border-zinc-800 hover:border-blue-500 bg-zinc-900 transition-all text-left group"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest group-hover:text-blue-400">Archive Density</p>
          <h3 className="text-2xl font-bold">{archive.unitCount} Units</h3>
          <div className="w-full bg-zinc-800 h-1 mt-2">
             <div className="bg-blue-500 h-1" style={{ width: `${archive.densityScore}%` }}></div>
          </div>
        </button>

        {/* FREQUENCY CHANNELS */}
        <button 
          onClick={() => setActiveDetail('channels')}
          className="p-6 border border-zinc-800 hover:border-green-500 bg-zinc-900 transition-all text-left group"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest group-hover:text-green-400">Frequency Channels</p>
          <h3 className="text-2xl font-bold">{channels.length} Active</h3>
        </button>

        {/* TOTAL REVENUE */}
        <button 
          onClick={() => setActiveDetail('revenue')}
          className="p-6 border border-zinc-800 hover:border-gold bg-zinc-900 transition-all text-left group"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest group-hover:text-gold">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gold">${revenue.totalRevenue.toLocaleString()}</h3>
        </button>
      </div>

      {/* Detail View Section */}
      {activeDetail && (
        <div className="mt-8 p-6 bg-zinc-900 border-t-2 border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl uppercase tracking-tighter">{activeDetail} Analysis</h4>
            <button 
              onClick={() => setActiveDetail(null)} 
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-400"
            >
              CLOSE [ESC]
            </button>
          </div>
          
          {activeDetail === 'revenue' && (
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-zinc-950 border border-zinc-800">
                     <p className="text-[10px] text-zinc-500 uppercase">Cleared Ledger</p>
                     <p className="text-lg text-green-500">${revenue.clearedRevenue}</p>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800">
                     <p className="text-[10px] text-zinc-500 uppercase">Pending Signal</p>
                     <p className="text-lg text-yellow-500">${revenue.pendingRevenue}</p>
                  </div>
               </div>
               <table className="w-full text-left text-xs uppercase tracking-tight">
                <thead><tr className="text-zinc-500 border-b border-zinc-800"><th className="pb-2">Source</th><th className="pb-2">Allocation</th></tr></thead>
                <tbody>
                  {Object.entries(revenue.categoryBreakdown).map(([source, amount]) => (
                    <tr key={source} className="border-b border-zinc-800/50">
                      <td className="py-3">{source}</td>
                      <td className="py-3 text-gold">${amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Implement Archive/Channel tables as needed */}
        </div>
      )}
    </div>
  );
};