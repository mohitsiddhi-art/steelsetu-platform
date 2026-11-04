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
  resetDemoCrmData,
} from '@/services/crmService';
import {
  CrmCustomer,
  CrmExpense,
  CrmInvoice,
  CrmSettings,
  CrmTask,
  CrmVendor,
} from '@/types/crm';
import { formatInr, formatTons } from '@/lib/format';
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
}

export default function TradeDeskCrmClient({ initialRfqs }: TradeDeskCrmClientProps) {
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
    setCustomers(getStoredCustomers());
    setVendors(getStoredVendors());
    setInvoices(getStoredInvoices());
    setExpenses(getStoredExpenses());
    setTasks(getStoredTasks());
    setSettings(getStoredSettings());
  }, []);

  // Quick Accounting Drawer State
  const [showAccountingTools, setShowAccountingTools] = useState(true);
  const [gstAmount, setGstAmount] = useState<number>(100000);
  const [udhaarPrincipal, setUdhaarPrincipal] = useState<number>(200000);
  const [udhaarDays, setUdhaarDays] = useState<number>(30);
  const [freightBase, setFreightBase] = useState<number>(55000);
  const [freightTons, setFreightTons] = useState<number>(25);
  const [freightRatePerTon, setFreightRatePerTon] = useState<number>(1400);

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
  const [newCustCredit] = useState(500000);
