import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, MapPin, Calendar, Award, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { TraceabilityRecord } from '../types/index.js';

interface TraceabilityModalProps {
  record: TraceabilityRecord | null;
  onClose: () => void;
}

export function TraceabilityModal({ record, onClose }: TraceabilityModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (record) {
      const url = `${window.location.origin}/#traceability/${record.lotNumber}`;
      QRCode.toDataURL(url, {
        width: 260,
        margin: 1,
        color: {
          dark: '#0E0C09',
          light: '#F8F4ED'
        }
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [record]);

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#120F0C] border border-[#2D241C] text-[#EDE8E1] rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C8275] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start justify-between border-b border-[#241D15] pb-5 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
              Authentic Origin Verification
            </span>
            <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#FAF7F2] mt-0.5">
              {record.coffeeName}
            </h2>
            <div className="text-xs font-mono text-[#A69C8E] mt-1">
              Lot Batch: <strong className="text-[#C88A3B]">{record.lotNumber}</strong>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-[#8C8275] block">SCA Cupping Score</span>
            <span className="text-3xl font-bold text-[#C88A3B] font-['Playfair_Display']">
              {record.cuppingScore}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center bg-[#17130E] border border-[#282016] rounded-xl p-5 text-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${record.lotNumber}`}
                className="w-40 h-40 rounded-lg shadow-lg border border-[#EDE8E1]/20"
              />
            ) : (
              <div className="w-40 h-40 bg-[#241D15] animate-pulse rounded-lg flex items-center justify-center text-xs text-[#8C8275]">
                Generating QR...
              </div>
            )}
            <span className="text-[11px] font-mono text-[#C88A3B] mt-3 font-semibold">
              {record.lotNumber}
            </span>
            <span className="text-[10px] text-[#8C8275] mt-1">
              Scan with mobile to view live public ledger
            </span>

            {qrDataUrl && (
              <a
                href={qrDataUrl}
                download={`Traceability_QR_${record.lotNumber}.png`}
                className="mt-3 text-[11px] text-[#D8CFBF] hover:text-[#C88A3B] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Save High-Res QR</span>
              </a>
            )}
          </div>

          {/* Traceability Spec Details */}
          <div className="md:col-span-2 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#17130E] border border-[#282016] rounded-lg">
              <div>
                <span className="text-[10px] text-[#8C8275] uppercase block">Highland Terroir</span>
                <span className="font-semibold text-[#EDE8E1]">{record.originName} - {record.region}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C8275] uppercase block">Altitude</span>
                <span className="font-semibold text-[#EDE8E1]">{record.altitudeMeters} MASL</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C8275] uppercase block">GPS Coordinates</span>
                <span className="font-mono text-[#C88A3B]">{record.gpsLatitude}° N, {record.gpsLongitude}° E</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C8275] uppercase block">Harvest Season</span>
                <span className="font-semibold text-[#EDE8E1]">{record.harvestMonthYear}</span>
              </div>
            </div>

            <div className="p-3 bg-[#17130E] border border-[#282016] rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-[#8C8275] uppercase block">Primary Cooperative & Mill</span>
                  <span className="font-semibold text-[#EDE8E1]">{record.cooperativeName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8C8275] uppercase block">Direct Farmer Share</span>
                  <span className="text-[#C88A3B] font-bold">${record.farmerFairShareUSDPerKg} / kg (Fair Premium)</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#8C8275] uppercase block">Processing & Drying Details</span>
                <span className="text-[#A69C8E]">
                  {record.washingStationName} • {record.fermentationHours > 0 ? `${record.fermentationHours}h fermentation • ` : 'Sun-dried intact • '}
                  {record.dryingDaysOnRaisedBeds} days on African raised beds.
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#8C8275] uppercase block">Official Liquoring & ECTA Grade</span>
                <span className="text-[#EDE8E1] flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C88A3B]" />
                  {record.ectaLiquoringGrade}
                </span>
              </div>
            </div>

            {/* Flavor Notes Pill list */}
            <div>
              <span className="text-[10px] text-[#8C8275] uppercase block mb-1">Cupping Flavour Profile</span>
              <div className="flex flex-wrap gap-1.5">
                {record.flavorNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#241D15] text-[#D8CFBF] border border-[#332A20]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#241D15] flex items-center justify-between text-xs text-[#8C8275]">
          <span>Issuing Authority: Ethiopian Coffee and Tea Authority (ECTA)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#241D15] hover:bg-[#332A20] text-[#EDE8E1] font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
