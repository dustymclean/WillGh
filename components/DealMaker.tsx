
import React, { useState, useRef } from 'react';
import { Contract } from '../types';

interface DealMakerProps {
  onSave: (contract: Contract) => void;
  onBack: () => void;
}

const DealMaker: React.FC<DealMakerProps> = ({ onSave, onBack }) => {
  const [form, setForm] = useState({ clientName: '', totalValue: 500 });
  const [isSigned, setIsSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00fff9';
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const mx = ('touches' in moveEvent) ? moveEvent.touches[0].clientX - rect.left : moveEvent.clientX - rect.left;
      const my = ('touches' in moveEvent) ? moveEvent.touches[0].clientY - rect.top : moveEvent.clientY - rect.top;
      ctx.lineTo(mx, my);
      ctx.stroke();
    };

    const stopDrawing = () => {
      canvas.removeEventListener('mousemove', handleMove as any);
      canvas.removeEventListener('touchmove', handleMove as any);
      setIsSigned(true);
    };

    canvas.addEventListener('mousemove', handleMove as any);
    canvas.addEventListener('touchmove', handleMove as any);
    window.addEventListener('mouseup', stopDrawing, { once: true });
    window.addEventListener('touchend', stopDrawing, { once: true });
  };

  const commit = () => {
    const canvas = canvasRef.current;
    const contract: Contract = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: form.clientName,
      date: new Date().toLocaleDateString(),
      totalValue: form.totalValue,
      signed: isSigned,
      signatureData: canvas?.toDataURL()
    };
    onSave(contract);
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-syne font-black uppercase italic vapor-text">Deal Maker</h2>
          <p className="text-[10px] text-pink-500 uppercase tracking-widest">Protocol for Legal Artifact Creation</p>
        </div>
        <button onClick={onBack} className="text-xs text-pink-400 hover:text-white uppercase tracking-widest transition-colors">Abort Mission</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Execution Protocol (Instructions) */}
        <div className="md:col-span-4 space-y-6">
           <div className="glass-panel p-6 border border-white/5 bg-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-pink-400 font-bold mb-4">Execution Protocol</h3>
              <ul className="space-y-4">
                <li className={`text-[9px] uppercase tracking-widest flex items-center gap-3 transition-opacity ${form.clientName ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-3 h-3 border ${form.clientName ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'}`} />
                  Step 01: Client Identity
                </li>
                <li className={`text-[9px] uppercase tracking-widest flex items-center gap-3 transition-opacity ${form.totalValue > 0 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-3 h-3 border ${form.totalValue > 0 ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'}`} />
                  Step 02: Investment Terms
                </li>
                <li className={`text-[9px] uppercase tracking-widest flex items-center gap-3 transition-opacity ${isSigned ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-3 h-3 border ${isSigned ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'}`} />
                  Step 03: Artifact Verification
                </li>
                <li className={`text-[9px] uppercase tracking-widest flex items-center gap-3 transition-opacity ${form.clientName && isSigned ? 'opacity-100 animate-pulse' : 'opacity-40'}`}>
                  <div className={`w-3 h-3 border ${form.clientName && isSigned ? 'bg-pink-500 border-pink-500' : 'border-white/20'}`} />
                  Step 04: Seal Artifact
                </li>
              </ul>
           </div>
           
           <div className="glass-panel p-6">
              <h3 className="text-lg font-bold uppercase tracking-widest text-cyan-400 mb-4">Project Terms</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-pink-200 block mb-2">Client Identity</label>
                  <input 
                    className="w-full bg-white/5 border border-pink-500/30 p-4 text-sm focus:border-cyan-400 outline-none text-white"
                    placeholder="NAME/ALIAS"
                    value={form.clientName}
                    onChange={e => setForm({...form, clientName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-pink-200 block mb-2">Investment Value ($)</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-pink-500/30 p-4 text-sm focus:border-cyan-400 outline-none text-white"
                    value={form.totalValue}
                    onChange={e => setForm({...form, totalValue: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
           </div>
        </div>

        {/* Contract Artifact (Signature) */}
        <div className="md:col-span-8 glass-panel p-8 flex flex-col gap-6 bg-[#0a001a] border-t-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,249,0.1)]">
           <h3 className="text-3xl font-syne font-black italic tracking-tighter uppercase leading-none mb-4">Contract Artifact</h3>
           <p className="text-[10px] text-pink-100/50 leading-relaxed uppercase tracking-widest">
             By signing below, the client acknowledges the sovereign artistic vision of Will Ghrigsby Photography. Artifacts will be delivered via Echo Vault upon finalization of digital transmission. All captures are subject to Neo-Andean processing protocols.
           </p>
           
           <div className="flex-grow space-y-4 mt-8">
              <label className="text-[10px] uppercase tracking-widest text-cyan-400 block font-bold">Digital Verification Sign-off</label>
              <div className="relative group">
                <canvas 
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onTouchStart={startDrawing}
                  width={600}
                  height={200}
                  className="w-full bg-black border border-white/10 cursor-crosshair min-h-[200px]"
                />
                <div className="absolute top-2 right-2 text-[8px] uppercase tracking-widest text-white/20 font-mono">Sign Within Perimeter</div>
              </div>
              <button 
                onClick={() => {
                  const ctx = canvasRef.current?.getContext('2d');
                  ctx?.clearRect(0, 0, 600, 200);
                  setIsSigned(false);
                }}
                className="text-[8px] uppercase tracking-widest text-pink-500 hover:text-white transition-colors"
              >
                Reset Verification Canvas
              </button>
           </div>

           <button 
             onClick={commit}
             disabled={!form.clientName || !isSigned}
             className="w-full py-5 bg-gradient-to-r from-cyan-600 to-pink-600 text-white font-black uppercase tracking-[0.4em] disabled:opacity-10 disabled:grayscale transition-all gemstone-glow mt-8"
           >
             Seal Project Artifact
           </button>
        </div>
      </div>
    </div>
  );
};

export default DealMaker;
