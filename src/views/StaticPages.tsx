import React, { useState } from 'react';
import { BlogPost, Testimonial } from '../types/index.js';
import {
  ShieldCheck,
  Award,
  Truck,
  Droplets,
  Sprout,
  Users,
  CheckCircle2,
  Send,
  Mail,
  Phone,
  MapPin,
  Anchor,
  Layers,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { apiClient } from '../lib/apiClient.js';
import { useToast } from '../components/Toast.js';

// --- Quality & Lab View ---
export function QualityView({ onOpenRFQ }: { onOpenRFQ: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
          SCA & ECTA Protocols
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
          Quality Control & Cupping Laboratory
        </h1>
        <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
          From cherry harvest to ocean containerization, every single bag of MY KUHLI coffee is subject to rigorous physical grading, moisture analysis, and sensory evaluation by certified Q-graders.
        </p>
      </div>

      {/* 4 Pillars of Quality */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#C88A3B]/10 text-[#C88A3B] flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-white text-base">Hand-Picking & Sorting</h3>
          <p className="text-xs text-[#8C8275] leading-relaxed">
            Only deep crimson cherries harvested at peak Brix sugar density are accepted at primary wet mills. Strict flotation tanks remove floaters before depulping.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#C88A3B]/10 text-[#C88A3B] flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-white text-base">Moisture & Water Activity</h3>
          <p className="text-xs text-[#8C8275] leading-relaxed">
            Continuous calibrated testing using Sinar moisture analyzers ensures green beans maintain 10.5% - 11.5% moisture with water activity strictly under 0.60 aw.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#C88A3B]/10 text-[#C88A3B] flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-white text-base">Optical & Density Milling</h3>
          <p className="text-xs text-[#8C8275] leading-relaxed">
            State-of-the-art destoners, air-gravity separator tables, and monochromatic optical color-sorters at Modjo dry mill eliminate primary and secondary defects.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#C88A3B]/10 text-[#C88A3B] flex items-center justify-center font-bold">
            04
          </div>
          <h3 className="font-bold text-white text-base">ECTA Cupping Certification</h3>
          <p className="text-xs text-[#8C8275] leading-relaxed">
            Official government liquoring by the Ethiopian Coffee & Tea Authority produces independent certificates of origin and verifiable grade scores prior to export clearance.
          </p>
        </div>
      </div>

      {/* Lab cupping form breakdown */}
      <div className="p-8 rounded-2xl bg-[#120F0C] border border-[#262018] space-y-6">
        <h2 className="text-2xl font-bold font-['Playfair_Display'] text-white">
          Sensory Evaluation Standards
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#A69C8E]">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-[#C88A3B]">Aroma & Fragrance</h4>
            <p>Evaluation of dry grounds fragrance and wet crust aroma, mapping complex floral jasmine, citrus blossom, and honeyed stone fruit compounds.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-[#C88A3B]">Acidity & Structure</h4>
            <p>Analysis of citric, malic, and phosphoric acid brightness that typifies Ethiopian heirloom varieties grown above 1,800 meters.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-[#C88A3B]">Body & Finish</h4>
            <p>Texture rating from tea-like clarity in washed Yirgacheffes to velvety syrupy mouthfeel in natural Guji and heavy-bodied Jimma naturals.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#201A14] flex justify-between items-center text-xs">
          <span className="text-[#8C8275]">Pre-shipment sample (PSS) testing available on all contracted lots.</span>
          <button
            onClick={onOpenRFQ}
            className="px-5 py-2 rounded-full bg-[#C88A3B] text-black font-semibold uppercase tracking-wider"
          >
            Request PSS & Cupping Sample
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Export Process & Logistics Corridor View ---
export function ExportProcessView({ onOpenRFQ }: { onOpenRFQ: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B] flex items-center justify-center gap-1.5">
          <Anchor className="w-4 h-4" />
          Reliable Maritime Sea Freight
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
          Export Logistics & Port Corridor
        </h1>
        <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
          Navigating international coffee logistics with speed and precision. From our Modjo dry port hub via the electrified Ethio-Djibouti Railway directly to container terminals at the Port of Djibouti.
        </p>
      </div>

      {/* Step by Step Corridor */}
      <div className="space-y-6">
        {[
          {
            step: '01',
            title: 'Hulling & Export Processing at Modjo Hub',
            desc: 'Parchment and dried pods are moved from regional stations to our dry mill in Modjo. Beans undergo precision hulling, gravity separation, destoning, and electronic color sorting to meet contract screen specs.',
            metric: 'Capacity: 120 MT / day'
          },
          {
            step: '02',
            title: 'GrainPro & Multi-Wall Packaging',
            desc: 'Beans are immediately bagged in gas-barrier GrainPro liners within 60kg jute bags or sealed in 30kg vacuum cartons to prevent humidity absorption and aroma loss.',
            metric: 'Barrier: High-impermeability'
          },
          {
            step: '03',
            title: 'ECTA Inspection & Customs Sealing',
            desc: 'Inspectors from the Ethiopian Coffee and Tea Authority and National Bank of Ethiopia verify lot numbers, screen sizes, moisture, and issue export authorization and phytosanitary certificates.',
            metric: 'Turnaround: 48 Hours'
          },
          {
            step: '04',
            title: 'Ethio-Djibouti Railway Freight',
            desc: 'Sealed containers are loaded onto electric freight trains at Modjo Dry Port, traveling direct to Doraleh Multipurpose Port (Djibouti) without highway delays.',
            metric: 'Transit: 18 - 24 Hours'
          },
          {
            step: '05',
            title: 'Ocean Carrier Loading & Global Transit',
            desc: 'Containers are loaded onto tier-one ocean liners (Maersk, MSC, CMA CGM, Hapag-Lloyd) connecting Djibouti with Northern Europe, Japan, the Middle East, and North America.',
            metric: 'Frequency: Weekly Sailings'
          }
        ].map(item => (
          <div key={item.step} className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#C88A3B] font-['Playfair_Display'] w-10">
                {item.step}
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-[#8C8275] max-w-2xl leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <div className="text-right text-xs shrink-0">
              <span className="text-[#C88A3B] font-mono font-semibold">{item.metric}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-[#17130E] border border-[#2D241C] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
            Ready to secure 2026 container allocations?
          </h3>
          <p className="text-xs text-[#8C8275] mt-1">
            Book 20ft Full Container Loads (320 bags / 19.2 MT) with fixed FOB or CIF freight schedules.
          </p>
        </div>
        <button
          onClick={onOpenRFQ}
          className="px-6 py-2.5 rounded-full bg-[#C88A3B] text-black font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
        >
          Request Container Booking
        </button>
      </div>
    </div>
  );
}

// --- Sustainability & Direct Trade View ---
export function SustainabilityView({ onOpenRFQ }: { onOpenRFQ: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
          Ethical & Sustainable Commerce
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
          Direct Trade & Farmer Equity
        </h1>
        <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
          We believe high-quality coffee begins with empowered farming communities. MY KUHLI pays significant premiums directly to smallholders, supporting regenerative shade-tree forestry and clean water infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
          <Sprout className="w-8 h-8 text-[#C88A3B]" />
          <h3 className="text-base font-bold text-white">Agroforestry & Shade Grown</h3>
          <p className="text-xs text-[#8C8275] leading-relaxed">
            Over 90% of our coffee grows naturally beneath indigenous canopy trees like Cordia africana and Acacia, preserving soil biodiversity and natural bird habitats.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
          <DollarSign className="w-8 h-8 text-[#C88A3B]" />
          <h3 className="text-base font-bold text-white">Guaranteed Fair Premiums</h3>
          <p className="text-xs text-[#8C8275] leading-relaxed">
            We publish direct farmer shares on every lot QR code. Smallholders receive 20% to 45% above local market cherry prices to reward selective hand-picking.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
          <Users className="w-8 h-8 text-[#C88A3B]" />
          <h3 className="text-base font-bold text-white">Washing Station Water Recycling</h3>
          <p className="text-xs text-[#8C8275] leading-relaxed">
            Eco-pulpers with closed-loop water recirculation systems reduce water usage by 85%, preventing acidification of local rivers in Yirgacheffe and Guji.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Blog & Insights View ---
export function BlogView({
  posts,
  onSelectPost
}: {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
          Origin Intelligence & Market Reports
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
          Ethiopian Coffee Insights
        </h1>
        <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
          Comprehensive market commentary on Ethiopian crop yields, ECTA floor price regulations, harvest timelines, and international shipping corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map(post => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="cursor-pointer p-6 rounded-2xl bg-[#120F0C] border border-[#262018] hover:border-[#C88A3B] transition-all duration-300 space-y-4 group"
          >
            <div className="h-60 rounded-xl overflow-hidden bg-[#1A1510] relative">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] uppercase font-bold bg-black/80 text-[#C88A3B] border border-white/10">
                {post.category}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-[#8C8275] flex items-center gap-3 font-mono">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>By {post.authorName}</span>
              </div>

              <h2 className="text-xl font-bold font-['Playfair_Display'] text-white group-hover:text-[#C88A3B] transition-colors line-clamp-2">
                {post.title}
              </h2>

              <p className="text-xs text-[#A69C8E] line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-2 flex items-center text-xs font-semibold text-[#C88A3B] group-hover:underline">
              <span>Read Full Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Contact Us View ---
export function ContactView() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.submitContact({ name, email, company, country, message });
      toast('Message Sent', 'Thank you! Our export desk will reply within 24 hours.', 'success');
      setSubmitted(true);
    } catch (err: any) {
      toast('Submission Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
          Direct Connection to Origin
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
          Contact MY KUHLI
        </h1>
        <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
          Whether you require container allocations, sample cupping kits, or contract quotations, our Addis Ababa commercial export team is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info Card */}
        <div className="p-8 rounded-2xl bg-[#120F0C] border border-[#262018] space-y-6">
          <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
            Headquarters & Logistics Hub
          </h3>

          <div className="space-y-4 text-xs text-[#A69C8E]">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C88A3B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm">Commercial Headquarters</strong>
                <span>Bole Medhanealem Commercial Center, Suite 704<br />Addis Ababa, Ethiopia</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#8C8275] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm">Export Processing & Dry Mill</strong>
                <span>Modjo Dry Port Logistics Corridor, Oromia, Ethiopia</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#C88A3B] shrink-0" />
              <div>
                <strong className="text-white block text-sm">Email Inquiries</strong>
                <a href="mailto:export@mykuhli.com" className="hover:text-white">export@mykuhli.com</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#C88A3B] shrink-0" />
              <div>
                <strong className="text-white block text-sm">Phone / WhatsApp Desk</strong>
                <span>+251 11 667 8900 / +251 911 234 567</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#201A14] text-xs text-[#8C8275] space-y-1">
            <div>ECTA Exporter License: <strong className="text-[#C88A3B]">ECTA-EXP-2024-9982</strong></div>
            <div>Operating Hours: Monday – Saturday, 08:30 – 18:00 EAT</div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 rounded-2xl bg-[#120F0C] border border-[#262018]">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 bg-[#C88A3B]/20 text-[#C88A3B] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Inquiry Received</h4>
              <p className="text-xs text-[#8C8275] max-w-sm mx-auto">
                Thank you for contacting MY KUHLI. A member of our commercial export team has received your message and will respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#D8CFBF]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#D8CFBF]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#D8CFBF]">Company Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Berlin Roastery GmbH"
                    className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#D8CFBF]">Country / Destination</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. Germany"
                    className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#D8CFBF]">Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Inquire regarding specific harvest lots, cupping sample sets, or maritime freight rates..."
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message to Export Desk'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Legal Pages (Privacy, Terms, Cookies) ---
export function LegalView({ type }: { type: 'privacy' | 'terms' | 'cookies' }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-xs text-[#A69C8E] leading-relaxed">
      {type === 'privacy' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold font-['Playfair_Display'] text-white">Privacy Policy</h1>
          <p>MY KUHLI respects international commercial data privacy standards. We collect company registration details, VAT identification, and contact information solely for trade execution, Incoterms compliance, and customs declarations with the National Bank of Ethiopia and the Ethiopian Customs Commission.</p>
          <h3 className="text-base font-bold text-white pt-2">Data Protection & Storage</h3>
          <p>We do not sell or monetize client data. All proforma invoices and shipping contracts are secured using enterprise-grade TLS encryption and restricted role-based authorization.</p>
        </div>
      )}

      {type === 'terms' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold font-['Playfair_Display'] text-white">Terms of International Trade & Incoterms</h1>
          <p>All sales contracts, quotations, and proformas issued by MY KUHLI are governed by Incoterms® 2020 as published by the International Chamber of Commerce (ICC). Standard contracts are executed under FOB Port of Djibouti or CIF destination port terms.</p>
          <h3 className="text-base font-bold text-white pt-2">Payment Terms</h3>
          <p>Unless expressly agreed otherwise in writing, commercial transactions require 30% T/T advance payment upon contract signing and 70% payable upon presentation of original shipping documents (clean on-board Bill of Lading, Certificate of Origin, Phytosanitary Certificate, and ECTA Liquoring Inspection).</p>
        </div>
      )}

      {type === 'cookies' && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold font-['Playfair_Display'] text-white">Cookie & Session Policy</h1>
          <p>This web application utilizes functional cookies and local session storage solely to preserve authentication tokens, role permissions, and active inquiry states across browsing sessions.</p>
        </div>
      )}
    </div>
  );
}
