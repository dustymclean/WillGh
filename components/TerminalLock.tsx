
import React, { useState } from 'react';

interface TerminalLockProps {
  onAuth: (success: boolean) => void;
}

const TerminalLock: React.FC<TerminalLockProps> = ({ onAuth }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sovereign Access Key updated to 'milo'
    if (pass === 'milo') {
      onAuth(true);
    } else {
      setError(true);
      setPass('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-12 glass-panel border border-pink-500/30 text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-black/40 rounded-full mx-auto flex items-center justify-center border border-cyan-400/50 gemstone-glow">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-syne font-black uppercase italic vapor-text">Terminal Locked</h2>
        <p className="text-[10px] text-pink-100/50 tracking-[0.3em] uppercase">Enter Sovereign Access Key</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="password" 
          autoFocus
          className={`w-full bg-black/60 border ${error ? 'border-red-500' : 'border-pink-500/30'} p-4 text-center tracking-[1em] text-cyan-400 outline-none focus:border-cyan-400 transition-all font-mono`}
          placeholder="••••"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <button 
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-pink-600 text-white font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all text-xs"
        >
          Authorize Transmission
        </button>
      </form>
      
      {error && <p className="text-[10px] text-red-400 uppercase tracking-widest animate-pulse">Signature Mismatch</p>}
      
      <p className="text-[8px] text-pink-100/20 uppercase tracking-[0.5em] pt-8">
        Proprietary Security Layer // Will Ghrigsby Photography
      </p>
    </div>
  );
};

export default TerminalLock;
