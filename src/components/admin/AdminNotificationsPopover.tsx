import React from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import {
  Bell,
  CheckCheck,
  Volume2,
  VolumeX,
  ShoppingBag,
  AlertTriangle,
  Truck,
  ExternalLink,
  X
} from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder?: (orderId: string) => void;
}

export const AdminNotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onSelectOrder
}) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    soundEnabled,
    toggleSound
  } = useFarmConfig();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'status_change':
        return <Truck className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-[#0D2B1D] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#071810]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Farm Alerts</h3>
            <p className="text-[10px] text-[#FDFBF5]/50">
              {unreadNotificationsCount} unread notification{unreadNotificationsCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Order sound alert enabled' : 'Order sound alert muted'}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              soundEnabled ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-[#FDFBF5]/40 hover:bg-white/5'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-xs text-[#FDFBF5]/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-xs text-[#FDFBF5]/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#FDFBF5]/40">
            No farm notifications yet. New orders and stock alerts will appear here in real time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.orderId && onSelectOrder) {
                  onSelectOrder(notif.orderId);
                  onClose();
                }
              }}
              className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 items-start relative ${
                !notif.read ? 'bg-[#D4AF37]/5' : ''
              }`}
            >
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] absolute top-4 right-3"></span>
              )}
              <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 pr-3">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white leading-snug">{notif.title}</h4>
                </div>
                <p className="text-[11px] text-[#FDFBF5]/70 mt-1 leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono text-[#FDFBF5]/40">{notif.timestamp}</span>
                  {notif.orderId && (
                    <span className="text-[10px] font-semibold text-[#D4AF37] hover:underline flex items-center gap-0.5">
                      <span>View {notif.orderId}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#071810] border-t border-white/10 text-center">
        <span className="text-[10px] text-[#FDFBF5]/40">
          Sync active: Automatic stock deductions on every incoming order
        </span>
      </div>
    </div>
  );
};
