
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PlayEntry, 
  BookingEvent, 
  Member, 
  Invoice, 
  Expense, 
  PlayPlan,
  PlanType,
  GSTSlab,
  SocksConfig,
  BusinessProfile,
  ServiceCategory,
  ServiceItem,
  CatalogueCategory,
  CatalogueDesign,
  StaffMember
} from '../types';
import { PLANS } from '../constants';

interface PlayZoneContextType {
  entries: PlayEntry[];
  members: Member[];
  events: BookingEvent[];
  invoices: Invoice[];
  expenses: Expense[];
  plans: PlayPlan[];
  categories: ServiceCategory[];
  services: ServiceItem[];
  socksConfig: SocksConfig;
  businessProfile: BusinessProfile;
  staff: StaffMember[];
  catalogueCategories: CatalogueCategory[];
  catalogueDesigns: CatalogueDesign[];
  addEntry: (entry: Omit<PlayEntry, 'id' | 'startTime' | 'status'>) => void;
  completeEntry: (id: string, overtimeAmount?: number) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addEvent: (event: Omit<BookingEvent, 'id'>) => void;
  updateEventStatus: (id: string, status: BookingEvent['status']) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addPlan: (plan: PlayPlan) => void;
  deletePlan: (id: string) => void;
  addCategory: (name: string) => void;
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  deleteService: (id: string) => void;
  updateSocksConfig: (config: SocksConfig) => void;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;
  addCatalogueCategory: (name: string) => void;
  addCatalogueDesign: (design: Omit<CatalogueDesign, 'id'>) => void;
  deleteCatalogueDesign: (id: string) => void;
  importBulkData: (data: any) => void;
  exportAllData: () => any;
  exportToCSV: (data: any[], fileName: string) => void;
}

const PlayZoneContext = createContext<PlayZoneContextType | undefined>(undefined);

export function PlayZoneProvider({ children }: { children: React.ReactNode }) {
  // --- STATE ---
  const [entries, setEntries] = useState<PlayEntry[]>(() => {
    const saved = localStorage.getItem('funky_entries');
    if (!saved) return [];
    return JSON.parse(saved).map((e: any) => ({
      ...e,
      startTime: new Date(e.startTime),
      endTime: e.endTime ? new Date(e.endTime) : undefined,
    }));
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('funky_members');
    if (!saved) return [];
    return JSON.parse(saved).map((m: any) => ({
      ...m,
      startDate: new Date(m.startDate),
      expiryDate: new Date(m.expiryDate),
    }));
  });

  const [events, setEvents] = useState<BookingEvent[]>(() => {
    const saved = localStorage.getItem('funky_events');
    if (!saved) return [];
    return JSON.parse(saved).map((e: any) => ({
      ...e,
      date: new Date(e.date),
    }));
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('funky_invoices');
    if (!saved) return [];
    return JSON.parse(saved).map((i: any) => ({
      ...i,
      date: new Date(i.date),
    }));
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('funky_expenses');
    if (!saved) return [];
    return JSON.parse(saved).map((ex: any) => ({
      ...ex,
      date: new Date(ex.date),
    }));
  });

  const [plans, setPlans] = useState<PlayPlan[]>(() => {
    const saved = localStorage.getItem('funky_plans');
    if (!saved) return PLANS;
    return JSON.parse(saved);
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem('funky_categories');
    return saved ? JSON.parse(saved) : [
      { id: 'cat1', name: 'Decoration' },
      { id: 'cat2', name: 'Food & Beverage' },
      { id: 'cat3', name: 'Photography' }
    ];
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('funky_services');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [socksConfig, setSocksConfig] = useState<SocksConfig>(() => {
    const saved = localStorage.getItem('funky_socks_config');
    return saved ? JSON.parse(saved) : {
      smallPrice: 40,
      mediumPrice: 50,
      gstSlab: 12
    };
  });

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('funky_business_profile');
    const defaults: BusinessProfile = {
      name: 'FunkyLand',
      subName: 'Indoor Kids Play Area',
      unitName: '(A unit of Sudershan Business Solutions)',
      address: '2nd Floor, Plot 17, Sector-6, Channi Himmat, Jammu, J&K',
      gstNo: '01AF1FS7527R1ZD',
      mobile: '9596913030, 9796220727',
      email: 'funky@funky-land.com',
      logo: '🎡',
      accountingYearStart: '01-04',
      gracePeriodMinutes: 10,
      overtimeRatePerMinute: 2,
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [catalogueCategories, setCatalogueCategories] = useState<CatalogueCategory[]>(() => {
    const saved = localStorage.getItem('funky_catalogue_categories');
    return saved ? JSON.parse(saved) : [{ id: 'ccat1', name: 'Birthday Decor' }, { id: 'ccat2', name: 'Party Themes' }];
  });

  const [catalogueDesigns, setCatalogueDesigns] = useState<CatalogueDesign[]>(() => {
    const saved = localStorage.getItem('funky_catalogue_designs');
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('funky_staff');
    if (!saved) return [{ id: 'STF01', name: 'Admin', role: 'admin', phone: '9999999999', status: 'active', joinedDate: new Date().toISOString() }];
    return JSON.parse(saved);
  });

  // Persistence
  useEffect(() => localStorage.setItem('funky_entries', JSON.stringify(entries)), [entries]);
  useEffect(() => localStorage.setItem('funky_members', JSON.stringify(members)), [members]);
  useEffect(() => localStorage.setItem('funky_events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('funky_invoices', JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem('funky_expenses', JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem('funky_plans', JSON.stringify(plans)), [plans]);
  useEffect(() => localStorage.setItem('funky_categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('funky_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('funky_socks_config', JSON.stringify(socksConfig)), [socksConfig]);
  useEffect(() => localStorage.setItem('funky_business_profile', JSON.stringify(businessProfile)), [businessProfile]);
  useEffect(() => localStorage.setItem('funky_catalogue_categories', JSON.stringify(catalogueCategories)), [catalogueCategories]);
  useEffect(() => localStorage.setItem('funky_catalogue_designs', JSON.stringify(catalogueDesigns)), [catalogueDesigns]);
  useEffect(() => localStorage.setItem('funky_staff', JSON.stringify(staff)), [staff]);

  // Actions
  const addEntry = (entry: Omit<PlayEntry, 'id' | 'startTime' | 'status'>) => {
    const newEntry: PlayEntry = {
      ...entry,
      id: `ENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      startTime: new Date(),
      status: 'active'
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const completeEntry = (id: string, overtimeAmount: number = 0) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'completed', endTime: new Date(), overtimeAmount } : e));
    const entry = entries.find(e => e.id === id);
    if (entry && entry.invoiceId && overtimeAmount > 0) {
      setInvoices(prev => prev.map(inv => inv.id === entry.invoiceId ? { ...inv, overtimeAmount } : inv));
    }
  };

  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...member,
      id: `MEM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
    setMembers(prev => [newMember, ...prev]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
     // Financial Year Logic
    const d = new Date();
    const [startDay, startMonth] = businessProfile.accountingYearStart.split('-').map(Number);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    let fyStartYear = (m > startMonth || (m === startMonth && day >= startDay)) ? year : year - 1;
    const currentFY = `${fyStartYear}-${(fyStartYear + 1).toString().slice(-2)}`;

    const fyInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.date);
      const invM = invDate.getMonth() + 1;
      const invDay = invDate.getDate();
      const invYear = invDate.getFullYear();
      let invFyStart = (invM > startMonth || (invM === startMonth && invDay >= startDay)) ? invYear : invYear - 1;
      return `${invFyStart}-${(invFyStart + 1).toString().slice(-2)}` === currentFY;
    });

    const nextNum = fyInvoices.length + 1;
    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      invoiceNumber: `FL/${currentFY}/${nextNum.toString().padStart(4, '0')}`,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const value = {
    entries, members, events, invoices, expenses, plans, categories, services, socksConfig, businessProfile, staff, catalogueCategories, catalogueDesigns,
    addEntry, completeEntry, addMember, updateMember, deleteMember,
    addEvent: (event: Omit<BookingEvent, 'id'>) => setEvents(prev => [...prev, { ...event, id: `EVT-${Math.random().toString(36).substr(2, 9).toUpperCase()}` }]),
    updateEventStatus: (id: string, status: BookingEvent['status']) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e)),
    addInvoice,
    addExpense: (expense: Omit<Expense, 'id'>) => setExpenses(prev => [...prev, { ...expense, id: `EXP-${Math.random().toString(36).substr(2, 9).toUpperCase()}` }]),
    addPlan: (plan: PlayPlan) => setPlans(prev => [...prev, plan]),
    deletePlan: (id: string) => setPlans(prev => prev.filter(p => p.id !== id)),
    addCategory: (name: string) => setCategories(prev => [...prev, { id: 'CAT' + Math.random().toString(36).substr(2, 5).toUpperCase(), name }]),
    addService: (service: Omit<ServiceItem, 'id'>) => setServices(prev => [...prev, { ...service, id: 'SRV' + Math.random().toString(36).substr(2, 5).toUpperCase() }]),
    deleteService: (id: string) => setServices(prev => prev.filter(s => s.id !== id)),
    updateSocksConfig: setSocksConfig,
    updateBusinessProfile: setBusinessProfile,
    addStaff: (member: Omit<StaffMember, 'id'>) => setStaff(prev => [...prev, { ...member, id: 'STF' + (prev.length + 1).toString().padStart(2, '0') }]),
    updateStaff: (id: string, updates: Partial<StaffMember>) => setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s)),
    deleteStaff: (id: string) => setStaff(prev => prev.filter(s => s.id !== id)),
    addCatalogueCategory: (name: string) => setCatalogueCategories(prev => [...prev, { id: 'CCAT' + Math.random().toString(36).substr(2, 5).toUpperCase(), name }]),
    addCatalogueDesign: (design: Omit<CatalogueDesign, 'id'>) => setCatalogueDesigns(prev => [...prev, { ...design, id: 'DSGN' + Math.random().toString(36).substr(2, 5).toUpperCase() }]),
    deleteCatalogueDesign: (id: string) => setCatalogueDesigns(prev => prev.filter(d => d.id !== id)),
    importBulkData: (data: any) => {
        if (data.entries) setEntries(data.entries.map((e: any) => ({ ...e, startTime: new Date(e.startTime), endTime: e.endTime ? new Date(e.endTime) : undefined })));
        if (data.members) setMembers(data.members.map((m: any) => ({ ...m, startDate: new Date(m.startDate), expiryDate: new Date(m.expiryDate) })));
        if (data.events) setEvents(data.events.map((e: any) => ({ ...e, date: new Date(e.date) })));
        if (data.invoices) setInvoices(data.invoices.map((i: any) => ({ ...i, date: new Date(i.date) })));
        if (data.expenses) setExpenses(data.expenses.map((ex: any) => ({ ...ex, date: new Date(ex.date) })));
        if (data.plans) setPlans(data.plans);
        if (data.categories) setCategories(data.categories);
        if (data.services) setServices(data.services);
    },
    exportAllData: () => ({ entries, members, events, invoices, expenses, plans, categories, services, exportDate: new Date().toISOString() }),
    exportToCSV: (data: any[], fileName: string) => {
        if (data.length === 0) return;
        const headers = Object.keys(data[0]);
        const csvContent = [headers.join(','), ...data.map(row => headers.map(f => `"${String(row[f] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.csv`;
        link.click();
    }
  };

  return <PlayZoneContext.Provider value={value}>{children}</PlayZoneContext.Provider>;
}

export function usePlayZone() {
  const context = useContext(PlayZoneContext);
  if (context === undefined) throw new Error('usePlayZone must be used within a PlayZoneProvider');
  return context;
}
