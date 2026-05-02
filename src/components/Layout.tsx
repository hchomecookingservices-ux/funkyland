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
import { APP_NAME, FOOTER_TEXT } from '../constants';
import { cn } from '../lib/utils';
import { usePlayZone } from '../hooks/usePlayZone';

export default function Layout() {
  const { businessProfile } = usePlayZone();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: BarChart3, label: 'Dashboard' },
    { to: '/billing', icon: PlusCircle, label: 'New Billing' },
    { to: '/tracking', icon: Users, label: 'Live Entries' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/services', icon: Layers, label: 'Services' },
    { to: '/catalogue', icon: Image, label: 'Catalogue' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/plans', icon: Settings, label: 'Settings & Plans' },
    { to: '/calendar', icon: Calendar, label: 'Events' },
    { to: '/accounting', icon: Receipt, label: 'Accounting' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('playzone_token');
    window.location.href = '/login';
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
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-bold overflow-hidden p-0.5">
            {businessProfile.logo.startsWith('data:image') ? (
               <img src={businessProfile.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
               <span>{businessProfile.logo}</span>
            )}
          </div>
          <span className="font-black text-slate-800 italic">{businessProfile.name}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white p-8 space-y-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <span className="text-2xl font-black text-slate-800 italic">{businessProfile.name}</span>
             <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} /></button>
          </div>
          <nav className="space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-6 p-4 rounded-2xl font-black text-xl",
                  isActive ? "bg-slate-900 text-white" : "text-slate-500"
                )}
              >
                <item.icon size={28} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button 
            onClick={handleLogout}
            className="mt-auto flex items-center gap-6 p-4 rounded-2xl font-black text-xl text-red-500 bg-red-50"
          >
            <LogOut size={28} />
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 sm:p-8 md:p-12 lg:p-16">
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
