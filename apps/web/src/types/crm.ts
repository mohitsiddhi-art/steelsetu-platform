export type PipelineStage = 'NEW_RFQ' | 'QUOTED' | 'APPROVED' | 'INVOICED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';

export interface CrmCustomer {
  id: string;
  name: string;
  companyName: string;
  gstin: string;
  pan: string;
  city: string;
  phone: string;
  email: string;
  totalBilled: number;
  advanceReceived: number;
  pendingBalance: number; // Udhaar
  creditLimit: number;
  lastOrderDate: string;
}

export interface CrmVendor {
  id: string;
  name: string;
  millName: string;
  category: string;
  city: string;
  gstin: string;
  phone: string;
  advancePaid: number;
  duesOwed: number;
  rating: number;
}

export interface CrmInvoiceItem {
  id: string;
  description: string;
  gradeOrSpec: string;
  quantityTons: number;
  ratePerTonInr: number;
  amountInr: number;
}

export interface CrmInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  companyName: string;
  gstin: string;
  items: CrmInvoiceItem[];
  subtotalInr: number;
  freightInr: number;
  loadingInr: number;
  gst18Inr: number;
  grandTotalInr: number;
  status: 'PROFORMA' | 'ISSUED' | 'PAID' | 'PARTIAL' | 'OVERDUE';
  notes: string;
}

export interface CrmExpense {
  id: string;
  date: string;
  category: 'FREIGHT' | 'LOADING' | 'MILL_ADVANCE' | 'OFFICE' | 'COMMISSION' | 'OTHER';
  description: string;
  amountInr: number;
  paidTo: string;
  referenceId?: string;
}

export interface CrmTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
  assignedTo: string;
}

export interface CrmSettings {
  companyName: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  termsAndConditions: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER';
  permissions: {
    canViewRfqs: boolean;
    canEditRfqs: boolean;
    canCreateInvoices: boolean;
    canEditRates: boolean;
    canDeleteRecords: boolean;
    canManageClaims: boolean;
  };
  lastActive: string;
}
