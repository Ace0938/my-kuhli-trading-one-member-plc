import React, { useState, useEffect } from 'react';
import {
  User,
  BuyerProfile,
  RFQ,
  Quotation,
  Order,
  Payment,
  Shipment,
  ExportDocument
} from '../types/index.js';
import { apiClient } from '../lib/apiClient.js';
import { useToast } from '../components/Toast.js';
import {
  FileText,
  Package,
  Truck,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Building,
  DollarSign,
  Send,
  ArrowRight,
  Plus
} from 'lucide-react';

interface BuyerDashboardViewProps {
  currentUser: User;
  buyerProfile: BuyerProfile | null;
  onOpenRFQ: () => void;
  onViewTraceability: (lotNumber: string) => void;
}

export function BuyerDashboardView({
  currentUser,
  buyerProfile,
  onOpenRFQ,
  onViewTraceability
}: BuyerDashboardViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'quotations' | 'orders' | 'documents' | 'profile'>('overview');

  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [documents, setDocuments] = useState<ExportDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [r, q, o, s, d] = await Promise.all([
        apiClient.getRFQs(),
        apiClient.getQuotations(),
        apiClient.getOrders(),
        apiClient.getShipments(),
        apiClient.getExportDocuments()
      ]);
      setRfqs(r);
      setQuotations(q);
      setOrders(o);
      setShipments(s);
      setDocuments(d);
    } catch (err: any) {
      toast('Sync Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      toast('Processing', 'Accepting quotation and booking export allocation...', 'info');
      const res = await apiClient.acceptQuotation(quoteId);
      toast('Contract Booked', `Order ${res.order.orderNumber} successfully created!`, 'success');
      loadData();
      setActiveTab('orders');
    } catch (err: any) {
      toast('Acceptance Failed', err.message, 'error');
    }
  };

  const handleDownloadQuotePdf = async (quoteId: string, quoteNumber: string) => {
    try {
      toast('Generating PDF', `Preparing official Proforma ${quoteNumber}...`, 'info');
      const res = await apiClient.getQuotationPdf(quoteId);
      const link = document.createElement('a');
      link.href = res.pdfDataUri;
      link.download = res.fileName;
      link.click();
      toast('Success', `Downloaded ${res.fileName}`, 'success');
    } catch (err: any) {
      toast('Download Error', err.message, 'error');
    }
  };

  const handleDownloadInvoicePdf = async (orderId: string, orderNumber: string) => {
    try {
      toast('Generating PDF', `Preparing Commercial Invoice for ${orderNumber}...`, 'info');
      const res = await apiClient.getOrderInvoicePdf(orderId);
      const link = document.createElement('a');
      link.href = res.pdfDataUri;
      link.download = res.fileName;
      link.click();
      toast('Success', `Downloaded ${res.fileName}`, 'success');
    } catch (err: any) {
      toast('Download Error', err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Buyer Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#17130E] to-[#120F0C] border border-[#2D241C] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#C88A3B] font-semibold tracking-wider uppercase mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>{buyerProfile?.companyName || 'Verified International Buyer'}</span>
            <span>•</span>
            <span>{buyerProfile?.country || 'Global Partner'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
            International Buyer Portal
          </h1>
          <p className="text-xs text-[#A69C8E] mt-1">
            Manage your direct Ethiopian green coffee allocations, proforma quotations, container shipments, and official ECTA export documents.
          </p>
        </div>

        <button
          onClick={onOpenRFQ}
          className="px-5 py-2.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 self-start md:self-auto transition-all shadow-lg shadow-[#C88A3B]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Coffee Inquiry (RFQ)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#241D15] pb-2 text-xs font-semibold no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-[#C88A3B] text-black font-bold' : 'bg-[#14110D] text-[#A69C8E] hover:text-white border border-[#2B231A]'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rfqs' ? 'bg-[#C88A3B] text-black font-bold' : 'bg-[#14110D] text-[#A69C8E] hover:text-white border border-[#2B231A]'
          }`}
        >
          <span>My Inquiries (RFQs)</span>
          <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px]">{rfqs.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('quotations')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'quotations' ? 'bg-[#C88A3B] text-black font-bold' : 'bg-[#14110D] text-[#A69C8E] hover:text-white border border-[#2B231A]'
          }`}
        >
          <span>Proforma Quotations</span>
          <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px]">{quotations.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-[#C88A3B] text-black font-bold' : 'bg-[#14110D] text-[#A69C8E] hover:text-white border border-[#2B231A]'
          }`}
        >
          <span>Export Orders</span>
          <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px]">{orders.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'documents' ? 'bg-[#C88A3B] text-black font-bold' : 'bg-[#14110D] text-[#A69C8E] hover:text-white border border-[#2B231A]'
          }`}
        >
          <span>Export Document Vault</span>
          <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px]">{documents.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'profile' ? 'bg-[#C88A3B] text-black font-bold' : 'bg-[#14110D] text-[#A69C8E] hover:text-white border border-[#2B231A]'
          }`}
        >
          Company & Trade Profile
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Active Inquiries</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">{rfqs.length}</div>
              <span className="text-xs text-[#C88A3B]">Direct with Addis Sales Desk</span>
            </div>
            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Proforma Quotes</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">{quotations.length}</div>
              <span className="text-xs text-[#A69C8E]">FOB Djibouti & CIF priced</span>
            </div>
            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Contracted Orders</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">{orders.length}</div>
              <span className="text-xs text-emerald-400">Total: ${(orders.reduce((acc, o) => acc + o.totalAmountUSD, 0) / 1000).toFixed(1)}k USD</span>
            </div>
            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Containers in Sea Transit</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">{shipments.length}</div>
              <span className="text-xs text-[#C88A3B]">Port of Djibouti / Maersk / MSC</span>
            </div>
          </div>

          {/* Quick Active Orders Preview */}
          <div className="p-6 rounded-2xl bg-[#120F0C] border border-[#262018] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Playfair_Display'] text-[#FAF7F2]">
                Active Export Allocations
              </h3>
              <button onClick={() => setActiveTab('orders')} className="text-xs text-[#C88A3B] hover:underline flex items-center gap-1">
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8C8275]">
                No active orders yet. Review your quotations or submit an RFQ to book a lot.
              </div>
            ) : (
              <div className="divide-y divide-[#201A14]">
                {orders.map(o => (
                  <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">{o.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1F2C1F] text-emerald-400 border border-emerald-500/20">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-[#A69C8E] mt-1">
                        Total: ${(o.totalAmountUSD).toLocaleString()} USD • {o.items.map(i => `${i.productName} (${(i.quantityKg / 1000).toFixed(1)} MT)`).join(', ')}
                      </div>
                      <div className="text-[11px] text-[#8C8275] mt-0.5">
                        Incoterm: {o.incoterm} • Destination: {o.destinationPort}, {o.destinationCountry}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadInvoicePdf(o.id, o.orderNumber)}
                        className="px-3 py-1.5 rounded bg-[#1C1611] hover:bg-[#2B2217] text-xs font-semibold text-[#EDE8E1] border border-[#332A20] flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C88A3B]" />
                        <span>Commercial Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RFQs Tab */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
              Submitted Requests for Quotation (RFQs)
            </h3>
            <button
              onClick={onOpenRFQ}
              className="px-4 py-2 rounded-full bg-[#C88A3B] text-black font-semibold text-xs uppercase tracking-wider"
            >
              + Create RFQ
            </button>
          </div>

          {rfqs.length === 0 ? (
            <div className="text-center py-12 bg-[#120F0C] border border-[#262018] rounded-xl text-xs text-[#8C8275]">
              No inquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {rfqs.map(rfq => (
                <div key={rfq.id} className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#C88A3B]">{rfq.rfqNumber}</span>
                      <h4 className="text-base font-bold text-white mt-0.5">{rfq.productName}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#1F1912] text-[#D8CFBF] border border-[#382E20] w-fit">
                      Status: <strong className="text-[#C88A3B]">{rfq.status}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#A69C8E] pt-2 border-t border-[#201A14]">
                    <div>
                      <span className="text-[10px] text-[#8C8275] block">Volume</span>
                      <span className="text-white font-semibold">{(rfq.quantityKg / 1000).toFixed(1)} MT ({(rfq.quantityKg / 60).toFixed(0)} bags)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C8275] block">Packaging</span>
                      <span className="text-white font-semibold">{rfq.packagingOption}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C8275] block">Incoterm</span>
                      <span className="text-white font-semibold">{rfq.incotermPreference}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C8275] block">Discharge Port</span>
                      <span className="text-white font-semibold">{rfq.destinationPort}, {rfq.destinationCountry}</span>
                    </div>
                  </div>

                  {rfq.specialNotes && (
                    <div className="text-xs text-[#8C8275] bg-[#17130E] p-2.5 rounded border border-[#241D15]">
                      Notes: {rfq.specialNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quotations Tab */}
      {activeTab === 'quotations' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
              Official Proforma Quotations
            </h3>
            <span className="text-xs text-[#8C8275]">Issued by MY KUHLI Commercial Export Desk</span>
          </div>

          {quotations.length === 0 ? (
            <div className="text-center py-12 bg-[#120F0C] border border-[#262018] rounded-xl text-xs text-[#8C8275]">
              No quotations issued yet. Submit an RFQ to receive an official proforma.
            </div>
          ) : (
            <div className="space-y-4">
              {quotations.map(quote => (
                <div key={quote.id} className="p-6 rounded-xl bg-[#120F0C] border border-[#2D241C] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#C88A3B]">{quote.quotationNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          quote.status === 'ACCEPTED'
                            ? 'bg-[#1C2D1C] text-emerald-400'
                            : 'bg-[#2E2417] text-[#C88A3B]'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#A69C8E] mt-1">
                        Valid Until: {new Date(quote.validUntil).toLocaleDateString()} • Incoterm: {quote.incoterm}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-[#8C8275] block">Total Proforma Value</span>
                      <span className="text-2xl font-bold text-white font-['Playfair_Display']">
                        ${quote.totalAmountUSD.toLocaleString()}
                        <span className="text-xs text-[#8C8275] font-normal"> USD</span>
                      </span>
                    </div>
                  </div>

                  {/* Line items table */}
                  <div className="bg-[#17130E] rounded-lg p-3 border border-[#241D15] overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-[#8C8275] border-b border-[#241D15]">
                          <th className="pb-2">Coffee Description</th>
                          <th className="pb-2">Bags / MT</th>
                          <th className="pb-2">Unit Price ($/kg)</th>
                          <th className="pb-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#201A14]">
                        {quote.items.map((item, idx) => (
                          <tr key={idx} className="text-[#EDE8E1]">
                            <td className="py-2">{item.productName} ({item.grade})</td>
                            <td className="py-2">{item.bagsCount} bags ({(item.quantityKg / 1000).toFixed(1)} MT)</td>
                            <td className="py-2 font-mono">${item.pricePerKgUSD.toFixed(2)}</td>
                            <td className="py-2 text-right font-mono font-semibold">${item.totalPriceUSD.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-[#A69C8E] pt-2 border-t border-[#201A14]">
                    <div>
                      FOB Coffee: ${quote.subtotalUSD.toLocaleString()} | Ocean Freight: ${quote.freightCostUSD.toLocaleString()} | Marine Insurance: ${quote.insuranceCostUSD.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleDownloadQuotePdf(quote.id, quote.quotationNumber)}
                        className="px-3.5 py-2 rounded-lg bg-[#1C1611] hover:bg-[#2B2217] text-xs font-semibold text-[#EDE8E1] border border-[#332A20] flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C88A3B]" />
                        <span>Download PDF Proforma</span>
                      </button>

                      {quote.status !== 'ACCEPTED' && (
                        <button
                          onClick={() => handleAcceptQuote(quote.id)}
                          className="px-5 py-2 rounded-lg bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider transition-colors"
                        >
                          Accept & Book Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
            Contracted Export Orders & Shipments
          </h3>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-[#120F0C] border border-[#262018] rounded-xl text-xs text-[#8C8275]">
              No active export orders. Accept a quotation to generate an order.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-6 rounded-xl bg-[#120F0C] border border-[#2D241C] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">{order.orderNumber}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#192C19] text-emerald-400 border border-emerald-500/20">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-[#A69C8E] mt-1">
                        Incoterm: {order.incoterm} • Destination: {order.destinationPort}, {order.destinationCountry}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-[#8C8275] block">Total Order</span>
                        <span className="text-xl font-bold text-white font-mono">${order.totalAmountUSD.toLocaleString()} USD</span>
                      </div>
                      <button
                        onClick={() => handleDownloadInvoicePdf(order.id, order.orderNumber)}
                        className="px-3.5 py-2 rounded-lg bg-[#1C1611] hover:bg-[#2B2217] text-xs font-semibold text-[#EDE8E1] border border-[#332A20] flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C88A3B]" />
                        <span>Commercial Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Progress Stepper */}
                  <div className="p-4 rounded-xl bg-[#17130E] border border-[#241D15] space-y-3">
                    <span className="text-[10px] uppercase font-bold text-[#8C8275] tracking-wider block">
                      Export Logistics Milestones
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                      <div className="p-2 rounded bg-[#100D0A] border border-[#262018]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                        <span className="text-[10px] text-[#EDE8E1] block">Contract Signed</span>
                      </div>
                      <div className="p-2 rounded bg-[#100D0A] border border-[#262018]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                        <span className="text-[10px] text-[#EDE8E1] block">Payment / LC Confirmed</span>
                      </div>
                      <div className="p-2 rounded bg-[#100D0A] border border-[#262018]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                        <span className="text-[10px] text-[#EDE8E1] block">Milled at Modjo</span>
                      </div>
                      <div className="p-2 rounded bg-[#100D0A] border border-[#262018]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                        <span className="text-[10px] text-[#EDE8E1] block">ECTA Inspection</span>
                      </div>
                      <div className="p-2 rounded bg-[#1C1710] border border-[#C88A3B]/40">
                        <Truck className="w-4 h-4 text-[#C88A3B] mx-auto mb-1 animate-pulse" />
                        <span className="text-[10px] text-[#C88A3B] font-bold block">Port of Djibouti</span>
                      </div>
                      <div className="p-2 rounded bg-[#100D0A] border border-[#262018] opacity-60">
                        <Package className="w-4 h-4 text-[#8C8275] mx-auto mb-1" />
                        <span className="text-[10px] text-[#8C8275] block">Discharge Port</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Documents Vault Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
                Official Export Document Vault
              </h3>
              <p className="text-xs text-[#8C8275] mt-0.5">
                Authentic government and maritime shipping documentation for customs clearance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#C88A3B]">{doc.documentType.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {doc.verificationStatus}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-white mt-1">{doc.title}</h4>
                  <div className="text-xs text-[#8C8275] mt-1 font-mono">Doc Ref: {doc.documentNumber}</div>
                  <div className="text-[11px] text-[#A69C8E] mt-0.5">Issuing Authority: {doc.issuingAuthority}</div>
                </div>

                <div className="pt-3 border-t border-[#201A14] flex items-center justify-between">
                  <span className="text-[10px] text-[#6E6559]">Issued: {new Date(doc.issuedDate).toLocaleDateString()}</span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded bg-[#1C1611] hover:bg-[#2B2217] text-xs font-semibold text-[#EDE8E1] border border-[#332A20] flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C88A3B]" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#120F0C] border border-[#262018] rounded-xl p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
              Company Trade Profile & Credentials
            </h3>
            <p className="text-xs text-[#8C8275] mt-1">
              Registered details used for proforma documentation and maritime customs bills.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#17130E] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] block">Company Name</span>
              <span className="font-semibold text-white">{buyerProfile?.companyName || 'Not specified'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#17130E] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] block">Corporate Tax ID / VAT</span>
              <span className="font-semibold text-white">{buyerProfile?.taxRegistrationNumber || 'DE328994102'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#17130E] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] block">Country & City</span>
              <span className="font-semibold text-white">{buyerProfile?.city}, {buyerProfile?.country}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#17130E] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] block">Primary Discharge Port</span>
              <span className="font-semibold text-white">{buyerProfile?.destinationPort || 'Port of Hamburg'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#17130E] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] block">Annual Volume Target</span>
              <span className="font-semibold text-white">{buyerProfile?.annualCoffeeVolumeMT || 40} Metric Tons / year</span>
            </div>
            <div className="p-3 rounded-lg bg-[#17130E] border border-[#262018]">
              <span className="text-[10px] text-[#8C8275] block">Verification Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {buyerProfile?.accountStatus || 'ACTIVE'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
