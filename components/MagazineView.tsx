
import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';

interface MagazineViewProps {
  items: PortfolioItem[];
}

const MagazineView: React.FC<MagazineViewProps> = ({ items }) => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const activeItem = items[activePageIndex];

  const handleFlip = (next: boolean) => {
    if (isFlipping) return;
    
    const newIndex = next 
      ? (activePageIndex + 1) % items.length 
      : (activePageIndex - 1 + items.length) % items.length;

    setDirection(next ? 'next' : 'prev');
    setIsFlipping(true);

    // Timing matches the CSS transition
    setTimeout(() => {
      setActivePageIndex(newIndex);
      setIsFlipping(false);
    }, 800);
  };

  if (!activeItem) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-pink-400 uppercase tracking-widest font-bold">No Artifacts Detected in this Node.</p>
    </div>
  );

  return (
    <div className="relative max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center py-12 px-4 overflow-hidden">
      {/* Magazine Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-20">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 via-cyan-400 to-orange-400 transition-all duration-700 shadow-[0_0_10px_rgba(0,255,249,0.5)]" 
          style={{ width: `${((activePageIndex + 1) / items.length) * 100}%` }}
        />
        <div className="flex justify-between mt-2 px-2 text-[8px] uppercase tracking-[0.4em] font-mono text-cyan-400/50">
          <span>Spread {activePageIndex + 1} // {items.length}</span>
          <span>Archival Status: Operational</span>
        </div>
      </div>

      {/* Main Reader Container with 3D Perspective */}
      <div 
        className={`relative transition-all duration-1000 ease-in-out transform-gpu flex flex-col items-center lg:items-stretch lg:flex-row gap-8 lg:gap-16
          ${isFlipping 
            ? (direction === 'next' ? 'scale-90 rotate-y-minus-90 translate-x-minus-20 opacity-0' : 'scale-90 rotate-y-90 translate-x-20 opacity-0') 
            : 'scale-100 rotate-y-0 translate-x-0 opacity-100'}
        `}
        style={{ 
          perspective: '2500px',
          transformStyle: 'preserve-3d',
          transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
        }}
      >
        {/* Left/Main Content: The Image Spread */}
        <div className="w-full lg:w-3/5 aspect-[4/5] lg:aspect-auto lg:h-[70vh] relative shadow-2xl glass-panel p-2 gemstone-glow transform-gpu hover:scale-[1.01] transition-transform duration-500">
          <div className="w-full h-full relative overflow-hidden bg-black group">
            <img 
              key={activeItem.id}
              src={activeItem.url} 
              className="w-full h-full object-cover filter brightness-110 contrast-105 saturate-125 transition-transform duration-[4000ms] ease-out animate-pulse-slow"
              alt="Editorial Main"
            />
            {/* Immersive Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
              <h4 className="text-[12vw] lg:text-[7rem] font-syne font-extrabold text-white leading-none tracking-tighter mix-blend-overlay opacity-50 uppercase italic select-none">
                {activeItem.category.split('-')[0]}
              </h4>
            </div>

            {/* Aesthetic Grain Layer */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay grain-bg" />
            
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-20" />
          </div>
        </div>

        {/* Right Content: The Editorial Narrative */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center space-y-8 py-4 lg:py-12 relative">
          <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-4">
              <span className="text-orange-400 text-[10px] uppercase font-bold tracking-[0.5em] border-b border-orange-400/30 pb-1">ARTIFACT {activeItem.id.slice(0, 4)}</span>
              <div className="h-px flex-grow bg-white/10" />
            </div>
            <h3 className="text-5xl lg:text-7xl font-syne font-black vapor-text italic leading-none">{activeItem.title}</h3>
          </div>
          
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <p className="text-2xl lg:text-3xl font-serif italic text-pink-200 leading-tight">
              "{activeItem.description}"
            </p>
            
            {activeItem.articleBody && (
              <div className="text-pink-100/70 leading-relaxed text-base font-light space-y-4 max-w-lg custom-scrollbar max-h-[30vh] overflow-y-auto pr-4">
                {activeItem.articleBody.split('\n').map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            )}

            {!activeItem.articleBody && (
               <p className="text-pink-100/30 text-sm italic tracking-widest uppercase">Encryption ongoing... full narrative metadata pending transmission.</p>
            )}
          </div>

          <div className="pt-12 flex flex-wrap items-center gap-6">
             <button 
                onClick={() => handleFlip(true)}
                className="group relative text-[10px] uppercase tracking-[0.4em] font-black py-5 px-10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all overflow-hidden gemstone-glow"
              >
              <span className="relative z-10 flex items-center gap-3">
                Collect Artifact
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            
            <button 
              onClick={() => handleFlip(false)}
              className="text-[9px] uppercase tracking-[0.3em] text-pink-500/50 hover:text-pink-400 transition-colors"
            >
              Previous Spread
            </button>
          </div>
        </div>
      </div>

      {/* Background Page Numbering Decoration */}
      <div className="fixed bottom-32 -right-12 opacity-5 hidden lg:block select-none pointer-events-none transform rotate-90">
         <span className="text-[20rem] font-syne font-black text-white italic uppercase leading-none">
           {String(activePageIndex + 1).padStart(2, '0')}
         </span>
      </div>

      <style>{`
        .rotate-y-90 { transform: rotateY(90deg); }
        .rotate-y-minus-90 { transform: rotateY(-90deg); }
        .translate-x-minus-20 { transform: translateX(-20vw); }
        .translate-x-20 { transform: translateX(20vw); }
        .rotate-y-0 { transform: rotateY(0deg); }
        .grain-bg { background-image: url('https://www.transparenttextures.com/patterns/asfalt-dark.png'); }
        @keyframes pulse-slow {
          0%, 100% { filter: brightness(1.1) contrast(1.05) saturate(1.25); }
          50% { filter: brightness(1.3) contrast(1.1) saturate(1.5); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MagazineView;
