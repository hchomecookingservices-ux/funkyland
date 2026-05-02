import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Gamepad2,
  BookOpen,
  PartyPopper,
  Gift,
  Smile,
  Instagram
} from 'lucide-react';
import { usePlayZone } from '../hooks/usePlayZone';
import { cn } from '../lib/utils';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { businessProfile } = usePlayZone();
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      if (userId && password) {
        onLogin();
      } else {
        setIsLoading(false);
      }
    }, 800);
  };

  const navItems = [
    { icon: <Gamepad2 size={20} />, label: 'PLAY', color: 'bg-emerald-500' },
    { icon: <BookOpen size={20} />, label: 'LEARN', color: 'bg-amber-500' },
    { icon: <PartyPopper size={20} />, label: 'PARTY', color: 'bg-pink-500' },
    { icon: <Gift size={20} />, label: 'CELEBRATE', color: 'bg-purple-500' },
    { icon: <Smile size={20} />, label: 'ENJOY', color: 'bg-sky-500' },
    { icon: <Instagram size={20} />, label: 'MEMORIES', color: 'bg-blue-600' },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-[#f8fbff] overflow-hidden font-sans">
      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl" 
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-pink-100/50 rounded-full blur-2xl" 
        />
        <div className="absolute top-1/4 right-10 w-16 h-16 bg-blue-100/50 rounded-full blur-lg" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border-8 border-white">
        
        {/* Left Side: Brand & Visuals */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-16 flex flex-col items-center justify-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="grid grid-cols-4 gap-4 p-4 transform -rotate-12 scale-150">
               {[...Array(16)].map((_, i) => <div key={i} className="w-12 h-12 border-2 border-white rounded-xl" />)}
             </div>
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 relative z-10"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
               <motion.div 
                 animate={{ rotate: [0, 10, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-4xl shadow-xl"
               >
                 🎡
               </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none uppercase">
              Kids Management<br />
              <span className="text-amber-400 not-italic">FUN ZONE</span>
            </h1>
            
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase">Professional CMS v2.0</p>
            </div>

            <div className="pt-8">
              <p className="text-blue-100/80 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                Comprehensive indoor soft-play management for modern entertainment centers.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-800 italic">Welcome Back! 👋</h2>
            <p className="text-slate-400 font-bold text-sm">Log in to manage your zone</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">User Identification</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="admin@playzone.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Secret Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-blue-600 accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-tight">Keep me logged in</span>
              </label>
              <button type="button" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-tight">
                Forgot Lock?
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest mt-6 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Access Zone
                  <ChevronRight size={24} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Powered by</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              Digital Communique Private Limited
            </p>
          </div>
        </div>
      </div>

      {/* Social/Feature Proof Icons */}
      <div className="relative z-10 mt-12 flex flex-wrap justify-center gap-6">
        {navItems.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex flex-col items-center gap-2"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 cursor-default",
              item.color
            )}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
