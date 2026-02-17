
import React from 'react';

const VaporBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0d0221]">
      {/* Sun / Orb */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-orange-600 via-pink-600 to-transparent rounded-full opacity-20 blur-[100px]" />
      
      {/* Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }} />

      {/* Retro Grid */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: 'linear-gradient(transparent 95%, rgba(0, 255, 249, 0.4) 95%), linear-gradient(90deg, transparent 95%, rgba(0, 255, 249, 0.4) 95%)',
             backgroundSize: '50px 50px',
             perspective: '500px',
             transform: 'rotateX(60deg) scale(2.5) translateY(-50px)'
           }} />

      {/* Floating Gemstone shapes */}
      <div className="absolute top-[20%] left-[10%] w-24 h-24 bg-cyan-500/10 blur-xl animate-pulse" />
      <div className="absolute top-[60%] right-[15%] w-32 h-32 bg-pink-500/10 blur-xl animate-pulse delay-700" />
    </div>
  );
};

export default VaporBackground;
