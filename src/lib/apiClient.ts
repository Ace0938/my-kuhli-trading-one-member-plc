import {
  User,
  BuyerProfile,
  Product,
  Origin,
  CoffeeLot,
  RFQ,
  Quotation,
  Order,
  Payment,
  Shipment,
  ExportDocument,
  TraceabilityRecord,
  Notification,
  Conversation,
  BlogPost,
  Testimonial,
  AuditLog,
  AdminAnalytics,
  Role
} from '../types/index.js';

const TOKEN_KEY = 'mykuhli_auth_token';
const USER_KEY = 'mykuhli_user_data';

class ApiClient {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setAuth(token: string, user: User, buyerProfile?: BuyerProfile | null) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({ user, buyerProfile }));
  }

  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getStoredAuth(): { user: User | null; buyerProfile: BuyerProfile | null } {
    try {
      const data = localStorage.getItem(USER_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return { user: null, buyerProfile: null };
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.error?.message || 'An error occurred during API communication');
    }

    return json.data as T;
  }

  // Auth
  async login(email: string, password: string): Promise<{ user: User; buyerProfile: BuyerProfile | null; token: string }> {
    const data = await this.request<{ user: User; buyerProfile: BuyerProfile | null; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setAuth(data.token, data.user, data.buyerProfile);
    return data;
  }

  async register(registrationData: any): Promise<{ user: User; buyerProfile: BuyerProfile; token: string }> {
    const data = await this.request<{ user: User; buyerProfile: BuyerProfile; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    });
    this.setAuth(data.token, data.user, data.buyerProfile);
    return data;
  }

  async getMe(): Promise<{ user: User; buyerProfile: BuyerProfile | null }> {
    const data = await this.request<{ user: User; buyerProfile: BuyerProfile | null }>('/api/auth/me');
    const token = this.getToken();
    if (token) {
      this.setAuth(token, data.user, data.buyerProfile);
    }
    return data;
  }

  async switchRole(role: Role): Promise<{ user: User; buyerProfile: BuyerProfile | null; token: string }> {
    const data = await this.request<{ user: User; buyerProfile: BuyerProfile | null; token: string }>('/api/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    this.setAuth(data.token, data.user, data.buyerProfile);
    return data;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products');
  }

  async getProduct(slug: string): Promise<Product> {
    return this.request<Product>(`/api/products/${slug}`);
  }

  async getProductSpecPdf(id: string): Promise<{ pdfDataUri: string; fileName: string }> {
    return this.request<{ pdfDataUri: string; fileName: string }>(`/api/products/${id}/spec-pdf`);
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    return this.request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Origins & Lots
  async getOrigins(): Promise<Origin[]> {
    return this.request<Origin[]>('/api/origins');
  }

  async getOrigin(slug: string): Promise<Origin> {
    return this.request<Origin>(`/api/origins/${slug}`);
  }

  async getLots(): Promise<CoffeeLot[]> {
    return this.request<CoffeeLot[]>('/api/lots');
  }

  async getTraceability(lotNumber: string): Promise<TraceabilityRecord> {
    return this.request<TraceabilityRecord>(`/api/traceability/${lotNumber}`);
  }

  // RFQs
  async getRFQs(): Promise<RFQ[]> {
    return this.request<RFQ[]>('/api/rfqs');
  }

  async submitRFQ(rfqData: any): Promise<RFQ> {
    return this.request<RFQ>('/api/rfqs', {
      method: 'POST',
      body: JSON.stringify(rfqData)
    });
  }

  // Quotations
  async getQuotations(): Promise<Quotation[]> {
    return this.request<Quotation[]>('/api/quotations');
  }

  async createQuotation(quoteData: any): Promise<Quotation> {
    return this.request<Quotation>('/api/quotations', {
      method: 'POST',
      body: JSON.stringify(quoteData)
    });
  }

  async acceptQuotation(id: string): Promise<{ quote: Quotation; order: Order }> {
    return this.request<{ quote: Quotation; order: Order }>(`/api/quotations/${id}/accept`, {
      method: 'POST'
    });
  }

  async getQuotationPdf(id: string): Promise<{ pdfDataUri: string; fileName: string }> {
    return this.request<{ pdfDataUri: string; fileName: string }>(`/api/quotations/${id}/pdf`);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/api/orders');
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string, note?: string): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    });
  }

  async getOrderInvoicePdf(id: string): Promise<{ pdfDataUri: string; fileName: string }> {
    return this.request<{ pdfDataUri: string; fileName: string }>(`/api/orders/${id}/invoice-pdf`);
  }

  // Payments
  async getPayments(orderId?: string): Promise<Payment[]> {
    return this.request<Payment[]>(`/api/payments${orderId ? `?orderId=${orderId}` : ''}`);
  }

  async initiatePayment(data: any): Promise<any> {
    return this.request('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async confirmPayment(data: any): Promise<Payment> {
    return this.request<Payment>('/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Shipments & Export Documents
  async getShipments(orderId?: string): Promise<Shipment[]> {
    return this.request<Shipment[]>(`/api/shipments${orderId ? `?orderId=${orderId}` : ''}`);
  }

  async createShipment(shipmentData: any): Promise<Shipment> {
    return this.request<Shipment>('/api/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData)
    });
  }

  async getExportDocuments(orderId?: string): Promise<ExportDocument[]> {
    return this.request<ExportDocument[]>(`/api/export-documents${orderId ? `?orderId=${orderId}` : ''}`);
  }

  async addExportDocument(docData: any): Promise<ExportDocument> {
    return this.request<ExportDocument>('/api/export-documents', {
      method: 'POST',
      body: JSON.stringify(docData)
    });
  }

  // Buyers
  async getBuyers(): Promise<any[]> {
    return this.request<any[]>('/api/buyers');
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/api/notifications');
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request('/api/notifications/read-all', { method: 'POST' });
  }

  // Messages
  async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/api/conversations');
  }

  async sendMessage(conversationId: string, content: string): Promise<any> {
    return this.request(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  // Blog & CMS
  async getBlogPosts(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>('/api/blog');
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/api/blog/${slug}`);
  }

  async createBlogPost(post: any): Promise<BlogPost> {
    return this.request<BlogPost>('/api/blog', {
      method: 'POST',
      body: JSON.stringify(post)
    });
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return this.request<Testimonial[]>('/api/testimonials');
  }

  async submitContact(data: any): Promise<any> {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Admin Analytics & Audit Logs
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    return this.request<AdminAnalytics>('/api/admin/analytics');
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.request<AuditLog[]>('/api/audit-logs');
  }

  async getSettings(): Promise<Record<string, string>> {
    return this.request<Record<string, string>>('/api/settings');
  }

  async updateSettings(settings: Record<string, string>): Promise<Record<string, string>> {
    return this.request<Record<string, string>>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // System Tests Runner
  async runSystemTests(): Promise<any> {
    return this.request('/api/tests/run', {
      method: 'POST'
    });
  }

  // Firebase Firestore Backend Methods
  async getFirebaseStatus(): Promise<{ success: boolean; connected: boolean; projectId?: string; databaseId?: string; error?: string }> {
    return this.request('/api/firebase/status');
  }

  async triggerFirebaseSync(): Promise<{ success: boolean; message: string; count: number }> {
    return this.request('/api/firebase/sync', {
      method: 'POST'
    });
  }
}

export const apiClient = new ApiClient();
