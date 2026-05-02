
export type UserRole = 'admin' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branchId?: string;
}

export type GSTSlab = 0 | 5 | 12 | 18;
export type PlanType = 'hourly' | 'unlimited' | 'subscription' | 'combo';

export interface PlayPlan {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  gstSlab: GSTSlab;
  type: PlanType;
  maxCapacity?: number;
}

export type EntryStatus = 'active' | 'completed' | 'cancelled';

export interface PlayEntry {
  id: string;
  childName: string;
  parentName: string;
  phoneNumber: string;
  startTime: any;
  endTime?: any;
  planId: string;
  planName: string;
  amount: number;
  status: EntryStatus;
  memberId?: string;
  personCount: number;
  smallSocksCount: number;
  mediumSocksCount: number;
  invoiceId?: string;
}

export interface Member {
  id: string;
  parentName: string;
  childName: string;
  childAge: number;
  phoneNumber: string;
  planId: string;
  startDate: any;
  expiryDate: any;
  rfidCard?: string;
  medicalNotes?: string;
  customerId?: string; // Linking to customer ID pattern
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
}

export interface BookingEvent {
  id: string; // e.g., EVB05
  category: string;
  customerId?: string;
  customerName: string;
  phoneNumber: string;
  date: any;
  timeSlot: string;
  kidsCount: number;
  bookingCharges: number;
  selectedServices: {
    serviceId: string;
    name: string;
    price: number;
    theme?: string;
  }[];
  theme?: string;
  grandTotal: number;
  gstPercentage: number;
  advancePaid: number;
  balance: number;
  payMode: 'cash' | 'upi' | 'card' | 'online';
  paymentStatus: 'pending' | 'partial' | 'paid';
  status: 'tentative' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  type: 'service' | 'product';
  quantity: number;
  unitPrice: number;
  gstSlab: GSTSlab;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: any;
  customerName: string;
  phoneNumber: string;
  items: InvoiceItem[];
  totalBaseAmount: number;
  totalGST: number;
  totalAmount: number;
  paymentMode: 'cash' | 'upi' | 'card' | 'split';
  status: 'paid' | 'pending';
  type: 'walking' | 'member' | 'event';
}

export interface SocksConfig {
  smallPrice: number;
  mediumPrice: number;
  gstSlab: GSTSlab;
}

export interface BusinessProfile {
  name: string;
  subName: string;
  unitName: string;
  address: string;
  gstNo: string;
  mobile: string;
  email: string;
  logo: string;
  accountingYearStart: string; // e.g., "04-01"
}

export interface CatalogueCategory {
  id: string;
  name: string;
}

export interface CatalogueDesign {
  id: string;
  categoryId: string;
  name: string;
  imageUrl?: string;
  description?: string;
  price?: number;
}

export interface Expense {
  id: string;
  category: string;
  date: any;
  amount: number;
  description: string;
  vendorName?: string;
}

export type StaffRole = 'admin' | 'cashier' | 'attendant' | 'manager';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  status: 'active' | 'inactive';
  joinedDate: any;
}
