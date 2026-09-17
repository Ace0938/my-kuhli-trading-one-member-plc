import React, { useState } from 'react';
import { X, Lock, Mail, Building, Globe, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { apiClient } from '../lib/apiClient.js';
import { useToast } from './Toast.js';
import { User, BuyerProfile, Role } from '../types/index.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, buyerProfile: BuyerProfile | null) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('buyer@nordicroasters.com');
  const [loginPassword, setLoginPassword] = useState('MyKuhli@2026');

  // Registration form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('Specialty Coffee Roaster');
  const [country, setCountry] = useState('Germany');
  const [city, setCity] = useState('Hamburg');
  const [destinationPort, setDestinationPort] = useState('Port of Hamburg');
  const [annualVolumeMT, setAnnualVolumeMT] = useState('40');
  const [taxId, setTaxId] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiClient.login(loginEmail, loginPassword);
      toast('Login Successful', `Welcome back, ${res.user.fullName}!`, 'success');
      onAuthSuccess(res.user, res.buyerProfile);
      onClose();
    } catch (err: any) {
      toast('Login Failed', err.message || 'Check email or password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiClient.register({
        fullName,
        email,
        password,
        phone,
        companyName,
        businessType,
        country,
        city,
        destinationPort,
        annualCoffeeVolumeMT: Number(annualVolumeMT) || 20,
        taxRegistrationNumber: taxId
      });
      toast('Account Registered', `Welcome to MY KUHLI, ${res.user.fullName}!`, 'success');
      onAuthSuccess(res.user, res.buyerProfile);
      onClose();
    } catch (err: any) {
      toast('Registration Failed', err.message || 'Could not create account', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: Role) => {
    setIsLoading(true);
    try {
      const res = await apiClient.switchRole(role);
      toast('Persona Switched', `Logged in as ${res.user.fullName} (${res.user.role})`, 'info');
      onAuthSuccess(res.user, res.buyerProfile);
      onClose();
    } catch (err: any) {
      toast('Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#120F0C] border border-[#2B231A] text-[#EDE8E1] rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C8275] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-[#241D15] mb-6">
          <button
            onClick={() => setMode('login')}
            className={`pb-3 text-sm font-semibold tracking-wider transition-colors relative flex-1 text-center ${
              mode === 'login' ? 'text-[#C88A3B]' : 'text-[#8C8275] hover:text-[#EDE8E1]'
            }`}
          >
            Buyer & Staff Sign In
            {mode === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A3B]"></div>}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`pb-3 text-sm font-semibold tracking-wider transition-colors relative flex-1 text-center ${
              mode === 'register' ? 'text-[#C88A3B]' : 'text-[#8C8275] hover:text-[#EDE8E1]'
            }`}
          >
            New Buyer Registration
            {mode === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C88A3B]"></div>}
          </button>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mb-6 p-3 bg-[#1A1510] border border-[#332A20] rounded-lg">
          <div className="text-[10px] uppercase font-bold text-[#C88A3B] tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Instant Demo Accounts (One-Click Testing)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SUPER_ADMIN')}
              className="px-2.5 py-1.5 rounded bg-[#241D15] hover:bg-[#332A20] text-left text-xs border border-[#3D3224] transition-colors"
            >
              <div className="font-semibold text-white">Super Admin</div>
              <div className="text-[10px] text-[#A69C8E]">admin@mykuhli.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SALES_MANAGER')}
              className="px-2.5 py-1.5 rounded bg-[#241D15] hover:bg-[#332A20] text-left text-xs border border-[#3D3224] transition-colors"
            >
              <div className="font-semibold text-white">Sales & RFQ Mgr</div>
              <div className="text-[10px] text-[#A69C8E]">sales@mykuhli.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('EXPORT_MANAGER')}
              className="px-2.5 py-1.5 rounded bg-[#241D15] hover:bg-[#332A20] text-left text-xs border border-[#3D3224] transition-colors"
            >
              <div className="font-semibold text-white">Export & Logistics</div>
              <div className="text-[10px] text-[#A69C8E]">export@mykuhli.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('BUYER')}
              className="px-2.5 py-1.5 rounded bg-[#241D15] hover:bg-[#332A20] text-left text-xs border border-[#3D3224] transition-colors"
            >
              <div className="font-semibold text-white">Nordic Buyer</div>
              <div className="text-[10px] text-[#A69C8E]">buyer@nordicroasters.com</div>
            </button>
          </div>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D8CFBF]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C8275] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="yourname@company.com"
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg pl-9 pr-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D8CFBF]">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C8275] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg pl-9 pr-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lars Lindqvist"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nordic Roasters"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Corporate Email</label>
                <input
                  type="email"
                  placeholder="buyer@nordicroasters.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Create Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Country</label>
                <input
                  type="text"
                  placeholder="e.g. Denmark, USA, Japan"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Destination Discharge Port</label>
                <input
                  type="text"
                  placeholder="e.g. Port of Aarhus"
                  value={destinationPort}
                  onChange={e => setDestinationPort(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Business Type</label>
                <select
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                >
                  <option value="Specialty Coffee Roaster">Specialty Coffee Roaster</option>
                  <option value="Green Coffee Importer">Green Coffee Importer</option>
                  <option value="B2B Wholesale Distributor">B2B Wholesale Distributor</option>
                  <option value="Commercial Coffee Roaster">Commercial Coffee Roaster</option>
                  <option value="Specialty Cafe Chain">Specialty Cafe Chain</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D8CFBF]">Annual Green Volume (MT)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={annualVolumeMT}
                  onChange={e => setAnnualVolumeMT(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-3"
            >
              {isLoading ? 'Creating Account...' : 'Register Buyer Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
