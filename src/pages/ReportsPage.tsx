import React, { useState, useMemo } from 'react';
import { usePlayZone } from '../hooks/usePlayZone';
import { 
  BarChart3, 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  Receipt,
  Users,
  PartyPopper,
  CreditCard,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Upload,
  MessageCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency, formatWhatsAppLink } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import ThermalReceipt from '../components/ThermalReceipt';
import { Invoice } from '../types';
import { X } from 'lucide-react';

export default function ReportsPage() {
  const { invoices, importBulkData, exportAllData, exportToCSV, businessProfile, isAdmin } = usePlayZone();
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-4xl font-black text-slate-800 italic mb-4">Access Denied 🔒</h1>
        <p className="text-slate-500 font-medium max-w-md">Only administrators can view financial reports and manage data backups. Please contact your manager if you need access.</p>
      </div>
    );
  }
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<Invoice | null>(null);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'upi' | 'card'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'walking' | 'member' | 'event'>('all');

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const invDate = new Date(inv.date);
      const matchesDate = (!dateRange.from || invDate >= new Date(dateRange.from)) &&
                          (!dateRange.to || invDate <= new Date(dateRange.to));
      const matchesPayment = paymentFilter === 'all' || inv.paymentMode === paymentFilter;
      const matchesType = typeFilter === 'all' || inv.type === typeFilter;
      const matchesSearch = !searchTerm || 
                            inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inv.phoneNumber.includes(searchTerm);
      
      return matchesDate && matchesPayment && matchesType && matchesSearch;
    });
  }, [invoices, dateRange, paymentFilter, typeFilter, searchTerm]);

  const stats = useMemo(() => {
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTransactions = filteredInvoices.length;
    const walkingRev = filteredInvoices.filter(i => i.type === 'walking').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const memberRev = filteredInvoices.filter(i => i.type === 'member').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const eventRev = filteredInvoices.filter(i => i.type === 'event').reduce((sum, inv) => sum + inv.totalAmount, 0);

    return {
      totalRevenue,
      totalTransactions,
      walkingRev,
      memberRev,
      eventRev,
      avgTicketSize: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
    };
  }, [filteredInvoices]);

  const chartData = useMemo(() => {
    // Group revenue by date for the filtered range
    const grouped: { [key: string]: number } = {};
    filteredInvoices.forEach(inv => {
      const d = new Date(inv.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      grouped[d] = (grouped[d] || 0) + inv.totalAmount;
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value })).reverse().slice(-10);
  }, [filteredInvoices]);

  const pieData = [
    { name: 'Walking', value: stats.walkingRev, color: '#FF7C7C' }, // Primary Red/Pink
    { name: 'Member', value: stats.memberRev, color: '#5C5CFE' }, // Secondary Blue
    { name: 'Event', value: stats.eventRev, color: '#FFB800' }   // Accent Gold
  ].filter(i => i.value > 0);

  const handleExportJSON = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FunkyLand_BackUp_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportCSV = () => {
    const dataToExport = filteredInvoices.map(inv => ({
      InvoiceNo: inv.invoiceNumber,
      Date: new Date(inv.date).toLocaleDateString(),
      Type: inv.type,
      Customer: inv.customerName,
      Phone: inv.phoneNumber,
      BaseAmount: inv.totalBaseAmount,
      GST: inv.totalGST,
      Total: inv.totalAmount,
      Mode: inv.paymentMode
    }));
    exportToCSV(dataToExport, 'FunkyLand_Sales');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleWhatsAppShare = (inv: Invoice) => {
    const message = `Hello ${inv.customerName},\n\nYour bill from ${businessProfile.name} is ready.\nInvoice: ${inv.invoiceNumber}\nTotal: ${formatCurrency(inv.totalAmount)}\n\nThank you for visiting!`;
    window.open(formatWhatsAppLink(inv.phoneNumber, message), '_blank');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('This will merge/overwrite existing data with the imported file. Continue?')) {
          importBulkData(data);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Financial Reports 📈</h1>
          <p className="text-slate-500 font-medium">Analyze revenue, bills & payment trends</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black text-slate-600 cursor-pointer">
            <Upload size={20} />
            Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <div className="relative group">
            <button 
              className="flex items-center gap-2 px-6 py-4 gradient-secondary text-white rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 transition-all font-black"
            >
              <Download size={20} />
              Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                onClick={handleExportJSON}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-black text-slate-700 flex items-center gap-2"
              >
                Full Backup (.json)
              </button>
              <button 
                onClick={handleExportCSV}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-black text-slate-700 flex items-center gap-2"
              >
                Invoices (.csv)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
          <Filter size={14} /> Refine Results
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date"
                value={dateRange.from}
                onChange={e => setDateRange({...dateRange, from: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold uppercase transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date"
                value={dateRange.to}
                onChange={e => setDateRange({...dateRange, to: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold uppercase transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Mode</label>
            <select 
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value as any)}
              className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/60/60995.png')] bg-[length:12px] bg-[right_20px_center] bg-no-repeat"
            >
              <option value="all">All Modes</option>
              <option value="upi">UPI / QR</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Bill Type</label>
            <select 
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold appearance-none"
            >
              <option value="all">All Bills</option>
              <option value="walking">Walking Customers</option>
              <option value="member">Member Bills</option>
              <option value="event">Event Bills</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: Receipt, color: 'primary', trend: '+12.5%' },
          { label: 'Transactions', value: stats.totalTransactions, icon: IndianRupee, color: 'secondary', trend: '+5.2%' },
          { label: 'Avg Ticket', value: formatCurrency(stats.avgTicketSize), icon: CreditCard, color: 'accent', trend: '-2.1%' },
          { label: 'Filter Items', value: filteredInvoices.length, icon: Filter, color: 'slate', trend: 'N/A' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group"
          >
            <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-10", `bg-${stat.color}`)} />
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", `bg-${stat.color}/10 text-${stat.color}`)}>
                <stat.icon size={24} />
              </div>
              <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1", 
                stat.trend.startsWith('+') ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={10}/> : stat.trend.startsWith('-') ? <ArrowDownRight size={10}/> : null}
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800 italic">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 italic">Revenue Trend</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary" /> Revenue</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 700, fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontWeight: 700, fontSize: 10}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC', radius: 10}}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontStyle: 'italic', fontWeight: 900 }}
                />
                <Bar dataKey="value" fill="#FF7C7C" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-800 italic">Bill Distribution</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontStyle: 'italic', fontWeight: 900 }}
                />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-xl font-black text-slate-800 italic">₹{stats.totalRevenue > 1000 ? (stats.totalRevenue / 1000).toFixed(1) + 'k' : stats.totalRevenue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800 italic">Recent Bills</h3>
          <div className="flex items-center gap-4 no-print">
            <button 
              onClick={handlePrintReport}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm"
              title="Print Table"
            >
              <FileText size={18} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none w-48 lg:w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Bill No</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Payment</th>
                <th className="px-8 py-4">Total</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-black text-primary italic">{inv.invoiceNumber}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{inv.customerName}</span>
                      <span className="text-[10px] text-slate-400">{inv.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      inv.type === 'walking' ? "bg-slate-100 text-slate-500" :
                      inv.type === 'member' ? "bg-blue-100 text-blue-600" :
                      "bg-amber-100 text-amber-600"
                    )}>
                      {inv.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-900 uppercase flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", 
                        inv.paymentMode === 'cash' ? "bg-emerald-400" :
                        inv.paymentMode === 'upi' ? "bg-purple-400" : "bg-blue-400"
                      )} />
                      {inv.paymentMode}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-800">{formatCurrency(inv.totalAmount)}</span>
                  </td>
                  <td className="px-8 py-5 text-right no-print">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleWhatsAppShare(inv)}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button 
                        onClick={() => setSelectedInvoiceForReceipt(inv)}
                        className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                        <Receipt size={14} />
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedInvoiceForReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoiceForReceipt(null)}
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
                  onClick={() => setSelectedInvoiceForReceipt(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <ThermalReceipt invoice={selectedInvoiceForReceipt} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
