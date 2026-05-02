import React, { useState } from 'react';
import { usePlayZone } from '../hooks/usePlayZone';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Clock, 
  Calendar, 
  Tag, 
  FileText,
  IndianRupee,
  X,
  CheckCircle2,
  Footprints,
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import { GSTSlab, PlanType, SocksConfig, BusinessProfile } from '../types';

export default function PlansPage() {
  const { 
    plans, 
    addPlan, 
    deletePlan, 
    socksConfig, 
    updateSocksConfig,
    businessProfile,
    updateBusinessProfile,
    staff,
    addStaff,
    updateStaff,
    deleteStaff
  } = usePlayZone();
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  
  const [tempSocksConfig, setTempSocksConfig] = useState<SocksConfig>(socksConfig);
  const [tempBusinessProfile, setTempBusinessProfile] = useState<BusinessProfile>(businessProfile);

  const [staffFormData, setStaffFormData] = useState({
    name: '',
    role: 'cashier' as any,
    phone: '',
    status: 'active' as any
  });

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff({
      ...staffFormData,
      joinedDate: new Date().toISOString()
    });
    setIsAddingStaff(false);
    setStaffFormData({ name: '', role: 'cashier', phone: '', status: 'active' });
  };

  React.useEffect(() => {
    setTempSocksConfig(socksConfig);
  }, [socksConfig]);

  React.useEffect(() => {
    setTempBusinessProfile(businessProfile);
  }, [businessProfile]);

  const handleSocksUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocksConfig(tempSocksConfig);
    alert('Socks pricing updated successfully!');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(tempBusinessProfile);
    alert('Business profile updated successfully!');
  };

  const [formData, setFormData] = useState({
    id: 'PL' + Math.floor(Math.random() * 9000 + 1000),
    name: '',
    price: '',
    validityDays: '0',
    durationMinutes: '60',
    gstSlab: '18' as GSTSlab | string,
    type: 'hourly' as PlanType,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPlan({
      id: formData.id,
      name: formData.name,
      price: parseFloat(formData.price),
      durationMinutes: parseInt(formData.durationMinutes),
      gstSlab: parseInt(formData.gstSlab) as GSTSlab,
      type: formData.type,
      maxCapacity: 50, // Default capacity
    });
    setIsAdding(false);
    setFormData({
      id: 'PL' + Math.floor(Math.random() * 9000 + 1000),
      name: '',
      price: '',
      validityDays: '0',
      durationMinutes: '60',
      gstSlab: '18',
      type: 'hourly',
      description: ''
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Plan Management ⚙️</h1>
          <p className="text-slate-500 font-medium">Configure play packages and memberships</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-6 py-4 gradient-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          ADD PLAN
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <Tag size={20} className="text-primary" />
              </div>
              <button 
                onClick={() => deletePlan(plan.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                title="Delete Plan"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{plan.id}</p>
              <h3 className="text-xl font-black text-slate-800">{plan.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-bold flex items-center gap-2">
                  <IndianRupee size={14} /> Price
                </span>
                <span className="font-black text-slate-800">{formatCurrency(plan.price)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-bold flex items-center gap-2">
                  <Clock size={14} /> Duration
                </span>
                <span className="font-black text-slate-800">{plan.durationMinutes} Min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-bold flex items-center gap-2">
                  <Settings size={14} /> GST
                </span>
                <span className="font-black text-slate-800">{plan.gstSlab}%</span>
              </div>
            </div>

            <div className="mt-8">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                {plan.type}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Business Settings */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 italic">Business Profile 🏢</h2>
              <p className="text-slate-400 font-medium text-xs">Manage company info & branding</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Name</label>
              <input 
                type="text" required
                value={tempBusinessProfile.name}
                onChange={e => setTempBusinessProfile({...tempBusinessProfile, name: e.target.value})}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl outline-none font-bold placeholder:text-slate-300"
                placeholder="Funky Land"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile No.</label>
                <div className="relative">
                  <input 
                    type="text" required
                    value={tempBusinessProfile.mobile}
                    onChange={e => setTempBusinessProfile({...tempBusinessProfile, mobile: e.target.value})}
                    className="w-full px-5 py-3 pl-12 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl outline-none font-bold"
                  />
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GST Number</label>
                <input 
                  type="text" required
                  value={tempBusinessProfile.gstNo}
                  onChange={e => setTempBusinessProfile({...tempBusinessProfile, gstNo: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl outline-none font-bold uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Grace Period (Min)</label>
                <input 
                  type="number" required
                  value={tempBusinessProfile.gracePeriodMinutes || 0}
                  onChange={e => setTempBusinessProfile({...tempBusinessProfile, gracePeriodMinutes: parseInt(e.target.value)})}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl outline-none font-bold placeholder:text-slate-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Overtime Rate (₹/Min)</label>
                <input 
                  type="number" required
                  value={tempBusinessProfile.overtimeRatePerMinute || 0}
                  onChange={e => setTempBusinessProfile({...tempBusinessProfile, overtimeRatePerMinute: parseFloat(e.target.value)})}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl outline-none font-bold placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Accounting Year Start (DD-MM)</label>
              <div className="relative">
                <input 
                  type="text" required
                  value={tempBusinessProfile.accountingYearStart}
                  onChange={e => setTempBusinessProfile({...tempBusinessProfile, accountingYearStart: e.target.value})}
                  className="w-full px-5 py-3 pl-12 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-2xl outline-none font-bold placeholder:text-slate-300"
                  placeholder="01-04"
                />
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-[9px] text-slate-400 px-1 font-bold italic">Invoices will reset every year on this date (e.g. 01-04 for April 1st)</p>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              <Save size={18} />
              Update Profile
            </button>
          </form>
        </div>

        {/* Staff Management */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 italic">Staff Panel 👥</h2>
                <p className="text-slate-400 font-medium text-xs">Manage team access & roles</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddingStaff(true)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white font-black rounded-xl text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all shrink-0"
            >
              <Plus size={16} />
              New Member
            </button>
          </div>

          <div className="space-y-3">
            {staff.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm leading-tight italic">{s.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.role} • {s.phone}</p>
                  </div>
                </div>
                {staff.length > 1 && (
                  <button 
                    onClick={() => deleteStaff(s.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Add Plan Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 italic">Add New Plan 🌈</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Plan ID</label>
                    <input 
                      type="text" required
                      value={formData.id}
                      onChange={e => setFormData({...formData, id: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold italic"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Title</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Weekend Special"
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price (₹)</label>
                    <input 
                      type="number" required
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as PlanType})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-medium appearance-none"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="unlimited">Unlimited Day Pass</option>
                      <option value="subscription">Membership</option>
                      <option value="combo">Combo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Validation (Days)</label>
                    <input 
                      type="number" required
                      value={formData.validityDays}
                      onChange={e => setFormData({...formData, validityDays: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Validation Time (Min)</label>
                    <input 
                      type="number" required
                      value={formData.durationMinutes}
                      onChange={e => setFormData({...formData, durationMinutes: e.target.value})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none font-medium h-20 resize-none"
                    placeholder="Short plan details..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 gradient-primary text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={24} />
                    Confirm Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isAddingStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingStaff(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 italic">Add Staff Member 👥</h2>
                <button onClick={() => setIsAddingStaff(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>

              <form onSubmit={handleStaffSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input 
                    type="text" required
                    value={staffFormData.name}
                    onChange={e => setStaffFormData({...staffFormData, name: e.target.value})}
                    placeholder="Enter name..."
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role</label>
                    <select 
                      value={staffFormData.role}
                      onChange={e => setStaffFormData({...staffFormData, role: e.target.value as any})}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none font-bold appearance-none"
                    >
                      <option value="cashier">Cashier</option>
                      <option value="attendant">Floor Attendant</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                    <input 
                      type="text" required
                      value={staffFormData.phone}
                      onChange={e => setStaffFormData({...staffFormData, phone: e.target.value})}
                      placeholder="10 digit number"
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingStaff(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={24} />
                    Add Member
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
