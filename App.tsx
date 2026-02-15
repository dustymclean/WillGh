
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ShieldCheck, 
  Briefcase, 
  Cpu, 
  ArrowRight, 
  Lock,
  Mail,
  Phone,
  LogOut,
  User,
  Calendar,
  Download,
  MapPin,
  Globe,
  X,
  MessageSquare,
  Plus,
  Trash2,
  Image as ImageIcon,
  Settings,
  Layout
} from 'lucide-react';
import { 
  DISCIPLINES, 
  PRICING_TIERS, 
  PORTFOLIO_ITEMS as INITIAL_PORTFOLIO, 
  CLIENT_GALLERIES 
} from './constants';
import { getCurationIntelligence } from './services/geminiService';
import { ClientGallery, PortfolioItem } from './types';

// --- Global Branding Components ---

const Logo = () => (
  <div className="flex flex-col items-center">
    <h1 className="font-signature text-6xl text-[#B87333] -mb-8 relative z-10 leading-none">Will</h1>
    <div className="border-t border-[#B87333] pt-2 text-center w-full">
      <h2 className="font-bold text-3xl uppercase tracking-premium leading-none text-[#1A1A1B]">Ghrigsby</h2>
      <p className="font-light text-[9px] uppercase tracking-ultra mt-1 text-[#B87333]">Artistic & Observational</p>
    </div>
  </div>
);

const SectionTitle = ({ title, subtitle, centered = false }: { title: string; subtitle?: string; centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : 'text-center md:text-left'}`}>
    <h2 className="text-4xl md:text-6xl font-bold text-[#1A1A1B] mb-6 leading-tight tracking-tight uppercase tracking-premium transition-colors duration-500">{title}</h2>
    {subtitle && <p className="text-xl text-gray-500 max-w-3xl leading-relaxed font-medium">{subtitle}</p>}
  </div>
);

// --- Admin Sub-Components ---

const PortfolioManager = ({ portfolio, setPortfolio }: { portfolio: PortfolioItem[], setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>> }) => {
  const [newItem, setNewItem] = useState({ title: '', url: '', discipline: 'concert' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.url) return;
    const item: PortfolioItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...newItem
    };
    const updated = [...portfolio, item];
    setPortfolio(updated);
    localStorage.setItem('will_portfolio', JSON.stringify(updated));
    setNewItem({ title: '', url: '', discipline: 'concert' });
  };

  const handleRemove = (id: string) => {
    const updated = portfolio.filter(item => item.id !== id);
    setPortfolio(updated);
    localStorage.setItem('will_portfolio', JSON.stringify(updated));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-2xl">
        <h4 className="text-xs font-bold uppercase tracking-ultra mb-10 flex items-center gap-3 text-[#B87333]">
          <ImageIcon className="w-5 h-5" /> Live Creative Control
        </h4>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Asset URL</label>
            <input 
              required
              type="text" value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})}
              placeholder="https://..." className="w-full p-4 bg-[#F0EDE9] border border-gray-100 text-xs focus:outline-none focus:border-[#B87333] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Asset Title</label>
            <input 
              type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})}
              placeholder="e.g. The Lyric 02" className="w-full p-4 bg-[#F0EDE9] border border-gray-100 text-xs focus:outline-none focus:border-[#B87333] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Discipline</label>
            <select 
              value={newItem.discipline} onChange={e => setNewItem({...newItem, discipline: e.target.value})}
              className="w-full p-4 bg-[#F0EDE9] border border-gray-100 text-xs focus:outline-none focus:border-[#B87333] transition-all appearance-none"
            >
              {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
          <button className="md:col-span-4 bg-[#B87333] text-white py-6 font-bold uppercase tracking-ultra hover:bg-[#1A1A1B] transition-all shadow-xl flex items-center justify-center gap-4">
            <Plus className="w-5 h-5" /> Push To Portfolio
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {portfolio.map(item => (
          <div key={item.id} className="group relative bg-[#F0EDE9] p-4 border border-gray-100 transition-all">
            <div className="aspect-[3/4] overflow-hidden mb-4 bg-gray-200 relative">
              <img src={item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.title} />
              <button 
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-[7px] font-bold text-[#B87333] uppercase tracking-ultra mb-1">{item.discipline}</p>
              <h5 className="text-[9px] font-bold uppercase tracking-widest truncate">{item.title || 'Untitled Frame'}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Modal & Portal Components ---

const IdCard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#1A1A1B]/95 backdrop-blur-xl animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-12 right-12 text-white/50 hover:text-[#B87333] transition-colors"><X className="w-8 h-8" /></button>
      <div className="relative group max-w-xl w-full perspective-1000">
        <div className="relative bg-[#1A1A1B] border border-[#B87333]/30 shadow-2xl p-12 aspect-[1.6/1] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#B87333]/20" />
          <div className="flex justify-between items-start">
            <div>
              <div className="scale-75 origin-top-left -ml-4 mb-4"><Logo /></div>
              <p className="text-[10px] font-bold text-[#B87333] uppercase tracking-ultra mb-1">Principal Photographer</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest italic">Digital Sovereignty Suite</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/30 uppercase tracking-ultra mb-4">Established 2026</p>
              <MapPin className="w-5 h-5 text-[#B87333] ml-auto" />
              <p className="text-[10px] text-white font-bold uppercase tracking-widest mt-2">Oxford, MS</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><Mail className="w-3 h-3 text-[#B87333]" /><span className="text-[10px] text-white/70 uppercase tracking-widest font-medium">will@willgh.com</span></div>
              <div className="flex items-center gap-3"><Phone className="w-3 h-3 text-[#B87333]" /><span className="text-[10px] text-white/70 uppercase tracking-widest font-medium">(601) 831-4678</span></div>
            </div>
            <div className="space-y-4 text-right">
              <div className="flex items-center gap-3 justify-end"><span className="text-[10px] text-white/70 uppercase tracking-widest font-medium">willgh.com</span><Globe className="w-3 h-3 text-[#B87333]" /></div>
              <div className="flex items-center gap-3 justify-end"><span className="text-[10px] text-white/70 uppercase tracking-widest font-medium">@willgrigsby</span><Camera className="w-3 h-3 text-[#B87333]" /></div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-center bg-black/20">
            <span className="text-[8px] text-white/20 uppercase tracking-ultra">Certified Asset Sovereign</span>
            <div className="flex gap-1"><div className="w-1 h-1 rounded-full bg-[#B87333]" /><div className="w-1 h-1 rounded-full bg-[#B87333]/50" /><div className="w-1 h-1 rounded-full bg-[#B87333]/20" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientVault = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [code, setCode] = useState('');
  const [activeGallery, setActiveGallery] = useState<ClientGallery | null>(null);
  const [error, setError] = useState('');
  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const gallery = CLIENT_GALLERIES.find(g => g.accessCode.toUpperCase() === code.toUpperCase());
    if (gallery) { setActiveGallery(gallery); setError(''); } else setError('Invalid access credentials.');
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[400] bg-[#1A1A1B]/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-12 right-12 text-white/50 hover:text-[#B87333] transition-colors"><X className="w-8 h-8" /></button>
      {!activeGallery ? (
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 border border-[#B87333]/30 flex items-center justify-center text-[#B87333] mx-auto mb-12"><Lock className="w-10 h-10" /></div>
          <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-premium">The Vault</h2>
          <p className="text-gray-400 mb-12 text-sm tracking-widest uppercase">Enter secure access code</p>
          <form onSubmit={handleAccess} className="space-y-4">
            <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="•••• •••• ••••" className="w-full bg-white/5 border border-white/10 p-6 text-xl text-white text-center font-bold tracking-[0.4em] focus:outline-none focus:border-[#B87333]" />
            {error && <p className="text-[#B87333] text-[10px] font-bold uppercase tracking-widest">{error}</p>}
            <button className="w-full bg-[#B87333] text-white py-6 font-bold uppercase tracking-widest hover:bg-white hover:text-[#1A1A1B] transition-all">Unlock Assets</button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-7xl animate-in fade-in slide-in-from-bottom-8 h-full overflow-y-auto py-20 no-scrollbar">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-12">
            <div><p className="text-[#B87333] uppercase text-[10px] font-bold tracking-ultra mb-4">Secure Client Portal</p><h1 className="text-6xl font-bold text-white uppercase tracking-premium">{activeGallery.clientName}</h1></div>
            <button onClick={() => setActiveGallery(null)} className="px-10 py-4 border border-[#B87333] text-[#B87333] hover:bg-[#B87333] hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">Logout</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{activeGallery.images.map((img, i) => (<div key={i} className="group relative aspect-square overflow-hidden bg-white/5"><img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" /><button className="absolute bottom-6 right-6 p-4 bg-[#B87333] text-white opacity-0 group-hover:opacity-100 transition-all"><Download className="w-5 h-5" /></button></div>))}</div>
        </div>
      )}
    </div>
  );
};

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[400] bg-[#1A1A1B]/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-12 right-12 text-white/50 hover:text-[#B87333] transition-colors"><X className="w-8 h-8" /></button>
      <div className="w-full max-w-7xl h-full overflow-y-auto py-20 no-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="text-white">
            <p className="text-[#B87333] uppercase text-xs font-bold tracking-ultra mb-4">Commission Inquiry</p>
            <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-premium mb-12">Book Now</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-16 italic font-light leading-relaxed">Secure your frame in the narrative of 2026. Accepting statewide commissions for elite visual storytelling.</p>
            <div className="space-y-12">
              {[{ icon: Calendar, title: "Availability", desc: "Currently booking Q3/Q4 for primary disciplines." }, { icon: Briefcase, title: "Engagements", desc: "Minimum statewide commissions start at $1,500." }].map((item, i) => (
                <div key={i} className="flex gap-8 items-start"><div className="w-16 h-16 border border-[#B87333]/30 flex items-center justify-center text-[#B87333] shrink-0"><item.icon className="w-8 h-8" /></div><div><h4 className="font-bold text-xl uppercase tracking-premium mb-2">{item.title}</h4><p className="text-gray-300 text-base leading-relaxed">{item.desc}</p></div></div>
              ))}
            </div>
          </div>
          <div className="bg-white p-12 lg:p-16 shadow-2xl relative overflow-hidden animate-in slide-in-from-right-8 duration-500">
            {submitted ? (
              <div className="text-center py-20 animate-in zoom-in">
                <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-8" />
                <h3 className="text-[#1A1A1B] text-3xl font-bold uppercase mb-4 tracking-premium">Inquiry Logged</h3>
                <p className="text-gray-500 text-lg italic mb-12">Will will reach out within 48 hours to discuss your project.</p>
                <button onClick={() => setSubmitted(false)} className="text-xs font-bold text-[#B87333] uppercase tracking-ultra border-b border-[#B87333] pb-2">Send Another</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-10 text-[#1A1A1B]">
                <div className="space-y-10">
                  <div className="relative group"><User className="absolute left-0 bottom-4 w-4 h-4 text-gray-400" /><input required type="text" placeholder="FULL NAME" className="w-full border-b border-gray-200 py-4 pl-8 focus:outline-none focus:border-[#B87333] transition-all uppercase tracking-widest text-sm font-medium placeholder:text-gray-300" /></div>
                  <div className="relative group"><Mail className="absolute left-0 bottom-4 w-4 h-4 text-gray-400" /><input required type="email" placeholder="EMAIL ADDRESS" className="w-full border-b border-gray-200 py-4 pl-8 focus:outline-none focus:border-[#B87333] transition-all uppercase tracking-widest text-sm font-medium placeholder:text-gray-300" /></div>
                  <div className="relative group"><MessageSquare className="absolute left-0 top-4 w-4 h-4 text-gray-400" /><textarea rows={4} placeholder="PROJECT NARRATIVE" className="w-full border-b border-gray-200 py-4 pl-8 focus:outline-none focus:border-[#B87333] transition-all uppercase tracking-widest text-sm font-medium placeholder:text-gray-300" /></div>
                </div>
                <button className="w-full bg-[#1A1A1B] text-white py-6 font-bold uppercase tracking-ultra hover:bg-[#B87333] transition-all shadow-xl group flex items-center justify-center gap-4 text-sm">Initiate Commission <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPortal = ({ onClose, portfolio, setPortfolio }: { onClose: () => void, portfolio: PortfolioItem[], setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>> }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'portfolio'>('portfolio');

  const handleAnalyze = async () => {
    if (!prompt) return;
    setLoading(true);
    const data = await getCurationIntelligence(prompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-white overflow-y-auto p-6 md:p-12 no-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 border-b border-gray-100 pb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#1A1A1B] flex items-center justify-center text-[#B87333] shadow-2xl"><Settings className="w-8 h-8 animate-pulse" /></div>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-premium text-[#1A1A1B]">Creative Sovereignty</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-ultra">Full creative control: Will Grigsby</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveTab('portfolio')} className={`px-8 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${activeTab === 'portfolio' ? 'bg-[#1A1A1B] text-white border-[#1A1A1B]' : 'border-gray-200 text-gray-400'}`}>
              <Layout className="w-4 h-4" /> Asset Hub
            </button>
            <button onClick={() => setActiveTab('intelligence')} className={`px-8 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${activeTab === 'intelligence' ? 'bg-[#1A1A1B] text-white border-[#1A1A1B]' : 'border-gray-200 text-gray-400'}`}>
              <Cpu className="w-4 h-4" /> AI Engine
            </button>
            <button onClick={onClose} className="px-8 py-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 shadow-xl">
              <LogOut className="w-4 h-4" /> Close
            </button>
          </div>
        </div>

        {activeTab === 'portfolio' ? (
          <div>
            <SectionTitle title="Asset Hub" subtitle="Add high-res URLs and tag them with your primary disciplines." />
            <PortfolioManager portfolio={portfolio} setPortfolio={setPortfolio} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="bg-[#F0EDE9] p-12 md:p-16 shadow-inner mb-12">
              <SectionTitle title="Intelligence" subtitle="Will, query the AI engine to evaluate your current curation strategy." />
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Analyze my current 'Delta Shadows' series..." className="flex-grow p-6 bg-white border border-gray-100 uppercase tracking-widest text-xs focus:outline-none focus:border-[#B87333] transition-all" />
                <button onClick={handleAnalyze} disabled={loading} className="bg-[#1A1A1B] text-white px-12 font-bold uppercase tracking-widest hover:bg-[#B87333] transition-all disabled:opacity-50">{loading ? 'Processing...' : 'Analyze'}</button>
              </div>
              {result && (
                <div className="bg-white p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-12 pb-12 border-b border-gray-50">
                    <h4 className="text-2xl font-bold uppercase tracking-premium">Findings</h4>
                    <div className="text-5xl font-bold text-[#B87333]">{result.valuationEstimate}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h5 className="font-bold text-[10px] text-gray-400 uppercase tracking-ultra mb-6">Tactical Advice</h5>
                      <div className="space-y-4">
                        {result.curationAdvice.map((adv: string, i: number) => (
                          <div key={i} className="text-sm p-4 bg-[#F0EDE9] border-l-4 border-[#B87333]">{adv}</div>
                        ))}
                      </div>
                    </div>
                    <div><h5 className="font-bold text-[10px] text-gray-400 uppercase tracking-ultra mb-6">Narrative Context</h5><p className="text-sm text-gray-600 leading-relaxed italic">{result.analysis}</p></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Entry ---

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('will_portfolio');
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'milo') { setIsAdminOpen(true); setShowAdminLogin(false); setPassword(''); }
    else alert('Sovereign Access Denied.');
  };

  if (isAdminOpen) return <AdminPortal onClose={() => setIsAdminOpen(false)} portfolio={portfolio} setPortfolio={setPortfolio} />;

  return (
    <div className="min-h-screen selection:bg-[#B87333]/30 safe-top">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-12 py-8 pt-12 md:pt-8 ${scrolled ? 'bg-white/95 backdrop-blur-xl py-4 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer scale-75 md:scale-90 origin-left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Logo /></div>
          <div className="flex items-center gap-5 md:gap-10 text-[10px] font-bold text-[#1A1A1B] uppercase tracking-ultra">
            <a href="#portfolio" className="hidden lg:block hover:text-[#B87333] transition-colors">Portfolio</a>
            <button onClick={() => setIsIdCardOpen(true)} className="hidden lg:block hover:text-[#B87333] transition-colors">Digital ID</button>
            <button onClick={() => setIsVaultOpen(true)} className="flex items-center gap-2 hover:text-[#B87333] transition-colors"><Lock className="w-3 h-3" /> <span className="hidden md:inline">Vault</span></button>
            <button onClick={() => setIsBookingOpen(true)} className="px-6 md:px-10 py-3 bg-[#1A1A1B] text-white hover:bg-[#B87333] transition-all shadow-xl">Book Now</button>
          </div>
        </div>
      </nav>

      {/* Overlays */}
      <ClientVault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
      <IdCard isOpen={isIdCardOpen} onClose={() => setIsIdCardOpen(false)} />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Header */}
      <header className="relative min-h-screen flex items-center px-6 md:px-12 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-[#F0EDE9] z-0">
          <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/50 to-white" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-1 border border-[#B87333] text-[#B87333] text-[9px] font-bold uppercase tracking-ultra mb-12">Oxford / Mississippi / Sovereign Artistry</div>
            <h1 className="text-5xl md:text-9xl font-bold text-[#1A1A1B] mb-12 leading-[0.85] tracking-tighter uppercase tracking-premium">Intentional <br /><span className="font-signature normal-case text-[#B87333] block mt-4">Observation.</span></h1>
            <p className="text-lg md:text-2xl text-gray-500 mb-16 max-w-2xl leading-relaxed italic">Capturing the raw energy of Oxford's stages, the narratives of the human form, and the silent geometry of our streets.</p>
            <div className="flex flex-wrap gap-6 md:gap-8 items-center">
              <a href="#portfolio" className="bg-[#1A1A1B] text-white px-10 md:px-12 py-5 md:py-6 font-bold uppercase tracking-widest hover:bg-[#B87333] transition-all shadow-2xl text-sm">View Work</a>
              <button onClick={() => setIsBookingOpen(true)} className="px-8 md:px-12 py-5 md:py-6 border border-[#1A1A1B] text-[#1A1A1B] font-bold uppercase tracking-widest hover:bg-[#F0EDE9] transition-all text-sm">Book Now</button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Dynamic Portfolio */}
        <section id="portfolio" className="py-32 px-6 md:px-12 bg-[#F0EDE9]">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="Portfolio" subtitle="Current highlights authentically captured and intentionally framed by Will Grigsby." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {portfolio.map((item) => (
                <div key={item.id} className="group relative aspect-[4/5] overflow-hidden bg-[#1A1A1B] cursor-crosshair">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" />
                  <div className="absolute inset-0 border-[20px] border-transparent group-hover:border-[#B87333]/20 transition-all duration-700 pointer-events-none" />
                  <div className="absolute bottom-10 left-10 right-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-white">
                    <p className="text-[10px] font-bold text-[#B87333] uppercase tracking-ultra mb-2">{item.discipline}</p>
                    <h3 className="text-3xl font-bold uppercase tracking-premium">{item.title || 'Untitled Frame'}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Licensing */}
        <section id="licensing" className="py-32 px-6 md:px-12 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="Sovereignty" subtitle="Tiered licensing frameworks for high-end professional protection and long-term asset value." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.tier} className="bg-white p-8 border border-gray-100 flex flex-col hover:border-[#B87333] transition-all group shadow-sm">
                  <h3 className="text-xs font-bold mb-4 text-[#B87333] uppercase tracking-ultra">{tier.tier}</h3>
                  <div className="text-4xl font-bold mb-6 text-[#1A1A1B] group-hover:text-[#B87333] transition-colors">{tier.price}</div>
                  <p className="text-sm text-gray-600 mb-8 leading-relaxed flex-grow uppercase tracking-widest font-medium">{tier.description}</p>
                  <button onClick={() => setIsBookingOpen(true)} className="w-full py-4 border border-gray-100 text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1B] hover:text-white transition-all">Inquire</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Restored Original Footer with Updated Heritage Credit */}
      <footer className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start">
             <Logo />
             <p className="text-[9px] text-gray-400 uppercase tracking-ultra mt-8">© 2026 Will Grigsby | Oxford, MS</p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 text-[10px] font-bold uppercase tracking-ultra text-center md:text-left">
            <div className="space-y-4">
              <p className="text-[#B87333] text-[8px] tracking-widest">Connect</p>
              <a href="mailto:will@willgh.com" className="block hover:text-[#B87333] transition-colors">will@willgh.com</a>
              <a href="tel:6018314678" className="block hover:text-[#B87333] transition-colors">(601) 831-4678</a>
            </div>
            <div className="space-y-4">
              <p className="text-[#B87333] text-[8px] tracking-widest">Heritage</p>
              <p className="text-gray-400 font-normal normal-case italic max-w-[280px]">Developed by Dusty McLean as a sovereign business suite for William Ghrigsby. A Valentine’s Day gift for the craft.</p>
              {!showAdminLogin ? (
                <button onClick={() => setShowAdminLogin(true)} className="text-gray-100 hover:text-[#B87333] transition-colors text-[8px] flex items-center gap-2 mt-4"><Lock className="w-2 h-2" /> Suite Access</button>
              ) : (
                <form onSubmit={handleAdminAuth} className="flex gap-2 animate-in slide-in-from-bottom-2">
                  <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="bg-[#F0EDE9] p-2 text-[8px] w-16 border-none focus:ring-1 focus:ring-[#B87333] outline-none" />
                  <button className="text-[#B87333] text-[8px] font-bold">Go</button>
                  <button type="button" onClick={() => setShowAdminLogin(false)} className="text-gray-400 text-[8px]">X</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
