import React from 'react';
import { Product, Origin, BlogPost, Testimonial } from '../types/index.js';
import { CoffeeCard } from '../components/CoffeeCard.js';
import {
  Coffee,
  ShieldCheck,
  Award,
  Truck,
  MapPin,
  Anchor,
  CheckCircle2,
  ArrowRight,
  Download,
  Calendar,
  Layers,
  Sparkles,
  QrCode,
  Globe,
  DollarSign
} from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  origins: Origin[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenRFQ: (productId?: string) => void;
  onViewTraceability: (lotNumber: string) => void;
}

export function HomeView({
  products,
  origins,
  blogPosts,
  testimonials,
  onNavigate,
  onSelectProduct,
  onOpenRFQ,
  onViewTraceability
}: HomeViewProps) {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#0B0907] overflow-hidden border-b border-[#201A14]">
        {/* Ambient background imagery with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1920&auto=format&fit=crop"
            alt="Ethiopian Coffee Highlands"
            className="w-full h-full object-cover object-center opacity-25 filter contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0907] via-[#0B0907]/80 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0B0907]/60 to-[#0B0907]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1710]/90 border border-[#C88A3B]/40 text-[#C88A3B] text-[11px] uppercase tracking-widest font-semibold backdrop-blur-sm animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#C88A3B] animate-pulse"></span>
            <span>Direct Origin Exporter • Addis Ababa & Modjo Dry Port</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Playfair_Display'] text-[#FAF7F2] tracking-tight leading-[1.12]">
            Exceptional Ethiopian Coffee.<br />
            <span className="italic font-normal text-[#C88A3B]">Delivered to the World.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#D5CDBF] font-normal leading-relaxed">
            From Ethiopia's legendary terroirs in Jimma, Yirgacheffe, Guji, and Sidama directly to global roasters. Verified traceability, ECTA certified grading, and streamlined rail-to-sea export logistics.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('coffee')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-[#0B0907] font-semibold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#C88A3B]/20 flex items-center justify-center gap-2"
            >
              <span>Explore Coffee Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenRFQ()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#1A140E] hover:bg-[#281F15] border border-[#3D3122] text-[#EDE8E1] hover:text-[#C88A3B] font-semibold text-xs uppercase tracking-widest transition-all duration-200"
            >
              Request Commercial Quote
            </button>

            <button
              onClick={() => onNavigate('traceability')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-transparent text-[#A69C8E] hover:text-[#EDE8E1] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-[#C88A3B]" />
              <span>Trace a Lot</span>
            </button>
          </div>

          {/* Ticker Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto border-t border-[#201A14]">
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white font-['Playfair_Display']">100%</div>
              <div className="text-[11px] text-[#A69C8E] uppercase tracking-wider mt-1">Direct Origin Traceable</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#C88A3B] font-['Playfair_Display']">ECTA</div>
              <div className="text-[11px] text-[#A69C8E] uppercase tracking-wider mt-1">Licensed Authority Exporter</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white font-['Playfair_Display']">48h</div>
              <div className="text-[11px] text-[#A69C8E] uppercase tracking-wider mt-1">Modjo to Port of Djibouti</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#C88A3B] font-['Playfair_Display']">82 – 90+</div>
              <div className="text-[11px] text-[#A69C8E] uppercase tracking-wider mt-1">SCA Cupping Range</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ETHIOPIAN HERITAGE & COMPANY INTRO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
              Rooted in the Birthplace of Coffee
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-[#FAF7F2] leading-tight">
              Honoring Century-Old Traditions with Modern Export Excellence
            </h2>
            <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
              Ethiopia is the biological motherland of Arabica coffee. In high-altitude cloud forests reaching beyond 2,200 meters, indigenous landraces mature slowly in nutrient-dense volcanic soil, yielding incomparable cup profiles of jasmine florality, bright bergamot, and ripe stone fruits.
            </p>
            <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
              MY KUHLI is an Ethiopian-owned and operated export house headquartered in Addis Ababa. We bridge the gap between smallholder cooperatives and global buyers through fair pricing, transparent contracts, modern dry-milling at Modjo, and guaranteed container shipping schedules.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#120F0C] border border-[#262018]">
                <div className="font-bold text-white text-base">Direct Cooperative Payouts</div>
                <div className="text-xs text-[#8C8275] mt-1">Rewarding farmers with guaranteed premiums above local cherry market rates.</div>
              </div>
              <div className="p-4 rounded-xl bg-[#120F0C] border border-[#262018]">
                <div className="font-bold text-white text-base">Modjo Logistics Dry Mill</div>
                <div className="text-xs text-[#8C8275] mt-1">State-of-the-art destoning, color sorters, and high-barrier GrainPro bagging.</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1510] border border-[#2B231A] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop"
                alt="Ethiopian Coffee Drying"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#16120E] border border-[#2E2419] p-5 rounded-xl shadow-2xl max-w-xs hidden sm:block">
              <span className="text-xs font-bold text-[#C88A3B] block">ECTA Export License</span>
              <span className="text-xs text-[#D8CFBF] mt-0.5 block">Strict compliance with National Bank of Ethiopia export currency regulations.</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED COFFEES PORTFOLIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
              2026 Harvest Portfolio
            </span>
            <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2] mt-1">
              Featured Export Coffee Lots
            </h2>
          </div>

          <button
            onClick={() => onNavigate('coffee')}
            className="text-xs font-semibold text-[#C88A3B] hover:text-[#FAF7F2] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All Green Coffees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <CoffeeCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onOpenRFQ={onOpenRFQ}
              onViewTraceability={onViewTraceability}
            />
          ))}
        </div>
      </section>

      {/* 4. ETHIOPIAN ORIGINS BENTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
            Terroir Diversity
          </span>
          <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
            Ethiopia's Premier Growing Regions
          </h2>
          <p className="text-xs text-[#A69C8E]">
            Each region boasts distinct microclimates, ancestral varieties, and cup characteristics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {origins.map(origin => (
            <div
              key={origin.id}
              onClick={() => onNavigate('origins', origin.slug)}
              className="cursor-pointer group relative h-72 rounded-2xl overflow-hidden border border-[#262018] bg-[#120F0C] p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#C88A3B]"
            >
              <img
                src={origin.imageUrl}
                alt={origin.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40 group-hover:opacity-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C09] via-[#0E0C09]/60 to-transparent" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-black/75 text-[#C88A3B] border border-white/10">
                  {origin.region}
                </span>
                <span className="text-xs text-[#FAF7F2] font-mono">
                  {origin.elevationRange}
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-bold font-['Playfair_Display'] text-white group-hover:text-[#C88A3B] transition-colors">
                  {origin.name}
                </h3>
                <p className="text-xs text-[#D8CFBF] line-clamp-2">
                  {origin.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {(typeof origin.flavorProfile === 'string' ? origin.flavorProfile.split(',') : []).slice(0, 3).map((note, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-[#EDE8E1]">
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE MY KUHLI */}
      <section className="bg-[#120F0C] border-y border-[#262018] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
              Competitive Advantage
            </span>
            <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
              Why Global Roasters Partner with MY KUHLI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#17130E] border border-[#2B2217] space-y-3">
              <MapPin className="w-6 h-6 text-[#C88A3B]" />
              <h3 className="font-bold text-white text-base">Direct Sourcing</h3>
              <p className="text-xs text-[#8C8275] leading-relaxed">
                Direct relations with washing stations and smallholder cooperatives, cutting out unnecessary broker intermediaries.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#17130E] border border-[#2B2217] space-y-3">
              <Award className="w-6 h-6 text-[#C88A3B]" />
              <h3 className="font-bold text-white text-base">Zero Defect Tolerances</h3>
              <p className="text-xs text-[#8C8275] leading-relaxed">
                Modern optical sorters and gravity tables at Modjo Dry Mill guarantee contract screen size and strictly clean cups.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#17130E] border border-[#2B2217] space-y-3">
              <Truck className="w-6 h-6 text-[#C88A3B]" />
              <h3 className="font-bold text-white text-base">Guaranteed Rail Slots</h3>
              <p className="text-xs text-[#8C8275] leading-relaxed">
                Fixed container rail allocations on the Ethio-Djibouti Railway ensure prompt delivery to ocean terminals without highway delays.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#17130E] border border-[#2B2217] space-y-3">
              <QrCode className="w-6 h-6 text-[#C88A3B]" />
              <h3 className="font-bold text-white text-base">Verifiable QR Ledger</h3>
              <p className="text-xs text-[#8C8275] leading-relaxed">
                Every exported GrainPro bag is tagged with an irrevocable QR code confirming GPS, washing station, and farmer payout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOGISTICS CORRIDOR TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#17130E] to-[#120F0C] border border-[#2D241C] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B] flex items-center gap-1.5">
              <Anchor className="w-4 h-4" />
              Strategic Transport Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-white">
              From Modjo Dry Port to the World
            </h2>
            <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
              Our export consolidation warehouse sits at Modjo Dry Port, the epicenter of Ethiopian logistics. Sealed containers are transferred directly onto the electrified Ethio-Djibouti railway to the deep-water Doraleh terminal in under 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[#EDE8E1] pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C88A3B]" />
                Incoterms: FOB Djibouti, CIF, CFR
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C88A3B]" />
                Maersk, MSC & CMA CGM Allocations
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('export')}
            className="px-6 py-3 rounded-full bg-[#C88A3B] text-black font-semibold text-xs uppercase tracking-wider whitespace-nowrap hover:bg-[#E0A352] transition-colors"
          >
            Explore Export Logistics
          </button>
        </div>
      </section>

      {/* 7. BUYER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
            Global Roaster Partners
          </span>
          <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
            Trusted Across 18 Countries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="p-6 rounded-2xl bg-[#120F0C] border border-[#262018] space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#D8CFBF] italic leading-relaxed">
                "{t.quote}"
              </p>

              <div className="pt-4 border-t border-[#201A14]">
                <div className="font-bold text-white text-xs">{t.buyerName}</div>
                <div className="text-[11px] text-[#C88A3B]">{t.companyName}, {t.country}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. MARKET INSIGHTS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
              Origin Knowledge
            </span>
            <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2] mt-1">
              Latest Export Reports & Articles
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-xs text-[#C88A3B] hover:underline flex items-center gap-1"
          >
            All Insights <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate('blog')}
              className="cursor-pointer p-4 rounded-xl bg-[#120F0C] border border-[#262018] hover:border-[#C88A3B] transition-colors space-y-3 group"
            >
              <div className="h-44 rounded-lg overflow-hidden bg-[#1A1510]">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[10px] font-bold text-[#C88A3B] uppercase">{post.category}</span>
              <h4 className="font-bold text-sm text-white group-hover:text-[#C88A3B] transition-colors line-clamp-2">{post.title}</h4>
              <p className="text-xs text-[#8C8275] line-clamp-2">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL COMMERCIAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#17130E] border border-[#2D241C] text-center space-y-6 shadow-2xl">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
            2026 Commercial Bookings
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-white max-w-2xl mx-auto leading-tight">
            Reserve Your Direct Origin Ethiopian Container Allocation
          </h2>
          <p className="text-xs sm:text-sm text-[#A69C8E] max-w-lg mx-auto leading-relaxed">
            Contact our Addis Ababa sales desk to receive custom FOB Port of Djibouti or CIF quotations with comprehensive laboratory cupping sheets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenRFQ()}
              className="px-8 py-3.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#C88A3B]/20"
            >
              Request Commercial Quotation
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 rounded-full bg-[#1F1912] hover:bg-[#2C2319] border border-[#3D3223] text-white font-semibold text-xs uppercase tracking-widest transition-colors"
            >
              Contact Commercial Desk
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
