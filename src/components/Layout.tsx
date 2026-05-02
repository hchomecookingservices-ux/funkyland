import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  PlusCircle, 
  Users, 
  Calendar, 
  LogOut, 
  Smartphone,
  Menu,
  X,
  Receipt,
  Layers,
  Image,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APP_NAME, FOOTER_TEXT } from '../constants';
import { cn } from '../lib/utils';
import { usePlayZone } from '../hooks/usePlayZone';

export default function Layout() {
  const { businessProfile, isAdmin, logout } = usePlayZone();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: BarChart3, label: 'Dashboard' },
    { to: '/billing', icon: PlusCircle, label: 'New Billing' },
    { to: '/tracking', icon: Users, label: 'Live Entries' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/services', icon: Layers, label: 'Services' },
    { to: '/catalogue', icon: Image, label: 'Catalogue' },
    { to: '/calendar', icon: Calendar, label: 'Events' },
    ...(isAdmin ? [
      { to: '/reports', icon: BarChart3, label: 'Reports' },
      { to: '/plans', icon: Settings, label: 'Settings & Plans' },
      { to: '/accounting', icon: Receipt, label: 'Accounting' },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 p-8 fixed h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 text-xl font-bold overflow-hidden p-1">
            {businessProfile.logo.startsWith('data:image') ? (
               <img src={businessProfile.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
               <span>{businessProfile.logo}</span>
            )}
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight italic">
            {businessProfile.name}
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-sm transition-all group",
                isActive 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform group-hover:scale-110",
                "text-inherit"
              )} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-sm text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-40 no-print">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white text-lg font-black overflow-hidden p-0.5 shadow-sm">
            {businessProfile.logo.startsWith('data:image') ? (
               <img src={businessProfile.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
               <span>{businessProfile.logo}</span>
            )}
          </div>
          <span className="font-black text-slate-800 italic text-lg tracking-tight">{businessProfile.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-50 bg-white flex flex-col no-print"
          >
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden p-1">
                    {businessProfile.logo.startsWith('data:image') ? (
                      <img src={businessProfile.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span>{businessProfile.logo}</span>
                    )}
                  </div>
                  <span className="text-xl font-black text-slate-800 tracking-tight italic">{businessProfile.name}</span>
               </div>
               <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400"
               >
                <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-lg transition-all",
                    isActive ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon size={24} />
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl font-black text-lg text-red-500 bg-red-50 hover:bg-red-100 transition-all"
              >
                <LogOut size={24} />
                Sign Out
              </button>
              <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2 italic">
                Powered by Digital Communique
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around px-4 z-40 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] no-print">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-primary scale-110" : "text-slate-400"
            )}
          >
            {({ isActive }) => (
              <div className={cn(
                "w-12 h-12 flex items-center justify-center rounded-2xl transition-all",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <item.icon size={22} className={cn(
                  "transition-transform",
                  isActive ? "fill-primary/20" : ""
                )} />
              </div>
            )}
          </NavLink>
        ))}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50">
            <Menu size={22} />
          </div>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 sm:p-8 md:p-12 lg:p-16 pb-32 md:pb-24">
        <Outlet />
        <footer className="mt-20 pt-8 border-t border-slate-100 text-center no-print">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-loose">
            {FOOTER_TEXT}<br />
            Designed for {businessProfile.name} Operations
          </p>
        </footer>
      </main>
    </div>
  );
}
