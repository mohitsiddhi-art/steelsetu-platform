'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Printer,
  Upload,
  Trash2,
  Building2,
  ShieldCheck,
  ArrowLeft,
  Plus,
  QrCode,
  Calculator,
  CheckCircle,
} from 'lucide-react';
import { formatInr, formatTons } from '@/lib/format';

interface LineItem {
  id: string;
  description: string;
  gradeOrSpec: string;
  hsn: string;
  quantityTons: number;
  ratePerTonInr: number;
}

export default function BillGeneratorPage() {
  // Document Engine State
  const [docType, setDocType] = useState<'TAX_INVOICE' | 'PROFORMA' | 'PURCHASE_ORDER' | 'CHALLAN'>('TAX_INVOICE');
  const [statutoryCopy, setStatutoryCopy] = useState<'ORIGINAL' | 'DUPLICATE' | 'TRIPLICATE'>('ORIGINAL');

  // Company Details (Sender)
  const [companyName, setCompanyName] = useState('Singhi Enterprises');
  const [tagline, setTagline] = useState('Registered Industrial Steel Stockist & Commercial Trade Desk');
  const [address, setAddress] = useState('Maharshi Debendra Road, Burrabazar');
  const [city, setCity] = useState('Kolkata');
  const [pincode, setPincode] = useState('700007');
  const [gstin, setGstin] = useState('19AABCS1428K1ZU');
  const [pan, setPan] = useState('AABCS1428K');
  const [phone, setPhone] = useState('+91 98830 51500');
  const [email, setEmail] = useState('hello@steelsetu.com');
  const [upiId, setUpiId] = useState('singhienterprises@okhdfcbank');

  // Bank Details
  const [bankName, setBankName] = useState('HDFC Bank, Burrabazar Branch');
  const [accountNumber, setAccountNumber] = useState('50200012345678');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');

  // Buyer Details (Recipient)
  const [buyerName, setBuyerName] = useState('M/s. Bengal Infra & Builders Pvt Ltd');
  const [buyerAddress, setBuyerAddress] = useState('EM Bypass Connector, Sector V, Salt Lake');
  const [buyerCity, setBuyerCity] = useState('Kolkata');
  const [buyerGstin, setBuyerGstin] = useState('19BBBBB2222M1Z2');
  const [buyerPhone, setBuyerPhone] = useState('+91 98310 12345');

  // Transport Details
  const [vehicleNo, setVehicleNo] = useState('WB 02 J 8842');
  const [transportorName, setTransportorName] = useState('Maa Tarini Roadways');
  const [destination, setDestination] = useState('Durgapur Project Site');
  const [ewayBillNo, setEwayBillNo] = useState('EWB-260049182394');

  // Line Items
  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'TMT Rebar 12mm (Fe 500D - IS 1786)',
      gradeOrSpec: 'IS 1786 Fe 500D',
      hsn: '7214',
      quantityTons: 15,
      ratePerTonInr: 54200,
    },
    {
      id: '2',
      description: 'PPGL Roofing Sheet 0.50mm AZ150',
      gradeOrSpec: 'AZ150 Grade',
      hsn: '7210',
      quantityTons: 8,
      ratePerTonInr: 78500,
    },
  ]);

  // Additional Charges & Taxes
  const [freightAmount, setFreightAmount] = useState<number>(12500);
  const [loadingAmount, setLoadingAmount] = useState<number>(4500);
  const [applyTcs, setApplyTcs] = useState<boolean>(true);

  // Logo & Seal State (Base64)
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sealUrl, setSealUrl] = useState<string | null>(null);

  // Invoice Date
  const [invoiceDate, setInvoiceDate] = useState('2026-11-04');

  useEffect(() => {
    setInvoiceDate(new Date().toISOString().split('T')[0]);
  }, []);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const sealInputRef = useRef<HTMLInputElement>(null);

  // Handle Logo Upload via FileReader
  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setLogoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Handle Seal Upload via FileReader
  function handleSealUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSealUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Add Item
  function handleAddItem() {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        description: 'MS Angle 50x50x6mm',
        gradeOrSpec: 'IS 2062',
        hsn: '7308',
        quantityTons: 5,
        ratePerTonInr: 54800,
      },
    ]);
  }

  function handleRemoveItem(id: string) {
    setItems(items.filter((i) => i.id !== id));
  }

  function handleItemChange(id: string, field: keyof LineItem, val: any) {
    setItems(
      items.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    );
  }

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.quantityTons * item.ratePerTonInr, 0);
  const taxableTotal = subtotal + freightAmount + loadingAmount;
  const gstAmount = docType === 'CHALLAN' ? 0 : Math.round(taxableTotal * 0.18);
  const tcsAmount = applyTcs && docType !== 'CHALLAN' ? Math.round((taxableTotal + gstAmount) * 0.001) : 0;
  const grandTotal = taxableTotal + gstAmount + tcsAmount;

  // UPI QR URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(companyName)}&am=${grandTotal}&cu=INR`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col ss-industrial-grid">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/trade-desk"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Trade Desk
            </Link>
            <span className="text-slate-700">|</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-xs font-mono text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Steelsetu 4-in-1 Document Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Document Engine & Statutory Copy Selectors */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-ss-orange" /> Document Type &amp; Statutory Copy Configuration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch instantly between Tax Invoice, Proforma, Purchase Order, and Delivery Challan with statutory copies.
              </p>
            </div>

            {/* Statutory Copy Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Statutory Copy:</span>
              <select
                value={statutoryCopy}
                onChange={(e) => setStatutoryCopy(e.target.value as any)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-bold"
              >
                <option value="ORIGINAL">Original for Recipient (Buyer)</option>
                <option value="DUPLICATE">Duplicate for Transporter (Driver)</option>
                <option value="TRIPLICATE">Triplicate for Supplier (Accounts)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { id: 'TAX_INVOICE', label: 'Tax Invoice (GST)', desc: 'Standard Goods & Tax cum Challan' },
              { id: 'PROFORMA', label: 'Proforma Invoice (P.I.)', desc: 'Advance Booking & Rate Lock' },
              { id: 'PURCHASE_ORDER', label: 'Purchase Order (P.O.)', desc: 'Outgoing Mill / Stockist Order' },
              { id: 'CHALLAN', label: 'Delivery Challan', desc: 'Yard Despatch & Weighbridge' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setDocType(t.id as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  docType === t.id
                    ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{t.label}</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Panel (Collapsible / Inputs) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1: Company Details & Logo Uploader */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" /> 1. Company Details &amp; Logo
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">PAN</label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Address &amp; City</label>
                <input
                  type="text"
                  value={`${address}, ${city} - ${pincode}`}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">UPI ID (For Dynamic QR)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  placeholder="e.g. singhienterprises@okhdfcbank"
                />
              </div>

              {/* Company Logo Uploader */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="text-slate-400 block font-medium">Company Logo (PNG/JPG)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Company Logo
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl(null)}
                      className="p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-400 hover:bg-rose-900"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Buyer & Transport Details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> 2. Buyer &amp; Transport Info
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Buyer Company Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Buyer GSTIN</label>
                <input
                  type="text"
                  value={buyerGstin}
                  onChange={(e) => setBuyerGstin(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Buyer Address</label>
                <input
                  type="text"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Vehicle No.</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">E-Way Bill No.</label>
                  <input
                    type="text"
                    value={ewayBillNo}
                    onChange={(e) => setEwayBillNo(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Line Items & TCS Option */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-ss-orange" /> 3. Charges &amp; TCS Options
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Freight Charges (₹)</label>
                  <input
                    type="number"
                    value={freightAmount}
                    onChange={(e) => setFreightAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Loading Charges (₹)</label>
                  <input
                    type="number"
                    value={loadingAmount}
                    onChange={(e) => setLoadingAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* TCS Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyTcs}
                    onChange={(e) => setApplyTcs(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 w-4 h-4"
                  />
                  <span className="text-slate-200 font-medium">
                    Apply TCS u/s 206C(1H) @ 0.1% on Total Value (&gt; ₹50 Lakhs)
                  </span>
                </label>
              </div>

              {/* Seal Uploader */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="text-slate-400 block font-medium">Authorized Signatory Seal/Stamp</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={sealInputRef}
                    onChange={handleSealUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => sealInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Seal / Stamp
                  </button>
                  {sealUrl && (
                    <button
                      type="button"
                      onClick={() => setSealUrl(null)}
                      className="p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-400"
                      title="Remove Seal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Line Items Table Edits */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">4. Line Items &amp; Steel Specifications</h3>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 items-center">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    placeholder="Product Description"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={item.hsn}
                    onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono"
                    placeholder="HSN Code"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    value={item.quantityTons}
                    onChange={(e) => handleItemChange(item.id, 'quantityTons', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono"
                    placeholder="Tons (MT)"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    value={item.ratePerTonInr}
                    onChange={(e) => handleItemChange(item.id, 'ratePerTonInr', Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono"
                    placeholder="Rate / MT"
                  />
                </div>
                <div className="sm:col-span-1 text-right">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-400 hover:bg-rose-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRINTABLE INVOICE SHEET */}
        <div id="invoice-sheet" className="rounded-2xl border border-slate-700 bg-white text-slate-900 p-8 space-y-6 shadow-2xl max-w-4xl mx-auto print:shadow-none print:p-0 print:border-none">
          {/* Header Row with Logo & Statutory Copy Badge */}
          <div className="flex justify-between items-start border-b border-slate-300 pb-6">
            <div className="flex items-start gap-4">
              {logoUrl ? (
                <img src={logoUrl} alt="Company Logo" className="h-16 w-auto object-contain max-w-[120px]" />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {companyName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{companyName}</h1>
                <p className="text-xs text-slate-600 mt-0.5">{tagline}</p>
                <p className="text-xs text-slate-600">{address}, {city} - {pincode}</p>
                <p className="text-xs text-slate-600 font-mono mt-1">GSTIN: {gstin} | PAN: {pan}</p>
              </div>
            </div>

            <div className="text-right font-mono space-y-1">
              <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                {docType.replace('_', ' ')}
              </span>
              <p className="text-xs font-bold text-rose-600 mt-1 uppercase tracking-wider border border-rose-300 bg-rose-50 px-2 py-0.5 rounded">
                [{statutoryCopy}]
              </p>
              <p className="text-xs text-slate-500 font-sans mt-1">Date: {invoiceDate}</p>
              <p className="text-xs text-slate-500 font-sans">Invoice #: SS/26-27/894</p>
            </div>
          </div>

          {/* Buyer & Transport Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-500 uppercase text-[10px]">Billed To (Buyer):</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{buyerName}</p>
              <p className="text-slate-700">{buyerAddress}</p>
              <p className="font-mono text-slate-600 mt-1">GSTIN: {buyerGstin}</p>
            </div>
            <div className="space-y-1 font-mono">
              <p className="font-bold text-slate-500 uppercase text-[10px] font-sans">Transport &amp; Despatch:</p>
              <p className="text-slate-800">Vehicle No: <span className="font-bold text-slate-900">{vehicleNo}</span></p>
              <p className="text-slate-800">Transporter: {transportorName}</p>
              <p className="text-slate-800">Destination: {destination}</p>
              <p className="text-slate-800">E-Way Bill: {ewayBillNo}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3">Description of Goods</th>
                <th className="p-3">HSN</th>
                <th className="p-3 text-right">Qty (MT)</th>
                <th className="p-3 text-right">Rate / MT</th>
                <th className="p-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{item.description}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{item.gradeOrSpec}</p>
                  </td>
                  <td className="p-3 text-slate-600 font-mono">{item.hsn}</td>
                  <td className="p-3 text-right font-mono">{formatTons(item.quantityTons)} MT</td>
                  <td className="p-3 text-right font-mono">{formatInr(item.ratePerTonInr)}</td>
                  <td className="p-3 text-right font-mono font-semibold">{formatInr(item.quantityTons * item.ratePerTonInr)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & UPI QR Code Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-center border-t border-slate-300">
            {/* Scan to Pay UPI QR Code */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <img src={qrCodeImageUrl} alt="UPI QR Code" className="w-28 h-28 object-contain rounded-lg border border-slate-300 bg-white p-1" />
              <div className="space-y-1 text-xs">
                <div className="inline-flex items-center gap-1 font-bold text-slate-900">
                  <QrCode className="w-4 h-4 text-blue-600" /> Scan &amp; Pay via UPI
                </div>
                <p className="text-slate-600">GPay / PhonePe / Paytm / BHIM</p>
                <p className="font-mono text-blue-600 font-bold">{upiId}</p>
                <p className="text-[10px] text-slate-500">Amount auto-embedded for instant settlement</p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Subtotal Goods:</span>
                <span className="font-semibold">{formatInr(subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Freight &amp; Transport:</span>
                <span>{formatInr(freightAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Loading &amp; Handling:</span>
                <span>{formatInr(loadingAmount)}</span>
              </div>
              {docType !== 'CHALLAN' && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">GST (18%):</span>
                    <span>{formatInr(gstAmount)}</span>
                  </div>
                  {applyTcs && (
                    <div className="flex justify-between py-1 border-b border-slate-200 text-purple-700">
                      <span>TCS u/s 206C(1H) @ 0.1%:</span>
                      <span>{formatInr(tcsAmount)}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-t-2 border-slate-900">
                <span>Grand Total:</span>
                <span>{formatInr(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Bank Details & Authorized Signatory Seal */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-300 text-xs">
            <div>
              <p className="font-bold text-slate-900 uppercase">Bank Details for RTGS / NEFT:</p>
              <p className="text-slate-700 mt-1">Bank: {bankName}</p>
              <p className="font-mono text-slate-800">A/C No: {accountNumber}</p>
              <p className="font-mono text-slate-800">IFSC: {ifscCode}</p>
            </div>
            <div className="text-right flex flex-col items-end justify-between">
              <div>
                <p className="font-bold text-slate-900">For {companyName}</p>
              </div>
              <div className="my-2">
                {sealUrl ? (
                  <img src={sealUrl} alt="Authorized Seal" className="h-16 w-auto object-contain ml-auto opacity-90" />
                ) : (
                  <div className="h-16 w-32 border border-dashed border-slate-400 rounded-lg flex items-center justify-center text-[10px] text-slate-400 ml-auto font-sans">
                    [ Authorised Seal &amp; Stamp ]
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-sans">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
