'use client';

import { useState, useEffect } from 'react';
import { getStoredStaff, saveStoredStaff } from '@/services/crmService';
import { StaffMember } from '@/types/crm';
import { Shield, UserPlus, Check, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StaffPermissionsClient() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'OWNER' | 'MANAGER'>('MANAGER');

  useEffect(() => {
    setStaffList(getStoredStaff());
  }, []);

  function handleTogglePermission(staffId: string, permKey: keyof StaffMember['permissions']) {
    const updated = staffList.map((s) => {
      if (s.id === staffId) {
        return {
          ...s,
          permissions: {
            ...s.permissions,
            [permKey]: !s.permissions[permKey],
          },
        };
      }
      return s;
    });
    setStaffList(updated);
    saveStoredStaff(updated);
  }

  function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      permissions: {
        canViewRfqs: true,
        canEditRfqs: newStaffRole === 'OWNER',
        canCreateInvoices: true,
        canEditRates: newStaffRole === 'OWNER',
        canDeleteRecords: newStaffRole === 'OWNER',
        canManageClaims: true,
      },
      lastActive: 'Just now',
    };

    const updated = [...staffList, newStaff];
    setStaffList(updated);
    saveStoredStaff(updated);
    setNewStaffName('');
    setNewStaffEmail('');
  }

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/trade-desk"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Trade Desk CRM
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" /> Owner vs Manager Permissions Matrix
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure granular staff access rights across Singhi Enterprises trade desk operations.
          </p>
        </div>
      </div>

      {/* Staff Table / Matrix */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 border-b border-slate-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4">Staff Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">View RFQs</th>
              <th className="px-6 py-4 text-center">Edit RFQs</th>
              <th className="px-6 py-4 text-center">Create Invoices</th>
              <th className="px-6 py-4 text-center">Edit Rates</th>
              <th className="px-6 py-4 text-center">Delete Records</th>
              <th className="px-6 py-4 text-center">Manage Claims</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-800/40">
                <td className="px-6 py-4 font-sans">
                  <div className="font-bold text-white text-sm">{staff.name}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{staff.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                      staff.role === 'OWNER'
                        ? 'bg-purple-950 border border-purple-800 text-purple-400'
                        : 'bg-blue-950 border border-blue-800 text-blue-400'
                    }`}
                  >
                    {staff.role}
                  </span>
                </td>
                {(
                  [
                    'canViewRfqs',
                    'canEditRfqs',
                    'canCreateInvoices',
                    'canEditRates',
                    'canDeleteRecords',
                    'canManageClaims',
                  ] as Array<keyof StaffMember['permissions']>
                ).map((permKey) => (
                  <td key={permKey} className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleTogglePermission(staff.id, permKey)}
                      className={`h-6 w-6 rounded-lg inline-flex items-center justify-center transition-colors ${
                        staff.permissions[permKey]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {staff.permissions[permKey] ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 max-w-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-400" /> Add New Staff Member
        </h2>
        <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Amit Kumar"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="manager@steelsetu.com"
              value={newStaffEmail}
              onChange={(e) => setNewStaffEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Role Assignment</label>
            <select
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value as any)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            >
              <option value="MANAGER">Manager (Trade Desk Staff)</option>
              <option value="OWNER">Owner (Full Admin Access)</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Add Staff Member & Apply Permissions
          </button>
        </form>
      </div>
    </main>
  );
}
