
import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CullingSuiteProps {
  onSave: (items: PortfolioItem[]) => void;
}

const CullingSuite: React.FC<CullingSuiteProps> = ({ onSave }) => {
  const [images, setImages] = useState<{file: File, url: string, rating: number, aiScore?: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file: File) => ({
        file,
        url: URL.createObjectURL(file),
        rating: 0
      }));
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length === 0) return;
      if (e.key >= '1' && e.key <= '5') {
        updateRating(parseInt(e.key));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(i => Math.min(i + 1, images.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(i => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images, currentIndex]);

  const updateRating = (rating: number) => {
    setImages(prev => {
      const copy = [...prev];
      copy[currentIndex].rating = rating;
      return copy;
    });
  };

  const analyzeWithAI = async () => {
    if (!images[currentIndex]) return;
    const current = images[currentIndex];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { text: "Analyze this photography frame for technical sharpness, exposure, and its resonance with a Neo-Andean Vaporwave aesthetic. Be concise, use professional terminology." },
              { inlineData: { data: base64Data, mimeType: current.file.type } }
            ]
          }
        });
        setImages(prev => {
          const next = [...prev];
          next[currentIndex].aiScore = response.text;
          return next;
        });
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(current.file);
  };

  const finalize = () => {
    const keeps = images
      .filter(img => img.rating >= 4)
      .map(img => ({
        id: Math.random().toString(36).substr(2, 9),
        url: img.url,
        title: `Keep: ${img.file.name}`,
        category: 'Neo-Andean' as const,
        description: 'Selected via Sovereignty Culling Suite',
        date: new Date().toISOString().split('T')[0]
      }));
    onSave(keeps);
  };

  return (
    <div className="space-y-6 h-full flex flex-col text-left">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black uppercase italic vapor-text">Culling Suite</h2>
          <p className="text-[10px] text-cyan-400 uppercase tracking-widest">Rapid Artifact Selection Tool</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            id="culling-upload" 
            onChange={handleFileChange}
          />
          <label htmlFor="culling-upload" className="px-6 py-2 glass-panel border border-cyan-400 text-cyan-400 uppercase text-[10px] tracking-widest cursor-pointer hover:bg-cyan-400/10">
            Import Frames
          </label>
          <button onClick={finalize} className="px-6 py-2 bg-pink-600 text-white uppercase text-[10px] tracking-widest font-black gemstone-glow">Commit Keeps ({images.filter(i => i.rating >= 4).length})</button>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
          {/* Main Viewer */}
          <div className="lg:col-span-8 glass-panel relative flex items-center justify-center p-4 bg-black/40 overflow-hidden">
             <img 
               src={images[currentIndex].url} 
               className="max-w-full max-h-[70vh] object-contain shadow-2xl"
               alt="Culling preview"
             />
             <div className="absolute bottom-8 flex gap-4">
                {[1,2,3,4,5].map(num => (
                  <button 
                    key={num}
                    onClick={() => updateRating(num)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                      images[currentIndex].rating >= num ? 'bg-cyan-500 border-cyan-300 text-white shadow-[0_0_15px_rgba(0,255,249,0.5)]' : 'bg-black/50 border-white/20 text-white/40'
                    }`}
                  >
                    {num}
                  </button>
                ))}
             </div>
          </div>
          
          {/* Instruction and Analysis Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Hotkey Protocol Guide */}
            <div className="glass-panel p-5 space-y-4 border border-cyan-400/20 bg-cyan-400/5">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-bold border-b border-cyan-400/20 pb-2">Hotkey Protocol</h4>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                  <span className="text-white/40">Next / Prev Frame</span>
                  <span className="text-white bg-white/10 px-2 py-0.5 rounded">← / →</span>
                </li>
                <li className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                  <span className="text-white/40">Assign Resonance</span>
                  <span className="text-white bg-white/10 px-2 py-0.5 rounded">1 — 5</span>
                </li>
                <li className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                  <span className="text-white/40">Commit Selection</span>
                  <span className="text-pink-400">Rating 4+</span>
                </li>
              </ul>
            </div>

            {/* Analysis Hub */}
            <div className="glass-panel p-5 space-y-6 flex-grow flex flex-col">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-pink-400 font-bold border-b border-pink-500/20 pb-2">Analysis Hub</h4>
              <div className="flex-grow space-y-4 overflow-y-auto max-h-[30vh] custom-scrollbar">
                <div className="bg-white/5 p-3 rounded text-[10px] tracking-widest">
                  <span className="text-cyan-400 block mb-1">FILE NAME:</span>
                  {images[currentIndex].file.name}
                </div>
                <button onClick={analyzeWithAI} className="w-full py-2 bg-gradient-to-r from-cyan-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest">Invoke AI Curator</button>
                {images[currentIndex].aiScore && (
                  <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 text-[10px] leading-relaxed italic text-pink-100/70 whitespace-pre-wrap">
                    {images[currentIndex].aiScore}
                  </div>
                )}
              </div>
              <div className="text-[10px] text-center opacity-40 uppercase tracking-widest italic pt-4">
                Frame {currentIndex + 1} of {images.length}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-pink-500/30 rounded-xl opacity-50 bg-pink-500/5">
          <p className="text-xl italic font-serif text-pink-200">The light table is empty.</p>
          <p className="text-[10px] uppercase tracking-widest mt-2">Upload raw archives to begin sovereign curation protocol.</p>
        </div>
      )}
    </div>
  );
};

export default CullingSuite;
