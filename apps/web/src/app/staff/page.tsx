import Navbar from '@/components/layout/Navbar';
import StaffPermissionsClient from '@/components/crm/StaffPermissionsClient';

export const instant = false;

export default function StaffPermissionsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <StaffPermissionsClient />
    </div>
  );
}
