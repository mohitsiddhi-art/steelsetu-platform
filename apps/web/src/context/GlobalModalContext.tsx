'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import ComplaintModal from '@/components/trust/ComplaintModal';

interface GlobalModalContextType {
  openComplaintModal: () => void;
  closeComplaintModal: () => void;
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined);

export function GlobalModalProvider({ children }: { children: ReactNode }) {
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  const openComplaintModal = () => setIsComplaintOpen(true);
  const closeComplaintModal = () => setIsComplaintOpen(false);

  return (
    <GlobalModalContext.Provider value={{ openComplaintModal, closeComplaintModal }}>
      {children}
      <ComplaintModal isOpen={isComplaintOpen} onClose={closeComplaintModal} />
    </GlobalModalContext.Provider>
  );
}

export function useGlobalModal() {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
}
