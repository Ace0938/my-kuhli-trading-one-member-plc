import React, { useState } from 'react';
import { Origin, Product } from '../types/index.js';
import { Mountain, Compass, Calendar, Coffee, Droplets, ArrowRight } from 'lucide-react';

interface OriginsViewProps {
  origins: Origin[];
  products: Product[];
  initialOriginSlug?: string;
  onSelectProduct: (p: Product) => void;
  onOpenRFQ: (productId?: string) => void;
}

export function OriginsView({
  origins,
  products,
  initialOriginSlug,
  onSelectProduct,
  onOpenRFQ
}: OriginsViewProps) {
  const [selectedOriginId, setSelectedOriginId] = useState<string>(
    initialOriginSlug
      ? origins.find(o => o.slug === initialOriginSlug)?.id || origins[0]?.id || ''
      : origins[0]?.id || ''
  );

  const activeOrigin = origins.find(o => o.id === selectedOriginId) || origins[0];
  const originProducts = products.filter(p => p.originName.toLowerCase() === activeOrigin?.name.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
          The Cradle of Arabica
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
          Ethiopian Coffee Origins
        </h1>
        <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
          Ethiopia is home to thousands of indigenous landrace varieties found nowhere else on earth. Explore the diverse microclimates, high-elevation terroirs, and distinct cup profiles of our export regions.
        </p>
      </div>

      {/* Origin Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-[#241D15] no-scrollbar">
        {origins.map(origin => (
          <button
            key={origin.id}
            onClick={() => setSelectedOriginId(origin.id)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedOriginId === origin.id
                ? 'bg-[#C88A3B] text-black shadow-lg shadow-[#C88A3B]/20'
                : 'bg-[#14110D] text-[#A69C8E] hover:text-[#FAF7F2] border border-[#2B231A]'
            }`}
          >
            {origin.name} Region
          </button>
        ))}
      </div>

      {activeOrigin && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Main Origin Highlight Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#120F0C] border border-[#262018] rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Origin Landscape Image */}
            <div className="h-72 lg:h-auto w-full relative bg-[#1A1510]">
              <img
                src={activeOrigin.imageUrl || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000&auto=format&fit=crop'}
                alt={activeOrigin.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120F0C] via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-xs font-semibold text-[#C88A3B]">
                {activeOrigin.region} Zone
              </div>
            </div>

            {/* Terroir & Cultural Profile */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C8275]">
                    {activeOrigin.region} • Elevation: {activeOrigin.elevationRange}
                  </span>
                  <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2] mt-1">
                    {activeOrigin.name}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
                  {activeOrigin.description}
                </p>

                {/* Key Terroir Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#19140F] border border-[#292016]">
                    <span className="text-[10px] text-[#8C8275] uppercase block">Altitude</span>
                    <span className="font-semibold text-white mt-0.5 block">{activeOrigin.elevationRange}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#19140F] border border-[#292016]">
                    <span className="text-[10px] text-[#8C8275] uppercase block">Harvest Period</span>
                    <span className="font-semibold text-white mt-0.5 block">{activeOrigin.harvestPeriod}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#19140F] border border-[#292016]">
                    <span className="text-[10px] text-[#8C8275] uppercase block">Processing</span>
                    <span className="font-semibold text-white mt-0.5 block">Washed, Natural, Anaerobic</span>
                  </div>
                </div>

                {/* Flavor Descriptors */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C88A3B] block mb-1.5">
                    Signature Cup Characteristics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(typeof activeOrigin.flavorProfile === 'string' ? activeOrigin.flavorProfile.split(',') : []).map((flavor, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs bg-[#241D15] text-[#EDE8E1] border border-[#332A20]"
                      >
                        {flavor.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#201A14] flex items-center justify-between">
                <span className="text-xs text-[#8C8275]">
                  Active lots ready for booking
                </span>
                <button
                  onClick={() => onOpenRFQ()}
                  className="px-5 py-2 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider transition-all"
                >
                  Inquire {activeOrigin.name} Lots
                </button>
              </div>
            </div>

          </div>

          {/* Coffees from this Origin */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
                Export Coffees Sourced from {activeOrigin.name}
              </h3>
              <span className="text-xs text-[#8C8275]">
                {originProducts.length} lots available
              </span>
            </div>

            {originProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8C8275] bg-[#120F0C] border border-[#241D15] rounded-xl">
                Current {activeOrigin.name} lots are currently in processing or undergoing ECTA cupping. Inquire to reserve advance allocations.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {originProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="cursor-pointer p-4 rounded-xl bg-[#120F0C] border border-[#262018] hover:border-[#C88A3B] transition-all space-y-3 group"
                  >
                    <div className="h-44 rounded-lg overflow-hidden bg-[#1A1510] relative">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-[#C88A3B]">
                        {p.grade.replace(/_/g, ' ')}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                        SCA {p.cupScore}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white group-hover:text-[#C88A3B] transition-colors">{p.name}</h4>
                      <p className="text-xs text-[#8C8275] line-clamp-1 mt-0.5">{p.variety} • {p.processingMethod}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#201A14]">
                      <span className="text-[#C88A3B] font-semibold">${p.basePricePerKgUSD?.toFixed(2) || 'Quote'} / kg</span>
                      <span className="text-[#8C8275] flex items-center gap-1 group-hover:text-white transition-colors">
                        View Spec <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
