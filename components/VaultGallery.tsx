import React, { useState } from 'react';
import type { Vault } from '../types';

export const VaultGallery = ({ vault }: { vault: Vault }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-serif mb-2">Welcome, {vault.client_name}</h1>
        <p className="text-zinc-400">Private Gallery • {vault.images.length} Images</p>
      </div>

      {/* Photo Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vault.images.map((url, index) => (
          <div 
            key={index} 
            className="group relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer rounded-lg border border-white/10 hover:border-gold/50 transition-all"
            onClick={() => setSelectedImage(url)}
          >
            <img 
              src={url} 
              alt={`Gallery item ${index + 1}`} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-sm font-bold tracking-widest uppercase">View Fullscreen</span>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Lightbox (Full Screen Modal) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            className="max-h-full max-w-full object-contain shadow-2xl"
            alt="Fullscreen preview"
          />
          <button 
            className="absolute top-8 right-8 text-white text-3xl font-light hover:text-gold"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};