import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Search, ShieldCheck, MapPin, Award, Calendar, CheckCircle2, QrCode, Download, ExternalLink } from 'lucide-react';
import { apiClient } from '../lib/apiClient.js';
import { TraceabilityRecord } from '../types/index.js';
import { useToast } from '../components/Toast.js';

interface TraceabilityViewProps {
  initialLotNumber?: string;
  onOpenRFQ: (productId?: string) => void;
}

export function TraceabilityView({ initialLotNumber, onOpenRFQ }: TraceabilityViewProps) {
  const { toast } = useToast();
  const [lotInput, setLotInput] = useState(initialLotNumber || 'MK-JIM-2026-001');
  const [record, setRecord] = useState<TraceabilityRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const sampleLots = [
    { lot: 'MK-JIM-2026-001', name: 'Jimma Grade 4 Commercial Natural', origin: 'Jimma' },
    { lot: 'MK-YIR-2026-004', name: 'Yirgacheffe Kochere Grade 1 Washed', origin: 'Yirgacheffe' },
    { lot: 'MK-GUJ-2026-002', name: 'Guji Uraga Anaerobic Micro-Lot', origin: 'Guji' }
  ];

  const fetchRecord = async (lot: string) => {
    setIsLoading(true);
    try {
      const data = await apiClient.getTraceability(lot);
      setRecord(data);
      // Generate QR
      const url = `${window.location.origin}/#traceability/${data.lotNumber}`;
      const qr = await QRCode.toDataURL(url, {
        width: 300,
        margin: 1,
        color: { dark: '#0E0C09', light: '#F5EFE6' }
      });
      setQrDataUrl(qr);
    } catch (err: any) {
      toast('Lot Lookup Error', err.message || 'Lot not found', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord(lotInput);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotInput.trim()) return;
    fetchRecord(lotInput.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          ECTA Verified Seed-to-Cup Ledger
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
          Traceability & Lot Verification
        </h1>
        <p className="text-xs sm:text-sm text-[#A69C8E] leading-relaxed">
          Every container exported by MY KUHLI carries an irrevocable digital origin audit. Verify the washing station, harvest coordinates, farmer cooperative payout, and official ECTA cupping certificate.
        </p>
      </div>

      {/* Lot Search Bar */}
      <div className="max-w-2xl mx-auto bg-[#120F0C] border border-[#2B231A] rounded-2xl p-4 shadow-xl space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Enter Lot Number (e.g. MK-JIM-2026-001)"
              value={lotInput}
              onChange={e => setLotInput(e.target.value)}
              className="w-full bg-[#1A1510] border border-[#332A20] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Lot'}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#8C8275] text-[11px]">Quick inspect:</span>
          {sampleLots.map(s => (
            <button
              key={s.lot}
              onClick={() => {
                setLotInput(s.lot);
                fetchRecord(s.lot);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                lotInput === s.lot
                  ? 'bg-[#C88A3B] text-black font-bold border-[#C88A3B]'
                  : 'bg-[#19140F] text-[#B8AEA2] hover:text-white border-[#2E2419]'
              }`}
            >
              {s.lot} ({s.origin})
            </button>
          ))}
        </div>
      </div>

      {/* Verified Lot Display */}
      {record ? (
        <div className="bg-[#120F0C] border border-[#2B231A] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in">
          
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#241D15]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#C88A3B] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#C88A3B] animate-ping" />
                <span>OFFICIALLY VERIFIED EXPORT BATCH</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2] mt-1">
                {record.coffeeName}
              </h2>
              <div className="text-xs text-[#A69C8E] mt-1">
                Lot Batch Reference: <span className="font-mono text-[#EDE8E1] font-bold">{record.lotNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#1A1510] border border-[#2E2419] text-center min-w-24">
                <span className="text-[10px] uppercase text-[#8C8275] block">SCA Cupping</span>
                <span className="text-2xl font-bold text-[#C88A3B] font-['Playfair_Display']">
                  {record.cuppingScore}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#1A1510] border border-[#2E2419] text-center min-w-28">
                <span className="text-[10px] uppercase text-[#8C8275] block">ECTA Grade</span>
                <span className="text-xs font-bold text-[#EDE8E1] mt-1 block">
                  {record.ectaLiquoringGrade}
                </span>
              </div>
            </div>
          </div>

          {/* 3-Column Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Col 1: Terroir & Farm */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C88A3B] flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Terroir & Smallholder Cooperative
              </h3>

              <div className="p-4 rounded-xl bg-[#17130E] border border-[#262018] space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Origin Terroir</span>
                  <span className="font-semibold text-white">{record.originName}, {record.region}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Altitude Elevation</span>
                  <span className="font-semibold text-white">{record.altitudeMeters} MASL</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">GPS Location</span>
                  <span className="font-mono text-[#C88A3B]">{record.gpsLatitude}° N, {record.gpsLongitude}° E</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Primary Cooperative</span>
                  <span className="font-semibold text-white">{record.cooperativeName}</span>
                </div>
                <div className="pt-2 border-t border-[#241D15]">
                  <span className="text-[10px] text-[#8C8275] uppercase block">Direct Farmer Fair Premium</span>
                  <span className="font-bold text-[#C88A3B] text-sm">${record.farmerFairShareUSDPerKg} / kg (Direct-to-grower)</span>
                </div>
              </div>
            </div>

            {/* Col 2: Processing & Milling */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C88A3B] flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Milling & Quality Assurance
              </h3>

              <div className="p-4 rounded-xl bg-[#17130E] border border-[#262018] space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Washing / Processing Station</span>
                  <span className="font-semibold text-white">{record.washingStationName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Fermentation & Drying</span>
                  <span className="font-semibold text-white">
                    {record.fermentationHours > 0 ? `${record.fermentationHours} hrs controlled tank` : 'Natural parchment drying'} • {record.dryingDaysOnRaisedBeds} days on African raised beds
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Harvest Season</span>
                  <span className="font-semibold text-white">{record.harvestMonthYear}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Export Dry Mill</span>
                  <span className="font-semibold text-white">Modjo Dry Port Export Consolidation Hub</span>
                </div>
                <div className="pt-2 border-t border-[#241D15]">
                  <span className="text-[10px] text-[#8C8275] uppercase block">Flavor Attributes</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {record.flavorNotes.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#241D15] text-[#D8CFBF]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: Real QR Code Container */}
            <div className="space-y-4 flex flex-col items-center justify-center p-6 rounded-xl bg-[#17130E] border border-[#262018] text-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C88A3B] flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                Irrevocable Lot QR
              </h3>

              {qrDataUrl && (
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <img
                    src={qrDataUrl}
                    alt={`QR for ${record.lotNumber}`}
                    className="w-44 h-44 object-contain"
                  />
                </div>
              )}

              <div className="text-xs font-mono text-[#EDE8E1] font-semibold mt-1">
                {record.lotNumber}
              </div>

              <p className="text-[11px] text-[#8C8275] max-w-xs">
                Each exported 60kg GrainPro bag and shipping container carries this scannable verification tag.
              </p>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`MY_KUHLI_${record.lotNumber}_QR.png`}
                  className="px-4 py-2 rounded-lg bg-[#241D15] hover:bg-[#332A20] text-xs font-semibold text-[#EDE8E1] flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Print-Ready QR</span>
                </a>
              )}
            </div>

          </div>

          {/* Supply Chain Timeline */}
          <div className="pt-6 border-t border-[#241D15] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#EDE8E1]">
              Chain of Custody & Traceability Journey
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#14100C] border border-[#241D15] relative">
                <div className="w-2 h-2 rounded-full bg-[#C88A3B] mb-2" />
                <span className="text-[10px] text-[#8C8275] block">1. Cherry Intake</span>
                <span className="font-semibold text-white">Smallholder Hand Pick</span>
              </div>
              <div className="p-3 rounded-lg bg-[#14100C] border border-[#241D15]">
                <div className="w-2 h-2 rounded-full bg-[#C88A3B] mb-2" />
                <span className="text-[10px] text-[#8C8275] block">2. Wet/Dry Mill</span>
                <span className="font-semibold text-white">{record.washingStationName}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#14100C] border border-[#241D15]">
                <div className="w-2 h-2 rounded-full bg-[#C88A3B] mb-2" />
                <span className="text-[10px] text-[#8C8275] block">3. Dry Milling</span>
                <span className="font-semibold text-white">Modjo Gravity & Sorters</span>
              </div>
              <div className="p-3 rounded-lg bg-[#14100C] border border-[#241D15]">
                <div className="w-2 h-2 rounded-full bg-[#C88A3B] mb-2" />
                <span className="text-[10px] text-[#8C8275] block">4. ECTA Liquoring</span>
                <span className="font-semibold text-white">Score: {record.cuppingScore} SCA</span>
              </div>
              <div className="p-3 rounded-lg bg-[#14100C] border border-[#241D15]">
                <div className="w-2 h-2 rounded-full bg-[#C88A3B] mb-2" />
                <span className="text-[10px] text-[#8C8275] block">5. Ocean Export</span>
                <span className="font-semibold text-white">Port of Djibouti FCL</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center text-xs">
            <span className="text-[#8C8275]">
              Interested in contracting this specific lot batch?
            </span>
            <button
              onClick={() => onOpenRFQ()}
              className="px-5 py-2 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold uppercase tracking-wider"
            >
              Request Contract Quotation
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#8C8275]">
          Loading lot verification details...
        </div>
      )}
    </div>
  );
}
