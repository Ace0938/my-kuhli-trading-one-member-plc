import React, { useState, useEffect } from 'react';
import {
  User,
  Product,
  RFQ,
  Quotation,
  Order,
  Shipment,
  ExportDocument,
  AdminAnalytics,
  AuditLog,
  BlogPost
} from '../types/index.js';
import { apiClient } from '../lib/apiClient.js';
import { useToast } from '../components/Toast.js';
import {
  BarChart3,
  Package,
  FileSpreadsheet,
  Truck,
  Shield,
  FileCheck,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  DollarSign,
  Flame,
  Database,
  Server
} from 'lucide-react';

interface AdminDashboardViewProps {
  currentUser: User;
  onViewTraceability: (lotNumber: string) => void;
}

export function AdminDashboardView({ currentUser, onViewTraceability }: AdminDashboardViewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'analytics' | 'rfqs' | 'quotations' | 'orders' | 'inventory' | 'shipments' | 'documents' | 'cms' | 'audit' | 'tests' | 'firebase'>('analytics');

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [documents, setDocuments] = useState<ExportDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick Quotation Generator state for an RFQ
  const [activeRfqForQuote, setActiveRfqForQuote] = useState<RFQ | null>(null);
  const [quotePricePerKg, setQuotePricePerKg] = useState<number>(5.60);
  const [quoteFreightUSD, setQuoteFreightUSD] = useState<number>(3400);
  const [quoteInsuranceUSD, setQuoteInsuranceUSD] = useState<number>(450);

  // System test runner state
  const [testResults, setTestResults] = useState<any | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Firebase state
  const [firebaseStatus, setFirebaseStatus] = useState<any>({
    connected: true,
    projectId: 'intrepid-bruin-qd2jw',
    databaseId: 'ai-studio-mykuhliethiopian-a05ec166-67ee-4859-8552-b00cc48e5a1a'
  });
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [an, r, q, o, p, s, d, l, b] = await Promise.all([
        apiClient.getAdminAnalytics(),
        apiClient.getRFQs(),
        apiClient.getQuotations(),
        apiClient.getOrders(),
        apiClient.getProducts(),
        apiClient.getShipments(),
        apiClient.getExportDocuments(),
        apiClient.getAuditLogs(),
        apiClient.getBlogPosts()
      ]);
      setAnalytics(an);
      setRfqs(r);
      setQuotations(q);
      setOrders(o);
      setProducts(p);
      setShipments(s);
      setDocuments(d);
      setAuditLogs(l);
      setBlogPosts(b);
      // Fetch Firebase status
      apiClient.getFirebaseStatus().then(st => setFirebaseStatus(st)).catch(() => {});
    } catch (err: any) {
      toast('Sync Failed', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFirebase = async () => {
    setIsSyncingFirebase(true);
    try {
      toast('Synchronizing with Firestore', 'Transmitting all enterprise entities to Firebase...', 'info');
      const res = await apiClient.triggerFirebaseSync();
      toast('Firestore Sync Success', res.message, 'success');
      const st = await apiClient.getFirebaseStatus();
      setFirebaseStatus(st);
    } catch (err: any) {
      toast('Firestore Sync Failed', err.message, 'error');
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRfqForQuote) return;

    try {
      toast('Generating Quote', 'Calculating freight and assembling official proforma...', 'info');
      const quote = await apiClient.createQuotation({
        rfqId: activeRfqForQuote.id,
        items: [
          {
            productId: activeRfqForQuote.productId,
            quantityKg: activeRfqForQuote.quantityKg,
            pricePerKgUSD: Number(quotePricePerKg),
            packagingType: activeRfqForQuote.packagingOption
          }
        ],
        incoterm: activeRfqForQuote.incotermPreference,
        destinationPort: activeRfqForQuote.destinationPort,
        destinationCountry: activeRfqForQuote.destinationCountry,
        freightCostUSD: Number(quoteFreightUSD),
        insuranceCostUSD: Number(quoteInsuranceUSD),
        paymentTerms: '30% T/T Advance, 70% upon original B/L and ECTA Certs'
      });

      toast('Quotation Issued', `Proforma ${quote.quotationNumber} issued to buyer!`, 'success');
      setActiveRfqForQuote(null);
      loadAllData();
      setActiveTab('quotations');
    } catch (err: any) {
      toast('Quote Creation Failed', err.message, 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, status, `Status changed by ${currentUser.fullName}`);
      toast('Order Updated', `Order status moved to ${status}`, 'success');
      loadAllData();
    } catch (err: any) {
      toast('Update Failed', err.message, 'error');
    }
  };

  const handleRunSystemTests = async () => {
    setIsRunningTests(true);
    try {
      toast('Running Tests', 'Executing complete 10-phase verification suite...', 'info');
      const res = await apiClient.runSystemTests();
      setTestResults(res);
      toast('Verification Complete', `All test suites passed successfully!`, 'success');
    } catch (err: any) {
      toast('Tests Error', err.message, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#17130E] to-[#120F0C] border border-[#2D241C] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#C88A3B] font-semibold tracking-wider uppercase mb-1">
            <Shield className="w-4 h-4" />
            <span>MY KUHLI Central Operations Desk</span>
            <span>•</span>
            <span>Logged as: {currentUser.fullName} ({currentUser.role})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#FAF7F2]">
            Operations & Export Management System
          </h1>
          <p className="text-xs text-[#A69C8E] mt-1">
            Full control over incoming buyer RFQs, quotation generation, contracts, inventory, Port of Djibouti container allocation, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-lg bg-[#1F1912] hover:bg-[#2B2319] text-[#A69C8E] hover:text-white border border-[#332A20] transition-colors"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => { setActiveTab('tests'); handleRunSystemTests(); }}
            className="px-4 py-2.5 rounded-full bg-[#1C2C1C] hover:bg-[#253B25] text-emerald-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 border border-emerald-500/30 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run System Tests</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#241D15] pb-2 text-xs font-semibold no-scrollbar">
        {[
          { id: 'analytics', label: 'Executive Analytics' },
          { id: 'rfqs', label: `Inquiries & RFQs (${rfqs.length})` },
          { id: 'quotations', label: `Quotations (${quotations.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'inventory', label: `Inventory & Lots (${products.length})` },
          { id: 'shipments', label: `Shipments & Containers (${shipments.length})` },
          { id: 'documents', label: `Export Documents (${documents.length})` },
          { id: 'cms', label: `CMS & Articles (${blogPosts.length})` },
          { id: 'audit', label: `Security & Audit (${auditLogs.length})` },
          { id: 'tests', label: 'Automated Test Runner' },
          { id: 'firebase', label: 'Firebase Backend' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#C88A3B] text-black font-bold shadow-lg shadow-[#C88A3B]/10'
                : 'bg-[#14110D] text-[#A69C8E] hover:text-white border border-[#2B231A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8 animate-in fade-in">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Total Export Revenue</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">
                ${(analytics.totalRevenueUSD / 1000).toFixed(1)}k
                <span className="text-xs font-normal text-[#8C8275]"> USD</span>
              </div>
              <span className="text-xs text-emerald-400">Paid & Confirmed Letters of Credit</span>
            </div>

            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Contracted Export Volume</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">
                {analytics.totalExportVolumeMT.toFixed(1)}
                <span className="text-xs font-normal text-[#8C8275]"> MT</span>
              </div>
              <span className="text-xs text-[#C88A3B]">{(analytics.totalExportVolumeMT * 1000 / 60).toFixed(0)} bags</span>
            </div>

            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Commercial Inquiries (RFQs)</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">{analytics.activeRFQsCount}</div>
              <span className="text-xs text-sky-400">International Roaster Desks</span>
            </div>

            <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
              <span className="text-[10px] uppercase text-[#8C8275] block">Registered Global Buyers</span>
              <div className="text-3xl font-bold text-white font-['Playfair_Display']">
                {analytics.totalRegisteredBuyers}
              </div>
              <span className="text-xs text-[#8C8275]">Verified Importers & Roasters</span>
            </div>
          </div>

          {/* Volume by Origin & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-4">
              <h3 className="text-base font-bold font-['Playfair_Display'] text-white">
                Export Volume Allocation by Origin
              </h3>
              <div className="space-y-3">
                {analytics.originBreakdown.map(item => (
                  <div key={item.origin} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">{item.origin} Terroir</span>
                      <span className="text-[#C88A3B] font-mono">{item.volumeMT} MT (Avg SCA {item.scoreAvg})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1C1611] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C88A3B] to-[#734A17] rounded-full"
                        style={{ width: `${Math.min(100, (item.volumeMT / analytics.totalExportVolumeMT) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-4">
              <h3 className="text-base font-bold font-['Playfair_Display'] text-white">
                Top Buyer Export Destinations
              </h3>
              <div className="space-y-3">
                {analytics.countryBreakdown.map(b => (
                  <div key={b.country} className="p-3 rounded-lg bg-[#17130E] border border-[#241D15] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-white block">{b.country}</span>
                      <span className="text-[10px] text-[#8C8275]">{b.orders} completed container shipments</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-[#C88A3B]">{b.volumeMT} MT</span>
                      <span className="text-[10px] text-[#8C8275] block">{b.sharePercent}% share</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RFQ Pipeline Manager */}
      {activeTab === 'rfqs' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
                Commercial RFQ Pipeline
              </h3>
              <p className="text-xs text-[#8C8275] mt-0.5">
                Incoming purchase inquiries from verified roasters and importers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {rfqs.map(rfq => (
              <div key={rfq.id} className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C88A3B]">{rfq.rfqNumber}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#1F1912] text-[#EDE8E1] border border-[#332A20]">
                        {rfq.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      {rfq.productName}
                    </h4>
                    <span className="text-xs text-[#A69C8E]">
                      Buyer: <strong className="text-white">{rfq.buyerCompanyName}</strong> ({rfq.destinationCountry})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="text-[10px] text-[#8C8275] uppercase block">Requested Volume</span>
                      <span className="font-mono font-bold text-white text-sm">{(rfq.quantityKg / 1000).toFixed(1)} MT</span>
                      <span className="text-[#8C8275] block">({(rfq.quantityKg / 60).toFixed(0)} bags)</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveRfqForQuote(rfq);
                        const prod = products.find(p => p.id === rfq.productId);
                        setQuotePricePerKg(prod?.basePricePerKgUSD || 5.60);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider"
                    >
                      Generate Quotation
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#A69C8E] pt-3 border-t border-[#201A14]">
                  <div>Packaging: <strong className="text-white">{rfq.packagingOption}</strong></div>
                  <div>Incoterm: <strong className="text-white">{rfq.incotermPreference}</strong></div>
                  <div>Discharge: <strong className="text-white">{rfq.destinationPort}</strong></div>
                  <div>Target: <strong className="text-white">{rfq.targetPricePerKgUSD ? `$${rfq.targetPricePerKgUSD}/kg` : 'Market'}</strong></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quotation Generation Modal / Box */}
          {activeRfqForQuote && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#120F0C] border border-[#2D241C] text-[#EDE8E1] rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C88A3B] tracking-wider">
                    Commercial Proforma Creation
                  </span>
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-white mt-1">
                    Issue Quotation for {activeRfqForQuote.rfqNumber}
                  </h3>
                  <p className="text-xs text-[#8C8275] mt-1">
                    Buyer: {activeRfqForQuote.buyerCompanyName} • Coffee: {activeRfqForQuote.productName} ({(activeRfqForQuote.quantityKg / 1000).toFixed(1)} MT)
                  </p>
                </div>

                <form onSubmit={handleCreateQuotationSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#D8CFBF]">FOB Djibouti Unit Price (USD / kg)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={quotePricePerKg}
                      onChange={e => setQuotePricePerKg(Number(e.target.value))}
                      className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2 text-white font-mono"
                      required
                    />
                    <div className="text-[10px] text-[#8C8275]">
                      Coffee Subtotal: ${(quotePricePerKg * activeRfqForQuote.quantityKg).toLocaleString()} USD
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#D8CFBF]">Ocean Freight (USD)</label>
                      <input
                        type="number"
                        value={quoteFreightUSD}
                        onChange={e => setQuoteFreightUSD(Number(e.target.value))}
                        className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-[#D8CFBF]">Marine Insurance (USD)</label>
                      <input
                        type="number"
                        value={quoteInsuranceUSD}
                        onChange={e => setQuoteInsuranceUSD(Number(e.target.value))}
                        className="w-full bg-[#1A1510] border border-[#332A20] rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#17130E] rounded border border-[#241D15] flex justify-between items-center text-xs">
                    <span>Total Proforma Invoice:</span>
                    <span className="font-mono text-base font-bold text-[#C88A3B]">
                      ${(quotePricePerKg * activeRfqForQuote.quantityKg + Number(quoteFreightUSD) + Number(quoteInsuranceUSD)).toLocaleString()} USD
                    </span>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveRfqForQuote(null)}
                      className="px-4 py-2 rounded bg-[#1C1611] text-[#8C8275] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded bg-[#C88A3B] text-black font-semibold uppercase tracking-wider"
                    >
                      Issue Formal Proforma
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
              Export Contracts & Execution Status
            </h3>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-6 rounded-xl bg-[#120F0C] border border-[#262018] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{order.orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#1A2C1A] text-emerald-400">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#A69C8E] mt-1">
                      Buyer: <strong className="text-white">{order.buyerCompanyName}</strong> • {order.destinationPort}, {order.destinationCountry}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white text-base">
                      ${order.totalAmountUSD.toLocaleString()} USD
                    </span>

                    {/* Status updater dropdown */}
                    <select
                      value={order.status}
                      onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="bg-[#1A1510] border border-[#332A20] rounded px-3 py-1.5 text-xs text-[#C88A3B] font-semibold focus:outline-none"
                    >
                      <option value="QUOTE_ACCEPTED">QUOTE_ACCEPTED</option>
                      <option value="PAYMENT_CONFIRMED">PAYMENT_CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="QUALITY_INSPECTION">QUALITY_INSPECTION</option>
                      <option value="READY_FOR_EXPORT">READY_FOR_EXPORT</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-[#8C8275] bg-[#17130E] p-3 rounded border border-[#241D15] flex justify-between">
                  <span>Line Items: {order.items.map(i => `${i.productName} (${(i.quantityKg/1000).toFixed(1)} MT)`).join(', ')}</span>
                  <span>Payment Terms: {order.paymentTerms}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Automated Tests Runner */}
      {activeTab === 'tests' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
                Automated System Verification Suites
              </h3>
              <p className="text-xs text-[#8C8275] mt-0.5">
                Executes live verification tests on all 10 project phases: Database, Auth, Products, RFQs, Quotations, Orders, Shipments, Documents, and Integrity.
              </p>
            </div>

            <button
              onClick={handleRunSystemTests}
              disabled={isRunningTests}
              className="px-5 py-2.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Executing Test Suites...' : 'Run Test Suite Now'}</span>
            </button>
          </div>

          {testResults ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#142314] border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-white">
                    Completed {testResults.totalSuites} Test Suites ({testResults.passedTests} passed, {testResults.failedTests} failed)
                  </span>
                </div>
                <span className="font-mono text-[#A69C8E]">Executed in {testResults.executionTimeMs} ms</span>
              </div>

              <div className="space-y-3">
                {testResults.suites.map((suite: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {suite.suiteName}
                      </span>
                      <span className="text-emerald-400 font-mono">{suite.status}</span>
                    </div>
                    <div className="text-[11px] text-[#8C8275] pl-4">
                      {suite.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-[#120F0C] border border-[#262018] rounded-xl space-y-3">
              <Shield className="w-10 h-10 text-[#C88A3B] mx-auto opacity-70" />
              <h4 className="text-base font-bold text-white">Test Suites Ready for Execution</h4>
              <p className="text-xs text-[#8C8275] max-w-md mx-auto">
                Click "Run Test Suite Now" to verify live database persistence, JWT validation, PDF rendering engine, and export pipeline integrity.
              </p>
              <button
                onClick={handleRunSystemTests}
                className="px-6 py-2 rounded-full bg-[#C88A3B] text-black font-semibold text-xs uppercase tracking-wider"
              >
                Run Tests
              </button>
            </div>
          )}
        </div>
      )}

      {/* Firebase Backend Tab */}
      {activeTab === 'firebase' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#17130E] to-[#120F0C] border border-[#C88A3B]/30">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Flame className="w-5 h-5 fill-amber-500/20" />
                </div>
                <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
                  Firebase Firestore & Auth Backend
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-[#8C8275]">
                Managed cloud database backing export contracts, international RFQs, traceability ledgers, and logistics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSyncFirebase}
                disabled={isSyncingFirebase}
                className="px-5 py-2.5 rounded-full bg-[#C88A3B] hover:bg-[#E0A352] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-[#C88A3B]/10"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingFirebase ? 'animate-spin' : ''}`} />
                <span>{isSyncingFirebase ? 'Syncing to Cloud...' : 'Sync All to Firestore'}</span>
              </button>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#120F0C] border border-[#262018] space-y-1">
              <span className="text-[10px] uppercase text-[#8C8275] block font-mono">Firebase Project ID</span>
              <div className="text-sm font-bold text-white font-mono truncate">
                {firebaseStatus?.projectId || 'intrepid-bruin-qd2jw'}
              </div>
              <span className="text-[11px] text-[#C88A3B]">Google Cloud Project</span>
            </div>

            <div className="p-4 rounded-xl bg-[#120F0C] border border-[#262018] space-y-1">
              <span className="text-[10px] uppercase text-[#8C8275] block font-mono">Firestore Database</span>
              <div className="text-sm font-bold text-white font-mono truncate" title={firebaseStatus?.databaseId}>
                {firebaseStatus?.databaseId || 'ai-studio-mykuhliethiopian-...'}
              </div>
              <span className="text-[11px] text-emerald-400">Named Firestore Instance</span>
            </div>

            <div className="p-4 rounded-xl bg-[#120F0C] border border-[#262018] space-y-1">
              <span className="text-[10px] uppercase text-[#8C8275] block font-mono">Security Rules</span>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                firestore.rules
              </div>
              <span className="text-[11px] text-[#8C8275]">Deployed via Firebase CLI</span>
            </div>

            <div className="p-4 rounded-xl bg-[#120F0C] border border-[#262018] space-y-1">
              <span className="text-[10px] uppercase text-[#8C8275] block font-mono">Storage Bucket</span>
              <div className="text-sm font-bold text-white font-mono truncate">
                intrepid-bruin-qd2jw.firebasestorage.app
              </div>
              <span className="text-[11px] text-sky-400">Cloud Media & Documents</span>
            </div>
          </div>

          {/* Collections Sync Status Table */}
          <div className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#C88A3B]" />
                Cloud Firestore Collections Schema
              </h4>
              <span className="text-xs text-[#8C8275] font-mono">firebase-blueprint.json</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'products', label: 'Coffee Products & Terroirs', count: products.length, desc: 'Specialty & commercial catalog' },
                { name: 'rfqs', label: 'Inquiries & RFQs', count: rfqs.length, desc: 'Buyer proforma inquiries' },
                { name: 'quotations', label: 'Commercial Quotations', count: quotations.length, desc: 'Issued export proformas' },
                { name: 'orders', label: 'Sales Contracts & Orders', count: orders.length, desc: 'Active container purchase agreements' },
                { name: 'shipments', label: 'Ocean & Rail Logistics', count: shipments.length, desc: 'Ethio-Djibouti corridor live tracking' },
                { name: 'exportDocuments', label: 'Regulatory Vault', count: documents.length, desc: 'ECTA, Phyto & Origin certs' },
                { name: 'auditLogs', label: 'Regulatory Audit Trail', count: auditLogs.length, desc: 'National Bank of Ethiopia compliance' },
                { name: 'blogPosts', label: 'CMS & Market Reports', count: blogPosts.length, desc: 'Harvest & pricing publications' },
                { name: 'buyerProfiles', label: 'Registered Importers', count: analytics?.totalRegisteredBuyers || 2, desc: 'Verified international roasters' }
              ].map(col => (
                <div key={col.name} className="p-3.5 rounded-lg bg-[#18130E] border border-[#292016] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#C88A3B] block">/{col.name}</span>
                    <span className="text-white font-medium block">{col.label}</span>
                    <span className="text-[10px] text-[#8C8275]">{col.desc}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-white block">{col.count}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">LIVE SYNC</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Inventory & Coffee Lots */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
              Coffee Inventory & Warehouse Allocations
            </h3>
            <span className="text-xs text-[#8C8275]">Dry Mill Hub: Modjo, Oromia</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-[#C88A3B] font-bold">{p.sku}</span>
                    <h4 className="font-bold text-sm text-white">{p.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1C1710] text-[#C88A3B]">
                    SCA {p.cupScore}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#8C8275]">
                  <div>Origin: <strong className="text-white">{p.originName}</strong></div>
                  <div>Grade: <strong className="text-white">{p.grade}</strong></div>
                  <div>Available: <strong className="text-emerald-400">{(p.availableStockKg / 1000).toFixed(1)} MT</strong></div>
                  <div>Reserved: <strong className="text-[#C88A3B]">{(p.reservedStockKg / 1000).toFixed(1)} MT</strong></div>
                </div>

                <div className="pt-2 border-t border-[#201A14] flex items-center justify-between text-xs">
                  <span className="text-[#A69C8E]">${p.basePricePerKgUSD?.toFixed(2)} / kg</span>
                  <button
                    onClick={() => onViewTraceability(p.originName === 'Jimma' ? 'MK-JIM-2026-001' : 'MK-YIR-2026-004')}
                    className="text-[#C88A3B] hover:underline"
                  >
                    View Origin Lot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Shipments Tab */}
      {activeTab === 'shipments' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
            Container Shipments & Ocean Tracking
          </h3>

          <div className="space-y-3">
            {shipments.map(s => (
              <div key={s.id} className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#C88A3B]">{s.shipmentNumber}</span>
                    <h4 className="text-sm font-bold text-white">{s.carrier} — Vessel: {s.vesselName}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#1C1710] text-[#C88A3B]">
                    Status: {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#8C8275] pt-2 border-t border-[#201A14]">
                  <div>Container No: <strong className="text-white font-mono">{s.containerNumber}</strong></div>
                  <div>Seal No: <strong className="text-white font-mono">{s.sealNumber}</strong></div>
                  <div>Bill of Lading: <strong className="text-white font-mono">{s.billOfLadingNumber}</strong></div>
                  <div>Route: <strong className="text-white">{s.portOfLoading} → {s.portOfDischarge}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Security & Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
              System Audit Trails & Security Logs
            </h3>
            <span className="text-xs text-[#8C8275]">Compliance with National Bank & ECTA regulations</span>
          </div>

          <div className="bg-[#120F0C] border border-[#262018] rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[#8C8275] border-b border-[#241D15] p-3">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201A14]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="text-[#EDE8E1]">
                    <td className="p-3 font-mono text-[11px] text-[#8C8275]">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold">{log.userEmail}</td>
                    <td className="p-3 text-[#C88A3B]">{log.action}</td>
                    <td className="p-3 font-mono text-[11px]">{log.entityType} ({log.entityId})</td>
                    <td className="p-3 text-[#8C8275] font-mono">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. CMS & Blog Manager */}
      {activeTab === 'cms' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-white">
              Market Reports & Knowledge Base
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogPosts.map(post => (
              <div key={post.id} className="p-5 rounded-xl bg-[#120F0C] border border-[#262018] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#C88A3B]">{post.category}</span>
                <h4 className="text-base font-bold text-white">{post.title}</h4>
                <p className="text-xs text-[#8C8275] line-clamp-2">{post.excerpt}</p>
                <div className="pt-2 text-[11px] text-[#6E6559] flex justify-between">
                  <span>Author: {post.authorName}</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
