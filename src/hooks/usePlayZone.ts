
import { useState, useEffect } from 'react';
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

export function usePlayZone() {
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
    if (!saved) return PLANS; // Fallback to constants if empty
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
      accountingYearStart: '04-01'
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [catalogueCategories, setCatalogueCategories] = useState<CatalogueCategory[]>(() => {
    const saved = localStorage.getItem('funky_catalogue_categories');
    return saved ? JSON.parse(saved) : [
      { id: 'ccat1', name: 'Birthday Decor' },
      { id: 'ccat2', name: 'Party Themes' }
    ];
  });

  const [catalogueDesigns, setCatalogueDesigns] = useState<CatalogueDesign[]>(() => {
    const saved = localStorage.getItem('funky_catalogue_designs');
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('funky_staff');
    if (!saved) return [
      { id: 'STF01', name: 'Admin', role: 'admin', phone: '9999999999', status: 'active', joinedDate: new Date().toISOString() }
    ];
    return JSON.parse(saved);
  });

  // --- PERSISTENCE ---
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

  // --- ACTIONS ---

  const addCategory = (name: string) => {
    const newCat = { id: 'CAT' + Math.random().toString(36).substr(2, 5).toUpperCase(), name };
    setCategories([...categories, newCat]);
  };

  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const newService = { ...service, id: 'SRV' + Math.random().toString(36).substr(2, 5).toUpperCase() };
    setServices([...services, newService]);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateSocksConfig = (config: SocksConfig) => {
    setSocksConfig(config);
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
  };

  const addCatalogueCategory = (name: string) => {
    const newCat = { id: 'CCAT' + Math.random().toString(36).substr(2, 5).toUpperCase(), name };
    setCatalogueCategories([...catalogueCategories, newCat]);
  };

  const addCatalogueDesign = (design: Omit<CatalogueDesign, 'id'>) => {
    const newDesign = { ...design, id: 'DSGN' + Math.random().toString(36).substr(2, 5).toUpperCase() };
    setCatalogueDesigns([...catalogueDesigns, newDesign]);
  };

  const deleteCatalogueDesign = (id: string) => {
    setCatalogueDesigns(prev => prev.filter(d => d.id !== id));
  };

  const addStaff = (member: Omit<StaffMember, 'id'>) => {
    const newMember: StaffMember = {
      ...member,
      id: 'STF' + (staff.length + 1).toString().padStart(2, '0')
    };
    setStaff(prev => [...prev, newMember]);
  };

  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStaff = (id: string) => {
    if (staff.length <= 1) return;
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  const addPlan = (plan: PlayPlan) => {
    setPlans(prev => [...prev, plan]);
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const addEntry = (entry: Omit<PlayEntry, 'id' | 'startTime' | 'status'>) => {
    const newEntry: PlayEntry = {
      ...entry,
      id: `ENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      startTime: new Date(),
      status: 'active'
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const completeEntry = (id: string) => {
    setEntries(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'completed', endTime: new Date() } : e
    ));
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

  const addEvent = (event: Omit<BookingEvent, 'id'>) => {
    const newEvent: BookingEvent = {
      ...event,
      id: `EVT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEventStatus = (id: string, status: BookingEvent['status']) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const getFinancialYear = (date: Date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    // Indian FY starts April 1st
    if (month >= 4) {
      return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${year - 1}-${year.toString().slice(-2)}`;
    }
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const currentFY = getFinancialYear(new Date());
    
    // Filter invoices from current FY to find max number
    const fyInvoices = invoices.filter(inv => getFinancialYear(new Date(inv.date)) === currentFY);
    
    let nextNum = 1;
    if (fyInvoices.length > 0) {
      const numbers = fyInvoices.map(inv => {
        const parts = inv.invoiceNumber.split('/');
        return parts.length === 3 ? parseInt(parts[2]) : 0;
      }).filter(n => !isNaN(n));
      nextNum = Math.max(0, ...numbers) + 1;
    }

    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      invoiceNumber: `FL/${currentFY}/${nextNum.toString().padStart(4, '0')}`,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `EXP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  return {
    entries,
    members,
    events,
    invoices,
    expenses,
    plans,
    categories,
    services,
    socksConfig,
    businessProfile,
    staff,
    catalogueCategories,
    catalogueDesigns,
    addEntry,
    completeEntry,
    addMember,
    updateMember,
    deleteMember,
    addEvent,
    updateEventStatus,
    addInvoice,
    addExpense,
    addPlan,
    deletePlan,
    addCategory,
    addService,
    deleteService,
    updateSocksConfig,
    updateBusinessProfile,
    addStaff,
    updateStaff,
    deleteStaff,
    addCatalogueCategory,
    addCatalogueDesign,
    deleteCatalogueDesign,
    importBulkData: (data: {
      entries?: any[],
      members?: any[],
      events?: any[],
      invoices?: any[],
      expenses?: any[],
      plans?: any[],
      categories?: any[],
      services?: any[],
      catalogueCategories?: any[],
      catalogueDesigns?: any[]
    }) => {
      if (data.entries) setEntries(data.entries.map(e => ({ ...e, startTime: new Date(e.startTime), endTime: e.endTime ? new Date(e.endTime) : undefined })));
      if (data.members) setMembers(data.members.map(m => ({ ...m, startDate: new Date(m.startDate), expiryDate: new Date(m.expiryDate) })));
      if (data.events) setEvents(data.events.map(e => ({ ...e, date: new Date(e.date) })));
      if (data.invoices) setInvoices(data.invoices.map(i => ({ ...i, date: new Date(i.date) })));
      if (data.expenses) setExpenses(data.expenses.map(ex => ({ ...ex, date: new Date(ex.date) })));
      if (data.plans) setPlans(data.plans);
      if (data.categories) setCategories(data.categories);
      if (data.services) setServices(data.services);
      if (data.catalogueCategories) setCatalogueCategories(data.catalogueCategories);
      if (data.catalogueDesigns) setCatalogueDesigns(data.catalogueDesigns);
    },
    exportAllData: () => {
      return {
        entries,
        members,
        events,
        invoices,
        expenses,
        plans,
        categories,
        services,
        catalogueCategories,
        catalogueDesigns,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    },
    exportToCSV: (data: any[], fileName: string) => {
      if (data.length === 0) return;
      
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(fieldName => {
            const value = row[fieldName];
            return `"${String(value ?? '').replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
}
