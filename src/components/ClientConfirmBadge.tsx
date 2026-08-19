import React from 'react';
import { useFarmConfig } from '../context/FarmConfigContext';
import { Edit3 } from 'lucide-react';

interface Props {
  label?: string;
  fieldKey?: string;
  className?: string;
}

export const ClientConfirmBadge: React.FC<Props> = ({
  label = 'CLIENT TO CONFIRM',
  className = ''
}) => {
  const { config, setIsConfigModalOpen } = useFarmConfig();

  if (!config.showClientBadges) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setIsConfigModalOpen(true);
      }}
      title="Click to edit or confirm this client asset"
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors shadow-xs cursor-pointer ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      <span>[{label}]</span>
      <Edit3 className="w-2.5 h-2.5 opacity-70" />
    </button>
  );
};
