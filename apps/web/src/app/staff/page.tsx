import Navbar from '@/components/layout/Navbar';
import StaffPermissionsClient from '@/components/crm/StaffPermissionsClient';
import { requireAdminRole } from '@/services/adminGuard';

export const instant = false;

export default async function StaffPermissionsPage() {
  // Second lock: `/staff` is reachable by either the `admin` or the `staff`
  // role; a visitor with neither (or no session) is redirected to sign in.
  await requireAdminRole(['admin', 'staff']);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <StaffPermissionsClient />
    </div>
  );
}
