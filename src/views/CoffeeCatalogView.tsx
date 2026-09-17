import React, { useState, useMemo } from 'react';
import { Product } from '../types/index.js';
import { CoffeeCard } from '../components/CoffeeCard.js';
import { Search, Filter, SlidersHorizontal, RotateCcw, Mountain, Coffee } from 'lucide-react';

interface CoffeeCatalogViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenRFQ: (productId: string) => void;
  onViewTraceability: (lotNumber: string) => void;
}

export function CoffeeCatalogView({
  products,
  onSelectProduct,
  onOpenRFQ,
  onViewTraceability
}: CoffeeCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedProcess, setSelectedProcess] = useState('ALL');
  const [minScore, setMinScore] = useState<number>(0);

  // Extract unique origins from products
  const origins = useMemo(() => {
    const set = new Set(products.map(p => p.originName));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesOrigin = p.originName.toLowerCase().includes(q);
        const matchesNotes = p.flavorNotes.some(n => n.toLowerCase().includes(q));
        if (!matchesName && !matchesOrigin && !matchesNotes) return false;
      }
      if (selectedOrigin !== 'ALL' && p.originName !== selectedOrigin) return false;
      if (selectedGrade !== 'ALL' && p.grade !== selectedGrade) return false;
      if (selectedProcess !== 'ALL' && p.processingMethod !== selectedProcess) return false;
      if (minScore > 0 && p.cupScore < minScore) return false;
      return true;
    });
  }, [products, searchQuery, selectedOrigin, selectedGrade, selectedProcess, minScore]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedOrigin('ALL');
    setSelectedGrade('ALL');
    setSelectedProcess('ALL');
    setMinScore(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-r from-[#17130E] to-[#120F0C] border border-[#2B2217] shadow-xl overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B] flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5" />
            2026 Harvest Green Coffee Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
            Ethiopian Coffee Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
            From high-volume commercial Grade 4 & 5 naturals out of Jimma to pristine 89+ micro-lots from Yirgacheffe and Guji. Available for direct export container allocation under FOB Djibouti and CIF terms.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-4 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8275] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search origin, notes, grade..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg pl-9 pr-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
            />
          </div>

          {/* Origin Filter */}
          <div>
            <select
              value={selectedOrigin}
              onChange={e => setSelectedOrigin(e.target.value)}
              className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
            >
              <option value="ALL">All Ethiopian Origins</option>
              {origins.filter(o => o !== 'ALL').map(o => (
                <option key={o} value={o}>{o} Region</option>
              ))}
            </select>
          </div>

          {/* Processing Filter */}
          <div>
            <select
              value={selectedProcess}
              onChange={e => setSelectedProcess(e.target.value)}
              className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
            >
              <option value="ALL">All Processing Methods</option>
              <option value="NATURAL">Natural / Sun-Dried</option>
              <option value="WASHED">Fully Washed</option>
              <option value="ANAEROBIC">Anaerobic Fermentation</option>
            </select>
          </div>

          {/* Cupping Score Minimum */}
          <div className="flex items-center gap-2">
            <select
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
            >
              <option value="0">Any Cupping Score</option>
              <option value="82">82+ Commercial & Premium</option>
              <option value="85">85+ Specialty Grade</option>
              <option value="88">88+ Exemplary Micro-Lots</option>
            </select>

            {(searchQuery || selectedOrigin !== 'ALL' || selectedGrade !== 'ALL' || selectedProcess !== 'ALL' || minScore > 0) && (
              <button
                onClick={handleReset}
                title="Reset all filters"
                className="p-2 rounded-lg bg-[#1F1811] text-[#8C8275] hover:text-[#C88A3B] border border-[#332A20] transition-colors shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Origin Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1F1912] text-xs">
          <span className="text-[#8C8275] text-[11px] mr-1">Quick Select:</span>
          {origins.map(o => (
            <button
              key={o}
              onClick={() => setSelectedOrigin(o)}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                selectedOrigin === o
                  ? 'bg-[#C88A3B] text-black font-bold'
                  : 'bg-[#1A1510] text-[#A69C8E] hover:text-[#EDE8E1] border border-[#2E251B]'
              }`}
            >
              {o === 'ALL' ? 'All Terroirs' : o}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results Count */}
      <div className="flex items-center justify-between text-xs text-[#8C8275]">
        <span>Showing <strong className="text-white">{filteredProducts.length}</strong> export grade coffee lots</span>
        <span>Standard Packaging: 60kg GrainPro Jute / 30kg Vacuum Carton</span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#120F0C] border border-[#262018] rounded-2xl space-y-3">
          <Coffee className="w-10 h-10 text-[#8C8275] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#EDE8E1]">No matching coffees found</h3>
          <p className="text-xs text-[#8C8275] max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to browse all Ethiopian export varieties.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-full bg-[#C88A3B] text-black text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <CoffeeCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onOpenRFQ={onOpenRFQ}
              onViewTraceability={onViewTraceability}
            />
          ))}
        </div>
      )}
    </div>
  );
}
