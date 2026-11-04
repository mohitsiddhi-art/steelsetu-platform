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
  companyName: '',
  tagline: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  gstin: '',
  pan: '',
  phone: '',
  email: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  upiId: '',
  termsAndConditions: '',
};

export const DEFAULT_CUSTOMERS: CrmCustomer[] = [];
export const DEFAULT_VENDORS: CrmVendor[] = [];
export const DEFAULT_INVOICES: CrmInvoice[] = [];
export const DEFAULT_EXPENSES: CrmExpense[] = [];
export const DEFAULT_TASKS: CrmTask[] = [];
export const DEFAULT_STAFF: StaffMember[] = [];

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
