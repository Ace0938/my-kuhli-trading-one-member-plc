import React, { useState } from 'react';
import {
  Coffee,
  Globe,
  Bell,
  User as UserIcon,
  Shield,
  FileText,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { User, Role, Notification } from '../types/index.js';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onRoleSwitch: (role: Role) => void;
  onOpenRFQ: (productId?: string) => void;
  notifications: Notification[];
}

export function Navbar({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onRoleSwitch,
  onOpenRFQ,
  notifications
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isAdminOrStaff = currentUser && ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'EXPORT_MANAGER', 'QUALITY_MANAGER', 'ACCOUNTANT'].includes(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-[#0E0C09]/95 backdrop-blur-md border-b border-[#262018] text-[#EDE8E1]">
      {/* Top micro-bar: Origin status & Role switch bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 text-[11px] font-medium tracking-wider bg-[#080705] border-b border-[#1C1712] text-[#A69C8E]">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-[#C88A3B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C88A3B] animate-pulse"></span>
            2026 HARVEST EXPORT WINDOW OPEN
          </span>
          <span>Addis Ababa (ECTA HQ): 11:15 AM EAT</span>
          <span>Port of Djibouti Transit: Normal (48h Rail Turnaround)</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10.5px]">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            FIREBASE BACKEND ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Interactive Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1C1712] hover:bg-[#282119] border border-[#332A20] text-[#D8CFBF] transition-colors"
              title="Quickly switch personas to experience all workflows"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#C88A3B]" />
              <span>Persona: <strong className="text-[#C88A3B]">{currentUser?.role || 'Guest'}</strong></span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-[#14110D] border border-[#332A20] rounded-md shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#8C8275] border-b border-[#241D15] mb-1">
                  Switch User Role Demo
                </div>
                <button
                  onClick={() => { onRoleSwitch('SUPER_ADMIN'); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#211B13] flex items-center justify-between text-[#EDE8E1]"
                >
                  <span>Super Admin (Full Operations)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3B2D1B] text-[#C88A3B]">Abebe</span>
                </button>
                <button
                  onClick={() => { onRoleSwitch('SALES_MANAGER'); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#211B13] flex items-center justify-between text-[#EDE8E1]"
                >
                  <span>Sales & RFQ Manager</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3B2D1B] text-[#C88A3B]">Selamawit</span>
                </button>
                <button
                  onClick={() => { onRoleSwitch('EXPORT_MANAGER'); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#211B13] flex items-center justify-between text-[#EDE8E1]"
                >
                  <span>Export & Shipping Logistics</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3B2D1B] text-[#C88A3B]">Dawit</span>
                </button>
                <button
                  onClick={() => { onRoleSwitch('BUYER'); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#211B13] flex items-center justify-between text-[#EDE8E1]"
                >
                  <span>International Buyer (Nordic)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1B2F3B] text-sky-400">Lars</span>
                </button>
              </div>
            )}
          </div>

          <span className="text-[#6E6559]">|</span>
          <span className="text-[#A69C8E]">Currency: USD ($)</span>
          <span className="text-[#A69C8E]">FOB / CIF Trade Terms</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C88A3B] to-[#734A17] flex items-center justify-center shadow-lg shadow-[#C88A3B]/10 border border-[#C88A3B]/30 group-hover:scale-105 transition-transform duration-200">
              <Coffee className="w-5 h-5 text-[#0E0C09]" />
            </div>
            <div>
              <span className="font-['Playfair_Display'] text-2xl font-bold tracking-wider text-[#FAF7F2] flex items-center gap-1.5">
                MY KUHLI
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-[#C88A3B] font-semibold">
                Ethiopian Coffee Exporter
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => onNavigate('coffee')}
              className={`hover:text-[#C88A3B] transition-colors ${currentView === 'coffee' ? 'text-[#C88A3B] font-semibold' : 'text-[#D5CDBF]'}`}
            >
              Coffee Catalog
            </button>
            <button
              onClick={() => onNavigate('origins')}
              className={`hover:text-[#C88A3B] transition-colors ${currentView === 'origins' ? 'text-[#C88A3B] font-semibold' : 'text-[#D5CDBF]'}`}
            >
              Origins
            </button>
            <button
              onClick={() => onNavigate('quality')}
              className={`hover:text-[#C88A3B] transition-colors ${currentView === 'quality' ? 'text-[#C88A3B] font-semibold' : 'text-[#D5CDBF]'}`}
            >
              Quality & Lab
            </button>
            <button
              onClick={() => onNavigate('traceability')}
              className={`hover:text-[#C88A3B] transition-colors ${currentView === 'traceability' ? 'text-[#C88A3B] font-semibold' : 'text-[#D5CDBF]'}`}
            >
              Traceability
            </button>
            <button
              onClick={() => onNavigate('export')}
              className={`hover:text-[#C88A3B] transition-colors ${currentView === 'export' ? 'text-[#C88A3B] font-semibold' : 'text-[#D5CDBF]'}`}
            >
              Export Process
            </button>
            <button
              onClick={() => onNavigate('sustainability')}
              className={`hover:text-[#C88A3B] transition-colors ${currentView === 'sustainability' ? 'text-[#C88A3B] font-semibold' : 'text-[#D5CDBF]'}`}
            >
              Sustainability
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className={`hover:text-[#C88A3B] transition-colors ${currentView === 'blog' ? 'text-[#C88A3B] font-semibold' : 'text-[#D5CDBF]'}`}
            >
              Insights
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-full hover:bg-[#201A14] text-[#A69C8E] hover:text-[#FAF7F2] transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C88A3B] text-[#0E0C09] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#16120E] border border-[#2D241C] rounded-lg shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-[#241D15] flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C88A3B]">Notifications</span>
                    <span className="text-[10px] text-[#8C8275]">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#201A14]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-xs text-[#8C8275] text-center">No alerts at this time</div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifDropdownOpen(false);
                            if (n.linkUrl?.startsWith('/admin')) onNavigate('admin');
                            else if (n.linkUrl?.startsWith('/dashboard')) onNavigate('dashboard');
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-[#201A14] transition-colors ${!n.isRead ? 'bg-[#1C1610]' : ''}`}
                        >
                          <div className="font-semibold text-[#EDE8E1]">{n.title}</div>
                          <div className="text-[#A69C8E] mt-0.5 text-[11px] line-clamp-2">{n.message}</div>
                          <div className="text-[9px] text-[#6E6559] mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Button based on auth state */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdminOrStaff ? (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`px-3.5 py-2 rounded text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors ${
                      currentView === 'admin'
                        ? 'bg-[#C88A3B] text-[#0E0C09]'
                        : 'bg-[#262018] text-[#EDE8E1] hover:bg-[#332A20] border border-[#3D3224]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-[#C88A3B]" />
                    <span>Admin Control</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className={`px-3.5 py-2 rounded text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors ${
                      currentView === 'dashboard'
                        ? 'bg-[#C88A3B] text-[#0E0C09]'
                        : 'bg-[#262018] text-[#EDE8E1] hover:bg-[#332A20] border border-[#3D3224]'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#C88A3B]" />
                    <span>Buyer Portal</span>
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 text-xs text-[#8C8275] hover:text-[#EDE8E1]"
                  title="Sign out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-2 text-xs font-medium text-[#D5CDBF] hover:text-white transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Main CTA */}
            <button
              onClick={() => onOpenRFQ()}
              className="px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#C88A3B] text-[#0B0907] hover:bg-[#E0A352] transition-all duration-200 shadow-lg shadow-[#C88A3B]/15"
            >
              Request a Quote
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => onOpenRFQ()}
              className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold bg-[#C88A3B] text-black"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#EDE8E1] hover:text-[#C88A3B]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drop menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#14110D] border-b border-[#262018] px-5 py-4 space-y-3 text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#241D15]">
            <span className="text-xs text-[#A69C8E]">Active User: <strong className="text-[#C88A3B]">{currentUser?.fullName || 'Guest'}</strong></span>
            <button
              onClick={() => {
                onRoleSwitch(currentUser?.role === 'SUPER_ADMIN' ? 'BUYER' : 'SUPER_ADMIN');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#C88A3B] underline"
            >
              Switch Role ({currentUser?.role === 'SUPER_ADMIN' ? 'to Buyer' : 'to Admin'})
            </button>
          </div>

          <button
            onClick={() => { onNavigate('coffee'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#C88A3B]"
          >
            Coffee Catalog
          </button>
          <button
            onClick={() => { onNavigate('origins'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#C88A3B]"
          >
            Origins (Jimma, Yirgacheffe, Guji...)
          </button>
          <button
            onClick={() => { onNavigate('quality'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#C88A3B]"
          >
            Quality & Cupping Standards
          </button>
          <button
            onClick={() => { onNavigate('traceability'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#C88A3B]"
          >
            Traceability & QR Verification
          </button>
          <button
            onClick={() => { onNavigate('export'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#C88A3B]"
          >
            Export Process & Port of Djibouti
          </button>
          <button
            onClick={() => { onNavigate('blog'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-[#C88A3B]"
          >
            Market Insights & Articles
          </button>

          <div className="pt-3 border-t border-[#241D15] flex flex-col gap-2">
            {currentUser ? (
              <>
                {isAdminOrStaff ? (
                  <button
                    onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded bg-[#C88A3B] text-black font-semibold text-center"
                  >
                    Open Admin Control Center
                  </button>
                ) : (
                  <button
                    onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded bg-[#C88A3B] text-black font-semibold text-center"
                  >
                    Open Buyer Portal
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-xs text-[#8C8275]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded border border-[#C88A3B] text-[#C88A3B] font-semibold text-center"
              >
                Buyer Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
