import React, { useState, useMemo } from 'react';
import { usePlayZone } from '../hooks/usePlayZone';
import { 
  Receipt, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Download,
  Filter,
  PieChart,
  BarChart3,
  Calendar,
  IndianRupee,
  Plus,
  Search,
  FileText,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn, formatWhatsAppLink } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function AccountingPage() {
  const { invoices, expenses, addExpense, exportToCSV } = usePlayZone();
  const [activeTab, setActiveTab ] = useState<'invoices' | 'expenses'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: '',
    description: '',
    vendorName: ''
  });

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(ex => 
      ex.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const totals = useMemo(() => {
    const revenue = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const gst = invoices.reduce((sum, i) => sum + i.totalGST, 0);
    const base = invoices.reduce((sum, i) => sum + i.totalBaseAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      revenue,
      gst,
      base,
      expenses: totalExpenses,
      net: revenue - totalExpenses
    };
  }, [invoices, expenses]);

  const pieData = [
    { name: 'Play Services', value: totals.base, color: '#FF6F61' },
    { name: 'GST', value: totals.gst, color: '#00CEC9' },
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount),
      description: expenseForm.description,
      vendorName: expenseForm.vendorName,
      date: new Date()
    });
    setIsAddingExpense(false);
    setExpenseForm({ category: '', amount: '', description: '', vendorName: '' });
  };

  const handleExportGSTR1 = () => {
    const dataToExport = invoices.map(inv => ({
      CustomerName: inv.customerName,
      InvoiceNumber: inv.invoiceNumber,
      InvoiceDate: new Date(inv.date).toLocaleDateString(),
      BaseAmount: inv.totalBaseAmount,
      GSTAmount: inv.totalGST,
      TotalAmount: inv.totalAmount,
      GST_Slab: inv.items[0]?.gstSlab || 18
    }));
    exportToCSV(dataToExport, 'FunkyLand_GSTR1');
  };

  const handlePrintAccounting = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Financials 📊</h1>
          <p className="text-slate-500 font-medium">Accounting & GST insights</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button 
            onClick={handlePrintAccounting}
            className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl shadow-sm hover:text-primary transition-all"
            title="Print Summary"
          >
            <FileText size={20} />
          </button>
          <button 
            onClick={handleExportGSTR1}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 text-slate-600 font-black rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-xs"
          >
            <Download size={20} />
            Excel
          </button>
          <button 
            onClick={() => setIsAddingExpense(true)}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all font-xs"
          >
            <Plus size={20} />
            Expense
          </button>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: totals.revenue, icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Total Expenses', value: totals.expenses, icon: ArrowDownLeft, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'GST Collected', value: totals.gst, icon: Receipt, color: 'text-cyan-500', bg: 'bg-cyan-50' },
          { label: 'Net Profit', value: totals.net, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={cn("text-2xl font-black", stat.color)}>{formatCurrency(stat.value)}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
              <button 
                onClick={() => setActiveTab('invoices')}
                className={cn(
                  "px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                  activeTab === 'invoices' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Invoices
              </button>
              <button 
                onClick={() => setActiveTab('expenses')}
                className={cn(
                  "px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                  activeTab === 'expenses' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Expenses
              </button>
            </div>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text"
                 placeholder="Search entries..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-64"
               />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === 'invoices' ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inv No</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 font-black text-slate-800 text-sm italic">{inv.invoiceNumber}</td>
                        <td className="px-8 py-5 font-bold text-slate-600 text-sm">{inv.customerName}</td>
                        <td className="px-8 py-5 text-slate-400 text-sm font-medium">{new Date(inv.date).toLocaleDateString()}</td>
                        <td className="px-8 py-5 font-black text-slate-800 text-right">{formatCurrency(inv.totalAmount)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic font-medium">No invoices found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExpenses.length > 0 ? filteredExpenses.map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                            {ex.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 font-bold text-slate-600 text-sm">{ex.description}</td>
                        <td className="px-8 py-5 text-slate-400 text-sm font-medium">{new Date(ex.date).toLocaleDateString()}</td>
                        <td className="px-8 py-5 font-black text-red-500 text-right">{formatCurrency(ex.amount)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic font-medium">No expenses recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
              <PieChart className="text-primary" /> Revenue Mix
            </h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RePieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 pt-6">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm font-bold text-slate-600">{d.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/20 blur-[60px]" />
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 italic">
              <Calendar className="text-accent" /> Tax Calendar
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-2xl space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next GSTR-1 Deadline</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black">May 11, 2026</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-lg">REMINDER</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium italic opacity-75">
                "Funky Land v2.0 automatically segments GST by slab (5%, 12%, 18%) for easy filing."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      <AnimatePresence>
        {isAddingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingExpense(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8"
            >
              <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 italic">
                <Plus className="text-primary" size={28} /> New Expense
              </h2>

              <form onSubmit={handleAddExpense} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                  <select 
                    required
                    value={expenseForm.category}
                    onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl transition-all outline-none font-medium appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="rent">Rent & Electricity</option>
                    <option value="staff">Staff Salary</option>
                    <option value="marketing">Marketing & CRM</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inventory">Inventory (Toys/Food)</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Amount (₹)</label>
                  <input 
                    type="number" required
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl transition-all outline-none font-black text-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                  <textarea 
                    required
                    value={expenseForm.description}
                    onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl transition-all outline-none font-medium h-24 resize-none"
                    placeholder="Details about the expense..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingExpense(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all font-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Confirm Expense ✅
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
