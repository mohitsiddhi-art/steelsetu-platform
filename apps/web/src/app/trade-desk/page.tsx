import Navbar from '@/components/layout/Navbar';
import TradeDeskCrmClient from '@/components/crm/TradeDeskCrmClient';
import { getAllRfqs } from '@/services/rfqService';

export const instant = false;

export default async function TradeDeskPage() {
  let initialRfqs: any[] = [];
  try {
    initialRfqs = await getAllRfqs();
  } catch (err) {
    console.error('Failed to load RFQs in TradeDesk server component:', err);
    initialRfqs = [];
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <TradeDeskCrmClient initialRfqs={initialRfqs} />
    </div>
  );
}
