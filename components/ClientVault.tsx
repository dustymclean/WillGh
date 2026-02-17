
import React, { useState } from 'react';
import { Booking } from '../types';

interface ClientVaultProps {
  bookings: Booking[];
}

const ClientVault: React.FC<ClientVaultProps> = ({ bookings }) => {
  const [accessKey, setAccessKey] = useState('');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const found = bookings.find(b => b.id === accessKey || b.vaultKey === accessKey);
    if (found) {
      setActiveBooking(found);
    } else {
      alert("Transmission ID not found in the Echoes. Verify your key and try again.");
    }
  };

  if (activeBooking) {
    const displayImages = activeBooking.images && activeBooking.images.length > 0 
      ? activeBooking.images 
      : [1,2,3,4,5,6].map(i => `https://picsum.photos/seed/vault${activeBooking.id}${i}/800/800`);

    return (
      <div className="space-y-12 animate-in fade-in duration-1000 text-left">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-pink-500/20 pb-8">
           <div>
             <span className="text-cyan-400 text-[10px] uppercase font-bold tracking-[0.5em]">High-Res Artifact Collection</span>
             <h2 className="text-5xl font-syne font-black uppercase italic vapor-text">{activeBooking.name}</h2>
           </div>
           <button 
             onClick={() => setActiveBooking(null)}
             className="px-6 py-2 border border-pink-500 text-pink-400 uppercase tracking-widest text-[9px] font-black hover:bg-pink-500 hover:text-white transition-all"
           >
             Lock Vault
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayImages.map((imgUrl, i) => (
            <div key={i} className="glass-panel group relative overflow-hidden aspect-square p-2 border-white/5 hover:border-cyan-400/50 transition-colors">
              <img 
                src={imgUrl} 
                className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-700"
                alt="Vault artifact"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                <button className="px-6 py-2 border border-cyan-400 text-cyan-400 uppercase text-[10px] tracking-widest font-black hover:bg-cyan-400 hover:text-black transition-all gemstone-glow">
                  Download Artifact
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel p-8 text-center border-t-2 border-pink-500 max-w-2xl mx-auto bg-black/40">
           <h4 className="text-xl font-bold uppercase tracking-widest mb-4">Complete Transmission Archive</h4>
           <p className="text-sm text-pink-100/60 font-serif italic mb-6">
             Your visual artifacts have been fully processed and are now available for local archival in high-fidelity formats.
           </p>
           <button className="w-full py-4 bg-gradient-to-r from-pink-600 to-cyan-600 text-white font-black uppercase tracking-[0.3em] gemstone-glow hover:brightness-110 transition-all">
             Archive All Artifacts (.ZIP)
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
      <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full animate-pulse flex items-center justify-center gemstone-glow shadow-[0_0_50px_rgba(255,0,193,0.3)]">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
         </svg>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-5xl font-syne font-black uppercase italic tracking-tighter vapor-text">Echo Vault</h2>
        <p className="text-pink-100/60 font-serif italic text-lg max-w-sm mx-auto">
          "Transmission verification required to decrypt your digital echoes."
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Decryption Protocol Guide */}
        <div className="glass-panel p-6 border border-cyan-400/20 bg-cyan-400/5 space-y-4 flex flex-col justify-center">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold border-b border-cyan-400/20 pb-2">Decryption Protocol</h4>
          <ul className="space-y-4">
            <li className="text-[9px] uppercase tracking-widest text-white/50 leading-relaxed">
              <span className="text-cyan-400 font-black mr-2">Step 1</span> Enter the unique ID provided in your project artifact.
            </li>
            <li className="text-[9px] uppercase tracking-widest text-white/50 leading-relaxed">
              <span className="text-cyan-400 font-black mr-2">Step 2</span> Initiate decryption to access the cloud node.
            </li>
            <li className="text-[9px] uppercase tracking-widest text-white/50 leading-relaxed">
              <span className="text-cyan-400 font-black mr-2">Step 3</span> Review and download your processed visual data.
            </li>
          </ul>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAccess} className="space-y-4 flex flex-col justify-center">
          <div>
            <label className="text-[9px] uppercase tracking-widest text-white/40 mb-2 block font-bold">Transmission Key</label>
            <input 
              type="text" 
              placeholder="XXXXXX"
              className="w-full bg-white/5 border border-pink-500/30 p-5 text-center text-cyan-400 font-mono tracking-[0.5em] focus:border-cyan-400 outline-none text-xl transition-all"
              value={accessKey}
              onChange={e => setAccessKey(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-white/10 border border-white/20 text-pink-400 uppercase tracking-[0.4em] font-black hover:bg-white/20 transition-all gemstone-glow"
          >
            Initiate Decryption
          </button>
          <p className="text-[9px] text-pink-500/40 uppercase tracking-widest animate-pulse mt-2 text-center">
            P2P Sovereignty Node Active
          </p>
        </form>
      </div>
      
      <div className="opacity-20 text-[8px] uppercase tracking-[0.8em] font-mono">
        WILL GHRIGSBY // NODE ACCESS GATEWAY
      </div>
    </div>
  );
};

export default ClientVault;
