import React, { useState } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { StaffMember, StaffRole } from '../../types';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  ShieldAlert,
  Key
} from 'lucide-react';

export const AdminStaffPage: React.FC = () => {
  const { staffAccounts, addStaffAccount, updateStaffAccount, deleteStaffAccount, currentStaffUser } = useFarmConfig();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('Logistics & Sales Coordinator');
  const [role, setRole] = useState<StaffRole>('staff');

  const handleOpenAddModal = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setTitle('Logistics & Dispatch Desk');
    setRole('staff');
    setIsAddModalOpen(true);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    addStaffAccount({
      fullName,
      email,
      phone,
      title,
      role,
      status: 'active',
      permissions: {
        canManageOrders: true,
        canUpdateDispatch: true,
        canManageInventory: role === 'admin',
        canViewFinancials: role === 'admin',
        canManageStaff: role === 'admin',
        canExportReports: role === 'admin'
      }
    });

    setIsAddModalOpen(false);
  };

  const handleToggleRole = (staff: StaffMember) => {
    if (staff.id === currentStaffUser?.id) {
      alert('You cannot modify your own primary role while logged in.');
      return;
    }

    const nextRole: StaffRole = staff.role === 'admin' ? 'staff' : 'admin';
    updateStaffAccount(staff.id, {
      role: nextRole,
      permissions: {
        canManageOrders: true,
        canUpdateDispatch: true,
        canManageInventory: nextRole === 'admin',
        canViewFinancials: nextRole === 'admin',
        canManageStaff: nextRole === 'admin',
        canExportReports: nextRole === 'admin'
      }
    });
  };

  const handleToggleStatus = (staff: StaffMember) => {
    if (staff.id === currentStaffUser?.id) {
      alert('You cannot deactivate your own active session.');
      return;
    }
    const nextStatus = staff.status === 'active' ? 'inactive' : 'active';
    updateStaffAccount(staff.id, { status: nextStatus });
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1">
            Access Control & Personnel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Staff & Role-Based Access (RBAC)
          </h1>
          <p className="text-xs text-[#FDFBF5]/60 mt-1">
            Manage authorized staff accounts, dispatch coordinators, and administrative permissions.
          </p>
        </div>

        {currentStaffUser?.role === 'admin' && (
          <button
            onClick={handleOpenAddModal}
            className="py-3 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/15 flex items-center gap-2 active:scale-98 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Account</span>
          </button>
        )}
      </div>

      {/* Staff Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffAccounts.map((staff) => (
          <div
            key={staff.id}
            className="bg-[#0D2B1D] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative group hover:border-[#D4AF37]/40 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    staff.role === 'admin'
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {staff.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{staff.fullName}</h3>
                    <p className="text-xs text-[#D4AF37] font-medium">{staff.title}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  staff.role === 'admin'
                    ? 'bg-[#D4AF37] text-[#0D2B1D]'
                    : 'bg-white/10 text-white'
                }`}>
                  {staff.role}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 py-3 border-y border-white/5 text-xs text-[#FDFBF5]/70">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-mono">{staff.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Last Active: <span className="font-mono text-white">{staff.lastLogin || 'Never'}</span></span>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="py-3">
                <div className="text-[10px] font-bold text-[#FDFBF5]/50 uppercase tracking-widest mb-2">
                  Granted Privileges
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>View & manage customer orders</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Update driver dispatch & delivery</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${staff.role === 'admin' ? 'text-emerald-400' : 'text-[#FDFBF5]/30'}`}>
                    {staff.role === 'admin' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                    <span>Inventory stock & price adjustments</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${staff.role === 'admin' ? 'text-emerald-400' : 'text-[#FDFBF5]/30'}`}>
                    {staff.role === 'admin' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
                    <span>Financial sales reports & staff RBAC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            {currentStaffUser?.role === 'admin' && (
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleRole(staff)}
                  className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Switch to {staff.role === 'admin' ? 'Staff' : 'Admin'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(staff)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      staff.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'
                    }`}
                  >
                    {staff.status === 'active' ? 'Active' : 'Suspended'}
                  </button>

                  {staff.id !== currentStaffUser.id && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete staff account for ${staff.fullName}?`)) {
                          deleteStaffAccount(staff.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#FDFBF5]/40 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Permissions Matrix Reference */}
      <div className="bg-[#0D2B1D] border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Role-Based Access Control (RBAC) Matrix
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#071810]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D2B1D] text-[#FDFBF5]/60 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3 px-4">System Capability</th>
                <th className="py-3 px-4 text-center">Staff Role</th>
                <th className="py-3 px-4 text-center text-[#D4AF37]">Admin Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#FDFBF5]/80">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">View incoming storefront & phone orders</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Update order status & assign dispatch driver</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Send WhatsApp dispatch notification to customer</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Direct warehouse stock & pricing modification</td>
                <td className="py-3 px-4 text-center text-rose-400 font-bold">Restricted</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Executive profit margins & sales reporting</td>
                <td className="py-3 px-4 text-center text-rose-400 font-bold">Restricted</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Manage staff accounts & grant roles</td>
                <td className="py-3 px-4 text-center text-rose-400 font-bold">Restricted</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">Allowed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl text-[#FDFBF5]">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Provision New Staff Account
                </h3>
                <p className="text-xs text-[#D4AF37]">YIFA Farms Operations Access</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-[#FDFBF5]/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Usman Bello"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. usman@yifafarms.ng"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 803 999 8888"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Logistics & Sales Coordinator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF5]/70 mb-1">Access Role (RBAC)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071810] border border-white/10 text-white text-xs font-bold focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="staff">Staff (Orders & Dispatch Fulfillment)</option>
                  <option value="admin">Admin (Full Access: Inventory, Reports, Staff)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-[#FDFBF5]/70 text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
