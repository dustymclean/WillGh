
import React, { useState } from 'react';
import { Booking } from '../types';

interface BookingViewProps {
  onBook: (booking: Booking) => void;
}

const BookingView: React.FC<BookingViewProps> = ({ onBook }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    package: 'Portrait Session',
  });

  const packages = [
    { name: 'Portrait Session', price: '$450', desc: '1.5 hours, 15 edited digital images with film grain finish.' },
    { name: 'Editorial/Magazine', price: '$800', desc: '3 hours, custom set design, 10 high-end magazine-ready shots.' },
    { name: 'Neo-Andean Special', price: '$1200', desc: 'Full day shoot in geometric locations, 20 signature processed images.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      status: 'pending'
    };
    onBook(newBooking);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto glass-panel p-12 text-center space-y-6">
        <div className="text-6xl text-cyan-400 animate-bounce">✧</div>
        <h2 className="text-4xl font-syne font-black uppercase tracking-tighter vapor-text italic">Inquiry Received</h2>
        <p className="text-pink-100/70 font-serif italic">
          The transmission has been received. Our team will decrypt your request and reach out via the void (email) shortly.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 border border-pink-500 text-pink-400 uppercase tracking-widest text-sm hover:bg-pink-500 hover:text-white transition-all"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
      <div className="lg:w-1/2 space-y-8">
        <h2 className="text-6xl font-syne font-black uppercase tracking-tighter vapor-text italic leading-none">Book Your<br/>Vibe Check</h2>
        <div className="space-y-6">
          {packages.map(pkg => (
            <div 
              key={pkg.name}
              className={`p-6 border cursor-pointer transition-all ${form.package === pkg.name ? 'border-cyan-400 bg-cyan-400/5' : 'border-pink-500/30 hover:border-pink-500'}`}
              onClick={() => setForm(f => ({ ...f, package: pkg.name }))}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-bold uppercase tracking-widest text-pink-200">{pkg.name}</h4>
                <span className="text-cyan-400 font-black">{pkg.price}</span>
              </div>
              <p className="text-sm text-pink-100/50">{pkg.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-1/2 glass-panel p-8 border border-pink-500/30">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-2">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-white/5 border border-pink-500/30 p-4 text-pink-100 focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="YOUR NAME"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-2">Email Terminal</label>
            <input 
              required
              type="email" 
              className="w-full bg-white/5 border border-pink-500/30 p-4 text-pink-100 focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="ADDRESS@VOID.COM"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-2">Target Date</label>
            <input 
              required
              type="date" 
              className="w-full bg-white/5 border border-pink-500/30 p-4 text-pink-100 focus:outline-none focus:border-cyan-400 transition-colors [color-scheme:dark]"
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-pink-600 to-cyan-600 text-white font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all gemstone-glow"
          >
            Initiate Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingView;
