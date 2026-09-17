import React from 'react';
import { Product, CoffeeLot, TraceabilityRecord } from '../types/index.js';
import {
  FileDown,
  ArrowLeft,
  ShieldCheck,
  Award,
  Mountain,
  Droplets,
  Layers,
  Calendar,
  Send,
  QrCode,
  Check
} from 'lucide-react';
import { apiClient } from '../lib/apiClient.js';
import { useToast } from '../components/Toast.js';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onOpenRFQ: (productId: string) => void;
  onViewTraceability: (lotNumber: string) => void;
  relatedProducts: Product[];
  onSelectProduct: (p: Product) => void;
}

export function ProductDetailView({
  product,
  onBack,
  onOpenRFQ,
  onViewTraceability,
  relatedProducts,
  onSelectProduct
}: ProductDetailViewProps) {
  const { toast } = useToast();

  const handleDownloadSpec = async () => {
    try {
      toast('Generating PDF', `Generating official PDF specification sheet for ${product.name}...`, 'info');
      const res = await apiClient.getProductSpecPdf(product.id);
      const link = document.createElement('a');
      link.href = res.pdfDataUri;
      link.download = res.fileName;
      link.click();
      toast('Success', `Downloaded ${res.fileName}`, 'success');
    } catch (err: any) {
      toast('Failed', err.message, 'error');
    }
  };

  // Associated sample lot number
  const sampleLotNumber = product.originName === 'Jimma'
    ? 'MK-JIM-2026-001'
    : product.originName === 'Yirgacheffe'
    ? 'MK-YIR-2026-004'
    : 'MK-GUJ-2026-002';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-[#A69C8E] hover:text-[#C88A3B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Coffee Catalog</span>
      </button>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1510] border border-[#2B231A] relative shadow-2xl">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop'}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#FAF7F2]">
              Grade: <strong className="text-[#C88A3B]">{product.grade.replace(/_/g, ' ')}</strong>
            </div>

            <div className="absolute top-4 right-4 bg-[#0E0C09]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#C88A3B]/40 text-right">
              <span className="text-[10px] uppercase text-[#A69C8E] block">SCA Cupping</span>
              <span className="text-xl font-bold text-[#C88A3B] font-['Playfair_Display']">
                {product.cupScore}
              </span>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden border border-[#2B231A] bg-[#17130E]">
                  <img src={img} alt="detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & CTAs */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs text-[#A69C8E] mb-2 font-mono">
              <span className="text-[#C88A3B] font-bold">ETHIOPIA EXPORT LOT</span>
              <span>•</span>
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span>Harvest: {product.harvestYear}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
              {product.name}
            </h1>

            <p className="text-sm text-[#A69C8E] mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Flavor Profile Palette */}
          <div className="p-4 rounded-xl bg-[#14100C] border border-[#262018] space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C88A3B]">
              Cupping Flavor Profile
            </span>
            <div className="flex flex-wrap gap-2">
              {product.flavorNotes.map((note, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-[#1F1913] text-[#EDE8E1] border border-[#332A20]"
                >
                  {note}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-[#B8AEA2]">
              <div>Aroma: <strong className="text-white">{product.aroma}</strong></div>
              <div>Acidity: <strong className="text-white">{product.acidity}</strong></div>
              <div>Body: <strong className="text-white">{product.body}</strong></div>
            </div>
          </div>

          {/* Key Export Metrics Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#14100C] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] uppercase block">Altitude</span>
              <span className="font-semibold text-white mt-0.5 block">{product.altitudeMin} – {product.altitudeMax}m</span>
            </div>
            <div className="p-3 rounded-lg bg-[#14100C] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] uppercase block">Processing</span>
              <span className="font-semibold text-white mt-0.5 block">{product.processingMethod}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#14100C] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] uppercase block">Screen Size</span>
              <span className="font-semibold text-white mt-0.5 block">{product.screenSize}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#14100C] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] uppercase block">Moisture Content</span>
              <span className="font-semibold text-[#C88A3B] mt-0.5 block">{product.moisturePercent}% (Optimum)</span>
            </div>
            <div className="p-3 rounded-lg bg-[#14100C] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] uppercase block">Variety</span>
              <span className="font-semibold text-white mt-0.5 block">{product.variety}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#14100C] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] uppercase block">Min Order Qty</span>
              <span className="font-semibold text-white mt-0.5 block">{(product.minOrderQuantityKg / 1000).toFixed(1)} MT</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="p-5 rounded-xl bg-[#17130E] border border-[#2D241C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {product.basePricePerKgUSD ? (
                <div>
                  <span className="text-[10px] uppercase text-[#8C8275] block">FOB Port of Djibouti Benchmark</span>
                  <span className="text-2xl font-bold text-white font-['Playfair_Display']">
                    ${product.basePricePerKgUSD.toFixed(2)}
                    <span className="text-xs text-[#8C8275] font-normal"> / kg</span>
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] uppercase text-[#C88A3B] block font-bold">Specialty Micro-Lot</span>
                  <span className="text-lg font-bold text-white">Contract Quotation Only</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadSpec}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-[#3D3224] hover:border-[#C88A3B] text-xs font-semibold text-[#EDE8E1] hover:text-[#C88A3B] flex items-center justify-center gap-2 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Spec PDF</span>
              </button>

              <button
                onClick={() => onOpenRFQ(product.id)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C88A3B]/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Quotation</span>
              </button>
            </div>
          </div>

          {/* Traceability Trigger */}
          <div className="pt-2 flex items-center justify-between border-t border-[#201A14] text-xs text-[#A69C8E]">
            <span className="flex items-center gap-1.5 text-[#C88A3B]">
              <ShieldCheck className="w-4 h-4" />
              <span>ECTA Certified Origin Traceability</span>
            </span>
            <button
              onClick={() => onViewTraceability(sampleLotNumber)}
              className="text-[#C88A3B] hover:underline flex items-center gap-1 font-semibold"
            >
              <QrCode className="w-4 h-4" />
              <span>Inspect Lot & QR Code</span>
            </button>
          </div>

        </div>

      </div>

      {/* Related Coffees */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#201A14]">
          <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#FAF7F2] mb-6">
            Complementary Ethiopian Coffees
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map(p => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="cursor-pointer p-4 rounded-xl bg-[#120F0C] border border-[#262018] hover:border-[#C88A3B] transition-colors space-y-2"
              >
                <div className="h-32 rounded-lg overflow-hidden bg-[#1A1510]">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="font-semibold text-sm text-white line-clamp-1">{p.name}</div>
                <div className="text-xs text-[#8C8275]">{p.originName} • Score: {p.cupScore}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
