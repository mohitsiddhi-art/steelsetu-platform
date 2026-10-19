export interface StoredRFQ {
  referenceId: string;
  buyerName: string;
  companyName: string;
  gstNumber: string;
  tons: number;
  productId: string;
  productName?: string;
  pincode: string;
  status: 'PENDING' | 'ALLOCATED' | 'REJECTED';
  timestamp: string;
}

// In-memory trade desk registry
const rfqStore: StoredRFQ[] = [
  {
    referenceId: 'RFQ-INIT-001',
    buyerName: 'Mohit Singhi',
    companyName: 'Singhi Enterprises',
    gstNumber: '08AAAAA1234A1Z1',
    tons: 15.0,
    productId: 'prod-001',
    productName: 'PPGL Profile Sheet (Castle Blue)',
    pincode: '331803',
    status: 'ALLOCATED',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

export function addRfq(item: StoredRFQ): void {
  rfqStore.unshift(item);
}

export function getAllRfqs(): StoredRFQ[] {
  return rfqStore;
}
