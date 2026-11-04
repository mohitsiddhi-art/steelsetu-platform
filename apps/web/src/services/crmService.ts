'use client';

import {
  CrmCustomer,
  CrmExpense,
  CrmInvoice,
  CrmSettings,
  CrmTask,
  CrmVendor,
  StaffMember,
} from '@/types/crm';
import { getAllRfqs } from '@/services/rfqService';

const STORAGE_KEY_CUSTOMERS = 'steelsetu_crm_customers_v1';
const STORAGE_KEY_VENDORS = 'steelsetu_crm_vendors_v1';
const STORAGE_KEY_INVOICES = 'steelsetu_crm_invoices_v1';
const STORAGE_KEY_EXPENSES = 'steelsetu_crm_expenses_v1';
const STORAGE_KEY_TASKS = 'steelsetu_crm_tasks_v1';
const STORAGE_KEY_SETTINGS = 'steelsetu_crm_settings_v1';
const STORAGE_KEY_STAFF = 'steelsetu_crm_staff_v1';

export const DEFAULT_SETTINGS: CrmSettings = {
  companyName: 'Singhi Enterprises',
  tagline: 'Burrabazar Prime Steel Stockists & Mill Channel Partners',
  address: 'Maharshi Debendra Road, Burrabazar, Kolkata - 700007, West Bengal',
  city: 'Kolkata',
  state: 'West Bengal',
  pincode: '700007',
  gstin: '19AAKCS8821K1ZP',
  pan: 'AAKCS8821K',
  phone: '+91 98830 51500',
  email: 'desk@steelsetu.com',
  bankName: 'HDFC Bank, Burrabazar Branch',
  accountNumber: '50200012345678',
  ifscCode: 'HDFC0000123',
  upiId: 'singhienterprises@hdfcbank',
  termsAndConditions:
    '1. Standard Mill Supply — Non-returnable once dispatched / subject to mill inspection clause.\n2. Goods once sold will not be taken back.\n3. Interest @ 18% p.a. will be charged if payment is delayed beyond agreed credit days.\n4. Subject to Kolkata Jurisdiction.',
};

export const DEFAULT_CUSTOMERS: CrmCustomer[] = [
  {
    id: 'cust_1',
    name: 'Rajesh Agarwal',
    companyName: 'Agarwal Infra & Builders Pvt Ltd',
    gstin: '19AABCA1234F1Z8',
    pan: 'AABCA1234F',
    city: 'Kolkata',
    phone: '+91 98310 11223',
    email: 'rajesh@agarwalinfra.com',
    totalBilled: 1450000,
    advanceReceived: 500000,
    pendingBalance: 320000,
    creditLimit: 1000000,
    lastOrderDate: '2026-10-25',
  },
  {
    id: 'cust_2',
    name: 'Vikram Sen',
    companyName: 'Bengal Structural Fabricators',
    gstin: '19AACBV5678G1Z2',
    pan: 'AACBV5678G',
    city: 'Howrah',
    phone: '+91 98741 55667',
    email: 'vikram@bengalstructurals.in',
    totalBilled: 2890000,
    advanceReceived: 1000000,
    pendingBalance: 850000,
    creditLimit: 2500000,
    lastOrderDate: '2026-10-28',
  },
  {
    id: 'cust_3',
    name: 'Suresh Poddar',
    companyName: 'Poddar Constructions',
    gstin: '19AADCP9012H1Z5',
    pan: 'AADCP9012H',
    city: 'Patna',
    phone: '+91 94311 88990',
    email: 'suresh@poddarbuild.com',
    totalBilled: 950000,
    advanceReceived: 950000,
    pendingBalance: 0,
    creditLimit: 500000,
    lastOrderDate: '2026-10-20',
  },
];

export const DEFAULT_VENDORS: CrmVendor[] = [
  {
    id: 'vend_1',
    name: 'Tata Steel Mill Desk',
    millName: 'Tata Steel / Tiscon',
    category: 'TMT Rebars & Structurals',
    city: 'Jamshedpur',
    gstin: '20AAACT1234A1Z9',
    phone: '+91 657 243 0000',
    advancePaid: 1500000,
    duesOwed: 0,
    rating: 4.9,
  },
  {
    id: 'vend_2',
    name: 'Super Smelters Dispatch',
    millName: 'Super Smelters (Super Shakti)',
    category: 'TMT & Structural Steel',
    city: 'Jamuria',
    gstin: '19AAECS3210F1ZB',
    phone: '+91 351 225 4000',
    advancePaid: 800000,
    duesOwed: 250000,
    rating: 4.6,
  },
  {
    id: 'vend_3',
    name: 'Surya Roshni Pipe Desk',
    millName: 'Surya Roshni Limited',
    category: 'GI & Black Steel Pipes',
    city: 'Bahadurgarh',
    gstin: '06AAACS8812K1Z8',
    phone: '+91 11 2681 4000',
    advancePaid: 500000,
    duesOwed: 180000,
    rating: 4.8,
  },
];

export const DEFAULT_INVOICES: CrmInvoice[] = [
  {
    id: 'inv_101',
    invoiceNumber: 'SS/26-27/041',
    date: '2026-10-28',
    dueDate: '2026-11-12',
    customerId: 'cust_2',
    customerName: 'Vikram Sen',
    companyName: 'Bengal Structural Fabricators',
    gstin: '19AACBV5678G1Z2',
    items: [
      {
        id: 'item_1',
        description: 'IS 2062 E250 MS Angles (50x50x6mm)',
        gradeOrSpec: 'IS 2062',
        quantityTons: 25,
        ratePerTonInr: 54800,
        amountInr: 1370000,
      },
    ],
    subtotalInr: 1370000,
    freightInr: 35000,
    loadingInr: 12000,
    gst18Inr: 250020,
    grandTotalInr: 1667020,
    status: 'ISSUED',
    notes: 'Material dispatched via WB-03-C-4421. Driver: Manoj Kumar (+91 98301 22334).',
  },
  {
    id: 'inv_102',
    invoiceNumber: 'SS/26-27/040',
    date: '2026-10-25',
    dueDate: '2026-11-09',
    customerId: 'cust_1',
    customerName: 'Rajesh Agarwal',
    companyName: 'Agarwal Infra & Builders Pvt Ltd',
    gstin: '19AABCA1234F1Z8',
    items: [
      {
        id: 'item_2',
        description: 'Tiscon Fe 500D TMT Rebars (12mm)',
        gradeOrSpec: 'IS 1786 Fe 500D',
        quantityTons: 20,
        ratePerTonInr: 58500,
        amountInr: 1170000,
      },
    ],
    subtotalInr: 1170000,
    freightInr: 28000,
    loadingInr: 10000,
    gst18Inr: 213840,
    grandTotalInr: 1421840,
    status: 'PAID',
    notes: 'Paid via HDFC NEFT Ref #HDFC5892104.',
  },
];

export const DEFAULT_EXPENSES: CrmExpense[] = [
  {
    id: 'exp_1',
    date: '2026-10-28',
    category: 'FREIGHT',
    description: 'Flatbed truck freight Kolkata to Howrah site (25 MT Angles)',
    amountInr: 35000,
    paidTo: 'Manoj Transport Agency',
    referenceId: 'SS/26-27/041',
  },
  {
    id: 'exp_2',
    date: '2026-10-26',
    category: 'LOADING',
    description: 'Burrabazar yard loading & weighing charges (20 MT TMT)',
    amountInr: 10000,
    paidTo: 'Burrabazar Hamal Panchayat',
    referenceId: 'SS/26-27/040',
  },
  {
    id: 'exp_3',
    date: '2026-10-24',
    category: 'MILL_ADVANCE',
    description: 'Advance RTGS for Tata Steel rolling cycle allocation',
    amountInr: 500000,
    paidTo: 'Tata Steel Ltd Jamshedpur',
  },
];

export const DEFAULT_TASKS: CrmTask[] = [
  {
    id: 'task_1',
    title: 'Confirm delivery schedule with Vikram Sen for 25 MT MS Angles',
    dueDate: '2026-10-30',
    priority: 'HIGH',
    completed: false,
    assignedTo: 'Mohit Singhi',
  },
  {
    id: 'task_2',
    title: 'Follow up on pending balance (₹3.2L) with Agarwal Infra',
    dueDate: '2026-10-31',
    priority: 'HIGH',
    completed: false,
    assignedTo: 'Desk Manager',
  },
  {
    id: 'task_3',
    title: 'Verify Mill Test Certificate for Super Smelters Fe 550D batch #904',
    dueDate: '2026-11-02',
    priority: 'MEDIUM',
    completed: true,
    assignedTo: 'Quality Inspector',
  },
];

export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff_1',
    name: 'Mohit Singhi',
    email: 'mohitsiddhi@gmail.com',
    role: 'OWNER',
    permissions: {
      canViewRfqs: true,
      canEditRfqs: true,
      canCreateInvoices: true,
      canEditRates: true,
      canDeleteRecords: true,
      canManageClaims: true,
    },
    lastActive: 'Just now',
  },
  {
    id: 'staff_2',
    name: 'Ankit Sharma',
    email: 'manager@steelsetu.com',
    role: 'MANAGER',
    permissions: {
      canViewRfqs: true,
      canEditRfqs: true,
      canCreateInvoices: true,
      canEditRates: false,
      canDeleteRecords: false,
      canManageClaims: true,
    },
    lastActive: '2 hours ago',
  },
];

// LocalStorage Helper Functions
export function getStoredCustomers(): CrmCustomer[] {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMERS;
  const raw = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
    return DEFAULT_CUSTOMERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CUSTOMERS;
  }
}

export function saveStoredCustomers(customers: CrmCustomer[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
}

export function getStoredVendors(): CrmVendor[] {
  if (typeof window === 'undefined') return DEFAULT_VENDORS;
  const raw = localStorage.getItem(STORAGE_KEY_VENDORS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(DEFAULT_VENDORS));
    return DEFAULT_VENDORS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_VENDORS;
  }
}

export function saveStoredVendors(vendors: CrmVendor[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
}

export function getStoredInvoices(): CrmInvoice[] {
  if (typeof window === 'undefined') return DEFAULT_INVOICES;
  const raw = localStorage.getItem(STORAGE_KEY_INVOICES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(DEFAULT_INVOICES));
    return DEFAULT_INVOICES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INVOICES;
  }
}

export function saveStoredInvoices(invoices: CrmInvoice[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
}

export function getStoredExpenses(): CrmExpense[] {
  if (typeof window === 'undefined') return DEFAULT_EXPENSES;
  const raw = localStorage.getItem(STORAGE_KEY_EXPENSES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
    return DEFAULT_EXPENSES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_EXPENSES;
  }
}

export function saveStoredExpenses(expenses: CrmExpense[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
}

export function getStoredTasks(): CrmTask[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  const raw = localStorage.getItem(STORAGE_KEY_TASKS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveStoredTasks(tasks: CrmTask[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
}

export function getStoredSettings(): CrmSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: CrmSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

export function getStoredStaff(): StaffMember[] {
  if (typeof window === 'undefined') return DEFAULT_STAFF;
  const raw = localStorage.getItem(STORAGE_KEY_STAFF);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(DEFAULT_STAFF));
    return DEFAULT_STAFF;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STAFF;
  }
}

export function saveStoredStaff(staff: StaffMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staff));
}

export function resetDemoCrmData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
  localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(DEFAULT_VENDORS));
  localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(DEFAULT_INVOICES));
  localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(DEFAULT_TASKS));
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(DEFAULT_STAFF));
}
