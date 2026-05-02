import React, { useState } from 'react';
import { usePlayZone } from '../hooks/usePlayZone';
import { 
  Users, 
  Search, 
  Clock, 
  CheckCircle2, 
  Phone,
  Receipt,
  X
} from 'lucide-react';
import { formatCurrency, formatWhatsAppLink } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ThermalReceipt from '../components/ThermalReceipt';
import { Invoice } from '../types';

export default function TrackingPage() {
  const { entries, invoices, completeEntry } = usePlayZone();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handlePrintReceipt = (invoiceId?: string) => {
    if (!invoiceId) return;
    const inv = invoices.find(i => i.id === invoiceId);
    if (inv) {
      setSelectedInvoice(inv);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.phoneNumber.includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && entry.status === filter;
  });

  const handleNotifyReminder = (entry: any) => {
    const message = `Hi ${entry.parentName}, this is a reminder from Funky Land! 🎡 ${entry.childName}'s play time is almost up! See you soon!`;
    window.open(formatWhatsAppLink(entry.phoneNumber, message), '_blank');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2 italic">
            <Users className="text-primary" /> Live Tracking
          </h1>
          <p className="text-slate-500 font-medium">Manage on-site children and session completion.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by kid or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-secondary outline-none transition-all font-medium"
            />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {(['active', 'completed', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEntries.map((entry) => (
            <motion.div
              layout
              key={entry.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "bg-white p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-xl",
                entry.status === 'active' ? "border-accent/10 hover:border-accent" : "border-slate-100 opacity-75"
              )}
            >
              <div className="flex items-center gap-5 flex-1">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-inner",
                  entry.status === 'active' ? "bg-accent text-white" : "bg-slate-100 grayscale"
                )}>
                  {entry.status === 'active' ? '🎡' : '✅'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-800">{entry.childName}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      entry.status === 'active' ? "bg-accent/10 text-accent" : "bg-slate-100 text-slate-500"
                    )}>
                      {entry.status}
                    </span>
                  </div>
                  <p className="text-slate-500 font-bold text-sm">
                    {entry.parentName} • <span className="text-slate-400 tabular-nums">{entry.phoneNumber}</span>
                  </p>
                  <div className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock size={12} /> {entry.planName}</span>
                    <span>• In: {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {entry.endTime && <span>• Out: {new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {entry.status === 'active' && (
                  <>
                    <button 
                      onClick={() => handlePrintReceipt(entry.invoiceId)}
                      className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      title="Print Bill"
                    >
                      <Receipt size={20} />
                    </button>
                    <button 
                      onClick={() => handleNotifyReminder(entry)}
                      className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      title="Send WhatsApp Reminder"
                    >
                      <Phone size={20} />
                    </button>
                    <button 
                      onClick={() => completeEntry(entry.id)}
                      className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl"
                    >
                      <CheckCircle2 size={18} />
                      Complete Session
                    </button>
                  </>
                )}
                
                {entry.status === 'completed' && (
                   <p className="font-black text-slate-400 px-4 italic text-sm">{formatCurrency(entry.amount)} Total Paid</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEntries.length === 0 && (
          <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black italic">No matching entries at the moment. 🎡</p>
          </div>
        )}
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
