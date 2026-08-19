import React, { useState, useMemo } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { ActivityLog } from '../../types';
import {
  History,
  Search,
  Filter,
  User,
  Clock,
  ShieldCheck,
  Package,
  ShoppingBag,
  Truck,
  RotateCcw,
  Send,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';

export const AdminActivityLogPage: React.FC = () => {
  const { activityLogs, clearActivityLogs, currentStaffUser } = useFarmConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        log.details.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        (log.targetId && log.targetId.toLowerCase().includes(q));

      const matchesAction = selectedActionFilter === 'all' || log.actionType === selectedActionFilter;

      return matchesSearch && matchesAction;
    });
  }, [activityLogs, searchQuery, selectedActionFilter]);

  const handleExportLogsCSV = () => {
    const headers = ['Timestamp', 'Staff Name', 'Role', 'Action Type', 'Target ID', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.actionType}"`,
      `"${l.targetId || ''}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YIFA_Farms_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: ActivityLog['actionType']) => {
    switch (action) {
      case 'order_create':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Order Created</span>;
      case 'order_status':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Status Update</span>;
      case 'inventory_update':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Inventory Log</span>;
      case 'supplier_po':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Supplier PO</span>;
      case 'notification_sent':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">Dispatch Ping</span>;
      case 'customer_update':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">Customer & Loyalty</span>;
      case 'bulk_action':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Bulk Action</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/10">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">
              Security & Audit Integrity
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono">
              {activityLogs.length} Events
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            System Activity Audit Trail
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
            Immutable log tracking all order modifications, inventory deductions, restock receipts, and staff actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportLogsCSV}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Audit Log</span>
          </button>

          {currentStaffUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear activity logs? Note: this will reset the local audit trail.')) {
                  clearActivityLogs();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#FDFBF5]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by staff name, order ID, product, or keyword..."
              className="w-full bg-[#071810] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-[#FDFBF5]/40 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Action Types</option>
              <option value="order_create">Order Created</option>
              <option value="order_status">Status Updated</option>
              <option value="inventory_update">Inventory Stock Adjustments</option>
              <option value="supplier_po">Supplier Purchase Orders</option>
              <option value="notification_sent">Dispatches & Alerts Sent</option>
              <option value="customer_update">Customer & Loyalty Modifications</option>
              <option value="bulk_action">Bulk Actions Executed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-[#0D2B1D] rounded-3xl border border-white/10 shadow-2xl p-6 space-y-4">
        <div className="divide-y divide-white/5">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-[#FDFBF5]/60 text-xs">
              No audit records found matching criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-xl px-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getActionBadge(log.actionType)}
                    <span className="text-xs font-bold text-white">{log.details}</span>
                    {log.targetId && (
                      <span className="text-[10px] font-mono bg-white/10 text-[#D4AF37] px-2 py-0.5 rounded">
                        #{log.targetId}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#FDFBF5]/60 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#D4AF37]" />
                      <span>{log.actorName} ({log.actorRole})</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#FDFBF5]/50 font-mono whitespace-nowrap flex items-center gap-1 sm:self-center">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
