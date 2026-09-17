import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, ShieldAlert, Sparkles, Building, Globe, Anchor } from 'lucide-react';
import { Product, Incoterm, PaymentMethod, User } from '../types/index.js';
import { apiClient } from '../lib/apiClient.js';
import { useToast } from './Toast.js';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProductId?: string;
  currentUser: User | null;
  onSuccess?: () => void;
}

export function RFQModal({
  isOpen,
  onClose,
  products,
  selectedProductId,
  currentUser,
  onSuccess
}: RFQModalProps) {
  const { toast } = useToast();

  const [productId, setProductId] = useState('');
  const [quantityKg, setQuantityKg] = useState(19200); // default 1 full 20ft container (320 bags)
  const [packagingOption, setPackagingOption] = useState('60kg Multi-wall GrainPro Jute');
  const [incotermPreference, setIncotermPreference] = useState<Incoterm>('FOB_DJIBOUTI');
  const [destinationCountry, setDestinationCountry] = useState('Germany');
  const [destinationPort, setDestinationPort] = useState('Port of Hamburg');
  const [targetPricePerKgUSD, setTargetPricePerKgUSD] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<PaymentMethod>('TELEGRAPHIC_TRANSFER_TT');
  const [preferredShipDate, setPreferredShipDate] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Guest inputs if not signed in
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestCompany, setGuestCompany] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfqNumber, setSubmittedRfqNumber] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProductId) {
      setProductId(selectedProductId);
    } else if (products.length > 0 && !productId) {
      setProductId(products[0].id);
    }
  }, [selectedProductId, products]);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      toast('Selection Required', 'Please select a coffee product.', 'error');
      return;
    }
    if (!destinationCountry || !destinationPort) {
      toast('Destination Required', 'Please specify destination country and port.', 'error');
      return;
    }
    if (!currentUser && (!guestEmail || !guestCompany)) {
      toast('Company Info Required', 'Please provide company email and name.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.submitRFQ({
        productId,
        quantityKg: Number(quantityKg),
        packagingOption,
        destinationCountry,
        destinationPort,
        incotermPreference,
        targetPricePerKgUSD: targetPricePerKgUSD ? Number(targetPricePerKgUSD) : undefined,
        paymentPreference,
        preferredShipDate: preferredShipDate || undefined,
        specialNotes,
        guestName,
        guestEmail,
        guestCompany
      });

      setSubmittedRfqNumber(res.rfqNumber);
      toast('RFQ Submitted', `Inquiry ${res.rfqNumber} registered with sales team!`, 'success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast('Submission Failed', err.message || 'Could not submit inquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRfqNumber(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#120F0C] border border-[#2B231A] text-[#EDE8E1] rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C8275] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRfqNumber ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#C88A3B]/20 text-[#C88A3B] rounded-full flex items-center justify-center mx-auto border border-[#C88A3B]/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-['Playfair_Display']">
              Request for Quotation Submitted
            </h3>
            <div className="text-sm text-[#C88A3B] font-mono font-semibold">
              RFQ Reference: {submittedRfqNumber}
            </div>
            <p className="text-xs text-[#A69C8E] max-w-md mx-auto leading-relaxed">
              Your formal inquiry has been routed to our Addis Ababa sales desk. A proforma quotation with calculated freight, container slot details, and official ECTA grading report will be issued to your portal within 24 business hours.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-[#C88A3B] text-black font-semibold text-xs uppercase tracking-wider"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88A3B]">
                Direct Origin Sourcing
              </span>
              <h2 className="text-2xl font-bold font-['Playfair_Display'] mt-1 text-[#FAF7F2]">
                Request Commercial Quotation
              </h2>
              <p className="text-xs text-[#A69C8E] mt-1">
                Receive customized FOB Djibouti or CIF containerized pricing with lab specs and lot reservations.
              </p>
            </div>

            {/* Coffee selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">Select Coffee</label>
                <select
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.originName} - Grade {p.grade.split('_')[1]})
                    </option>
                  ))}
                </select>
                {currentProduct && (
                  <div className="text-[11px] text-[#A69C8E] flex items-center justify-between pt-1">
                    <span>SCA Score: <strong className="text-[#C88A3B]">{currentProduct.cupScore}</strong></span>
                    <span>Stock: {(currentProduct.availableStockKg / 1000).toFixed(1)} MT avail</span>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">
                  Quantity (Kg or MT)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="60"
                    min="3600"
                    value={quantityKg}
                    onChange={e => setQuantityKg(Number(e.target.value))}
                    className="flex-1 bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  />
                  <span className="self-center text-xs text-[#8C8275] whitespace-nowrap">
                    ({(quantityKg / 60).toFixed(0)} bags / {(quantityKg / 1000).toFixed(1)} MT)
                  </span>
                </div>
                <div className="flex gap-2 text-[10px] text-[#C88A3B]">
                  <button type="button" onClick={() => setQuantityKg(3600)} className="underline">60 bags (3.6 MT)</button>
                  <button type="button" onClick={() => setQuantityKg(19200)} className="underline">1 FCL Container (19.2 MT)</button>
                  <button type="button" onClick={() => setQuantityKg(38400)} className="underline">2 FCL (38.4 MT)</button>
                </div>
              </div>
            </div>

            {/* Packaging & Incoterms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">Packaging Spec</label>
                <select
                  value={packagingOption}
                  onChange={e => setPackagingOption(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                >
                  <option value="60kg Multi-wall GrainPro Jute">60kg GrainPro Jute Bags</option>
                  <option value="30kg Vacuum Pack Carton Box">30kg Vacuum Pack Sealed Cartons</option>
                  <option value="1 Ton Bulk Container Liner">1-Ton Bulk Container Liner</option>
                  <option value="60kg Standard Jute (Commercial)">60kg Standard Clean Jute</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">Preferred Incoterm</label>
                <select
                  value={incotermPreference}
                  onChange={e => setIncotermPreference(e.target.value as Incoterm)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                >
                  <option value="FOB_DJIBOUTI">FOB Port of Djibouti (Default Export)</option>
                  <option value="CIF">CIF (Cost, Insurance & Ocean Freight)</option>
                  <option value="CFR">CFR (Cost & Ocean Freight)</option>
                  <option value="EXW_ADDIS_ABABA">EXW Addis Ababa Dry Port</option>
                  <option value="FCA_MODJO">FCA Modjo Logistics Hub</option>
                </select>
              </div>
            </div>

            {/* Destination Port & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">Destination Country</label>
                <input
                  type="text"
                  value={destinationCountry}
                  onChange={e => setDestinationCountry(e.target.value)}
                  placeholder="e.g. Germany, Japan, USA, UAE"
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">Destination Port / Discharge</label>
                <input
                  type="text"
                  value={destinationPort}
                  onChange={e => setDestinationPort(e.target.value)}
                  placeholder="e.g. Port of Hamburg, Yokohama, Seattle"
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                  required
                />
              </div>
            </div>

            {/* Target Price & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">Target Price (USD / kg) - Optional</label>
                <input
                  type="number"
                  step="0.05"
                  placeholder="e.g. 5.50"
                  value={targetPricePerKgUSD}
                  onChange={e => setTargetPricePerKgUSD(e.target.value)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D8CFBF]">Payment Terms Preference</label>
                <select
                  value={paymentPreference}
                  onChange={e => setPaymentPreference(e.target.value as PaymentMethod)}
                  className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                >
                  <option value="TELEGRAPHIC_TRANSFER_TT">Telegraphic Transfer (T/T Advance + B/L)</option>
                  <option value="LETTER_OF_CREDIT_LC">Irrevocable Confirmed L/C at sight</option>
                  <option value="CASH_AGAINST_DOCUMENTS_CAD">Cash Against Documents (CAD)</option>
                  <option value="ESCROW">International Trade Escrow</option>
                </select>
              </div>
            </div>

            {/* If guest user, collect company and contact */}
            {!currentUser && (
              <div className="p-3.5 bg-[#17130E] border border-[#2B2217] rounded-lg space-y-3">
                <div className="text-xs font-bold text-[#C88A3B] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>Buyer Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={guestCompany}
                    onChange={e => setGuestCompany(e.target.value)}
                    className="bg-[#100D0A] border border-[#332A20] rounded px-2.5 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Person"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="bg-[#100D0A] border border-[#332A20] rounded px-2.5 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Work Email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    className="bg-[#100D0A] border border-[#332A20] rounded px-2.5 py-1.5 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
                    required
                  />
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D8CFBF]">Special Specifications / Instructions</label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                placeholder="e.g. Need strict moisture under 11.2%, screening 16+, specific organic certificate, or shipping date constraints."
                className="w-full bg-[#1A1510] border border-[#332A20] rounded-lg px-3 py-2 text-xs text-[#EDE8E1] focus:outline-none focus:border-[#C88A3B]"
              />
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#8C8275]">
                Certified by Ethiopian Coffee & Tea Authority
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting...' : 'Submit Commercial RFQ'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
