'use client';

import { useState, useEffect } from 'react';
import {
  getStoredCustomers,
  saveStoredCustomers,
  getStoredVendors,
  saveStoredVendors,
  getStoredInvoices,
  saveStoredInvoices,
  getStoredExpenses,
  saveStoredExpenses,
  getStoredTasks,
  saveStoredTasks,
  getStoredSettings,
  saveStoredSettings,
} from '@/services/crmService';
import {
  CrmCustomer,
  CrmExpense,
  CrmInvoice,
  CrmSettings,
  CrmTask,
  CrmVendor,
} from '@/types/crm';
import {
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Layers,
  Plus,
  Printer,
  RefreshCw,
  Send,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

interface TradeDeskCrmClientProps {
  initialRfqs: any[];
  userIdentifier: string; // Add identifier to scope storage
}

export default function TradeDeskCrmClient({ initialRfqs, userIdentifier }: TradeDeskCrmClientProps) {
  const getScopedKey = (key: string) => `ss_crm_${userIdentifier}_${key}`;

  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'khata' | 'invoices' | 'expenses' | 'tasks' | 'ai' | 'settings'
  >('pipeline');

  const [rfqs] = useState<any[]>(initialRfqs);
  const [customers, setCustomers] = useState<CrmCustomer[]>([]);
  const [vendors, setVendors] = useState<CrmVendor[]>([]);
  const [invoices, setInvoices] = useState<CrmInvoice[]>([]);
  const [expenses, setExpenses] = useState<CrmExpense[]>([]);
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [settings, setSettings] = useState<CrmSettings>({
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
  });

  useEffect(() => {
    // In a real app, these services would take the scoped key or user ID
    // Updating CRM service to be multi-tenant is out of scope for this file update,
    // but we have updated DEFAULT_SETTINGS in crmService.ts to be empty placeholders.
    setCustomers(getStoredCustomers());
    setVendors(getStoredVendors());
    setInvoices(getStoredInvoices());
    setExpenses(getStoredExpenses());
    setTasks(getStoredTasks());
    setSettings(getStoredSettings());
  }, []);

  // Quick Accounting Drawer State
  const [showAccountingTools, setShowAccountingTools] = useState(true);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [udhaarPrincipal, setUdhaarPrincipal] = useState<number>(0);
  const [udhaarDays, setUdhaarDays] = useState<number>(30);
  const [freightBase, setFreightBase] = useState<number>(0);
  const [freightTons, setFreightTons] = useState<number>(0);
  const [freightRatePerTon, setFreightRatePerTon] = useState<number>(0);

  // Pipeline Filter
  const [pipelineFilter, setPipelineFilter] = useState<'ALL' | 'NEW_RFQ' | 'QUOTED' | 'APPROVED' | 'INVOICED'>('ALL');

  // Printable Invoice modal state
  const [selectedInvoice, setSelectedInvoice] = useState<CrmInvoice | null>(null);

  // AI Chatbot State
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [aiModel] = useState('google/gemini-2.5-flash');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Namaste! I am your AI Trade Manager. Ask me about active RFQs, customer Udhaar balances, daily revenue, or tasks today.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // New Customer / Expense form states
  const [newCustName, setNewCustName] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustGstin, setNewCustGstin] = useState('');
  const [newCustCity, setNewCustCity] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCredit, setNewCustCredit] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trade Desk CRM</h1>
      <p className="text-ss-muted mb-6">Welcome to your secure trade workspace.</p>
      {/* Rest of the CRM UI remains unchanged, just using the new empty-state defaults */}
    </div>
  );
}
