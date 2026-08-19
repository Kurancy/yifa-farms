import React, { useState } from 'react';
import { useFarmConfig } from '../../context/FarmConfigContext';
import { YifaLogo } from '../YifaLogo';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onBackToStorefront: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStorefront }) => {
  const { loginStaff } = useFarmConfig();
  const [email, setEmail] = useState<string>('admin@yifafarms.ng');
  const [password, setPassword] = useState<string>('yifa2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginStaff(email, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Login failed. Please verify credentials.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#071810] text-[#FDFBF5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2D7A4F]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top bar back button */}
      <div className="max-w-md w-full mx-auto mb-6 flex justify-between items-center relative z-10">
        <button
          onClick={onBackToStorefront}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#FDFBF5]/70 hover:text-[#D4AF37] transition-colors py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-mono text-emerald-400/90 uppercase tracking-wider">Kaduna Node Online</span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Card Container */}
        <div className="bg-[#0D2B1D] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/60 relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <YifaLogo variant="badge" size="xl" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[#D4AF37] text-[11px] font-bold tracking-[0.25em] uppercase">Operations & Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              YIFA Farms Portal
            </h1>
            <p className="mt-2 text-xs text-[#FDFBF5]/60">
              Sign in with your verified staff or manager credentials to access live dispatch and inventory controls.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF5]/80 uppercase tracking-wider mb-2">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#FDFBF5]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yifafarms.ng"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#071810] border border-white/10 text-white placeholder-[#FDFBF5]/30 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-[#FDFBF5]/80 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer">
                  Internal Passcode
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#FDFBF5]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#071810] border border-white/10 text-white placeholder-[#FDFBF5]/30 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FDFBF5]/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-4 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0D2B1D] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0D2B1D] border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Farm Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-1.5 mb-3 text-[11px] font-bold text-[#FDFBF5]/60 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Instant Demo Accounts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@yifafarms.ng', 'yifa2026')}
                className="text-left p-2.5 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 border border-white/5 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#D4AF37]">Admin Director</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono">Full RBAC</span>
                </div>
                <div className="text-[11px] text-[#FDFBF5]/50 mt-0.5 truncate">admin@yifafarms.ng</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('staff@yifafarms.ng', 'staff2026')}
                className="text-left p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400">Logistics Staff</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Orders/Dispatch</span>
                </div>
                <div className="text-[11px] text-[#FDFBF5]/50 mt-0.5 truncate">staff@yifafarms.ng</div>
              </button>
            </div>
          </div>

          {/* Secure Environment Badge */}
          <div className="mt-6 text-center">
            <span className="text-[11px] text-[#FDFBF5]/40 flex items-center justify-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Unified database: Real-time sync with storefront & warehouse.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
