import React from 'react';
import { Coffee, Mail, Phone, MapPin, ShieldCheck, Award, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: () => void;
  onOpenRFQ: () => void;
}

export function Footer({ onNavigate, onOpenAuth, onOpenRFQ }: FooterProps) {
  return (
    <footer className="bg-[#080705] border-t border-[#201A14] text-[#EDE8E1] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-14 border-b border-[#1C1611]">
          
          {/* Col 1: Brand story */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#C88A3B] flex items-center justify-center text-black">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-['Playfair_Display'] text-2xl font-bold tracking-wide">
                MY KUHLI
              </span>
            </div>

            <p className="text-xs text-[#A69C8E] leading-relaxed">
              Direct-from-origin Ethiopian coffee sourcing, dry-milling, and international sea-freight export. Connecting high-altitude family smallholders with the world's most discerning roasteries.
            </p>

            <div className="pt-2 text-[11px] text-[#C88A3B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ECTA Export License: ECTA-EXP-2024-9982</span>
            </div>
          </div>

          {/* Col 2: Coffee & Origins */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
              Coffee & Origins
            </h4>
            <ul className="space-y-2 text-xs text-[#A69C8E]">
              <li>
                <button onClick={() => onNavigate('coffee')} className="hover:text-[#C88A3B] transition-colors">
                  Complete Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('origins', 'jimma')} className="hover:text-[#C88A3B] transition-colors">
                  Jimma Naturals (Grade 4 & 5)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('origins', 'yirgacheffe')} className="hover:text-[#C88A3B] transition-colors">
                  Yirgacheffe Washed Grade 1
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('origins', 'guji')} className="hover:text-[#C88A3B] transition-colors">
                  Guji Anaerobic Micro-Lots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('origins', 'sidama')} className="hover:text-[#C88A3B] transition-colors">
                  Sidama Natural Grade 2
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('origins', 'harrar')} className="hover:text-[#C88A3B] transition-colors">
                  Harrar Longberry Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Export & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
              Export Operations
            </h4>
            <ul className="space-y-2 text-xs text-[#A69C8E]">
              <li>
                <button onClick={() => onNavigate('quality')} className="hover:text-[#C88A3B] transition-colors">
                  Quality & Cupping Lab Protocols
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('traceability')} className="hover:text-[#C88A3B] transition-colors">
                  Lot Traceability & QR Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('export')} className="hover:text-[#C88A3B] transition-colors">
                  Logistics & Port of Djibouti Route
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sustainability')} className="hover:text-[#C88A3B] transition-colors">
                  Fair Price Transparency to Smallholders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-[#C88A3B] transition-colors">
                  Ethiopian Market Reports
                </button>
              </li>
              <li>
                <button onClick={onOpenRFQ} className="hover:text-[#C88A3B] text-[#C88A3B] font-semibold flex items-center gap-1">
                  Request Official Quotation <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
              Headquarters & Hub
            </h4>
            <div className="space-y-2.5 text-xs text-[#A69C8E]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C88A3B] shrink-0 mt-0.5" />
                <span>
                  Bole Medhanealem Commercial Center, Suite 704<br />
                  Addis Ababa, Ethiopia
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A69C8E] shrink-0 mt-0.5" />
                <span>
                  Export Consolidation Warehouse:<br />
                  Modjo Dry Port Logistics Hub, Oromia
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C88A3B] shrink-0" />
                <a href="mailto:export@mykuhli.com" className="hover:text-white transition-colors">
                  export@mykuhli.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C88A3B] shrink-0" />
                <span>+251 11 667 8900 / +251 911 234 567</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAuth}
                className="w-full py-2 px-3 text-center rounded border border-[#332A20] bg-[#14110D] hover:bg-[#1E1913] text-xs text-[#D8CFBF] font-medium transition-colors"
              >
                Access Buyer Portal (Sign In)
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7165]">
          <div>
            © {new Date().getFullYear()} MY KUHLI Coffee Exporters Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-[#EDE8E1] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-[#EDE8E1] transition-colors">
              Terms & Incoterms
            </button>
            <button onClick={() => onNavigate('cookie-policy')} className="hover:text-[#EDE8E1] transition-colors">
              Cookie Policy
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#EDE8E1] transition-colors">
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
