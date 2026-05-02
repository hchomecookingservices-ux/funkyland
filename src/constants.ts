
import { PlayPlan } from './types';

export const COLORS = {
  primary: '#FF6F61', // Fun Coral
  secondary: '#6C5CE7', // Playful Purple
  accent: '#00CEC9', // Bright Aqua
  background: '#FFF8F0',
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
};

export const GST_RATES = [0, 5, 12, 18];

export const PLANS: PlayPlan[] = [
  { id: 'h1', name: 'Standard Play (1 Hr)', durationMinutes: 60, price: 200, gstSlab: 18, type: 'hourly' },
  { id: 'h2', name: 'Fun Play (2 Hrs)', durationMinutes: 120, price: 350, gstSlab: 18, type: 'hourly' },
  { id: 'dp', name: 'Day Pass (Unlimited)', durationMinutes: 0, price: 600, gstSlab: 18, type: 'unlimited' },
  { id: 'c1', name: 'Play + Snack Combo', durationMinutes: 60, price: 300, gstSlab: 18, type: 'combo' },
  { id: 'm1', name: 'Monthly Membership', durationMinutes: 0, price: 2500, gstSlab: 18, type: 'subscription' },
];

export const APP_NAME = 'KIDS MANAGEMENT FUN ZONE';
export const BUSINESS_DETAILS = {
  NAME: 'Kids Fun Zone',
  SUB_NAME: 'Zone Management System',
  UNIT_NAME: 'Digital Communique Private Limited',
  ADDRESS: '2nd Floor, Plot 17, Sector-6, Channi Himmat, Jammu, J&K',
  GST_NO: '01AF1FS7527R1ZD',
  MOBILE: '9596913030, 9796220727',
  EMAIL: 'funky@funky-land.com'
};
export const FOOTER_TEXT = '© 2024 Digital Communique Private Limited';

export const GST_LOGIC = {
  SERVICES: 18,
  FOOD: 5,
  PRODUCTS: 12,
};
