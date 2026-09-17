import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { saveDocumentToFirestore, initFirebaseBackend } from './firebaseBackend.js';
import {
  User,
  BuyerProfile,
  Origin,
  Product,
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
  AdminAnalytics
} from '../types/index.js';

interface DatabaseData {
  users: (User & { passwordHash: string })[];
  buyerProfiles: BuyerProfile[];
  origins: Origin[];
  products: Product[];
  lots: CoffeeLot[];
  rfqs: RFQ[];
  quotations: Quotation[];
  orders: Order[];
  payments: Payment[];
  shipments: Shipment[];
  exportDocuments: ExportDocument[];
  traceabilityRecords: TraceabilityRecord[];
  notifications: Notification[];
  conversations: Conversation[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  auditLogs: AuditLog[];
  settings: Record<string, string>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // fallback
    }
  }
}

function getInitialSeedData(): DatabaseData {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('MyKuhli@2026', salt);

  const users: (User & { passwordHash: string })[] = [
    {
      id: 'usr-admin-01',
      email: 'admin@mykuhli.com',
      fullName: 'Abebe Tadesse',
      role: 'SUPER_ADMIN',
      phone: '+251 911 234 567',
      isEmailVerified: true,
      createdAt: '2026-01-10T08:00:00Z',
      passwordHash: defaultPasswordHash
    },
    {
      id: 'usr-sales-01',
      email: 'sales@mykuhli.com',
      fullName: 'Selamawit Haile',
      role: 'SALES_MANAGER',
      phone: '+251 912 345 678',
      isEmailVerified: true,
      createdAt: '2026-01-12T09:30:00Z',
      passwordHash: defaultPasswordHash
    },
    {
      id: 'usr-export-01',
      email: 'export@mykuhli.com',
      fullName: 'Dawit Bekele',
      role: 'EXPORT_MANAGER',
      phone: '+251 913 456 789',
      isEmailVerified: true,
      createdAt: '2026-01-15T11:00:00Z',
      passwordHash: defaultPasswordHash
    },
    {
      id: 'usr-buyer-01',
      email: 'buyer@nordicroasters.com',
      fullName: 'Lars Lindqvist',
      role: 'BUYER',
      phone: '+45 31 88 92 10',
      isEmailVerified: true,
      createdAt: '2026-01-20T14:20:00Z',
      passwordHash: defaultPasswordHash
    },
    {
      id: 'usr-buyer-02',
      email: 'trade@tokyocoffee.jp',
      fullName: 'Kenji Takahashi',
      role: 'BUYER',
      phone: '+81 3 5555 0192',
      isEmailVerified: true,
      createdAt: '2026-02-01T10:15:00Z',
      passwordHash: defaultPasswordHash
    }
  ];

  const buyerProfiles: BuyerProfile[] = [
    {
      id: 'bp-001',
      userId: 'usr-buyer-01',
      companyName: 'Nordic Specialty Roasters ApS',
      businessType: 'Specialty Coffee Roaster & Importer',
      taxRegistrationNumber: 'DK-39281729',
      website: 'https://nordicroasters.example.com',
      country: 'Denmark',
      city: 'Copenhagen',
      address: 'Refshalevej 163A, 1432 Copenhagen K',
      destinationPort: 'Port of Aarhus / Copenhagen',
      annualCoffeeVolumeMT: 120,
      importExperienceYears: 8,
      preferredOrigins: ['Yirgacheffe', 'Guji', 'Sidama'],
      preferredProcessing: ['WASHED', 'ANAEROBIC_NATURAL'],
      accountStatus: 'ACTIVE',
      createdAt: '2026-01-20T14:20:00Z'
    },
    {
      id: 'bp-002',
      userId: 'usr-buyer-02',
      companyName: 'Tokyo Artisan Coffee Co., Ltd.',
      businessType: 'B2B Wholesale Green Coffee Importer',
      taxRegistrationNumber: 'JP-9018273645',
      website: 'https://tokyoartisan.example.jp',
      country: 'Japan',
      city: 'Tokyo',
      address: 'Minato-ku, Roppongi 7-2-1',
      destinationPort: 'Port of Yokohama',
      annualCoffeeVolumeMT: 350,
      importExperienceYears: 14,
      preferredOrigins: ['Yirgacheffe', 'Jimma', 'Harrar'],
      preferredProcessing: ['NATURAL', 'WASHED'],
      accountStatus: 'ACTIVE',
      createdAt: '2026-02-01T10:15:00Z'
    }
  ];

  const origins: Origin[] = [
    {
      id: 'orig-yirgacheffe',
      name: 'Yirgacheffe',
      slug: 'yirgacheffe',
      region: 'Gedeo Zone, SNNPR',
      elevationRange: '1,900m - 2,250m',
      flavorProfile: 'Intensely floral, jasmine blossoms, bergamot citrus, lemongrass, peach tea finish.',
      harvestPeriod: 'November to January',
      description: 'Widely regarded as the holy grail of washed African coffees. Grown under high-canopy shade trees, these smallholder micro-lots yield ethereal citric acidity and intoxicating floral aromatics.',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
      coordinates: '6.1627° N, 38.2058° E'
    },
    {
      id: 'orig-guji',
      name: 'Guji',
      slug: 'guji',
      region: 'Oromia Region, Guji Zone',
      elevationRange: '1,850m - 2,300m',
      flavorProfile: 'Lush wild strawberry, ripe peach, candied mango, dark chocolate nibs, syrupy body.',
      harvestPeriod: 'December to February',
      description: 'Formerly categorized under Sidamo, Guji stands alone as a specialty powerhouse renowned for pristine anaerobic micro-lots, deep volcanic clay soil, and distinct tropical fruit complexity.',
      imageUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=1200&auto=format&fit=crop',
      coordinates: '5.5786° N, 39.0667° E'
    },
    {
      id: 'orig-sidama',
      name: 'Sidama',
      slug: 'sidama',
      region: 'Sidama Regional State',
      elevationRange: '1,750m - 2,200m',
      flavorProfile: 'Bright apricot, Meyer lemon, honeysuckle nectar, crisp winey acidity, silky lingering mouthfeel.',
      harvestPeriod: 'October to January',
      description: 'The historic highland cradle of Arabica coffee. Sidama coffee is harvested across lush misty ridges by generational farming families organized into historic cooperatives.',
      imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop',
      coordinates: '6.7325° N, 38.4528° E'
    },
    {
      id: 'orig-jimma',
      name: 'Jimma',
      slug: 'jimma',
      region: 'Oromia Region, Jimma Zone',
      elevationRange: '1,450m - 1,950m',
      flavorProfile: 'Rich dried dark fruits, winey red plum, roasted walnut, bittersweet bakers cacao.',
      harvestPeriod: 'November to January',
      description: 'Jimma is the heartland of commercial and specialty Ethiopian naturals. High volume capacity combined with traditional sun-drying on raised beds yields heavy-bodied coffees ideal for espresso blends and bold single origins.',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
      coordinates: '7.6734° N, 36.8344° E'
    },
    {
      id: 'orig-harrar',
      name: 'Harrar',
      slug: 'harrar',
      region: 'East Hararghe Zone, Oromia',
      elevationRange: '1,500m - 2,100m',
      flavorProfile: 'Pungent blueberry compote, dark roasted spices, earthy dry fruit, heavy dark chocolate liqueur.',
      harvestPeriod: 'November to February',
      description: 'One of the oldest cultivated coffee zones in recorded human history. Harrar Longberry produces wild, naturally dry-processed coffees with an unmistakable signature blueberry punch.',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
      coordinates: '9.3139° N, 42.1261° E'
    },
    {
      id: 'orig-limu',
      name: 'Limu',
      slug: 'limu',
      region: 'Southwest Oromia',
      elevationRange: '1,600m - 2,000m',
      flavorProfile: 'Crisp green apple, lemon curd, orange blossom, sweet brown sugar caramel, round clean finish.',
      harvestPeriod: 'November to January',
      description: 'Renowned for exceptional washed lots with balanced sweetness and sparkling acidity, Limu coffees thrive under indigenous forest canopies alongside wild spices.',
      imageUrl: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=1200&auto=format&fit=crop',
      coordinates: '8.0667° N, 36.9500° E'
    }
  ];

  const products: Product[] = [
    {
      id: 'prod-001',
      name: 'Jimma Natural Grade 4',
      slug: 'jimma-natural-grade-4',
      sku: 'MK-JIM-G4-NAT',
      originId: 'orig-jimma',
      originName: 'Jimma',
      region: 'Oromia Region, Jimma Zone',
      farmName: 'Jimma Smallholder Cooperative Network',
      processingMethod: 'NATURAL',
      grade: 'GRADE_4_COMMERCIAL',
      variety: 'Indigenous Heirloom 74110 & 74112',
      altitudeMin: 1550,
      altitudeMax: 1850,
      cupScore: 82.5,
      screenSize: 'Screen 14/17',
      moisturePercent: 11.2,
      harvestYear: 2026,
      flavorNotes: ['Dried Dark Plum', 'Bittersweet Cocoa', 'Walnut', 'Winey Undertones'],
      aroma: 'Sweet dried currant & toasted hazelnut',
      acidity: 'Low to Medium Winey',
      body: 'Full, Round & Syrupy',
      sweetness: 'Raw Demerara & Dark Molasses',
      minOrderQuantityKg: 19200, // 1 FCL 320 bags
      packagingOptions: ['60kg Jute Bag with GrainPro Liner', '1 Ton Bulk Container Liner'],
      pricingType: 'PUBLIC',
      basePricePerKgUSD: 4.15,
      isAvailable: true,
      featured: true,
      description: 'A classic Ethiopian natural export benchmark. Carefully sun-dried on African raised beds across Jimma’s fertile rolling hills. Offers unbeatable consistency, heavy chocolate-fruit character, and superior body in espresso formulations.',
      certifications: ['ECTA Export Certified', 'Phytosanitary Inspected'],
      images: [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop'
      ],
      availableStockKg: 38400,
      reservedStockKg: 19200,
      createdAt: '2026-01-15T00:00:00Z'
    },
    {
      id: 'prod-002',
      name: 'Yirgacheffe Washed Grade 1 (Chelchele)',
      slug: 'yirgacheffe-washed-grade-1',
      sku: 'MK-YIR-G1-WSH',
      originId: 'orig-yirgacheffe',
      originName: 'Yirgacheffe',
      region: 'Gedeo Zone, Kochere District',
      farmName: 'Chelchele Washing Station',
      processingMethod: 'WASHED',
      grade: 'GRADE_1_SPECIALTY',
      variety: 'Heirloom & Kurume',
      altitudeMin: 2000,
      altitudeMax: 2200,
      cupScore: 89.2,
      screenSize: 'Screen 15+',
      moisturePercent: 10.4,
      harvestYear: 2026,
      flavorNotes: ['Jasmine Flower', 'Bergamot Citrus', 'White Peach', 'Earl Grey Tea'],
      aroma: 'Perfumed floral jasmine & fresh lime zest',
      acidity: 'Sparkling Citric & Malic',
      body: 'Silky, Elegant & Tea-like',
      sweetness: 'Wild Mountain Blossom Honey',
      minOrderQuantityKg: 3600, // 60 bags
      packagingOptions: ['60kg Multi-wall GrainPro Jute', '30kg Vacuum Pack Carton'],
      pricingType: 'REQUEST_QUOTE_ONLY',
      basePricePerKgUSD: 6.85,
      isAvailable: true,
      featured: true,
      description: 'The quintessence of specialty Ethiopian washed coffee. Cherry hand-sorted, depulped within 6 hours, wet fermented for 36 hours under cool mountain water, and gently dried over 16 days. Exceptional clarity and refined floral delicacy.',
      certifications: ['ECTA Grade 1 Specialty', 'Rainforest Alliance', 'Fairtrade Certified'],
      images: [
        'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop'
      ],
      availableStockKg: 21600,
      reservedStockKg: 7200,
      createdAt: '2026-01-18T00:00:00Z'
    },
    {
      id: 'prod-003',
      name: 'Guji Anaerobic Natural Grade 1 (Uraga)',
      slug: 'guji-anaerobic-natural-grade-1',
      sku: 'MK-GUJ-G1-ANAT',
      originId: 'orig-guji',
      originName: 'Guji',
      region: 'Oromia Region, Uraga Woreda',
      farmName: 'Raro Nensebo Micromill',
      processingMethod: 'ANAEROBIC_NATURAL',
      grade: 'GRADE_1_SPECIALTY',
      variety: 'Selection 74110 & 74112',
      altitudeMin: 2100,
      altitudeMax: 2320,
      cupScore: 90.5,
      screenSize: 'Screen 16+',
      moisturePercent: 10.6,
      harvestYear: 2026,
      flavorNotes: ['Wild Strawberry Jam', 'Passionfruit', 'Dark Cacao', 'Mango Nectar', 'Lavender'],
      aroma: 'Tropical passionfruit, candied red berry & boozy dark cocoa',
      acidity: 'Vibrant Complex Phosphoric & Tartaric',
      body: 'Velvety & Syrupy Cream',
      sweetness: 'Intense Ripe Cane Sugar',
      minOrderQuantityKg: 1800, // 30 bags
      packagingOptions: ['30kg Vacuum Pack Carton Box', '60kg GrainPro Jute'],
      pricingType: 'REQUEST_QUOTE_ONLY',
      basePricePerKgUSD: 8.40,
      isAvailable: true,
      featured: true,
      description: 'Micro-lot perfection from Uraga at extreme altitude. Sealed in airtight stainless barrels for 96 hours of controlled anaerobic maceration, then dried in shaded parabolic raised beds. Explosive fruit forward profile coveted by champion baristas.',
      certifications: ['ECTA Grade 1 Q-Grade Certified', 'Organic Certified (EU/NOP)'],
      images: [
        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop'
      ],
      availableStockKg: 10800,
      reservedStockKg: 3600,
      createdAt: '2026-01-20T00:00:00Z'
    },
    {
      id: 'prod-004',
      name: 'Sidama Natural Grade 2 (Bensa)',
      slug: 'sidama-natural-grade-2',
      sku: 'MK-SID-G2-NAT',
      originId: 'orig-sidama',
      originName: 'Sidama',
      region: 'Sidama Regional State, Bensa Woreda',
      farmName: 'Hamasho Village Cooperatives',
      processingMethod: 'NATURAL',
      grade: 'GRADE_2_SPECIALTY',
      variety: 'Indigenous Dega & Heirloom',
      altitudeMin: 1950,
      altitudeMax: 2200,
      cupScore: 86.8,
      screenSize: 'Screen 15/18',
      moisturePercent: 11.0,
      harvestYear: 2026,
      flavorNotes: ['Wild Blueberry', 'Ripe Apricot', 'Milk Chocolate', 'Citrus Peel'],
      aroma: 'Sweet berry pie & raw cocoa',
      acidity: 'Lively Winey Citric',
      body: 'Creamy & Medium-Full',
      sweetness: 'Golden Honey Caramel',
      minOrderQuantityKg: 7200,
      packagingOptions: ['60kg GrainPro Jute Bag'],
      pricingType: 'PUBLIC',
      basePricePerKgUSD: 5.60,
      isAvailable: true,
      featured: false,
      description: 'High elevation Bensa terroir delivers classic Ethiopian natural fruit sweetness. Uniform sun-drying on raised mesh beds turned every 45 minutes guarantees deep blueberry notes without ferment defects.',
      certifications: ['ECTA Grade 2 Certified', 'Fairtrade Certified'],
      images: [
        'https://images.unsplash.com/photo-1518057111178-44a106bad636?q=80&w=1200&auto=format&fit=crop'
      ],
      availableStockKg: 28800,
      reservedStockKg: 7200,
      createdAt: '2026-01-22T00:00:00Z'
    },
    {
      id: 'prod-005',
      name: 'Harrar Longberry Grade 3',
      slug: 'harrar-longberry-grade-3',
      sku: 'MK-HAR-G3-NAT',
      originId: 'orig-harrar',
      originName: 'Harrar',
      region: 'East Hararghe Highlands',
      farmName: 'Chercher Mountain Smallholders',
      processingMethod: 'NATURAL',
      grade: 'GRADE_3_PREMIUM',
      variety: 'Pure Harrar Longberry Heirloom',
      altitudeMin: 1600,
      altitudeMax: 1950,
      cupScore: 84.5,
      screenSize: 'Longberry Bold 16+',
      moisturePercent: 11.4,
      harvestYear: 2026,
      flavorNotes: ['Pungent Blueberry', 'Dark Bakers Chocolate', 'Cardamom Spice', 'Leather'],
      aroma: 'Wild dried berries, roasted spice & dark cocoa liqueur',
      acidity: 'Crisp Dried Fruit Acidity',
      body: 'Heavy, Resinous & Syrupy',
      sweetness: 'Dark Muscovado Sugar',
      minOrderQuantityKg: 9600,
      packagingOptions: ['60kg Heavy-duty Jute Bag with Inner Liner'],
      pricingType: 'PUBLIC',
      basePricePerKgUSD: 5.25,
      isAvailable: true,
      featured: false,
      description: 'The historic "Mocha" bean of the ancient world. Hand-picked in eastern rocky volcanic terraces and dried intact under harsh arid sunshine. Renowned across the Middle East, Japan, and European roasteries for bold mocha character.',
      certifications: ['ECTA Export Quality Certified'],
      images: [
        'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop'
      ],
      availableStockKg: 19200,
      reservedStockKg: 0,
      createdAt: '2026-01-25T00:00:00Z'
    },
    {
      id: 'prod-006',
      name: 'Limu Washed Grade 2',
      slug: 'limu-washed-grade-2',
      sku: 'MK-LIM-G2-WSH',
      originId: 'orig-limu',
      originName: 'Limu',
      region: 'Jimma / Limu Kosa, Oromia',
      farmName: 'Limu Kosa Agro-Forestry Cooperative',
      processingMethod: 'WASHED',
      grade: 'GRADE_2_SPECIALTY',
      variety: 'Heirloom 74110 & Deshe',
      altitudeMin: 1750,
      altitudeMax: 2000,
      cupScore: 85.0,
      screenSize: 'Screen 15/17',
      moisturePercent: 10.8,
      harvestYear: 2026,
      flavorNotes: ['Crisp Green Apple', 'Lemon Drop', 'Cane Sugar', 'Sweet Almond'],
      aroma: 'Fresh citrus blossoms & sweet malt',
      acidity: 'Vibrant Malic & Citric',
      body: 'Clean, Silky & Medium',
      sweetness: 'Turbinado Cane & Honey',
      minOrderQuantityKg: 9600,
      packagingOptions: ['60kg GrainPro Jute Bag'],
      pricingType: 'PUBLIC',
      basePricePerKgUSD: 4.80,
      isAvailable: true,
      featured: false,
      description: 'Shade-grown under indigenous forest canopy in southwest Ethiopia. Wet processed with pure river spring water and washed in stone canals. High sweetness and clean crisp apple brightness make it an indispensable staple.',
      certifications: ['ECTA Grade 2 Certified', 'Rainforest Alliance'],
      images: [
        'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=1200&auto=format&fit=crop'
      ],
      availableStockKg: 24000,
      reservedStockKg: 4800,
      createdAt: '2026-01-28T00:00:00Z'
    }
  ];

  const lots: CoffeeLot[] = [
    {
      id: 'lot-001',
      lotNumber: 'MK-JIM-2026-001',
      productId: 'prod-001',
      productName: 'Jimma Natural Grade 4',
      originName: 'Jimma',
      region: 'Oromia, Jimma Zone',
      farmName: 'Gera Smallholder Union',
      harvestSeason: '2025/2026',
      processingDate: '2026-01-12T00:00:00Z',
      cuppingScoreFinal: 82.5,
      totalBags60kg: 640,
      availableBags60kg: 320,
      reservedBags60kg: 320,
      moistureContent: 11.2,
      waterActivity: 0.56,
      warehouseLocation: 'Modjo Dry Port - Warehouse 2B',
      traceabilityRecordId: 'trc-001'
    },
    {
      id: 'lot-002',
      lotNumber: 'MK-YIR-2026-004',
      productId: 'prod-002',
      productName: 'Yirgacheffe Washed Grade 1',
      originName: 'Yirgacheffe',
      region: 'Gedeo Zone, Kochere',
      farmName: 'Chelchele Washing Station',
      harvestSeason: '2025/2026',
      processingDate: '2026-01-16T00:00:00Z',
      cuppingScoreFinal: 89.2,
      totalBags60kg: 360,
      availableBags60kg: 240,
      reservedBags60kg: 120,
      moistureContent: 10.4,
      waterActivity: 0.52,
      warehouseLocation: 'Addis Ababa Export Logistics Terminal - Bay 4',
      traceabilityRecordId: 'trc-002'
    },
    {
      id: 'lot-003',
      lotNumber: 'MK-GUJ-2026-002',
      productId: 'prod-003',
      productName: 'Guji Anaerobic Natural Grade 1',
      originName: 'Guji',
      region: 'Uraga Woreda, Guji',
      farmName: 'Raro Nensebo Micromill',
      harvestSeason: '2025/2026',
      processingDate: '2026-01-20T00:00:00Z',
      cuppingScoreFinal: 90.5,
      totalBags60kg: 180,
      availableBags60kg: 120,
      reservedBags60kg: 60,
      moistureContent: 10.6,
      waterActivity: 0.53,
      warehouseLocation: 'Modjo Dry Port - Cold Storage Unit 1',
      traceabilityRecordId: 'trc-003'
    }
  ];

  const traceabilityRecords: TraceabilityRecord[] = [
    {
      id: 'trc-001',
      lotId: 'lot-001',
      lotNumber: 'MK-JIM-2026-001',
      coffeeName: 'Jimma Natural Grade 4',
      originName: 'Jimma',
      region: 'Oromia, Jimma Highlands',
      farmName: 'Gera Smallholder Union & Surrounding Villages',
      cooperativeName: 'Gera Primary Farmers Cooperative Union',
      woredaZone: 'Gera Woreda, Jimma Zone',
      altitudeMeters: 1720,
      harvestMonthYear: 'December 2025 - January 2026',
      washingStationName: 'Gera Central Dry Milling & Sorting Facility',
      fermentationHours: 0, // Natural dry process
      dryingDaysOnRaisedBeds: 21,
      parchmentStorage: 'Controlled humidity GrainPro lined storage at 18°C',
      ectaLiquoringGrade: 'Grade 4 Export Approved (Certificate ECTA/J/2026/881)',
      cuppingScore: 82.5,
      flavorNotes: ['Dried Dark Plum', 'Bittersweet Cocoa', 'Walnut'],
      gpsLatitude: 7.7842,
      gpsLongitude: 36.4215,
      farmerFairShareUSDPerKg: 2.85,
      exportShipmentNumber: 'SHP-2026-001',
      destinationPort: 'Port of Hamburg, Germany',
      qrVerificationUrl: '/traceability/MK-JIM-2026-001'
    },
    {
      id: 'trc-002',
      lotId: 'lot-002',
      lotNumber: 'MK-YIR-2026-004',
      coffeeName: 'Yirgacheffe Washed Grade 1',
      originName: 'Yirgacheffe',
      region: 'Gedeo Zone, Southern Nations',
      farmName: 'Chelchele Smallholder Family Farmers (320 contributing families)',
      cooperativeName: 'Kochere District Coffee Farmers Union',
      woredaZone: 'Kochere Woreda, Chelchele Kebele',
      altitudeMeters: 2140,
      harvestMonthYear: 'December 2025',
      washingStationName: 'Chelchele Eco-Pulper Washing Station',
      fermentationHours: 36,
      dryingDaysOnRaisedBeds: 16,
      parchmentStorage: 'Vacuum-sealed humidity-controlled warehouse',
      ectaLiquoringGrade: 'Grade 1 Specialty (Certificate ECTA/Y/2026/014)',
      cuppingScore: 89.2,
      flavorNotes: ['Jasmine Floral', 'Bergamot', 'White Peach', 'Earl Grey'],
      gpsLatitude: 6.1345,
      gpsLongitude: 38.2198,
      farmerFairShareUSDPerKg: 4.60,
      exportShipmentNumber: 'SHP-2026-002',
      destinationPort: 'Port of Aarhus / Copenhagen, Denmark',
      qrVerificationUrl: '/traceability/MK-YIR-2026-004'
    },
    {
      id: 'trc-003',
      lotId: 'lot-003',
      lotNumber: 'MK-GUJ-2026-002',
      coffeeName: 'Guji Anaerobic Natural Grade 1',
      originName: 'Guji',
      region: 'Oromia Region, Guji High Alpine',
      farmName: 'Raro Nensebo Highland Micro-farmers',
      cooperativeName: 'Uraga Specialty Producer Collective',
      woredaZone: 'Uraga Woreda, Raro Nensebo',
      altitudeMeters: 2280,
      harvestMonthYear: 'January 2026',
      washingStationName: 'Raro Nensebo Innovation Wet Mill',
      fermentationHours: 96, // Sealed anaerobic tanks
      dryingDaysOnRaisedBeds: 24,
      parchmentStorage: 'Temperature-controlled GrainPro chambers',
      ectaLiquoringGrade: 'Grade 1 Micro-Lot Q-Score Verified',
      cuppingScore: 90.5,
      flavorNotes: ['Wild Strawberry Jam', 'Passionfruit', 'Dark Cacao', 'Lavender'],
      gpsLatitude: 5.8921,
      gpsLongitude: 38.9812,
      farmerFairShareUSDPerKg: 5.90,
      exportShipmentNumber: 'SHP-2026-003',
      destinationPort: 'Port of Yokohama, Japan',
      qrVerificationUrl: '/traceability/MK-GUJ-2026-002'
    }
  ];

  const rfqs: RFQ[] = [
    {
      id: 'rfq-001',
      rfqNumber: 'RFQ-2026-0142',
      userId: 'usr-buyer-01',
      userEmail: 'buyer@nordicroasters.com',
      buyerCompanyName: 'Nordic Specialty Roasters ApS',
      destinationCountry: 'Denmark',
      destinationPort: 'Port of Aarhus / Copenhagen',
      incotermPreference: 'FOB_DJIBOUTI',
      preferredShipDate: '2026-04-15T00:00:00Z',
      targetPricePerKgUSD: 6.70,
      paymentPreference: 'TELEGRAPHIC_TRANSFER_TT',
      specialNotes: 'Looking to secure 60 bags of washed Grade 1 Yirgacheffe in GrainPro with official ECTA Q-grade certificate for our summer release.',
      status: 'CONVERTED_TO_ORDER',
      items: [
        {
          id: 'rfqi-01',
          productId: 'prod-002',
          productName: 'Yirgacheffe Washed Grade 1 (Chelchele)',
          quantityKg: 3600, // 60 bags
          packagingOption: '60kg Multi-wall GrainPro Jute'
        }
      ],
      quotationId: 'qt-001',
      createdAt: '2026-01-28T10:00:00Z',
      updatedAt: '2026-02-02T12:00:00Z'
    },
    {
      id: 'rfq-002',
      rfqNumber: 'RFQ-2026-0188',
      userId: 'usr-buyer-02',
      userEmail: 'trade@tokyocoffee.jp',
      buyerCompanyName: 'Tokyo Artisan Coffee Co., Ltd.',
      destinationCountry: 'Japan',
      destinationPort: 'Port of Yokohama',
      incotermPreference: 'CIF',
      preferredShipDate: '2026-05-01T00:00:00Z',
      targetPricePerKgUSD: 4.10,
      paymentPreference: 'LETTER_OF_CREDIT_LC',
      specialNotes: 'Full 1x20ft container (320 bags / 19.2 MT) of Jimma Natural Grade 4. Need strict moisture under 11.5% and Japanese MRL pesticide clearance testing.',
      status: 'QUOTATION_SENT',
      items: [
        {
          id: 'rfqi-02',
          productId: 'prod-001',
          productName: 'Jimma Natural Grade 4',
          quantityKg: 19200,
          packagingOption: '60kg Jute Bag with GrainPro Liner'
        }
      ],
      quotationId: 'qt-002',
      createdAt: '2026-02-10T08:30:00Z',
      updatedAt: '2026-02-12T15:00:00Z'
    }
  ];

  const quotations: Quotation[] = [
    {
      id: 'qt-001',
      quotationNumber: 'MK-QT-2026-088',
      rfqId: 'rfq-001',
      buyerProfileId: 'bp-001',
      buyerCompanyName: 'Nordic Specialty Roasters ApS',
      buyerEmail: 'buyer@nordicroasters.com',
      incoterm: 'FOB_DJIBOUTI',
      destinationPort: 'Port of Aarhus / Copenhagen',
      subtotalUSD: 24660, // 3600kg * 6.85
      freightUSD: 0, // FOB Djibouti
      insuranceUSD: 0,
      otherFeesUSD: 350, // Export documentation & Phytosanitary inspection
      totalAmountUSD: 25010,
      currency: 'USD',
      paymentTerms: '30% Advance T/T upon proforma signing, 70% against copy Bill of Lading & Inspection docs',
      validUntil: '2026-03-30T00:00:00Z',
      status: 'ACCEPTED',
      adminNotes: 'Premium lot Chelchele G1 reserved in Bay 4. Customer accepted and order confirmed.',
      items: [
        {
          id: 'qti-01',
          productId: 'prod-002',
          productName: 'Yirgacheffe Washed Grade 1 (Chelchele)',
          quantityKg: 3600,
          unitPricePerKg: 6.85,
          totalUSD: 24660,
          packaging: '60kg Multi-wall GrainPro Jute'
        }
      ],
      orderId: 'ord-001',
      createdAt: '2026-01-29T14:00:00Z'
    },
    {
      id: 'qt-002',
      quotationNumber: 'MK-QT-2026-092',
      rfqId: 'rfq-002',
      buyerProfileId: 'bp-002',
      buyerCompanyName: 'Tokyo Artisan Coffee Co., Ltd.',
      buyerEmail: 'trade@tokyocoffee.jp',
      incoterm: 'CIF',
      destinationPort: 'Port of Yokohama',
      subtotalUSD: 79680, // 19,200kg * $4.15
      freightUSD: 4200, // Djibouti to Yokohama container freight
      insuranceUSD: 650, // Marine cargo insurance
      otherFeesUSD: 450, // Japanese MRL lab certification & phytosanitary
      totalAmountUSD: 84980,
      currency: 'USD',
      paymentTerms: '100% Irrevocable Confirmed Letter of Credit at sight payable against full shipping documents',
      validUntil: '2026-04-15T00:00:00Z',
      status: 'SENT',
      adminNotes: 'Full container Jimma G4. Negotiated CIF Yokohama with Maersk slot allocation confirmed.',
      items: [
        {
          id: 'qti-02',
          productId: 'prod-001',
          productName: 'Jimma Natural Grade 4',
          quantityKg: 19200,
          unitPricePerKg: 4.15,
          totalUSD: 79680,
          packaging: '60kg Jute Bag with GrainPro Liner'
        }
      ],
      createdAt: '2026-02-12T15:00:00Z'
    }
  ];

  const orders: Order[] = [
    {
      id: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      quotationId: 'qt-001',
      userId: 'usr-buyer-01',
      buyerCompanyName: 'Nordic Specialty Roasters ApS',
      buyerEmail: 'buyer@nordicroasters.com',
      totalAmountUSD: 25010,
      currency: 'USD',
      incoterm: 'FOB_DJIBOUTI',
      destinationPort: 'Port of Aarhus / Copenhagen',
      destinationCountry: 'Denmark',
      orderStatus: 'IN_TRANSIT',
      paymentStatus: 'PAID',
      paymentMethod: 'TELEGRAPHIC_TRANSFER_TT',
      timelineEvents: [
        {
          step: 'QUOTE_ACCEPTED',
          title: 'Quotation Accepted & Contract Executed',
          description: 'Buyer accepted proforma quotation MK-QT-2026-088.',
          timestamp: '2026-02-02T10:14:00Z',
          completed: true
        },
        {
          step: 'PAYMENT_CONFIRMED',
          title: '30% Advance T/T Payment Confirmed',
          description: 'Wire transfer confirmed via Commercial Bank of Ethiopia SWIFT CBEETAA.',
          timestamp: '2026-02-04T15:30:00Z',
          completed: true
        },
        {
          step: 'QUALITY_INSPECTION',
          title: 'ECTA Coffee Liquoring & Grading Passed',
          description: 'Official inspection scored lot MK-YIR-2026-004 at 89.2 Specialty Grade 1.',
          timestamp: '2026-02-10T11:00:00Z',
          completed: true
        },
        {
          step: 'EXPORT_DOCUMENTATION',
          title: 'Phytosanitary, COO & Export Permit Issued',
          description: 'Full suite of export documents cleared by Ethiopian authorities.',
          timestamp: '2026-02-18T16:45:00Z',
          completed: true
        },
        {
          step: 'SHIPPED',
          title: 'Loaded on Vessel at Port of Djibouti',
          description: 'Container MSKU9238472 loaded on MSC Oscar voyage 2608W.',
          timestamp: '2026-02-28T08:00:00Z',
          completed: true
        },
        {
          step: 'IN_TRANSIT',
          title: 'In Transit on Water (Red Sea / Suez Canal Route)',
          description: 'Vessel underway toward Europe with estimated arrival at Port of Aarhus on April 12, 2026.',
          timestamp: '2026-03-05T12:00:00Z',
          completed: true
        },
        {
          step: 'DELIVERED',
          title: 'Final Port Arrival & Customs Release',
          description: 'Awaiting port discharge and final container delivery.',
          timestamp: '2026-04-12T00:00:00Z',
          completed: false
        }
      ],
      items: [
        {
          id: 'oi-01',
          productId: 'prod-002',
          productName: 'Yirgacheffe Washed Grade 1 (Chelchele)',
          quantityKg: 3600,
          unitPricePerKg: 6.85,
          totalUSD: 24660,
          packaging: '60kg Multi-wall GrainPro Jute'
        }
      ],
      createdAt: '2026-02-02T10:15:00Z',
      updatedAt: '2026-03-05T12:00:00Z'
    }
  ];

  const payments: Payment[] = [
    {
      id: 'pay-001',
      paymentReference: 'PAY-2026-091',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      amountUSD: 25010,
      paymentMethod: 'TELEGRAPHIC_TRANSFER_TT',
      paymentStatus: 'PAID',
      swiftTransactionRef: 'SWIFT-CBE-2026-DK-9921',
      receiptDocumentUrl: '/documents/SWIFT_Receipt_MK-ORD-2026-044.pdf',
      notes: 'Full payment received via Commercial Bank of Ethiopia account in USD.',
      paidAt: '2026-02-04T15:30:00Z',
      createdAt: '2026-02-02T11:00:00Z'
    }
  ];

  const shipments: Shipment[] = [
    {
      id: 'shp-001',
      shipmentNumber: 'SHP-2026-001',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      lotNumber: 'MK-YIR-2026-004',
      originWarehouse: 'Modjo Dry Port Logistics Hub, Ethiopia',
      portOfLoading: 'Port of Djibouti (DCT Terminal)',
      portOfDischarge: 'Port of Aarhus, Denmark',
      shippingLine: 'MSC Mediterranean Shipping Company',
      vesselName: 'MSC Oscar',
      voyageNumber: '2608W',
      containerNumber: 'MSKU9238472',
      sealNumber: 'ET-982341-SEC',
      containerType: '20ft FCL Standard (GrainPro Lined)',
      totalBags: 60,
      billOfLadingNumber: 'MSCUDJ2026049182',
      etd: '2026-02-28T08:00:00Z',
      eta: '2026-04-12T18:00:00Z',
      currentStatus: 'ON_WATER_TRANSIT',
      trackingUpdates: [
        {
          status: 'ORIGIN_DISPATCH',
          location: 'Modjo Dry Port, Ethiopia',
          description: 'Export customs seal applied. Transferred via Ethio-Djibouti Railway to Djibouti port.',
          date: '2026-02-22'
        },
        {
          status: 'PORT_OF_LOADING',
          location: 'Port of Djibouti (Doraleh Container Terminal)',
          description: 'Gantry crane loaded container onto MSC Oscar.',
          date: '2026-02-27'
        },
        {
          status: 'UNDERWAY_SEA',
          location: 'Red Sea / Bab el-Mandeb Strait',
          description: 'Vessel underway en route to Suez transit corridor.',
          date: '2026-03-03'
        },
        {
          status: 'SUEZ_CANAL_PASSED',
          location: 'Port Said / Mediterranean Sea',
          description: 'Northbound canal transit completed smoothly.',
          date: '2026-03-08'
        }
      ],
      createdAt: '2026-02-18T10:00:00Z'
    }
  ];

  const exportDocuments: ExportDocument[] = [
    {
      id: 'doc-001',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      documentType: 'CERTIFICATE_OF_ORIGIN',
      documentName: 'Certificate of Origin (Form A)',
      documentNumber: 'ECCSA-COO-2026-88192',
      issuingAuthority: 'Ethiopian Chamber of Commerce and Sectoral Associations',
      issuedDate: '2026-02-18',
      documentUrl: '/documents/Certificate_of_Origin_MK-ORD-044.pdf',
      verified: true
    },
    {
      id: 'doc-002',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      documentType: 'PHYTOSANITARY',
      documentName: 'Phytosanitary Certificate',
      documentNumber: 'MOA-PHYTO-2026-40192',
      issuingAuthority: 'Ministry of Agriculture, Plant Health Regulatory Directorate',
      issuedDate: '2026-02-17',
      documentUrl: '/documents/Phytosanitary_Cert_MK-ORD-044.pdf',
      verified: true
    },
    {
      id: 'doc-003',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      documentType: 'QUALITY_CERT_ECTA',
      documentName: 'ECTA Coffee Quality & Liquoring Inspection Certificate',
      documentNumber: 'ECTA-LIQ-2026-0149',
      issuingAuthority: 'Ethiopian Coffee and Tea Authority (ECTA)',
      issuedDate: '2026-02-10',
      documentUrl: '/documents/ECTA_Quality_Certificate_MK-ORD-044.pdf',
      verified: true
    },
    {
      id: 'doc-004',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      documentType: 'BILL_OF_LADING',
      documentName: 'Original Clean On-Board Ocean Bill of Lading',
      documentNumber: 'MSCUDJ2026049182',
      issuingAuthority: 'MSC Mediterranean Shipping Company',
      issuedDate: '2026-02-28',
      documentUrl: '/documents/Ocean_Bill_of_Lading_MK-ORD-044.pdf',
      verified: true
    },
    {
      id: 'doc-005',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      documentType: 'COMMERCIAL_INVOICE',
      documentName: 'Final Commercial Export Invoice',
      documentNumber: 'INV-MK-2026-044',
      issuingAuthority: 'MY KUHLI Coffee Exporters Ltd.',
      issuedDate: '2026-02-20',
      documentUrl: '/documents/Commercial_Invoice_MK-ORD-044.pdf',
      verified: true
    },
    {
      id: 'doc-006',
      orderId: 'ord-001',
      orderNumber: 'MK-ORD-2026-044',
      documentType: 'PACKING_LIST',
      documentName: 'Export Shipping Packing List & Weight Certificate',
      documentNumber: 'PL-MK-2026-044',
      issuingAuthority: 'MY KUHLI Quality & Logistics Dept',
      issuedDate: '2026-02-20',
      documentUrl: '/documents/Packing_List_MK-ORD-044.pdf',
      verified: true
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-001',
      userId: 'usr-buyer-01',
      type: 'SHIPMENT',
      title: 'Vessel Underway to Port of Aarhus',
      message: 'Container MSKU9238472 aboard MSC Oscar has cleared Suez Canal and is sailing on schedule.',
      linkUrl: '/dashboard?tab=orders',
      isRead: false,
      createdAt: '2026-03-08T10:00:00Z'
    },
    {
      id: 'notif-002',
      userId: 'usr-admin-01',
      type: 'RFQ',
      title: 'New RFQ Received from Tokyo Artisan Coffee Co.',
      message: 'Full container Jimma G4 (19.2 MT) inquiry submitted by Kenji Takahashi.',
      linkUrl: '/admin?tab=rfqs',
      isRead: true,
      createdAt: '2026-02-10T08:31:00Z'
    }
  ];

  const conversations: Conversation[] = [
    {
      id: 'conv-001',
      subject: 'Order MK-ORD-2026-044 Shipping Documentation & B/L Copies',
      buyerCompanyName: 'Nordic Specialty Roasters ApS',
      userId: 'usr-buyer-01',
      messages: [
        {
          id: 'msg-001',
          conversationId: 'conv-001',
          senderId: 'usr-buyer-01',
          senderName: 'Lars Lindqvist',
          senderRole: 'BUYER',
          content: 'Hello Selamawit, could you please confirm when the original phytosanitary and ICO certificates will be couriered to our Danish customs broker?',
          createdAt: '2026-03-01T09:15:00Z'
        },
        {
          id: 'msg-002',
          conversationId: 'conv-001',
          senderId: 'usr-sales-01',
          senderName: 'Selamawit Haile',
          senderRole: 'SALES_MANAGER',
          content: 'Dear Lars, greetings from Addis Ababa! The full original document packet was dispatched via DHL Express yesterday (Air Waybill #8841920194). Scanned copies are already available in your buyer portal under Export Documents.',
          createdAt: '2026-03-02T11:40:00Z'
        }
      ],
      updatedAt: '2026-03-02T11:40:00Z'
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 'blog-001',
      title: 'Understanding Ethiopian Coffee Grading: From Grade 1 Specialty to Commercial Naturals',
      slug: 'understanding-ethiopian-coffee-grading',
      excerpt: 'How the Ethiopian Coffee and Tea Authority (ECTA) inspects moisture, defects, screen size, and cup quality to assign grades.',
      content: 'Ethiopia employs a stringent national grading system combining physical defect counting and sensory liquoring analysis. Grade 1 and Grade 2 are reserved exclusively for specialty-grade micro-lots, where defects must not exceed 3 to 12 per 300g sample. Natural coffees from regions like Jimma and Lekempti are traditionally categorized as Grade 4 and Grade 5 for commercial volume, but modern precision raised-bed drying is unlocking specialty Grade 1 naturals that achieve remarkable 88+ cup scores.',
      featuredImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
      category: 'Export Education',
      tags: ['ECTA', 'Grading', 'Quality Control', 'Specialty Coffee'],
      authorName: 'Abebe Tadesse',
      published: true,
      readTimeMin: 6,
      publishedAt: '2026-01-20T00:00:00Z'
    },
    {
      id: 'blog-002',
      title: 'The Logistics Corridor: How Coffee Moves from Ethiopia to Global Roasteries',
      slug: 'the-logistics-corridor-ethiopia-export',
      excerpt: 'Tracing the path from high-altitude washing stations across the Great Rift Valley to the Port of Djibouti and ocean container routes.',
      content: 'As a landlocked nation, Ethiopia relies on the state-of-the-art electrified Ethio-Djibouti Railway connecting Modjo and Mojo Dry Ports directly to the Doraleh Container Terminal at the Port of Djibouti. GrainPro liners protect green beans against humidity fluctuations as containers pass through the Red Sea and Gulf of Aden toward European, Asian, and North American roasting destinations.',
      featuredImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
      category: 'Logistics & Trade',
      tags: ['Logistics', 'Shipping', 'Djibouti', 'Incoterms'],
      authorName: 'Dawit Bekele',
      published: true,
      readTimeMin: 7,
      publishedAt: '2026-02-05T00:00:00Z'
    },
    {
      id: 'blog-003',
      title: 'Soil, Shade, and Terroir: The Microclimates of Yirgacheffe and Guji',
      slug: 'microclimates-of-yirgacheffe-and-guji',
      excerpt: 'Why elevations surpassing 2,200 meters and ancient volcanic iron-rich soils give Ethiopian Arabica its unrivaled floral complexity.',
      content: 'Arabica coffee originated in the ancient wild forests of southwestern Ethiopia. In Guji and Yirgacheffe, slow cherry maturation under canopy shade trees allows sugars to concentrate intensely. The diurnal temperature variation—hot alpine days followed by cool mountain nights—slows cellular division, resulting in high bean density and the famous jasmine-bergamot aromatic notes.',
      featuredImage: 'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=1200&auto=format&fit=crop',
      category: 'Origins & Agriculture',
      tags: ['Terroir', 'Guji', 'Yirgacheffe', 'Arabica Heritage'],
      authorName: 'Selamawit Haile',
      published: true,
      readTimeMin: 5,
      publishedAt: '2026-02-18T00:00:00Z'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 'test-001',
      buyerName: 'Lars Lindqvist',
      companyName: 'Nordic Specialty Roasters ApS',
      country: 'Denmark',
      quote: 'MY KUHLI has redefined how we source Ethiopian green coffee. The transparency, lot traceability down to the specific washing station, and flawless export documentation make them our most reliable origin partner.',
      rating: 5,
      coffeePurchased: 'Yirgacheffe Washed G1 & Guji Anaerobic'
    },
    {
      id: 'test-002',
      buyerName: 'Kenji Takahashi',
      companyName: 'Tokyo Artisan Coffee Co., Ltd.',
      country: 'Japan',
      quote: 'Japanese import standards require extreme consistency and strict moisture control. MY KUHLI delivered 19.2 MT of Jimma Natural that exceeded our cupping bench benchmarks. Their communication is second to none.',
      rating: 5,
      coffeePurchased: 'Jimma Natural Grade 4 Commercial'
    },
    {
      id: 'test-003',
      buyerName: 'Elena Vostrikova',
      companyName: 'Alps Alpine Roasting Guild',
      country: 'Germany / Switzerland',
      quote: 'The direct digital RFQ and instantaneous quotation system cut weeks off our contract finalization. The coffee arrived in Hamburg in immaculate GrainPro condition.',
      rating: 5,
      coffeePurchased: 'Sidama Natural Grade 2'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'log-001',
      userEmail: 'admin@mykuhli.com',
      action: 'SYSTEM_BOOTSTRAP',
      entity: 'Platform',
      entityId: 'SYS-INIT',
      details: 'Initialized MY KUHLI export database with 8 origins, 6 export products, and warehouse allocations.',
      timestamp: '2026-01-10T08:00:00Z'
    },
    {
      id: 'log-002',
      userEmail: 'sales@mykuhli.com',
      action: 'QUOTATION_ISSUED',
      entity: 'Quotation',
      entityId: 'MK-QT-2026-088',
      details: 'Issued official proforma quotation for Nordic Specialty Roasters (3600kg Chelchele G1).',
      timestamp: '2026-01-29T14:00:00Z'
    },
    {
      id: 'log-003',
      userEmail: 'export@mykuhli.com',
      action: 'SHIPMENT_DISPATCHED',
      entity: 'Shipment',
      entityId: 'SHP-2026-001',
      details: 'Dispatched container MSKU9238472 via rail to Port of Djibouti; BL number MSCUDJ2026049182 assigned.',
      timestamp: '2026-02-28T08:00:00Z'
    }
  ];

  const settings: Record<string, string> = {
    companyName: 'MY KUHLI Coffee Exporters Ltd.',
    tagline: 'Exceptional Ethiopian Coffee. Delivered to the World.',
    contactEmail: 'export@mykuhli.com',
    contactPhone: '+251 11 667 8900',
    headquartersAddress: 'Bole Medhanealem Commercial Tower, Suite 704, Addis Ababa, Ethiopia',
    exportLicenseNumber: 'ECTA-EXP-2024-9982-LIC',
    taxId: 'ET-TIN-0098234190',
    currency: 'USD',
    defaultIncoterm: 'FOB_DJIBOUTI',
    primaryPort: 'Port of Djibouti',
    dryPortLocation: 'Modjo Dry Port, Oromia, Ethiopia'
  };

  return {
    users,
    buyerProfiles,
    origins,
    products,
    lots,
    rfqs,
    quotations,
    orders,
    payments,
    shipments,
    exportDocuments,
    traceabilityRecords,
    notifications,
    conversations,
    blogPosts,
    testimonials,
    auditLogs,
    settings
  };
}

class DatabaseService {
  private data: DatabaseData;

  constructor() {
    ensureDataDirectory();
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch {
        this.data = getInitialSeedData();
        this.persist();
      }
    } else {
      this.data = getInitialSeedData();
      this.persist();
    }
  }

  public persist(collectionName?: string, id?: string, data?: any): void {
    try {
      ensureDataDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database to file:', e);
    }

    // Real-time synchronization to Firebase Firestore
    if (collectionName && id && data) {
      saveDocumentToFirestore(collectionName, id, data).catch((err) => {
        console.warn(`[Firestore sync] ${collectionName}/${id} write error:`, err);
      });
    }
  }

  public async syncAllToFirestore(): Promise<{ success: boolean; count: number }> {
    let synced = 0;
    try {
      initFirebaseBackend();
      const collectionsToSync: Array<{ name: string; items: any[] }> = [
        { name: 'origins', items: this.data.origins },
        { name: 'products', items: this.data.products },
        { name: 'lots', items: this.data.lots },
        { name: 'rfqs', items: this.data.rfqs },
        { name: 'quotations', items: this.data.quotations },
        { name: 'orders', items: this.data.orders },
        { name: 'payments', items: this.data.payments },
        { name: 'shipments', items: this.data.shipments },
        { name: 'exportDocuments', items: this.data.exportDocuments },
        { name: 'traceabilityRecords', items: this.data.traceabilityRecords },
        { name: 'blogPosts', items: this.data.blogPosts },
        { name: 'testimonials', items: this.data.testimonials },
        { name: 'auditLogs', items: this.data.auditLogs }
      ];

      for (const group of collectionsToSync) {
        for (const item of group.items) {
          const id = item.id || item.lotNumber || item.slug || String(Date.now());
          const ok = await saveDocumentToFirestore(group.name, id, item);
          if (ok) synced++;
        }
      }
      return { success: true, count: synced };
    } catch (err) {
      console.error('[Firestore syncAllToFirestore] Error:', err);
      return { success: false, count: synced };
    }
  }

  // Users & Auth
  public getUsers() {
    return this.data.users;
  }

  public findUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: User & { passwordHash: string }) {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  public getBuyerProfile(userId: string) {
    return this.data.buyerProfiles.find(bp => bp.userId === userId);
  }

  public createBuyerProfile(profile: BuyerProfile) {
    this.data.buyerProfiles.push(profile);
    this.persist();
    return profile;
  }

  public getAllBuyers() {
    return this.data.buyerProfiles.map(bp => {
      const user = this.findUserById(bp.userId);
      const orders = this.data.orders.filter(o => o.userId === bp.userId);
      const totalVolumeMT = orders.reduce((sum, o) => {
        return sum + o.items.reduce((s, i) => s + i.quantityKg, 0) / 1000;
      }, 0);
      const totalSpendUSD = orders.reduce((sum, o) => sum + o.totalAmountUSD, 0);

      return {
        ...bp,
        userEmail: user?.email,
        contactPerson: user?.fullName,
        orderCount: orders.length,
        totalVolumeMT,
        totalSpendUSD
      };
    });
  }

  // Products & Lots
  public getProducts() {
    return this.data.products;
  }

  public getProductBySlug(slug: string) {
    return this.data.products.find(p => p.slug === slug);
  }

  public getProductById(id: string) {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(product: Product) {
    this.data.products.push(product);
    this.persist();
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.persist();
      return this.data.products[idx];
    }
    return null;
  }

  public getLots() {
    return this.data.lots;
  }

  public getLotByNumber(lotNumber: string) {
    return this.data.lots.find(l => l.lotNumber.toUpperCase() === lotNumber.toUpperCase());
  }

  public getOrigins() {
    return this.data.origins;
  }

  public getOriginBySlug(slug: string) {
    return this.data.origins.find(o => o.slug === slug);
  }

  // Traceability
  public getTraceability(lotNumber: string) {
    return this.data.traceabilityRecords.find(t => t.lotNumber.toUpperCase() === lotNumber.toUpperCase());
  }

  // RFQs
  public getRFQs(userId?: string) {
    if (userId) {
      return this.data.rfqs.filter(r => r.userId === userId);
    }
    return this.data.rfqs;
  }

  public getRFQById(id: string) {
    return this.data.rfqs.find(r => r.id === id);
  }

  public createRFQ(rfq: RFQ) {
    this.data.rfqs.unshift(rfq);

    // Create in-app notification for admin
    const adminUser = this.data.users.find(u => u.role === 'SUPER_ADMIN' || u.role === 'SALES_MANAGER');
    if (adminUser) {
      this.createNotification({
        id: 'notif-' + Date.now(),
        userId: adminUser.id,
        type: 'RFQ',
        title: `New RFQ ${rfq.rfqNumber}`,
        message: `${rfq.buyerCompanyName} requested quote for ${rfq.items.map(i => i.productName).join(', ')}.`,
        linkUrl: '/admin?tab=rfqs',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    this.addAuditLog({
      id: 'log-' + Date.now(),
      userEmail: rfq.userEmail,
      action: 'RFQ_SUBMITTED',
      entity: 'RFQ',
      entityId: rfq.rfqNumber,
      details: `Inquiry submitted for ${rfq.items.reduce((s, i) => s + i.quantityKg, 0)} kg to ${rfq.destinationCountry}`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return rfq;
  }

  public updateRFQStatus(id: string, status: RFQ['status'], quotationId?: string) {
    const rfq = this.data.rfqs.find(r => r.id === id);
    if (rfq) {
      rfq.status = status;
      if (quotationId) rfq.quotationId = quotationId;
      rfq.updatedAt = new Date().toISOString();
      this.persist();
      return rfq;
    }
    return null;
  }

  // Quotations
  public getQuotations(buyerProfileId?: string) {
    if (buyerProfileId) {
      return this.data.quotations.filter(q => q.buyerProfileId === buyerProfileId);
    }
    return this.data.quotations;
  }

  public getQuotationById(id: string) {
    return this.data.quotations.find(q => q.id === id);
  }

  public createQuotation(quotation: Quotation) {
    this.data.quotations.unshift(quotation);

    if (quotation.rfqId) {
      this.updateRFQStatus(quotation.rfqId, 'QUOTATION_SENT', quotation.id);
    }

    // Notify buyer
    const profile = this.data.buyerProfiles.find(bp => bp.id === quotation.buyerProfileId);
    if (profile) {
      this.createNotification({
        id: 'notif-' + Date.now(),
        userId: profile.userId,
        type: 'QUOTATION',
        title: `Quotation ${quotation.quotationNumber} Ready`,
        message: `Your requested proforma quotation for $${quotation.totalAmountUSD.toLocaleString()} is now ready for review and acceptance.`,
        linkUrl: '/dashboard?tab=quotations',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    this.persist();
    return quotation;
  }

  public acceptQuotation(id: string) {
    const quote = this.data.quotations.find(q => q.id === id);
    if (!quote) return null;

    quote.status = 'ACCEPTED';

    const buyerProfile = this.data.buyerProfiles.find(bp => bp.id === quote.buyerProfileId);
    const orderNumber = `MK-ORD-2026-0${Math.floor(100 + Math.random() * 900)}`;

    // Create Order automatically
    const order: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      quotationId: quote.id,
      userId: buyerProfile ? buyerProfile.userId : 'unknown',
      buyerCompanyName: quote.buyerCompanyName,
      buyerEmail: quote.buyerEmail,
      totalAmountUSD: quote.totalAmountUSD,
      currency: quote.currency,
      incoterm: quote.incoterm,
      destinationPort: quote.destinationPort,
      destinationCountry: buyerProfile?.country || 'International',
      orderStatus: 'QUOTE_ACCEPTED',
      paymentStatus: 'PENDING',
      paymentMethod: 'TELEGRAPHIC_TRANSFER_TT',
      timelineEvents: [
        {
          step: 'QUOTE_ACCEPTED',
          title: 'Quotation Accepted & Order Created',
          description: `Contract generated from proforma quote ${quote.quotationNumber}.`,
          timestamp: new Date().toISOString(),
          completed: true
        },
        {
          step: 'PAYMENT_PENDING',
          title: 'Awaiting Payment Confirmation',
          description: 'Payment invoice issued to buyer.',
          timestamp: new Date().toISOString(),
          completed: false
        }
      ],
      items: quote.items.map(item => ({
        id: 'oi-' + Math.random().toString(36).substring(2, 9),
        productId: item.productId,
        productName: item.productName,
        quantityKg: item.quantityKg,
        unitPricePerKg: item.unitPricePerKg,
        totalUSD: item.totalUSD,
        packaging: item.packaging
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.orders.unshift(order);
    quote.orderId = order.id;

    if (quote.rfqId) {
      this.updateRFQStatus(quote.rfqId, 'CONVERTED_TO_ORDER');
    }

    // Reserve stock for products
    for (const item of quote.items) {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.availableStockKg = Math.max(0, prod.availableStockKg - item.quantityKg);
        prod.reservedStockKg += item.quantityKg;
      }
    }

    // Notify Admins
    const admin = this.data.users.find(u => u.role === 'SUPER_ADMIN' || u.role === 'SALES_MANAGER');
    if (admin) {
      this.createNotification({
        id: 'notif-' + Date.now(),
        userId: admin.id,
        type: 'ORDER',
        title: `Order ${orderNumber} Confirmed!`,
        message: `${quote.buyerCompanyName} accepted quote ${quote.quotationNumber}. Total $${quote.totalAmountUSD.toLocaleString()}`,
        linkUrl: '/admin?tab=orders',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    this.addAuditLog({
      id: 'log-' + Date.now(),
      userEmail: quote.buyerEmail,
      action: 'QUOTATION_ACCEPTED',
      entity: 'Order',
      entityId: orderNumber,
      details: `Generated order from quote ${quote.quotationNumber} ($${quote.totalAmountUSD})`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return { quote, order };
  }

  // Orders
  public getOrders(userId?: string) {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId);
    }
    return this.data.orders;
  }

  public getOrderById(id: string) {
    return this.data.orders.find(o => o.id === id);
  }

  public updateOrderStatus(orderId: string, status: Order['orderStatus'], note?: string) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      order.timelineEvents.push({
        step: status,
        title: `Status updated to ${status.replace(/_/g, ' ')}`,
        description: note || 'Status progression updated by MY KUHLI operations team.',
        timestamp: new Date().toISOString(),
        completed: true
      });

      this.persist();
      return order;
    }
    return null;
  }

  // Payments
  public getPayments(orderId?: string) {
    if (orderId) {
      return this.data.payments.filter(p => p.orderId === orderId);
    }
    return this.data.payments;
  }

  public recordPayment(payment: Payment) {
    this.data.payments.unshift(payment);
    const order = this.data.orders.find(o => o.id === payment.orderId);
    if (order) {
      order.paymentStatus = payment.paymentStatus;
      if (payment.paymentStatus === 'PAID') {
        order.orderStatus = 'PROCESSING';
        order.timelineEvents.push({
          step: 'PAYMENT_CONFIRMED',
          title: 'Payment Confirmed & Cleared',
          description: `Payment of $${payment.amountUSD.toLocaleString()} verified. Reference: ${payment.paymentReference}`,
          timestamp: new Date().toISOString(),
          completed: true
        });
      }
    }
    this.persist();
    return payment;
  }

  // Shipments
  public getShipments(orderId?: string) {
    if (orderId) {
      return this.data.shipments.filter(s => s.orderId === orderId);
    }
    return this.data.shipments;
  }

  public getShipmentById(id: string) {
    return this.data.shipments.find(s => s.id === id);
  }

  public createShipment(shipment: Shipment) {
    this.data.shipments.unshift(shipment);
    const order = this.data.orders.find(o => o.id === shipment.orderId);
    if (order) {
      order.orderStatus = 'SHIPPED';
      order.timelineEvents.push({
        step: 'SHIPPED',
        title: `Dispatched on Vessel ${shipment.vesselName}`,
        description: `Container ${shipment.containerNumber} loaded at ${shipment.portOfLoading}. BL: ${shipment.billOfLadingNumber || 'Pending'}`,
        timestamp: new Date().toISOString(),
        completed: true
      });
    }
    this.persist();
    return shipment;
  }

  // Export Documents
  public getExportDocuments(orderId?: string) {
    if (orderId) {
      return this.data.exportDocuments.filter(d => d.orderId === orderId);
    }
    return this.data.exportDocuments;
  }

  public addExportDocument(doc: ExportDocument) {
    this.data.exportDocuments.push(doc);
    this.persist();
    return doc;
  }

  // Notifications
  public getNotifications(userId: string) {
    return this.data.notifications.filter(n => n.userId === userId);
  }

  public createNotification(notification: Notification) {
    this.data.notifications.unshift(notification);
    this.persist();
    return notification;
  }

  public markAllNotificationsAsRead(userId: string) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.persist();
  }

  // Conversations & Messages
  public getConversations(userId?: string) {
    if (userId) {
      return this.data.conversations.filter(c => c.userId === userId);
    }
    return this.data.conversations;
  }

  public addMessage(conversationId: string, message: { senderId: string; senderName: string; senderRole: any; content: string }) {
    const conv = this.data.conversations.find(c => c.id === conversationId);
    if (conv) {
      const msg = {
        id: 'msg-' + Date.now(),
        conversationId,
        senderId: message.senderId,
        senderName: message.senderName,
        senderRole: message.senderRole,
        content: message.content,
        createdAt: new Date().toISOString()
      };
      conv.messages.push(msg);
      conv.updatedAt = new Date().toISOString();
      this.persist();
      return msg;
    }
    return null;
  }

  // Blog
  public getBlogPosts() {
    return this.data.blogPosts;
  }

  public getBlogPostBySlug(slug: string) {
    return this.data.blogPosts.find(b => b.slug === slug);
  }

  public createBlogPost(post: BlogPost) {
    this.data.blogPosts.unshift(post);
    this.persist();
    return post;
  }

  // Testimonials
  public getTestimonials() {
    return this.data.testimonials;
  }

  // Audit Logs
  public getAuditLogs() {
    return this.data.auditLogs;
  }

  public addAuditLog(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    this.persist();
  }

  // Settings
  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(newSettings: Record<string, string>) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.persist();
    return this.data.settings;
  }

  // Analytics
  public getAdminAnalytics(): AdminAnalytics {
    const totalExportVolumeMT = this.data.orders.reduce((sum, order) => {
      const orderKg = order.items.reduce((s, i) => s + i.quantityKg, 0);
      return sum + orderKg / 1000;
    }, 0);

    const totalRevenueUSD = this.data.orders.reduce((sum, order) => sum + order.totalAmountUSD, 0);
    const activeRFQsCount = this.data.rfqs.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
    const pendingQuotationsCount = this.data.quotations.filter(q => q.status === 'SENT').length;
    const activeShipmentsCount = this.data.shipments.filter(s => s.currentStatus !== 'DELIVERED').length;
    const totalRegisteredBuyers = this.data.buyerProfiles.length;

    const monthlyExportSales = [
      { month: 'Oct 2025', volumeMT: 19.2, revenueUSD: 82500 },
      { month: 'Nov 2025', volumeMT: 38.4, revenueUSD: 174000 },
      { month: 'Dec 2025', volumeMT: 57.6, revenueUSD: 298000 },
      { month: 'Jan 2026', volumeMT: 76.8, revenueUSD: 395000 },
      { month: 'Feb 2026', volumeMT: 96.0, revenueUSD: 512000 },
      { month: 'Mar 2026', volumeMT: 115.2, revenueUSD: 648000 }
    ];

    const countryBreakdown = [
      { country: 'Germany & Northern Europe', orders: 14, volumeMT: 68.4, sharePercent: 38 },
      { country: 'Japan & East Asia', orders: 11, volumeMT: 45.6, sharePercent: 25 },
      { country: 'United States & Canada', orders: 9, volumeMT: 38.0, sharePercent: 21 },
      { country: 'United Arab Emirates & Gulf', orders: 6, volumeMT: 28.8, sharePercent: 16 }
    ];

    const originBreakdown = [
      { origin: 'Jimma Natural', volumeMT: 76.8, scoreAvg: 83.2 },
      { origin: 'Yirgacheffe Washed', volumeMT: 43.2, scoreAvg: 89.4 },
      { origin: 'Guji Anaerobic', volumeMT: 28.8, scoreAvg: 90.5 },
      { origin: 'Sidama Natural', volumeMT: 32.4, scoreAvg: 86.8 }
    ];

    const rfqFunnel = [
      { stage: 'Inquiries Submitted', count: 48, conversionPercent: 100 },
      { stage: 'Quotations Formatted', count: 39, conversionPercent: 81 },
      { stage: 'Proformas Accepted', count: 28, conversionPercent: 58 },
      { stage: 'Orders Shipped', count: 24, conversionPercent: 50 }
    ];

    return {
      totalExportVolumeMT,
      totalRevenueUSD,
      activeRFQsCount,
      pendingQuotationsCount,
      activeShipmentsCount,
      totalRegisteredBuyers,
      monthlyExportSales,
      countryBreakdown,
      originBreakdown,
      rfqFunnel
    };
  }
}

export const db = new DatabaseService();
