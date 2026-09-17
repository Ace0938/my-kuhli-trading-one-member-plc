import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomeView } from './views/HomeView.js';
import { CoffeeCatalogView } from './views/CoffeeCatalogView.js';
import { ProductDetailView } from './views/ProductDetailView.js';
import { OriginsView } from './views/OriginsView.js';
import { TraceabilityView } from './views/TraceabilityView.js';
import { BuyerDashboardView } from './views/BuyerDashboardView.js';
import { AdminDashboardView } from './views/AdminDashboardView.js';
import {
  QualityView,
  ExportProcessView,
  SustainabilityView,
  BlogView,
  ContactView,
  LegalView
} from './views/StaticPages.js';
import { RFQModal } from './components/RFQModal.js';
import { AuthModal } from './components/AuthModal.js';
import { TraceabilityModal } from './components/TraceabilityModal.js';
import { apiClient } from './lib/apiClient.js';
import {
  User,
  BuyerProfile,
  Product,
  Origin,
  BlogPost,
  Testimonial,
  Notification,
  Role,
  TraceabilityRecord
} from './types/index.js';

function AppContent() {
  const { toast } = useToast();

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);

  // Router view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  // Domain state
  const [products, setProducts] = useState<Product[]>([]);
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Modals & Selectors
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqProductId, setRfqProductId] = useState<string | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [traceabilityRecord, setTraceabilityRecord] = useState<TraceabilityRecord | null>(null);

  // Initialize data and check stored session
  useEffect(() => {
    const stored = apiClient.getStoredAuth();
    if (stored.user) {
      setCurrentUser(stored.user);
      setBuyerProfile(stored.buyerProfile);
      // verify with backend
      apiClient.getMe().then(me => {
        setCurrentUser(me.user);
        setBuyerProfile(me.buyerProfile);
      }).catch(() => {});
    }

    // Load public datasets
    Promise.all([
      apiClient.getProducts(),
      apiClient.getOrigins(),
      apiClient.getBlogPosts(),
      apiClient.getTestimonials(),
      apiClient.getNotifications().catch(() => [])
    ]).then(([p, o, b, t, n]) => {
      setProducts(p);
      setOrigins(o);
      setBlogPosts(b);
      setTestimonials(t);
      setNotifications(n);
    }).catch(err => {
      console.error('Initialization error:', err);
    });

    // Handle hash change routing
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setCurrentView('home');
        return;
      }
      const parts = hash.split('/');
      setCurrentView(parts[0]);
      if (parts[1]) {
        setViewParam(parts[1]);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setSelectedProduct(null);
    setSelectedBlogPost(null);
    setCurrentView(view);
    setViewParam(param);
    window.location.hash = param ? `${view}/${param}` : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSwitch = async (role: Role) => {
    try {
      const res = await apiClient.switchRole(role);
      setCurrentUser(res.user);
      setBuyerProfile(res.buyerProfile);
      toast('Role Switched', `Active as ${res.user.fullName} (${res.user.role})`, 'info');
      if (['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'EXPORT_MANAGER'].includes(res.user.role)) {
        handleNavigate('admin');
      } else {
        handleNavigate('dashboard');
      }
    } catch (err: any) {
      toast('Switch Error', err.message, 'error');
    }
  };

  const handleLogout = () => {
    apiClient.clearAuth();
    setCurrentUser(null);
    setBuyerProfile(null);
    toast('Signed Out', 'You have been logged out.', 'info');
    handleNavigate('home');
  };

  const handleOpenRFQ = (productId?: string) => {
    setRfqProductId(productId);
    setRfqModalOpen(true);
  };

  const handleViewTraceability = async (lotNumber: string) => {
    try {
      const record = await apiClient.getTraceability(lotNumber);
      setTraceabilityRecord(record);
    } catch (err: any) {
      toast('Traceability Lookup', err.message || 'Lot record not found', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#EDE8E1] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#C88A3B]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onRoleSwitch={handleRoleSwitch}
        onOpenRFQ={handleOpenRFQ}
        notifications={notifications}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onOpenRFQ={handleOpenRFQ}
            onViewTraceability={handleViewTraceability}
            relatedProducts={products.filter(p => p.id !== selectedProduct.id && p.originName === selectedProduct.originName)}
            onSelectProduct={setSelectedProduct}
          />
        ) : selectedBlogPost ? (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
            <button
              onClick={() => setSelectedBlogPost(null)}
              className="text-xs font-semibold text-[#C88A3B] hover:underline"
            >
              ← Back to Insights
            </button>
            <span className="text-xs font-bold uppercase text-[#C88A3B]">{selectedBlogPost.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-white">
              {selectedBlogPost.title}
            </h1>
            <div className="text-xs text-[#8C8275] font-mono">
              Published on {new Date(selectedBlogPost.publishedAt).toLocaleDateString()} by {selectedBlogPost.author}
            </div>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#1A1510]">
              <img src={selectedBlogPost.coverImage} alt={selectedBlogPost.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="prose prose-invert text-sm text-[#A69C8E] leading-relaxed whitespace-pre-line">
              {selectedBlogPost.content}
            </div>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <HomeView
                products={products}
                origins={origins}
                blogPosts={blogPosts}
                testimonials={testimonials}
                onNavigate={handleNavigate}
                onSelectProduct={setSelectedProduct}
                onOpenRFQ={handleOpenRFQ}
                onViewTraceability={handleViewTraceability}
              />
            )}

            {currentView === 'coffee' && (
              <CoffeeCatalogView
                products={products}
                onSelectProduct={setSelectedProduct}
                onOpenRFQ={handleOpenRFQ}
                onViewTraceability={handleViewTraceability}
              />
            )}

            {currentView === 'origins' && (
              <OriginsView
                origins={origins}
                products={products}
                initialOriginSlug={viewParam}
                onSelectProduct={setSelectedProduct}
                onOpenRFQ={handleOpenRFQ}
              />
            )}

            {currentView === 'quality' && <QualityView onOpenRFQ={() => handleOpenRFQ()} />}

            {currentView === 'traceability' && (
              <TraceabilityView
                initialLotNumber={viewParam}
                onOpenRFQ={handleOpenRFQ}
              />
            )}

            {currentView === 'export' && <ExportProcessView onOpenRFQ={() => handleOpenRFQ()} />}

            {currentView === 'sustainability' && <SustainabilityView onOpenRFQ={() => handleOpenRFQ()} />}

            {currentView === 'blog' && (
              <BlogView
                posts={blogPosts}
                onSelectPost={setSelectedBlogPost}
              />
            )}

            {currentView === 'contact' && <ContactView />}

            {currentView === 'dashboard' && (
              currentUser ? (
                <BuyerDashboardView
                  currentUser={currentUser}
                  buyerProfile={buyerProfile}
                  onOpenRFQ={() => handleOpenRFQ()}
                  onViewTraceability={handleViewTraceability}
                />
              ) : (
                <div className="text-center py-20 space-y-4">
                  <h2 className="text-2xl font-bold font-['Playfair_Display'] text-white">Buyer Sign-In Required</h2>
                  <p className="text-xs text-[#8C8275]">Please sign in or register to access the International Buyer Portal.</p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-[#C88A3B] text-black font-semibold text-xs uppercase tracking-wider"
                  >
                    Open Sign-In Dialog
                  </button>
                </div>
              )
            )}

            {currentView === 'admin' && (
              currentUser ? (
                <AdminDashboardView
                  currentUser={currentUser}
                  onViewTraceability={handleViewTraceability}
                />
              ) : (
                <div className="text-center py-20 space-y-4">
                  <h2 className="text-2xl font-bold font-['Playfair_Display'] text-white">Admin Authentication Required</h2>
                  <p className="text-xs text-[#8C8275]">Please log in using an administrative account to access operations.</p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-[#C88A3B] text-black font-semibold text-xs uppercase tracking-wider"
                  >
                    Open Sign-In Dialog
                  </button>
                </div>
              )
            )}

            {currentView === 'privacy' && <LegalView type="privacy" />}
            {currentView === 'terms' && <LegalView type="terms" />}
            {currentView === 'cookie-policy' && <LegalView type="cookies" />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenRFQ={() => handleOpenRFQ()}
      />

      {/* RFQ Submission Modal */}
      <RFQModal
        isOpen={rfqModalOpen}
        onClose={() => setRfqModalOpen(false)}
        products={products}
        selectedProductId={rfqProductId}
        currentUser={currentUser}
        onSuccess={() => {
          apiClient.getRFQs().catch(() => {});
        }}
      />

      {/* Auth Modal (Login & Registration) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user, profile) => {
          setCurrentUser(user);
          setBuyerProfile(profile);
          if (['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'EXPORT_MANAGER'].includes(user.role)) {
            handleNavigate('admin');
          } else {
            handleNavigate('dashboard');
          }
        }}
      />

      {/* Origin QR Traceability Modal */}
      <TraceabilityModal
        record={traceabilityRecord}
        onClose={() => setTraceabilityRecord(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
