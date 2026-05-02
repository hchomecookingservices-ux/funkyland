
import React, { useMemo, useState } from 'react';
import { usePlayZone } from '../hooks/usePlayZone';
import { 
  Users, 
  Wallet, 
  Calendar as CalendarIcon, 
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Receipt as ReceiptIcon,
  PieChart,
  Footprints,
  X,
  FileText,
  Download,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import ThermalReceipt from '../components/ThermalReceipt';
import { Invoice } from '../types';

export default function DashboardPage() {
  const { entries, events, invoices, exportToCSV, categories } = usePlayZone();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const navigate = useNavigate();

  const handlePrintDashboard = () => {
    window.print();
  };

  const handleExportDashboard = () => {
    const today = new Date().toDateString();
    const todaySales = invoices.filter(i => new Date(i.date).toDateString() === today).map(i => ({
      Invoice: i.invoiceNumber,
      Customer: i.customerName,
      Amount: i.totalAmount,
      Mode: i.paymentMode
    }));
    exportToCSV(todaySales, 'Daily_Sales_Summary');
  };

  const activeEntries = entries.filter(e => e.status === 'active');
  
  const today = new Date().toDateString();
  const todayInvoices = invoices.filter(i => new Date(i.date).toDateString() === today);
  const todayRevenue = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const todayGST = todayInvoices.reduce((sum, i) => sum + i.totalGST, 0);

  const todaySocks = useMemo(() => {
    const todayStr = new Date().toDateString();
    return entries
      .filter(e => {
        const d = e.startTime instanceof Date ? e.startTime : new Date(e.startTime);
        return d.toDateString() === todayStr;
      })
      .reduce((acc, curr) => ({
        small: acc.small + (curr.smallSocksCount || 0),
        medium: acc.medium + (curr.mediumSocksCount || 0)
      }), { small: 0, medium: 0 });
  }, [entries]);

  // Chart data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const dayInvoices = invoices.filter(inv => new Date(inv.date).toDateString() === dayStr);
    return {
      name: d.toLocaleDateString([], { weekday: 'short' }),
      revenue: dayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    };
  });

  // Monthly breakdown
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    return months.map((month, index) => {
      const monthInvoices = invoices.filter(inv => {
        const d = new Date(inv.date);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      });
      return {
        name: month,
        revenue: monthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
      };
    }).slice(0, new Date().getMonth() + 1);
  }, [invoices]);

  const billTypeData = useMemo(() => {
    return [
      { name: 'Walking', value: invoices.filter(i => i.type === 'walking').reduce((sum, i) => sum + i.totalAmount, 0) },
      { name: 'Members', value: invoices.filter(i => i.type === 'member').reduce((sum, i) => sum + i.totalAmount, 0) },
      { name: 'Events', value: invoices.filter(i => i.type === 'event').reduce((sum, i) => sum + i.totalAmount, 0) },
    ].filter(i => i.value > 0);
  }, [invoices]);

  const stats = [
    { 
      label: 'Live Kids', 
      value: activeEntries.length.toString(), 
      icon: Users, 
      color: 'bg-accent',
      trend: '+12% from avg'
    },
    { 
      label: 'Today Revenue', 
      value: formatCurrency(todayRevenue), 
      icon: Wallet, 
      color: 'bg-primary',
      trend: `${todayInvoices.length} check-ins`
    },
    { 
      label: 'Socks Sold', 
      value: (todaySocks.small + todaySocks.medium).toString(), 
      icon: Footprints, 
      color: 'bg-amber-500',
      trend: `S: ${todaySocks.small} / M: ${todaySocks.medium}`
    },
    { 
      label: 'Events Today', 
      value: events.filter(e => new Date(e.date).toDateString() === today).length.toString(), 
      icon: CalendarIcon, 
      color: 'bg-secondary',
      trend: 'Upcoming'
    },
  ];

  const lastInvoice = invoices.length > 0 ? invoices[invoices.length - 1] : null;

  return (
    <div className="space-y-10 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Operations Hub 🎡</h1>
          <p className="text-slate-500 font-medium italic">Monitoring Funky Land Kids Zone • <span className="text-primary font-bold">Main Branch</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-3 no-print">
          <button 
            onClick={() => navigate('/billing')}
            className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black rounded-3xl shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-[0.1em] group"
          >
            <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
              <Zap size={20} fill="currentColor" />
            </div>
            Quick POS Terminal
          </button>
          
          <button 
            onClick={handlePrintDashboard}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-5 bg-white border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:text-blue-500 transition-all shadow-sm"
            title="Print Summary"
          >
            <FileText size={22} />
          </button>

          {lastInvoice && (
            <button 
              onClick={() => setSelectedInvoice(lastInvoice)}
              className="hidden lg:inline-flex items-center gap-3 px-6 py-5 bg-white border-2 border-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
              title="Print Last Receipt"
            >
              <ReceiptIcon size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs uppercase tracking-widest">Recent Bill</span>
            </button>
          )}
        </div>
      </header>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link 
          to="/billing" 
          className="group bg-white p-10 rounded-[3rem] border-2 border-transparent hover:border-primary/20 shadow-xl shadow-slate-200/50 transition-all flex items-center gap-8 relative overflow-hidden active:scale-[0.98]"
        >
          <div className="w-24 h-24 rounded-[2rem] gradient-primary flex items-center justify-center text-5xl shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
            🎡
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-1">Add Customer</h2>
            <p className="text-slate-400 font-black italic uppercase tracking-widest text-sm">New Session Registration</p>
          </div>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowUpRight size={40} className="text-slate-200 group-hover:text-primary transition-colors" />
          </motion.div>
          {/* Decorative element */}
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </Link>

        {lastInvoice ? (
          <button 
            onClick={() => setSelectedInvoice(lastInvoice)}
            className="group bg-slate-900 p-10 rounded-[3rem] shadow-2xl transition-all flex items-center gap-8 relative overflow-hidden text-left active:scale-[0.98]"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-white/10 flex items-center justify-center text-white shadow-inner group-hover:rotate-[-12deg] transition-transform duration-500">
              <ReceiptIcon size={48} />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-white tracking-tight mb-1">Print Bill</h2>
              <p className="text-slate-400 font-black italic uppercase tracking-widest text-sm">Re-print Latest Transaction</p>
              <p className="text-emerald-400 font-mono text-xs mt-2 font-bold uppercase">{lastInvoice.invoiceNumber} • {formatCurrency(lastInvoice.totalAmount)}</p>
            </div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </button>
        ) : (
           <div className="bg-slate-50 border-4 border-dashed border-slate-100 p-10 rounded-[3rem] flex items-center justify-center text-center">
              <p className="text-slate-300 font-black italic uppercase tracking-widest">No recent transactions</p>
           </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              <p className="text-[10px] font-black text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight">
                <ArrowUpRight size={12} className="text-emerald-500" /> {stat.trend}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary" /> Weekly Revenue
              </h2>
              <div className="h-[250px] w-full min-h-[250px] min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={last7Days}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6F61" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#FF6F61" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1E293B', color: '#fff' }}
                      itemStyle={{ color: '#FF6F61', fontWeight: 900 }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#FF6F61" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-500" /> Monthly Trends
              </h2>
              <div className="h-[250px] w-full min-h-[250px] min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dx={-10} />
                    <Tooltip 
                      cursor={{fill: '#F8FAFC', radius: 10}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1E293B', color: '#fff' }}
                    />
                    <Bar dataKey="revenue" fill="#5C5CFE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Clock className="text-accent" /> Live Zones
            </h2>
            <Link to="/tracking" className="text-secondary font-black hover:underline text-sm uppercase tracking-widest">Monitor All</Link>
          </div>
          
          <div className="grid gap-4">
            {activeEntries.slice(0, 4).length > 0 ? (
              activeEntries.slice(0, 4).map((entry) => (
                <div key={entry.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner">
                      {['🎡', '🎮', '🧩', '🎨', '🎠'][Math.floor(Math.random() * 5)]}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">{entry.childName}</h4>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">Plan: {entry.planName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                    </span>
                    <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">In: {entry.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-[2.5rem] text-center">
                <p className="text-slate-400 font-black italic">The zone is quiet... 😴</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Events & Quick Insights */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <CalendarIcon className="text-secondary" /> Event Feed
            </h2>
            <div className="space-y-4">
              {events.slice(0, 3).length > 0 ? (
                events.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:border-secondary/20 hover:shadow-lg group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">
                        {new Date(event.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        event.status === 'confirmed' ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {event.status}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 mb-1 group-hover:text-secondary transition-colors">{event.customerName}'s {categories.find(c => c.id === event.category)?.name || 'Event'}</h4>
                    <p className="text-xs text-slate-500 font-medium">{event.kidsCount} Kids • {event.timeSlot}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm font-bold italic">No events booked.</p>
                </div>
              )}
            </div>
            <Link to="/calendar" className="mt-6 block text-center py-3 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all">
              Manage Calendar
            </Link>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <PieChart size={20} className="text-accent" /> Revenue Source
            </h2>
            <div className="h-[200px] w-full relative min-h-[200px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={billTypeData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} width={60} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', background: '#1E293B', color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {billTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#FF6F61', '#5C5CFE', '#FFB800'][index % 3]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-700 pl-4 py-1 mt-4">
              Real-time breakdown of your income streams based on customer type.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between no-print">
                <h3 className="text-xl font-black text-slate-800 italic">Bill Preview</h3>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <ThermalReceipt invoice={selectedInvoice} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
