'use client';

import { useState } from 'react';
import { SteelProduct } from '@/types/steel';
import RfqModal from '@/components/common/RfqModal';
import { FileText } from 'lucide-react';

interface ProductDetailRfqProps {
  product: SteelProduct;
}

/** Sidebar action on the product detail page — opens the RFQ form. */
export default function ProductDetailRfq({ product }: ProductDetailRfqProps) {
  const [open, setOpen] = useState(false);

  const outOfStock = product.inventoryTons <= 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={outOfStock}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
      >
        {outOfStock ? 'Currently Unavailable' : 'Request Quotation'}
      </button>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <FileText className="h-3 w-3" />
        No advance payment · Credit terms available
      </div>

      <RfqModal product={open ? product : null} onClose={() => setOpen(false)} />
    </>
  );
}
