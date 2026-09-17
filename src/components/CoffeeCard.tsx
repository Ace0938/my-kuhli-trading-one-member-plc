import React from 'react';
import { Product } from '../types/index.js';
import { FileDown, ArrowRight, ShieldCheck, Mountain } from 'lucide-react';
import { apiClient } from '../lib/apiClient.js';
import { useToast } from './Toast.js';

export interface CoffeeCardProps {
  key?: React.Key;
  product: Product;
  onSelect: (product: Product) => void;
  onOpenRFQ: (productId?: string) => void;
  onViewTraceability?: (lotNumber: string) => void;
}

export function CoffeeCard({
  product,
  onSelect,
  onOpenRFQ,
  onViewTraceability
}: CoffeeCardProps) {
  const { toast } = useToast();

  const handleDownloadSpec = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      toast('Generating PDF', `Preparing ${product.name} specification sheet...`, 'info');
      const res = await apiClient.getProductSpecPdf(product.id);
      const link = document.createElement('a');
      link.href = res.pdfDataUri;
      link.download = res.fileName;
      link.click();
      toast('Downloaded', `Saved ${res.fileName}`, 'success');
    } catch (err: any) {
      toast('Download Failed', err.message, 'error');
    }
  };

  const isSpecialty = product.cupScore >= 85;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer bg-[#120F0C] border border-[#262018] hover:border-[#C88A3B]/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image & Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-[#1A1510]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />

        {/* Grade Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider backdrop-blur-md shadow-md ${
            isSpecialty
              ? 'bg-[#C88A3B] text-black font-extrabold'
              : 'bg-[#1C1611]/90 text-[#EDE8E1] border border-[#332A20]'
          }`}>
            {product.grade.replace(/_/g, ' ')}
          </span>

          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-black/75 text-[#FAF7F2] backdrop-blur-sm border border-white/10 w-fit">
            {product.processingMethod.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Cupping Score Badge */}
        <div className="absolute top-3 right-3 bg-[#0E0C09]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#C88A3B]/40 text-right">
          <span className="text-[9px] uppercase tracking-wider text-[#A69C8E] block">SCA Score</span>
          <span className="text-sm font-bold text-[#C88A3B] font-['Playfair_Display']">
            {product.cupScore}
          </span>
        </div>

        {/* Origin Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <Mountain className="w-3 h-3 text-[#C88A3B]" />
          <span>{product.originName} • {product.altitudeMin}–{product.altitudeMax}m</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#8C8275] mb-1 font-mono">
            <span>{product.sku}</span>
            <span>{product.harvestYear} Harvest</span>
          </div>

          <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#FAF7F2] group-hover:text-[#C88A3B] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#A69C8E] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Flavor Notes */}
          <div className="flex flex-wrap gap-1 mt-3">
            {product.flavorNotes.slice(0, 3).map((note, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C1712] text-[#D8CFBF] border border-[#2E2419]"
              >
                {note}
              </span>
            ))}
            {product.flavorNotes.length > 3 && (
              <span className="text-[10px] text-[#8C8275] self-center">
                +{product.flavorNotes.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 border-t border-[#201A14] flex items-center justify-between">
          <div>
            {product.basePricePerKgUSD ? (
              <div>
                <span className="text-[10px] uppercase text-[#8C8275] block">FOB Djibouti Ref</span>
                <span className="text-base font-bold text-[#EDE8E1]">
                  ${product.basePricePerKgUSD.toFixed(2)}
                  <span className="text-xs font-normal text-[#8C8275]"> / kg</span>
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase text-[#C88A3B] block font-semibold">Contract Lot</span>
                <span className="text-xs text-[#D8CFBF] font-medium">Request Quote Only</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadSpec}
              title="Download Product Spec Sheet PDF"
              className="p-2 rounded bg-[#1C1611] hover:bg-[#2B2217] text-[#A69C8E] hover:text-[#C88A3B] border border-[#2E2419] transition-colors"
            >
              <FileDown className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenRFQ(product.id);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs tracking-wider flex items-center gap-1 transition-all"
            >
              <span>Quote</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
