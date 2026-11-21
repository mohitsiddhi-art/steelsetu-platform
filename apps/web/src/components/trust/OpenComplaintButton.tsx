'use client';

import { type ReactNode } from 'react';
import { useGlobalModal } from '@/context/GlobalModalContext';

export default function OpenComplaintButton({ children }: { children: ReactNode }) {
  const { openComplaintModal } = useGlobalModal();

  return (
    <button
      type="button"
      onClick={openComplaintModal}
      className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white transition-colors"
    >
      {children}
    </button>
  );
}
