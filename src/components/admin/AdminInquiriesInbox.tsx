import React, { useState, useMemo } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { useToast } from '../../context/ToastContext';
import { CustomerInquiry } from '../../types';
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ExternalLink,
  Trash2,
  Send,
  Sparkles,
  User,
  X,
  FileText,
  Tag,
  ShieldCheck
} from 'lucide-react';

export const AdminInquiriesInbox: React.FC = () => {
  const {
    inquiries,
    unreadInquiriesCount,
    updateInquiryStatus,
    deleteInquiry
  } = useFarmConfig();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeInquiry, setActiveInquiry] = useState<CustomerInquiry | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inq.fullName.toLowerCase().includes(q) ||
        inq.phone.includes(q) ||
        (inq.email && inq.email.toLowerCase().includes(q)) ||
        inq.subject.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q) ||
        (inq.location && inq.location.toLowerCase().includes(q));

      const matchesChannel = selectedChannel === 'all' || inq.channel === selectedChannel;
      const matchesStatus = selectedStatus === 'all' || inq.status === selectedStatus;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [inquiries, searchQuery, selectedChannel, selectedStatus]);

  const handleOpenDetail = (inq: CustomerInquiry) => {
    setActiveInquiry(inq);
    setReplyText(inq.replyNotes || '');
    if (inq.status === 'new') {
      updateInquiryStatus(inq.id, 'in_progress');
    }
  };

  const handleSaveReply = (status: CustomerInquiry['status'] = 'replied') => {
    if (!activeInquiry) return;
    try {
      updateInquiryStatus(activeInquiry.id, status, replyText);
      toast.success(`Inquiry marked as ${status === 'replied' ? 'Replied' : status}.`, 'Inbox Updated');
      setActiveInquiry(null);
    } catch {
      toast.error('Failed to update inquiry status.', 'Error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const proceed = await toast.confirmAction({
      title: 'Delete Customer Inquiry',
      message: `Permanently delete inquiry message from ${name}?`,
      confirmText: 'Delete Message',
      cancelText: 'Keep',
      type: 'danger'
    });

    if (proceed) {
      try {
        deleteInquiry(id);
        toast.success(`Inquiry from ${name} deleted.`, 'Message Deleted');
        if (activeInquiry?.id === id) setActiveInquiry(null);
      } catch {
        toast.error('Failed to delete inquiry.', 'Error');
      }
    }
  };

  const getChannelBadge = (channel: CustomerInquiry['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </span>
        );
      case 'quote_request':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Quote Engine
          </span>
        );
      case 'track_order_support':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Order Support
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Contact Form
          </span>
        );
    }
  };

  const getStatusBadge = (status: CustomerInquiry['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            ● New Message
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            In Progress
          </span>
        );
      case 'replied':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Replied / Handled
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-[#FDFBF5]/60 border border-white/10">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2B1D] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">
              Storefront Inquiries & Despatch Comms
            </span>
            {unreadInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-xs font-mono font-bold border border-rose-500/40">
                {unreadInquiriesCount} New Unread
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Customer Inquiries & Messages
          </h1>
          <p className="text-xs text-[#FDFBF5]/70 mt-0.5">
            Single unified inbox receiving contact forms, WhatsApp order requests, quote submissions, and dispatch support tickets.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-[#071810] px-4 py-2.5 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-[#FDFBF5]/50 uppercase font-mono">Total Messages</div>
            <div className="text-sm sm:text-base font-black font-mono text-white">
              {inquiries.length}
            </div>
          </div>

          <div className="bg-[#071810] px-4 py-2.5 rounded-2xl border border-white/10 text-right">
            <div className="text-[10px] text-[#FDFBF5]/50 uppercase font-mono">Pending Action</div>
            <div
              className={`text-sm sm:text-base font-black font-mono ${
                unreadInquiriesCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {unreadInquiriesCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D2B1D] p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#FDFBF5]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender name, phone, keywords, or location..."
              className="w-full bg-[#071810] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-[#FDFBF5]/40 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Channel Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="contact_form">Website Contact Form</option>
              <option value="whatsapp">WhatsApp Inquiries</option>
              <option value="quote_request">Quote Engine Leads</option>
              <option value="track_order_support">Track Order Support</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#071810] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">● New (Unread)</option>
              <option value="in_progress">In Progress</option>
              <option value="replied">Replied / Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-[#0D2B1D] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {filteredInquiries.length === 0 ? (
            <div className="py-16 text-center text-[#FDFBF5]/60 space-y-3">
              <MessageSquare className="w-8 h-8 text-[#D4AF37] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-white">No inquiries found matching criteria.</p>
              <p className="text-xs text-[#FDFBF5]/50">Submissions from the public storefront appear here instantly.</p>
            </div>
          ) : (
            filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => handleOpenDetail(inq)}
                className={`p-5 hover:bg-white/[0.03] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  inq.status === 'new' ? 'bg-[#D4AF37]/[0.04] border-l-4 border-l-[#D4AF37]' : ''
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm hover:text-[#D4AF37] transition-colors">
                      {inq.fullName}
                    </span>
                    {getChannelBadge(inq.channel)}
                    {getStatusBadge(inq.status)}
                    {inq.location && (
                      <span className="text-[11px] text-[#FDFBF5]/50 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        {inq.location}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-[#D4AF37] line-clamp-1">
                    {inq.subject}
                  </div>

                  <p className="text-xs text-[#FDFBF5]/70 line-clamp-2 leading-relaxed">
                    {inq.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#FDFBF5]/40 pt-1">
                    <span>ID: #{inq.id}</span>
                    <span>•</span>
                    <span>{inq.phone}</span>
                    {inq.email && (
                      <>
                        <span>•</span>
                        <span>{inq.email}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{new Date(inq.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetail(inq);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0D2B1D] text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    View & Reply
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(inq.id, inq.fullName);
                    }}
                    className="p-1.5 text-[#FDFBF5]/30 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Inquiry Detail & Reply Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#0D2B1D] border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#071810] px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Inquiry #{activeInquiry.id}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getChannelBadge(activeInquiry.channel)}
                    {getStatusBadge(activeInquiry.status)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveInquiry(null)}
                className="p-2 rounded-xl text-[#FDFBF5]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Sender Profile Box */}
              <div className="bg-[#071810] p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">{activeInquiry.fullName}</div>
                    <div className="text-xs text-[#FDFBF5]/60 mt-0.5">
                      {activeInquiry.location || 'Kaduna State'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeInquiry.phone.replace(/\s+/g, '')}`}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/${activeInquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${activeInquiry.fullName}, this is Abubakar Ibrahim from YIFA Farms Kaduna regarding your inquiry "${activeInquiry.subject}".`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA58] text-[#0D2B1D] font-black flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/5 text-[#FDFBF5]/70">
                  <div>
                    <span className="text-[#FDFBF5]/40">Phone:</span> {activeInquiry.phone}
                  </div>
                  <div>
                    <span className="text-[#FDFBF5]/40">Email:</span> {activeInquiry.email || 'None provided'}
                  </div>
                </div>
              </div>

              {/* Message Subject & Body */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Subject / Request:
                </label>
                <div className="p-3.5 rounded-2xl bg-[#071810] border border-white/10 text-white font-semibold text-sm">
                  {activeInquiry.subject}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Message Content:
                </label>
                <div className="p-4 rounded-2xl bg-[#071810] border border-white/10 text-[#FDFBF5]/90 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message}
                </div>
              </div>

              {/* Internal Reply & Resolution Notes */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Sales Desk Reply / Resolution Notes:
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Record outcome of WhatsApp/phone conversation, dispatched price quote, or next action steps..."
                  className="w-full bg-[#071810] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#071810] px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDelete(activeInquiry.id, activeInquiry.fullName)}
                className="px-3.5 py-2 rounded-xl text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
              >
                Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveReply('in_progress')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Save Notes (In Progress)
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveReply('replied')}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Resolved & Replied</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
