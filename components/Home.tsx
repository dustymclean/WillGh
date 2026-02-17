
import React from 'react';

interface HomeProps {
  onExplore: () => void;
  onMagazine: () => void;
}

const Home: React.FC<HomeProps> = ({ onExplore, onMagazine }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="relative mb-8">
        <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic font-syne vapor-text leading-none">
          Will<br/>Ghrigsby<br/>Photography
        </h2>
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400 opacity-20 blur-2xl animate-ping" />
      </div>

      <p className="max-w-2xl text-lg md:text-xl text-pink-100/80 mb-12 font-serif italic leading-relaxed">
        Capturing the intersection of ancestral geometry and digital nostalgia. 
        Soft-focus portraits, gemstone refractions, and the quiet buzz of a CRT sunset.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <button 
          onClick={onExplore}
          className="px-10 py-4 glass-panel border border-pink-500/50 hover:border-cyan-400 text-pink-400 hover:text-cyan-400 transition-all duration-300 uppercase tracking-widest font-bold group"
        >
          View The Archive
          <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">→</span>
        </button>
        <button 
          onClick={onMagazine}
          className="px-10 py-4 border-b border-pink-400/30 hover:border-pink-400 text-pink-300/70 hover:text-pink-100 transition-all duration-300 uppercase tracking-widest text-sm italic"
        >
          Curated Magazine
        </button>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
        {[1,2,3,4].map(i => (
          <div key={i} className="aspect-[3/4] overflow-hidden glass-panel relative group">
            <img 
              src={`https://picsum.photos/seed/home${i}/400/600`} 
              className="w-full h-full object-cover filter grayscale sepia group-hover:grayscale-0 transition-all duration-700"
              alt="Preview"
            />
            <div className="absolute inset-0 bg-pink-500/10 group-hover:bg-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
