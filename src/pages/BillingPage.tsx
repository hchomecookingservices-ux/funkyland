
import React, { useState, useMemo } from 'react';
import { usePlayZone } from '../hooks/usePlayZone';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Smartphone, 
  User, 
  Baby, 
  Package, 
  Send,
  Plus,
  Trash2,
  Receipt,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, formatWhatsAppLink, cn } from '../lib/utils';
import { GST_LOGIC } from '../constants';
import { Invoice, InvoiceItem, GSTSlab } from '../types';
import ThermalReceipt from '../components/ThermalReceipt';

export default function BillingPage() {
  const { addEntry, addInvoice, addMember, plans, socksConfig, businessProfile, members, staff, invoices } = usePlayZone();
  const navigate = useNavigate();
  
  const [handledBy, setHandledBy] = useState(staff[0]?.id || '');
  
  const [formData, setFormData] = useState({
    customerId: 'CU' + Math.floor(Math.random() * 90000 + 10000),
    name: '',
    mobileNo: '',
    personCount: 1,
    smallSocks: 0,
    mediumSocks: 0,
    planId: plans[0]?.id || '',
    description: '',
    isGstInclusive: true,
    registerAsMember: false
  });

  // Auto-populate based on phone number
  React.useEffect(() => {
    if (formData.mobileNo.length === 10) {
      // Prioritize Members
      const memberMatch = members.find(m => m.phoneNumber === formData.mobileNo);
      if (memberMatch) {
        setFormData(prev => ({
          ...prev,
          name: `${memberMatch.parentName} (${memberMatch.childName})`,
          customerId: memberMatch.id
        }));
        return;
      }

      // Then check previous invoices (walking customers)
      const invoiceMatch = invoices.find(inv => inv.phoneNumber === formData.mobileNo);
      if (invoiceMatch) {
        setFormData(prev => ({
          ...prev,
          name: invoiceMatch.customerName,
          // keep existing customerId or update if we find a consistent pattern
        }));
      }
    }
  }, [formData.mobileNo, members, invoices]);

  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [showMemberResults, setShowMemberResults] = useState(false);

  const searchedMembers = useMemo(() => {
    if (!memberSearchTerm || memberSearchTerm.length < 2) return [];
    return members.filter(m => 
      m.parentName.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      m.childName.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      m.phoneNumber.includes(memberSearchTerm)
    );
  }, [members, memberSearchTerm]);

  const selectMember = (m: any) => {
    setFormData({
      ...formData,
      name: `${m.parentName} (${m.childName})`,
      mobileNo: m.phoneNumber,
      customerId: m.id
    });
    setMemberSearchTerm('');
    setShowMemberResults(false);
  };

  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'split'>('upi');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<any>(null);

  const selectedPlan = useMemo(() => {
    return plans.find(p => p.id === formData.planId) || plans[0];
  }, [formData.planId, plans]);

  const billingCalculations = useMemo(() => {
    if (!selectedPlan) return { totalBase: 0, totalGst: 0, totalAmount: 0, items: [] };

    const items: InvoiceItem[] = [];
    let totalBase = 0;
    let totalGst = 0;

    // 1. Plan Calculation
    let planTotal = selectedPlan.price * formData.personCount;
    let planBase = planTotal;
    let planGst = (planBase * selectedPlan.gstSlab) / 100;
    
    if (formData.isGstInclusive) {
      // If inclusive, price is the total. Derive base.
      planBase = planTotal / (1 + selectedPlan.gstSlab / 100);
      planGst = planTotal - planBase;
    }

    totalBase += planBase;
    totalGst += planGst;

    items.push({
      id: `ITEM-1`,
      description: `Plan: ${selectedPlan.name} (${formData.personCount} Person)`,
      type: 'service',
      quantity: formData.personCount,
      unitPrice: planBase / formData.personCount,
      gstSlab: selectedPlan.gstSlab as GSTSlab,
      amount: planBase + planGst
    });

    // 2. Socks Calculation
    if (formData.smallSocks > 0) {
      let smallBase = socksConfig.smallPrice * formData.smallSocks;
      let smallGst = (smallBase * socksConfig.gstSlab) / 100;
      
      if (formData.isGstInclusive) {
        const total = socksConfig.smallPrice * formData.smallSocks;
        smallBase = total / (1 + socksConfig.gstSlab / 100);
        smallGst = total - smallBase;
      }

      totalBase += smallBase;
      totalGst += smallGst;
      items.push({
        id: `SOCKS-S`,
        description: `Socks (Small) x ${formData.smallSocks}`,
        type: 'product',
        quantity: formData.smallSocks,
        unitPrice: smallBase / formData.smallSocks,
        gstSlab: socksConfig.gstSlab,
        amount: smallBase + smallGst
      });
    }

    if (formData.mediumSocks > 0) {
      let mediumBase = socksConfig.mediumPrice * formData.mediumSocks;
      let mediumGst = (mediumBase * socksConfig.gstSlab) / 100;

      if (formData.isGstInclusive) {
        const total = socksConfig.mediumPrice * formData.mediumSocks;
        mediumBase = total / (1 + socksConfig.gstSlab / 100);
        mediumGst = total - mediumBase;
      }

      totalBase += mediumBase;
      totalGst += mediumGst;
      items.push({
        id: `SOCKS-M`,
        description: `Socks (Medium) x ${formData.mediumSocks}`,
        type: 'product',
        quantity: formData.mediumSocks,
        unitPrice: mediumBase / formData.mediumSocks,
        gstSlab: socksConfig.gstSlab,
        amount: mediumBase + mediumGst
      });
    }

    return {
      totalBase,
      totalGst,
      totalAmount: totalBase + totalGst,
      items
    };
  }, [selectedPlan, formData.personCount, formData.smallSocks, formData.mediumSocks, socksConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const invoiceData = {
      customerName: formData.name,
      phoneNumber: formData.mobileNo,
      date: new Date(),
      items: billingCalculations.items,
      totalBaseAmount: billingCalculations.totalBase,
      totalGST: billingCalculations.totalGst,
      totalAmount: billingCalculations.totalAmount,
      paymentMode,
      status: 'paid' as const,
      type: 'walking' as const
    };

    // 1. Create Invoice
    const newInvoice = addInvoice(invoiceData);
    setLastInvoice(newInvoice);

    // 2. Add Entry for tracking
    addEntry({
      childName: formData.name, 
      parentName: formData.name,
      phoneNumber: formData.mobileNo,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amount: billingCalculations.totalAmount,
      personCount: formData.personCount,
      smallSocksCount: formData.smallSocks,
      mediumSocksCount: formData.mediumSocks,
      invoiceId: newInvoice.id,
      memberId: formData.registerAsMember ? formData.customerId : undefined
    });

    // 3. Register as member if requested
    if (formData.registerAsMember) {
      const isAlreadyMember = members.some(m => m.phoneNumber === formData.mobileNo);
      if (!isAlreadyMember) {
        addMember({
          parentName: formData.name,
          childName: formData.name,
          childAge: 5, // Default or prompt? simplified to 5 for now
          phoneNumber: formData.mobileNo,
          planId: selectedPlan.id,
          startDate: new Date(),
          expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          customerId: formData.customerId
        });
      }
    }
    
    setIsSuccess(true);
  };

  const handleWhatsAppNotify = () => {
    const message = `Welcome to ${businessProfile.name}! 🎡\n\nInv No: INVOICE_PENDING\nCustomer: ${formData.name}\nPlan: ${selectedPlan?.name}\nTotal: ${formatCurrency(billingCalculations.totalAmount)}\n\nHave fun! 🎠`;
    window.open(formatWhatsAppLink(formData.mobileNo, message), '_blank');
  };

  if (isSuccess) {
    return (
      <div className="max-w-6xl mx-auto py-10 space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Checkout Complete! 🥳</h2>
          <p className="text-slate-500 font-medium italic mb-2">Session is now active and invoice generated.</p>
          <div className="bg-slate-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">
            Entry Time: {new Date().toLocaleTimeString()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="space-y-4">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                 <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b pb-4 flex items-center gap-2">
                   <Receipt size={16} className="text-emerald-500" /> Payment Receipt
                 </h4>
                 <ThermalReceipt invoice={lastInvoice} />
              </div>
            </div>
            
            <div className="space-y-4 flex flex-col justify-start">
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Entry Detail</h4>
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase">Kid Name</span>
                        <span className="text-slate-800 text-sm font-black italic">{formData.name}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase">Plan</span>
                        <span className="text-slate-800 text-sm font-black italic">{selectedPlan?.name}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase">Time In</span>
                        <span className="text-emerald-600 text-sm font-black italic">{new Date().toLocaleTimeString()}</span>
                     </div>
                  </div>
               </div>

               <button 
                onClick={() => window.print()}
                className="w-full py-5 bg-white text-slate-800 font-black text-sm rounded-3xl border-2 border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-slate-200/40"
              >
                <CheckCircle2 size={20} className="text-emerald-500" />
                Print Confirmation
              </button>
               <button 
                onClick={handleWhatsAppNotify}
                className="w-full py-5 bg-emerald-50 text-emerald-600 font-black text-sm rounded-3xl border-2 border-emerald-100 hover:bg-emerald-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-emerald-600/5"
              >
                <Send size={20} />
                Send via WhatsApp
              </button>
              <button 
                onClick={() => navigate('/tracking')}
                className="w-full py-5 bg-slate-900 text-white font-black text-sm rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                Go to Tracking 🎡
              </button>
              <button 
                 onClick={() => {
                   setIsSuccess(false);
                   setFormData(prev => ({
                     ...prev,
                     customerId: 'CU' + Math.floor(Math.random() * 90000 + 10000),
                     name: '',
                     mobileNo: '',
                     personCount: 1,
                     smallSocks: 0,
                     mediumSocks: 0,
                     description: ''
                   }));
                 }}
                className="w-full py-4 text-slate-400 font-black text-xs hover:text-primary transition-all uppercase tracking-widest"
              >
                New Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl text-slate-500 hover:bg-slate-50 transition-all border border-slate-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Add Customer 🎡</h1>
            <p className="text-slate-500 font-medium">New Session Registration</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="relative">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Search Member</label>
               <input 
                 type="text"
                 placeholder="Search by Parent Name or Phone..."
                 value={memberSearchTerm}
                 onChange={e => {
                   setMemberSearchTerm(e.target.value);
                   setShowMemberResults(true);
                 }}
                 className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-secondary/20 focus:bg-white rounded-2xl transition-all outline-none font-medium"
               />
               <AnimatePresence>
                 {showMemberResults && searchedMembers.length > 0 && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                   >
                     {searchedMembers.map(m => (
                       <button
                         key={m.id}
                         type="button"
                         onClick={() => selectMember(m)}
                         className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0"
                       >
                         <p className="font-black text-slate-800">{m.parentName} ({m.childName})</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{m.phoneNumber} • {m.id}</p>
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Customer ID</label>
                <input 
                  type="text" readOnly
                  value={formData.customerId}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-primary italic"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name"
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl transition-all outline-none font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Handled By (Staff)</label>
                <select 
                  value={handledBy}
                  onChange={e => setHandledBy(e.target.value)}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-secondary/20 focus:bg-white rounded-2xl outline-none font-bold"
                >
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile No.</label>
                <input 
                  type="tel" required
                  value={formData.mobileNo}
                  onChange={e => setFormData({...formData, mobileNo: e.target.value})}
                  placeholder="9876543210"
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl transition-all outline-none font-medium"
                />
              </div>
              <div className="md:col-span-2 py-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={formData.registerAsMember}
                    onChange={e => setFormData({...formData, registerAsMember: e.target.checked})}
                    className="w-6 h-6 rounded-lg border-2 border-slate-200 checked:bg-primary accent-primary"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Save as Member</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enable to store customer data for future visits</span>
                  </div>
                </label>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">No. of Person</label>
                <input 
                  type="number" required
                  min="1"
                  value={formData.personCount}
                  onChange={e => setFormData({...formData, personCount: parseInt(e.target.value)})}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl transition-all outline-none font-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Small Socks</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setFormData(f => ({...f, smallSocks: Math.max(0, f.smallSocks - 1)}))} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">-</button>
                  <span className="font-black text-xl w-8 text-center">{formData.smallSocks}</span>
                  <button type="button" onClick={() => setFormData(f => ({...f, smallSocks: f.smallSocks + 1}))} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">+</button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Medium Socks</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setFormData(f => ({...f, mediumSocks: Math.max(0, f.mediumSocks - 1)}))} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">-</button>
                  <span className="font-black text-xl w-8 text-center">{formData.mediumSocks}</span>
                  <button type="button" onClick={() => setFormData(f => ({...f, mediumSocks: f.mediumSocks + 1}))} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">+</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Plan</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.planId}
                    onChange={e => setFormData({...formData, planId: e.target.value})}
                    className="flex-1 px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold"
                  >
                    <option value="">--Select Plan--</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({...f, isGstInclusive: !f.isGstInclusive}))}
                    className={cn(
                      "px-4 py-2 rounded-2xl text-[8px] font-black uppercase tracking-widest transition-all border-2",
                      formData.isGstInclusive 
                        ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20" 
                        : "bg-white text-slate-400 border-slate-100"
                    )}
                  >
                    {formData.isGstInclusive ? "Inclusive" : "Add GST"}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price</label>
                  <div className="px-5 py-3 bg-slate-100 rounded-2xl font-black text-slate-500">
                    {selectedPlan ? formatCurrency(selectedPlan.price) : '0.00'}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Time (Min)</label>
                  <div className="px-5 py-3 bg-slate-100 rounded-2xl font-black text-slate-500">
                    {selectedPlan ? `${selectedPlan.durationMinutes}m` : '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description / Notes</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-medium h-24 resize-none"
                placeholder="Any additional details..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px]" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2 italic">
                <Receipt size={20} className="text-primary" /> Bill Details
              </h3>
              
              <div className="space-y-3">
                {billingCalculations.items.map(item => (
                  <div key={item.id} className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <span>{item.description}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-slate-400 font-bold text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(billingCalculations.totalBase)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold text-sm">
                  <span>Total GST</span>
                  <span>{formatCurrency(billingCalculations.totalGst)}</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Payable</span>
                  <span className="text-4xl font-black text-primary">{formatCurrency(billingCalculations.totalAmount)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <CreditCard size={20} className="text-accent" /> Payment Mode
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'cash', label: 'Cash', icon: Banknote },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPaymentMode(mode.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                    paymentMode === mode.id 
                      ? "border-accent bg-accent/5 text-accent" 
                      : "border-slate-50 text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <mode.icon size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <button 
                type="submit"
                className="w-full py-5 gradient-primary text-white font-black text-xl rounded-[2rem] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Checkout ✅
              </button>
              <button 
                type="button"
                onClick={handleWhatsAppNotify}
                disabled={!formData.mobileNo}
                className="w-full py-4 bg-emerald-50 text-emerald-600 font-black text-xs rounded-2xl border-2 border-emerald-100 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest"
              >
                <Send size={16} />
                Send via WhatsApp
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
