
import React, { useState, useRef } from 'react';
import { PortfolioItem } from '../types';
import { GoogleGenAI } from "@google/genai";

interface MagazineEditorProps {
  items: PortfolioItem[];
  onSave: (items: PortfolioItem[]) => void;
  onBack: () => void;
}

const MagazineEditor: React.FC<MagazineEditorProps> = ({ items, onSave, onBack }) => {
  const magazineItems = items.filter(i => i.category === 'Magazine' || i.category === 'Neo-Andean');
  const [selectedId, setSelectedId] = useState<string | null>(magazineItems[0]?.id || null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(magazineItems[0] || null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setSelectedId(id);
      setEditingItem({ ...item });
    }
  };

  const handleUpdateField = (field: keyof PortfolioItem, value: string) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      setEditingItem({ ...editingItem, url: base64 });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const generateAINarrative = async () => {
    if (!editingItem) return;
    setIsSynthesizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a poetic, high-fashion, Neo-Andean vaporwave editorial article (about 150 words) for a photography spread titled "${editingItem.title}". Use words like "transmission", "echo", "ancestral", and "digital".`,
        config: { temperature: 0.8 }
      });
      if (response.text) {
        handleUpdateField('articleBody', response.text);
      }
    } catch (err) {
      console.error("AI Synthesis Error:", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const commitChanges = () => {
    if (editingItem) {
      const updated = items.map(i => i.id === editingItem.id ? editingItem : i);
      onSave(updated);
      alert("Transmission successful. Spread persisted to the cloud node.");
    }
  };

  const addNewPage = () => {
    const newItem: PortfolioItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: 'https://picsum.photos/seed/newmag/800/1200',
      title: 'New Editorial Spread',
      category: 'Magazine',
      description: 'The narrative starts here...',
      articleBody: '',
      date: new Date().toISOString().split('T')[0]
    };
    const nextItems = [...items, newItem];
    onSave(nextItems); // Persist immediately
    setSelectedId(newItem.id);
    setEditingItem(newItem);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 h-full flex flex-col text-left">
      <div className="flex justify-between items-center border-b border-orange-500/20 pb-4">
        <div>
          <h2 className="text-4xl font-syne font-black uppercase italic vapor-text">Editorial Lab</h2>
          <p className="text-[10px] text-orange-400 uppercase tracking-widest mt-1">AI-Assisted Narrative Synthesis Active</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="text-xs text-pink-400 hover:text-white uppercase tracking-widest transition-colors">Abort</button>
          <button onClick={addNewPage} className="px-6 py-2 border border-cyan-400 text-cyan-400 uppercase text-[10px] tracking-widest font-black hover:bg-cyan-400 hover:text-black">New Spread</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
        {/* Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-4 flex flex-col gap-3 h-[60vh] overflow-y-auto custom-scrollbar">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/50 mb-2 border-b border-white/5 pb-1">Inhalt (Contents)</h4>
            {magazineItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`text-left p-3 border transition-all flex items-center gap-3 group ${
                  selectedId === item.id ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-orange-400/50'
                }`}
              >
                <img src={item.url} className="w-10 h-10 object-cover rounded shadow-lg" alt="thumb" />
                <div className="overflow-hidden">
                  <div className={`text-[10px] font-bold uppercase truncate ${selectedId === item.id ? 'text-orange-400' : 'text-white'}`}>{item.title}</div>
                  <div className="text-[8px] uppercase tracking-widest opacity-40">Artifact: {item.id.slice(0, 4)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 glass-panel p-2 bg-black relative overflow-hidden group border border-white/10">
          {editingItem ? (
            <div className="w-full h-full relative p-4 flex flex-col justify-center items-center text-center">
               <img src={editingItem.url} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[4px] scale-110" alt="BG" />
               <div className="relative z-10 glass-panel p-8 border-orange-500/30 max-w-sm bg-black/40">
                 <h1 className="text-5xl font-black italic uppercase font-syne vapor-text leading-none mb-4">{editingItem.title}</h1>
                 <p className="text-xs italic text-pink-200 opacity-80">{editingItem.description}</p>
                 <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent my-4" />
                 <p className="text-[10px] uppercase tracking-[0.5em] text-white">Transmission Node: {editingItem.id.slice(0, 4)}</p>
               </div>
               
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-4 right-4 p-2 bg-black/60 border border-white/20 text-white hover:border-cyan-400 transition-colors rounded-full z-20 group"
               >
                 {isUploading ? (
                   <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                 )}
                 <span className="absolute right-full mr-2 bg-black px-2 py-1 text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Upload Artifact</span>
               </button>
               <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-xs uppercase tracking-widest">
              No Spread Selected
            </div>
          )}
        </div>

        {/* Property Terminal */}
        <div className="lg:col-span-4 glass-panel p-6 space-y-6 overflow-y-auto custom-scrollbar border-l border-white/10">
          {editingItem ? (
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.4em] text-orange-400 font-bold border-b border-orange-500/20 pb-2">Property Terminal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-white/50 mb-1">Spread Title</label>
                  <input 
                    className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white focus:border-orange-500 outline-none font-mono"
                    value={editingItem.title}
                    onChange={e => handleUpdateField('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-white/50 mb-1">Narrative Context</label>
                  <textarea 
                    className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white focus:border-orange-500 outline-none h-20 custom-scrollbar"
                    value={editingItem.description}
                    onChange={e => handleUpdateField('description', e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[8px] uppercase tracking-widest text-white/50">Full Narrative Artifact</label>
                    <button 
                      onClick={generateAINarrative}
                      disabled={isSynthesizing}
                      className="text-[8px] font-black uppercase text-cyan-400 hover:text-white transition-colors disabled:opacity-30"
                    >
                      {isSynthesizing ? 'SYNTHESIZING...' : 'GENERATE VIA AI'}
                    </button>
                  </div>
                  <textarea 
                    className="w-full bg-black/60 border border-white/10 p-3 text-[10px] text-white focus:border-orange-500 outline-none h-48 custom-scrollbar leading-relaxed font-serif"
                    value={editingItem.articleBody || ''}
                    onChange={e => handleUpdateField('articleBody', e.target.value)}
                    placeholder="The narrative echo starts here..."
                  />
                </div>
              </div>

              <button 
                onClick={commitChanges}
                className="w-full py-4 bg-orange-600 text-white font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all text-[10px] shadow-lg shadow-orange-500/20 gemstone-glow"
              >
                Broadcast to Live Node
              </button>
            </div>
          ) : (
             <div className="h-full flex items-center justify-center opacity-30 italic uppercase text-[10px] tracking-widest text-center px-4">
               Select an artifact spread to initiate editing.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagazineEditor;
