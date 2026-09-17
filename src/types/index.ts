export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'EXPORT_MANAGER'
  | 'QUALITY_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'ACCOUNTANT'
  | 'CONTENT_MANAGER'
  | 'BUYER';

export type ProcessingMethod =
  | 'NATURAL'
  | 'WASHED'
  | 'ANAEROBIC_NATURAL'
  | 'ANAEROBIC_WASHED'
  | 'HONEY'
  | 'EXPERIMENTAL';

export type CoffeeGrade =
  | 'GRADE_1_SPECIALTY'
  | 'GRADE_2_SPECIALTY'
  | 'GRADE_3_PREMIUM'
  | 'GRADE_4_COMMERCIAL'
  | 'GRADE_5_COMMERCIAL'
  | 'UG_UNDER_GRADE';

export type PricingType = 'PUBLIC' | 'REQUEST_QUOTE_ONLY' | 'TIERED_PRIVATE';

export type RFQStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'QUOTATION_SENT'
  | 'NEGOTIATION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CONVERTED_TO_ORDER';

export type QuotationStatus =
  | 'DRAFT'
  | 'SENT'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'REVISION_REQUESTED'
  | 'EXPIRED';

export type OrderStatus =
  | 'QUOTE_ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'QUALITY_INSPECTION'
  | 'READY_FOR_EXPORT'
  | 'EXPORT_DOCUMENTATION'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod =
  | 'TELEGRAPHIC_TRANSFER_TT'
  | 'LETTER_OF_CREDIT_LC'
  | 'CASH_AGAINST_DOCUMENTS_CAD'
  | 'ESCROW'
  | 'BANK_GUARANTEE';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'FAILED'
  | 'REFUNDED';

export type Incoterm =
  | 'FOB_DJIBOUTI'
  | 'CIF'
  | 'CFR'
  | 'EXW_ADDIS_ABABA'
  | 'FCA_MODJO'
  | 'DDP';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  companyName: string;
  businessType: string;
  taxRegistrationNumber?: string;
  website?: string;
  country: string;
  city: string;
  address?: string;
  destinationPort?: string;
  annualCoffeeVolumeMT?: number;
  importExperienceYears?: number;
  preferredOrigins: string[];
  preferredProcessing: string[];
  accountStatus: 'NEW_LEAD' | 'QUALIFIED' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Origin {
  id: string;
  name: string;
  slug: string;
  region: string;
  elevationRange: string;
  flavorProfile: string;
  harvestPeriod: string;
  description: string;
  imageUrl: string;
  coordinates?: string;
}

export interface Farm {
  id: string;
  name: string;
  originId: string;
  woreda: string;
  altitude: number;
  cooperative?: string;
  managerName?: string;
  totalAreaHa?: number;
  varieties: string[];
  certifications: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  originId: string;
  originName: string;
  region: string;
  farmId?: string;
  farmName?: string;
  processingMethod: ProcessingMethod;
  grade: CoffeeGrade;
  variety: string;
  altitudeMin: number;
  altitudeMax: number;
  cupScore: number;
  screenSize: string;
  moisturePercent: number;
  harvestYear: number;
  flavorNotes: string[];
  aroma: string;
  acidity: string;
  body: string;
  sweetness: string;
  minOrderQuantityKg: number;
  packagingOptions: string[];
  pricingType: PricingType;
  basePricePerKgUSD?: number;
  isAvailable: boolean;
  featured: boolean;
  description: string;
  certifications: string[];
  images: string[];
  availableStockKg: number;
  reservedStockKg: number;
  createdAt: string;
}

export interface CoffeeLot {
  id: string;
  lotNumber: string;
  productId: string;
  productName: string;
  originName: string;
  region: string;
  farmName: string;
  cooperativeName?: string;
  harvestSeason: string;
  processingDate: string;
  cuppingScoreFinal: number;
  totalBags60kg: number;
  availableBags60kg: number;
  reservedBags60kg: number;
  moistureContent: number;
  waterActivity?: number;
  warehouseLocation: string;
  traceabilityRecordId?: string;
}

export interface RFQItem {
  id: string;
  productId: string;
  productName: string;
  quantityKg: number;
  packagingOption: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  userId: string;
  userEmail: string;
  buyerCompanyName: string;
  destinationCountry: string;
  destinationPort: string;
  incotermPreference: Incoterm;
  preferredShipDate?: string;
  targetPricePerKgUSD?: number;
  paymentPreference: PaymentMethod;
  specialNotes?: string;
  status: RFQStatus;
  items: RFQItem[];
  quotationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  quantityKg: number;
  unitPricePerKg: number;
  totalUSD: number;
  packaging: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  rfqId?: string;
  buyerProfileId: string;
  buyerCompanyName: string;
  buyerEmail: string;
  incoterm: Incoterm;
  destinationPort: string;
  subtotalUSD: number;
  freightUSD: number;
  insuranceUSD: number;
  otherFeesUSD: number;
  totalAmountUSD: number;
  currency: string;
  paymentTerms: string;
  validUntil: string;
  status: QuotationStatus;
  adminNotes?: string;
  items: QuotationItem[];
  orderId?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantityKg: number;
  unitPricePerKg: number;
  totalUSD: number;
  packaging: string;
}

export interface TimelineEvent {
  step: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  quotationId?: string;
  userId: string;
  buyerCompanyName: string;
  buyerEmail: string;
  totalAmountUSD: number;
  currency: string;
  incoterm: Incoterm;
  destinationPort: string;
  destinationCountry: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  timelineEvents: TimelineEvent[];
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  paymentReference: string;
  orderId: string;
  orderNumber: string;
  amountUSD: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  swiftTransactionRef?: string;
  receiptDocumentUrl?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
}

export interface ShipmentTrackingUpdate {
  status: string;
  location: string;
  description: string;
  date: string;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  orderNumber: string;
  lotNumber?: string;
  originWarehouse: string;
  portOfLoading: string;
  portOfDischarge: string;
  shippingLine: string;
  vesselName: string;
  voyageNumber?: string;
  containerNumber: string;
  sealNumber: string;
  containerType: string;
  totalBags: number;
  billOfLadingNumber?: string;
  etd: string;
  eta: string;
  currentStatus: string;
  trackingUpdates: ShipmentTrackingUpdate[];
  createdAt: string;
}

export interface ExportDocument {
  id: string;
  orderId: string;
  orderNumber: string;
  documentType:
    | 'CERTIFICATE_OF_ORIGIN'
    | 'PHYTOSANITARY'
    | 'QUALITY_CERT_ECTA'
    | 'EXPORT_PERMIT'
    | 'COMMERCIAL_INVOICE'
    | 'PACKING_LIST'
    | 'BILL_OF_LADING';
  documentName: string;
  documentNumber: string;
  issuingAuthority: string;
  issuedDate: string;
  documentUrl: string;
  verified: boolean;
}

export interface TraceabilityRecord {
  id: string;
  lotId: string;
  lotNumber: string;
  coffeeName: string;
  originName: string;
  region: string;
  farmName: string;
  cooperativeName: string;
  woredaZone: string;
  altitudeMeters: number;
  harvestMonthYear: string;
  washingStationName: string;
  fermentationHours: number;
  dryingDaysOnRaisedBeds: number;
  parchmentStorage: string;
  ectaLiquoringGrade: string;
  cuppingScore: number;
  flavorNotes: string[];
  gpsLatitude: number;
  gpsLongitude: number;
  farmerFairShareUSDPerKg: number;
  exportShipmentNumber?: string;
  destinationPort?: string;
  qrVerificationUrl: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'RFQ' | 'QUOTATION' | 'ORDER' | 'PAYMENT' | 'SHIPMENT' | 'SYSTEM';
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  subject: string;
  buyerCompanyName: string;
  userId: string;
  messages: Message[];
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  authorName: string;
  published: boolean;
  readTimeMin: number;
  publishedAt: string;
}

export interface Testimonial {
  id: string;
  buyerName: string;
  companyName: string;
  country: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  coffeePurchased: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AdminAnalytics {
  totalExportVolumeMT: number;
  totalRevenueUSD: number;
  activeRFQsCount: number;
  pendingQuotationsCount: number;
  activeShipmentsCount: number;
  totalRegisteredBuyers: number;
  monthlyExportSales: { month: string; volumeMT: number; revenueUSD: number }[];
  countryBreakdown: { country: string; orders: number; volumeMT: number; sharePercent: number }[];
  originBreakdown: { origin: string; volumeMT: number; scoreAvg: number }[];
  rfqFunnel: { stage: string; count: number; conversionPercent: number }[];
}
