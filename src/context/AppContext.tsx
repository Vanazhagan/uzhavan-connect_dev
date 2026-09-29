import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  UserProfile,
  VerificationRequest,
  CropListing,
  CropSaleRecord,
  CropOffer,
  BuyerRequirement,
  WorkerProfile,
  WorkerBooking,
  ReverseWorkerRequest,
  MachineItem,
  MachineryBooking,
  AgriStore,
  AgriProduct,
  LogisticsPartnerProfile,
  DeliveryRequest,
  Order,
  PaymentRecord,
  FarmCalendarEvent,
  FarmWeatherDay,
  AppNotification,
  AdminIssue,
  RevenueSectorMetric,
  UzhavanAward,
  SupportedLanguage,
  DigitalTransactionRecord,
  MarketPriceItem,
  MachineryRequirement,
} from '../types';
import {
  SEED_FARMERS,
  SEED_BUYERS,
  SEED_CROPS,
  SEED_OFFERS,
  SEED_BUYER_REQUIREMENTS,
  SEED_WORKERS,
  SEED_WORKER_BOOKINGS,
  SEED_REVERSE_WORKER_REQUESTS,
  SEED_MACHINERY,
  SEED_MACHINERY_BOOKINGS,
  SEED_MACHINERY_REQUIREMENTS,
  SEED_MARKET_PRICES,
  SEED_AGRI_STORES,
  SEED_AGRI_PRODUCTS,
  SEED_LOGISTICS_PARTNERS,
  SEED_DELIVERY_REQUESTS,
  SEED_ORDERS,
  SEED_WEATHER_FORECAST,
  SEED_CALENDAR_EVENTS,
  SEED_NOTIFICATIONS,
  SEED_REVENUE_SECTORS,
  SEED_ADMIN_ISSUES,
  SEED_AWARDS,
} from '../data/seedData';
import { TRANSLATIONS } from '../i18n/translations';
import { ASSET_IMAGES } from '../assets/images';

interface FavouritesMap {
  farmers: string[];
  workers: string[];
  machinery: string[];
  stores: string[];
}

export interface SalesLedgerMetrics {
  validSales: CropSaleRecord[];
  soldQuantity: number;
  remainingQuantity: number;
  soldPercentage: number;
  isSoldOut: boolean;
  buyerCount: number;
}

export function computeSalesLedger(totalQuantityKg: number, sales?: CropSaleRecord[]): SalesLedgerMetrics {
  const original = Number(totalQuantityKg) || 0;
  const validSales = (sales || []).filter(
    s => s && typeof s.quantityKg === 'number' && s.quantityKg > 0
  );

  const soldQuantity = validSales.reduce((acc, s) => acc + s.quantityKg, 0);
  const remainingQuantity = Math.max(0, original - soldQuantity);
  const soldPercentage = original > 0
    ? Math.min(100, Math.round((soldQuantity / original) * 100))
    : 0;
  const isSoldOut = remainingQuantity === 0;
  const buyerCount = new Set(validSales.map(s => s.buyerId)).size;

  return {
    validSales,
    soldQuantity,
    remainingQuantity,
    soldPercentage,
    isSoldOut,
    buyerCount,
  };
}

export function normalizeCropWithLedger(crop: CropListing): CropListing {
  const ledger = computeSalesLedger(crop.totalQuantityKg, crop.sales);
  return {
    ...crop,
    sales: ledger.validSales,
    soldQuantityKg: ledger.soldQuantity,
    remainingQuantityKg: ledger.remainingQuantity,
    isSoldOut: ledger.isSoldOut,
  };
}

interface AppContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (typeof TRANSLATIONS)['en'];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  whyTrustRingModalUser: UserProfile | null;
  setWhyTrustRingModalUser: (user: UserProfile | null) => void;

  // Data states
  crops: CropListing[];
  offers: CropOffer[];
  buyerRequirements: BuyerRequirement[];
  marketPrices: MarketPriceItem[];
  workers: WorkerProfile[];
  workerBookings: WorkerBooking[];
  machinery: MachineItem[];
  machineryBookings: MachineryBooking[];
  machineryRequirements: MachineryRequirement[];
  agriStores: AgriStore[];
  agriProducts: AgriProduct[];
  logisticsPartners: LogisticsPartnerProfile[];
  deliveryRequests: DeliveryRequest[];
  verificationRequests: VerificationRequest[];
  orders: Order[];
  calendarEvents: FarmCalendarEvent[];
  weatherForecast: FarmWeatherDay[];
  notifications: AppNotification[];
  adminIssues: AdminIssue[];
  revenueSectors: RevenueSectorMetric[];
  awards: UzhavanAward[];
  favourites: FavouritesMap;
  selectedMachineForCalendar: MachineItem | null;
  setSelectedMachineForCalendar: (machine: MachineItem | null) => void;

  // Actions
  switchRole: (role: UserRole) => void;
  addCropListing: (crop: Partial<CropListing>) => void;
  recordPartialSale: (cropId: string, buyerId: string, buyerName: string, qtyKg: number, pricePerKg: number, offerId?: string) => { success: boolean; message: string; remainingQuantity?: number; orderId?: string };
  submitCropOffer: (offerData: { cropListingId: string; cropName: string; offeredQuantityKg: number; offeredPricePerKg: number; pickupTerms: 'Farm Pickup by Buyer' | 'Farmer Arranged Logistics' | 'Direct Mandi Delivery'; message?: string; unit?: string }) => { success: boolean; message: string };
  respondToOffer: (offerId: string, action: 'accept' | 'reject' | 'counter', counterPrice?: number, counterQuantity?: number, counterMessage?: string) => { success: boolean; message: string; remainingQuantity?: number };
  respondToCounterOffer: (offerId: string, action: 'accept' | 'reject') => { success: boolean; message: string };
  addBuyerRequirement: (req: Partial<BuyerRequirement>) => void;
  labourRequirements: ReverseWorkerRequest[];
  bookWorker: (booking: Partial<WorkerBooking>) => { success: boolean; message: string };
  acceptWorkerBooking: (bookingId: string) => void;
  rejectWorkerBooking: (bookingId: string, reason?: string) => void;
  updateWorkerBookingStatus: (bookingId: string, status: 'in_progress' | 'completed' | 'cancelled') => void;
  postLabourRequirement: (req: Partial<ReverseWorkerRequest>) => { success: boolean; message: string };
  expressWorkerInterest: (requirementId: string, workerData?: Partial<WorkerProfile>, isIndividual?: boolean) => { success: boolean; message: string };
  acceptLabourRequirementTeam: (requirementId: string, workerId: string) => { success: boolean; message: string };
  confirmIndividualWorker: (requirementId: string, workerId: string) => { success: boolean; message: string };
  cancelLabourRequirement: (requirementId: string) => void;
  cancelWorkerBooking: (bookingId: string) => void;
  requestWorkerReschedule: (bookingId: string, newDate: string, newTimeSlot: string) => void;
  approveWorkerReschedule: (bookingId: string) => void;

  bookMachinery: (booking: Partial<MachineryBooking>) => { success: boolean; message: string };
  acceptMachineryBooking: (bookingId: string) => void;
  rejectMachineryBooking: (bookingId: string, reason?: string) => void;
  cancelMachineryBooking: (bookingId: string) => void;
  requestMachineryReschedule: (bookingId: string, newDate: string, newTimeSlot: string) => void;
  approveMachineryReschedule: (bookingId: string) => void;
  updateMachineryBookingStatus: (bookingId: string, status: MachineryBooking['status']) => void;
  postMachineryRequirement: (req: Partial<MachineryRequirement>) => { success: boolean; message: string };
  respondToMachineryRequirement: (reqId: string, proposedRate: number, notes?: string) => { success: boolean; message: string };

  createDeliveryRequest: (req: Partial<DeliveryRequest>) => { success: boolean; message: string };
  acceptDeliveryRequest: (deliveryId: string, partnerId?: string) => void;
  assignDriverAndVehicle: (deliveryId: string, driverName: string, driverMobile: string, vehicleNumber: string) => { success: boolean; message: string };
  rejectDeliveryRequest: (deliveryId: string, reason?: string) => void;
  updateDeliveryStatus: (deliveryId: string, newStatus: DeliveryRequest['status'], note?: string) => void;
  confirmBuyerProduceReceived: (deliveryId: string) => void;
  submitKycVerification: (userId: string, role: UserRole, kycDetails: any) => { success: boolean; message: string };
  approveKycVerification: (requestId: string) => void;
  rejectKycVerification: (requestId: string, reason: string) => void;
  recordBuyerPayment: (orderId: string, amount: number, method: 'UPI' | 'Bank Transfer' | 'Cash', referenceId?: string, proofUrl?: string) => void;
  confirmFarmerPaymentReceipt: (orderId: string, paymentId?: string) => void;
  raisePaymentDispute: (orderId: string, reason: string, paymentId?: string) => void;
  addCalendarEvent: (event: Partial<FarmCalendarEvent>) => void;
  toggleFavourite: (type: keyof FavouritesMap, id: string) => void;
  markNotificationRead: (id: string) => void;
  adminApproveVerification: (entityId: string, role: string) => void;
  adminResolveIssue: (issueId: string, note: string) => void;
  runDemoStory: () => void;
  resetToDefaults: () => void;
  triggerSoldOutCelebration: () => void;
  digitalTransactionRecord: DigitalTransactionRecord | null;
  setDigitalTransactionRecord: (rec: DigitalTransactionRecord | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'uzhavan_connect_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage parse error', e);
    return defaultValue;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage save error', e);
  }
}

function isObsoleteCropName(name?: string): boolean {
  if (!name) return false;
  const n = name.toLowerCase().trim();
  return (
    n.includes('tomato') ||
    n.includes('தக்காளி') ||
    n.includes('turmeric') ||
    n.includes('மஞ்சள்')
  );
}

function sanitizeCrops(rawCrops: CropListing[]): CropListing[] {
  if (!Array.isArray(rawCrops)) return SEED_CROPS;
  const filtered = rawCrops.filter(
    c => c && !isObsoleteCropName(c.cropName) && !isObsoleteCropName(c.cropNameTa) && !isObsoleteCropName(c.variety)
  );
  return filtered.length > 0 ? filtered : SEED_CROPS;
}

function sanitizeOffers(rawOffers: CropOffer[]): CropOffer[] {
  if (!Array.isArray(rawOffers)) return SEED_OFFERS;
  return rawOffers.filter(o => o && !isObsoleteCropName(o.cropName));
}

function sanitizeRequirements(rawReqs: BuyerRequirement[]): BuyerRequirement[] {
  if (!Array.isArray(rawReqs)) return SEED_BUYER_REQUIREMENTS;
  return rawReqs.filter(r => r && !isObsoleteCropName(r.cropNeeded) && !isObsoleteCropName(r.cropNeededTa));
}

function sanitizeMarketPrices(rawPrices: MarketPriceItem[]): MarketPriceItem[] {
  if (!Array.isArray(rawPrices)) return SEED_MARKET_PRICES;
  const filtered = rawPrices.filter(p => p && !isObsoleteCropName(p.cropName) && !isObsoleteCropName(p.cropNameTa));
  const existingNames = new Set(filtered.map(p => p.cropName.toLowerCase()));

  SEED_MARKET_PRICES.forEach(seedItem => {
    if (!existingNames.has(seedItem.cropName.toLowerCase())) {
      filtered.push(seedItem);
    }
  });

  return filtered;
}

function sanitizeMachinery(raw: MachineItem[]): MachineItem[] {
  if (!Array.isArray(raw) || raw.length < 12) return SEED_MACHINERY;
  const seedImageMap = new Map(SEED_MACHINERY.map(m => [m.id, m.imageUrl]));
  const updated = raw.map(item => {
    if (seedImageMap.has(item.id)) {
      return { ...item, imageUrl: seedImageMap.get(item.id)! };
    }
    return item;
  });
  const existingIds = new Set(updated.map(m => m.id));
  SEED_MACHINERY.forEach(seedItem => {
    if (!existingIds.has(seedItem.id)) {
      updated.push(seedItem);
    }
  });
  return updated;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() =>
    getStored<SupportedLanguage>('lang', 'en')
  );
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() =>
    getStored<UserRole>('role', 'farmer')
  );
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [whyTrustRingModalUser, setWhyTrustRingModalUser] = useState<UserProfile | null>(null);
  const [digitalTransactionRecord, setDigitalTransactionRecord] = useState<DigitalTransactionRecord | null>(null);

  // Core collections
  const [crops, setCrops] = useState<CropListing[]>(() => {
    const raw = getStored<CropListing[]>('crops', SEED_CROPS);
    const sanitized = sanitizeCrops(raw).map(normalizeCropWithLedger);
    setStored('crops', sanitized);
    return sanitized;
  });
  const cropsRef = React.useRef<CropListing[]>(crops);
  cropsRef.current = crops;
  const [offers, setOffers] = useState<CropOffer[]>(() => {
    const raw = getStored<CropOffer[]>('offers', SEED_OFFERS);
    const sanitized = sanitizeOffers(raw);
    setStored('offers', sanitized);
    return sanitized;
  });
  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>(() => {
    const raw = getStored<BuyerRequirement[]>('requirements', SEED_BUYER_REQUIREMENTS);
    const sanitized = sanitizeRequirements(raw);
    setStored('requirements', sanitized);
    return sanitized;
  });
  const [workers, setWorkers] = useState<WorkerProfile[]>(() => getStored('workers', SEED_WORKERS));
  const [workerBookings, setWorkerBookings] = useState<WorkerBooking[]>(() =>
    getStored('worker_bookings', SEED_WORKER_BOOKINGS)
  );
  const [labourRequirements, setLabourRequirements] = useState<ReverseWorkerRequest[]>(() =>
    getStored('labour_requirements', SEED_REVERSE_WORKER_REQUESTS)
  );
  const [machinery, setMachinery] = useState<MachineItem[]>(() => {
    const raw = getStored<MachineItem[]>('machinery', SEED_MACHINERY);
    const sanitized = sanitizeMachinery(raw);
    setStored('machinery', sanitized);
    return sanitized;
  });
  const [machineryBookings, setMachineryBookings] = useState<MachineryBooking[]>(() =>
    getStored('machinery_bookings', SEED_MACHINERY_BOOKINGS)
  );
  const [machineryRequirements, setMachineryRequirements] = useState<MachineryRequirement[]>(() =>
    getStored('machinery_requirements', SEED_MACHINERY_REQUIREMENTS)
  );
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(() => {
    const raw = getStored<MarketPriceItem[]>('market_prices', SEED_MARKET_PRICES);
    const sanitized = sanitizeMarketPrices(raw);
    setStored('market_prices', sanitized);
    return sanitized;
  });
  const [agriStores, setAgriStores] = useState<AgriStore[]>(() => getStored('stores', SEED_AGRI_STORES));
  const [agriProducts, setAgriProducts] = useState<AgriProduct[]>(() => getStored('products', SEED_AGRI_PRODUCTS));
  const [logisticsPartners, setLogisticsPartners] = useState<LogisticsPartnerProfile[]>(() =>
    getStored('logistics_partners', SEED_LOGISTICS_PARTNERS)
  );
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>(() =>
    getStored('delivery_requests', SEED_DELIVERY_REQUESTS)
  );
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(() =>
    getStored('verification_requests', [
      {
        id: 'user_buyer_new',
        userId: 'user_buyer_new',
        userName: 'Kaveri Agro Exports',
        userRole: 'buyer' as UserRole,
        district: 'Salem',
        mobile: '9788012345',
        submittedAt: '2026-10-02 09:30',
        status: 'VERIFICATION_PENDING' as const,
        kycSummary: {
          businessName: 'Kaveri Agro Exports Pvt Ltd',
          gstOrPanMasked: 'GST: 33AABCK9918P1Z3',
          idType: 'GSTIN Registration',
        },
      },
      {
        id: 'user_worker_new',
        userId: 'user_worker_new',
        userName: 'Thirunavukarasu Field Team',
        userRole: 'worker' as UserRole,
        district: 'Madurai',
        mobile: '9842109822',
        submittedAt: '2026-10-02 11:15',
        status: 'VERIFICATION_PENDING' as const,
        kycSummary: {
          idType: '6 Farm Labor ID cards',
          idNumberMasked: 'TN-LAB-99201',
        },
      },
      {
        id: 'user_farmer_kumar',
        userId: 'user_farmer_kumar',
        userName: 'Suresh Kumar',
        userRole: 'farmer' as UserRole,
        district: 'Coimbatore',
        mobile: '9842154321',
        submittedAt: '2026-09-28 10:00',
        status: 'VERIFIED' as const,
        kycSummary: {
          landRecordRefMasked: 'Patta/Chitta Ref: 88219/Pollachi',
          idType: 'Farmer Identity Proof',
        },
      },
      {
        id: 'user_buyer_murugan',
        userId: 'user_buyer_murugan',
        userName: 'Murugan Wholesale Mandi',
        userRole: 'buyer' as UserRole,
        district: 'Coimbatore',
        mobile: '9843011223',
        submittedAt: '2026-09-25 12:00',
        status: 'VERIFIED' as const,
        kycSummary: {
          businessName: 'Murugan Wholesale Agro Mandi',
          gstOrPanMasked: 'GST: 33AAACM4411P1Z5',
          idType: 'Mandatory Mandi License',
        },
      },
      {
        id: 'user_logistics_vettri',
        userId: 'user_logistics_vettri',
        userName: 'Vettri Transport (V. Saravanan)',
        userRole: 'logistics' as UserRole,
        district: 'Coimbatore',
        mobile: '9842888999',
        submittedAt: '2026-09-28 14:00',
        status: 'VERIFIED' as const,
        kycSummary: {
          businessName: 'Vettri Rural Express Logistics',
          drivingLicenceMasked: 'DL: TN-37...0098',
          vehicleRcMasked: 'RC: TN 37 CY 4052',
          idType: 'Commercial RC & Goods Permit',
        },
      },
    ])
  );
  const [orders, setOrders] = useState<Order[]>(() => {
    const loaded = getStored('orders', SEED_ORDERS);
    return (loaded || []).map((o: Order) => {
      const updatedPayments = (o.payments || []).map(p => ({
        ...p,
        status: p.status || (o.settlementStatus === 'settlement_completed' ? ('CONFIRMED_BY_FARMER' as const) : ('RECORDED' as const)),
      }));
      const confirmedPaid = updatedPayments
        .filter(p => p.status === 'CONFIRMED_BY_FARMER')
        .reduce((sum, p) => sum + p.amount, 0);
      const remainingBalance = Math.max(0, o.cropValue - confirmedPaid);
      return {
        ...o,
        payments: updatedPayments,
        totalPaid: confirmedPaid,
        remainingBalance,
      };
    });
  });
  const [calendarEvents, setCalendarEvents] = useState<FarmCalendarEvent[]>(() =>
    getStored('calendar_events', SEED_CALENDAR_EVENTS)
  );
  const [weatherForecast] = useState<FarmWeatherDay[]>(SEED_WEATHER_FORECAST);
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStored('notifications', SEED_NOTIFICATIONS)
  );
  const [adminIssues, setAdminIssues] = useState<AdminIssue[]>(() =>
    getStored('admin_issues', SEED_ADMIN_ISSUES)
  );
  const [revenueSectors, setRevenueSectors] = useState<RevenueSectorMetric[]>(() =>
    getStored('revenue_sectors', SEED_REVENUE_SECTORS)
  );
  const [awards] = useState<UzhavanAward[]>(SEED_AWARDS);
  const [favourites, setFavourites] = useState<FavouritesMap>(() =>
    getStored('favourites', { farmers: ['user_farmer_kumar'], workers: ['worker_marimuthu'], machinery: ['mach_tractor_01'], stores: ['store_cauvery_bio'] })
  );
  const [selectedMachineForCalendar, setSelectedMachineForCalendar] = useState<MachineItem | null>(null);

  // Helper to resolve consistent demo user profile per role
  const getDemoUserForRole = (role: UserRole): UserProfile => {
    switch (role) {
      case 'farmer':
        return SEED_FARMERS[0];
      case 'buyer':
        return SEED_BUYERS[0];
      case 'worker':
        return {
          id: 'user_worker_mari',
          name: 'Marimuthu Team Leader',
          businessName: 'Marimuthu Harvest Workers',
          role: 'worker',
          mobile: '9842019283',
          district: 'Coimbatore',
          taluk: 'Pollachi',
          preferredLanguage: 'ta',
          trust: SEED_WORKERS[0].trust,
          verificationStatus: 'verified',
        };
      case 'machinery':
        return {
          id: 'prov_ravi_machinery',
          name: 'Ravi Palanisamy',
          businessName: 'Ravi Agricultural Machinery Hub',
          role: 'machinery',
          mobile: '9842233445',
          district: 'Coimbatore',
          taluk: 'Pollachi',
          village: 'Anamalai',
          preferredLanguage: 'ta',
          verificationStatus: 'verified',
          trust: {
            level: 'gold',
            title: 'Active Member',
            completedTransactions: 28,
            fulfilmentRate: 97,
            isVerified: true,
            positiveFeedbackScore: 4.85,
            cancellationRate: 1.0,
            reasons: ['28 Verified Tractor Bookings', 'Dedicated Machine Maintenance', 'Verified Equipment Papers'],
          },
        };
      case 'logistics':
        return {
          id: 'user_logistics_vettri',
          name: 'Vettri Transport (V. Saravanan)',
          businessName: 'Vettri Rural Express Logistics',
          role: 'logistics',
          mobile: '9842888999',
          district: 'Coimbatore',
          taluk: 'Pollachi',
          preferredLanguage: 'ta',
          verificationStatus: 'verified',
          trust: {
            level: 'gold',
            title: 'Active Member',
            completedTransactions: 31,
            fulfilmentRate: 98,
            isVerified: true,
            positiveFeedbackScore: 4.9,
            cancellationRate: 0.8,
            reasons: ['31 Verified Trips Delivered', 'On-Time GPS Tracking'],
          },
        };
      case 'agri_input':
        return {
          id: 'store_cauvery_bio',
          name: 'P. Balasubramanian',
          businessName: 'Cauvery Bio Inputs & Certified Seeds',
          role: 'agri_input',
          mobile: '9843234567',
          district: 'Erode',
          taluk: 'Erode',
          preferredLanguage: 'ta',
          trust: SEED_AGRI_STORES[0].trust,
          verificationStatus: 'verified',
        };
      case 'admin':
        return {
          id: 'user_admin',
          name: 'Chief Admin (Uzhavan Ops)',
          businessName: 'Uzhavan Connect Central Operations',
          role: 'admin',
          mobile: '9840000000',
          email: 'admin@demo.com',
          district: 'Tamil Nadu Central',
          preferredLanguage: 'en',
          trust: {
            level: 'star',
            title: 'Platform System Admin',
            completedTransactions: 999,
            fulfilmentRate: 100,
            isVerified: true,
            positiveFeedbackScore: 5.0,
            cancellationRate: 0,
            reasons: ['Master Platform Administrator', 'Zero Fee Rate Enforcer', 'Audit Verified'],
          },
          verificationStatus: 'verified',
        };
      default:
        return SEED_FARMERS[0];
    }
  };

  // Active user representation based on role
  const [currentUser, setCurrentUserState] = useState<UserProfile>(() =>
    getDemoUserForRole(currentRole)
  );

  // Sync to localStorage
  useEffect(() => setStored('lang', language), [language]);
  useEffect(() => setStored('role', currentRole), [currentRole]);
  useEffect(() => {
    cropsRef.current = crops;
    setStored('crops', crops);
  }, [crops]);
  useEffect(() => setStored('offers', offers), [offers]);
  useEffect(() => setStored('requirements', buyerRequirements), [buyerRequirements]);
  useEffect(() => setStored('workers', workers), [workers]);
  useEffect(() => setStored('worker_bookings', workerBookings), [workerBookings]);
  useEffect(() => setStored('labour_requirements', labourRequirements), [labourRequirements]);
  useEffect(() => setStored('machinery', machinery), [machinery]);
  useEffect(() => setStored('machinery_bookings', machineryBookings), [machineryBookings]);
  useEffect(() => setStored('machinery_requirements', machineryRequirements), [machineryRequirements]);
  useEffect(() => setStored('market_prices', marketPrices), [marketPrices]);
  useEffect(() => setStored('stores', agriStores), [agriStores]);
  useEffect(() => setStored('products', agriProducts), [agriProducts]);
  useEffect(() => setStored('logistics_partners', logisticsPartners), [logisticsPartners]);
  useEffect(() => setStored('delivery_requests', deliveryRequests), [deliveryRequests]);
  useEffect(() => setStored('orders', orders), [orders]);
  useEffect(() => setStored('calendar_events', calendarEvents), [calendarEvents]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('admin_issues', adminIssues), [adminIssues]);
  useEffect(() => setStored('revenue_sectors', revenueSectors), [revenueSectors]);
  useEffect(() => setStored('favourites', favourites), [favourites]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const switchRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setActiveTabState('home');
    setCurrentUserState(getDemoUserForRole(role));
  };

  const triggerSoldOutCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#16a34a', '#eab308', '#059669', '#ca8a04'],
      });
    } catch {
      // safe fallback
    }
  };

  const addCropListing = (cropData: Partial<CropListing>) => {
    const newCrop: CropListing = {
      id: `crop_${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerDistrict: `${currentUser.taluk ? currentUser.taluk + ', ' : ''}${currentUser.district}`,
      farmerTrust: currentUser.trust,
      cropName: cropData.cropName || 'Coconut',
      cropNameTa: cropData.cropNameTa || 'தேங்காய்',
      variety: cropData.variety || 'Pollachi Tall Hybrid Grade 1',
      imageUrl: cropData.imageUrl || ASSET_IMAGES.cropCoconutHarvest,
      totalQuantityKg: cropData.totalQuantityKg || 2000,
      soldQuantityKg: 0,
      remainingQuantityKg: cropData.totalQuantityKg || 2000,
      pricePerKg: cropData.pricePerKg || 30,
      unit: cropData.unit || 'Coconuts',
      harvestDate: cropData.harvestDate || '2026-10-10',
      qualityGrade: cropData.qualityGrade || 'Grade A - Premium',
      cultivationType: cropData.cultivationType || 'Natural / Organic',
      description: cropData.description || 'Fresh mature Pollachi coconuts, rich copra yield, sweet water.',
      openForOffers: cropData.openForOffers ?? true,
      sales: [],
      isSoldOut: false,
      publishedDate: new Date().toISOString().split('T')[0],
    };

    setCrops(prev => [newCrop, ...prev]);

    // Also add an upcoming harvest event to the farm calendar
    const calendarEvent: FarmCalendarEvent = {
      id: `cal_harvest_${newCrop.id}`,
      title: `${newCrop.cropName} Harvest (${newCrop.totalQuantityKg} KG)`,
      titleTa: `${newCrop.cropNameTa} அறுவடை (${newCrop.totalQuantityKg} கிலோ)`,
      date: newCrop.harvestDate,
      time: '07:00 AM - 01:00 PM',
      type: 'harvest',
      cropName: newCrop.cropName,
      quantityKg: newCrop.totalQuantityKg,
      weatherAlert: false,
      status: 'scheduled',
      details: `Harvest ready on ${newCrop.harvestDate}. Quality: ${newCrop.qualityGrade}`,
    };
    setCalendarEvents(prev => [...prev, calendarEvent]);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Crop Listed Successfully',
        titleTa: 'பயிர் வெற்றிகரமாக பட்டியலிடப்பட்டது',
        message: `${newCrop.totalQuantityKg} KG ${newCrop.cropName} listed at ₹${newCrop.pricePerKg}/KG.`,
        messageTa: `${newCrop.totalQuantityKg} கிலோ ${newCrop.cropNameTa} ₹${newCrop.pricePerKg}/கிலோவிற்கு பட்டியலிடப்பட்டுள்ளது.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'myCrops',
      },
      ...prev,
    ]);
  };

  const recordPartialSale = (
    cropId: string,
    buyerId: string,
    buyerName: string,
    quantityKg: number,
    pricePerKg: number,
    offerId?: string
  ): { success: boolean; message: string; remainingQuantity?: number; orderId?: string } => {
    if (!cropId) {
      return { success: false, message: 'Crop ID is required.' };
    }

    if (typeof quantityKg !== 'number' || quantityKg <= 0 || isNaN(quantityKg)) {
      return { success: false, message: 'Quantity must be greater than zero.' };
    }

    const currentCrop = cropsRef.current.find(c => c.id === cropId);
    if (!currentCrop) {
      return { success: false, message: 'Crop listing not found.' };
    }

    const currentLedger = computeSalesLedger(currentCrop.totalQuantityKg, currentCrop.sales);

    // Prevent duplicate acceptance: If an offer is already accepted in the ledger, don't add again
    if (offerId && currentLedger.validSales.some(s => s.offerId === offerId)) {
      return {
        success: false,
        message: 'This offer has already been accepted.',
        remainingQuantity: currentLedger.remainingQuantity,
      };
    }

    // If crop is already sold out
    if (currentLedger.remainingQuantity <= 0 || currentCrop.isSoldOut) {
      return {
        success: false,
        message: 'Crop is already SOLD OUT. 0 KG remaining.',
        remainingQuantity: 0,
      };
    }

    // Validate quantity before acceptance
    if (quantityKg > currentLedger.remainingQuantity) {
      return {
        success: false,
        message: `Only ${currentLedger.remainingQuantity} KG is currently available.`,
        remainingQuantity: currentLedger.remainingQuantity,
      };
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const cropUnit = currentCrop.unit || (currentCrop.cropName === 'Coconut' ? 'Coconuts' : 'KG');
    const unitSingular = cropUnit === 'Coconuts' ? 'Coconut' : cropUnit === 'Pieces' ? 'Piece' : cropUnit;

    const saleRecord: CropSaleRecord = {
      id: `sale_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      cropListingId: cropId,
      offerId,
      buyerId,
      buyerName,
      quantityKg,
      pricePerKg,
      unit: cropUnit,
      totalAmount: quantityKg * pricePerKg,
      date: dateStr,
      acceptedAt: timeStr,
    };

    const updatedSales = [...currentLedger.validSales, saleRecord];
    const newLedger = computeSalesLedger(currentCrop.totalQuantityKg, updatedSales);

    const updatedCrop: CropListing = {
      ...currentCrop,
      sales: updatedSales,
      soldQuantityKg: newLedger.soldQuantity,
      remainingQuantityKg: newLedger.remainingQuantity,
      isSoldOut: newLedger.isSoldOut,
    };

    // Update crops ref immediately so sequential/rapid calls see latest ledger
    cropsRef.current = cropsRef.current.map(c => (c.id === cropId ? updatedCrop : c));

    // Update state
    setCrops(prevCrops => prevCrops.map(c => (c.id === cropId ? updatedCrop : c)));

    // Create an order automatically for this sale
    const cropValue = quantityKg * pricePerKg;
    const buyerFee = Math.round(cropValue * 0.02); // 2% Buyer platform fee
    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      farmerId: currentCrop.farmerId,
      farmerName: currentCrop.farmerName,
      farmerTrust: currentCrop.farmerTrust,
      buyerId,
      buyerName,
      buyerTrust: SEED_BUYERS.find(b => b.id === buyerId)?.trust || SEED_BUYERS[0].trust,
      cropListingId: currentCrop.id,
      cropName: currentCrop.cropName,
      quantityKg,
      pricePerKg,
      unit: cropUnit,
      cropValue,
      buyerPlatformFee: buyerFee,
      totalPayableByBuyer: cropValue + buyerFee,
      pickupTerms: 'Direct Farm Pickup by Buyer',
      orderStatus: 'confirmed',
      settlementStatus: 'unpaid',
      payments: [],
      totalPaid: 0,
      remainingBalance: cropValue,
      createdAt: timeStr,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update Admin Revenue Sector for Buyer Crop Orders
    setRevenueSectors(prev =>
      prev.map(sec => {
        if (sec.sector === 'buyer_crop') {
          return {
            ...sec,
            transactionCount: sec.transactionCount + 1,
            bookingValue: sec.bookingValue + cropValue,
            platformRevenue: sec.platformRevenue + buyerFee,
          };
        }
        return sec;
      })
    );

    if (newLedger.isSoldOut) {
      triggerSoldOutCelebration();
    }

    return {
      success: true,
      message: newLedger.isSoldOut
        ? `SOLD OUT! All ${currentCrop.totalQuantityKg.toLocaleString('en-IN')} ${cropUnit} successfully contracted!`
        : `Recorded partial sale of ${quantityKg.toLocaleString('en-IN')} ${cropUnit}. ${newLedger.remainingQuantity.toLocaleString('en-IN')} ${cropUnit} remaining.`,
      remainingQuantity: newLedger.remainingQuantity,
      orderId: newOrder.id,
    };
  };

  const submitCropOffer = (offerData: {
    cropListingId: string;
    cropName: string;
    offeredQuantityKg: number;
    offeredPricePerKg: number;
    pickupTerms: 'Farm Pickup by Buyer' | 'Farmer Arranged Logistics' | 'Direct Mandi Delivery';
    message?: string;
    unit?: string;
  }) => {
    const crop = cropsRef.current.find(c => c.id === offerData.cropListingId);
    if (!crop) return { success: false, message: 'Crop not found.' };

    const cropUnit = offerData.unit || crop.unit || (crop.cropName === 'Coconut' ? 'Coconuts' : 'KG');
    const unitSingular = cropUnit === 'Coconuts' ? 'Coconut' : cropUnit === 'Pieces' ? 'Piece' : cropUnit;

    const newOffer: CropOffer = {
      id: `offer_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      cropListingId: crop.id,
      cropName: crop.cropName,
      farmerId: crop.farmerId,
      farmerName: crop.farmerName,
      farmerTrust: crop.farmerTrust,
      farmerDistrict: crop.farmerDistrict,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerLocation: `${currentUser.taluk || currentUser.village || 'Coimbatore'}, ${currentUser.district}`,
      buyerTrust: currentUser.trust,
      offeredQuantityKg: offerData.offeredQuantityKg,
      offeredPricePerKg: offerData.offeredPricePerKg,
      totalCropValue: offerData.offeredQuantityKg * offerData.offeredPricePerKg,
      pickupTerms: offerData.pickupTerms,
      message: offerData.message || '',
      status: 'pending', // PENDING FARMER APPROVAL - DOES NOT REDUCE CROP QUANTITY
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      unit: cropUnit,
    };

    setOffers(prev => [newOffer, ...prev]);

    // Send notification to farmer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        recipientUserId: crop.farmerId,
        title: 'New Purchase Offer Received',
        titleTa: 'புதிய கொள்முதல் சலுகை வந்துள்ளது',
        message: `${currentUser.name} offered ₹${offerData.offeredPricePerKg}/${unitSingular} for ${offerData.offeredQuantityKg} ${cropUnit} ${crop.cropName}.`,
        messageTa: `${currentUser.name} உங்கள் ${crop.cropNameTa || crop.cropName}-க்கு சலுகை அனுப்பியுள்ளார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'myCrops',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Offer submitted! Status: PENDING FARMER APPROVAL. Awaiting farmer review.`,
    };
  };

  const respondToOffer = (
    offerId: string,
    action: 'accept' | 'reject' | 'counter',
    counterPrice?: number,
    counterQuantity?: number,
    counterMessage?: string
  ): { success: boolean; message: string; remainingQuantity?: number } => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) {
      return { success: false, message: 'Offer not found.' };
    }

    const crop = cropsRef.current.find(c => c.id === offer.cropListingId);
    const cropUnit = offer.unit || crop?.unit || 'KG';
    const unitSingular = cropUnit === 'Coconuts' ? 'Coconut' : cropUnit === 'Pieces' ? 'Piece' : cropUnit;

    if (action === 'accept') {
      // 1. Prevent duplicate acceptance: If already accepted in offer status
      if (offer.status === 'accepted') {
        return { success: false, message: 'This offer has already been accepted.' };
      }

      if (!crop) {
        return { success: false, message: 'Crop listing not found.' };
      }

      const ledger = computeSalesLedger(crop.totalQuantityKg, crop.sales);

      // Check if already in ledger
      if (ledger.validSales.some(s => s.offerId === offerId)) {
        return { success: false, message: 'This offer has already been accepted.' };
      }

      // Check if sold out
      if (ledger.remainingQuantity <= 0 || crop.isSoldOut) {
        return {
          success: false,
          message: `Crop is already SOLD OUT. 0 ${cropUnit} remaining.`,
          remainingQuantity: 0,
        };
      }

      // Validate: offerQuantity > remainingQuantity
      if (offer.offeredQuantityKg > ledger.remainingQuantity) {
        return {
          success: false,
          message: `Only ${ledger.remainingQuantity} ${cropUnit} is currently available.`,
          remainingQuantity: ledger.remainingQuantity,
        };
      }

      // 2. Execute partial sale linked to this offerId
      const saleResult = recordPartialSale(
        offer.cropListingId,
        offer.buyerId,
        offer.buyerName,
        offer.offeredQuantityKg,
        offer.offeredPricePerKg,
        offer.id
      );

      if (!saleResult.success) {
        return saleResult;
      }

      // 3. Update offer status to 'accepted'
      setOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: 'accepted' as const, orderId: saleResult.orderId } : o))
      );

      // 4. Send notification
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'buyer',
          recipientUserId: offer.buyerId,
          title: 'Offer Accepted by Farmer!',
          titleTa: 'விவசாயி உங்கள் சலுகையை ஏற்றுக்கொண்டார்!',
          message: `Farmer accepted your offer for ${offer.offeredQuantityKg} ${cropUnit} ${offer.cropName} at ₹${offer.offeredPricePerKg}/${unitSingular}. Order confirmed.`,
          messageTa: `விவசாயி உங்கள் ${offer.cropName} சலுகையை ஏற்றுக்கொண்டார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'orders',
        },
        ...prev,
      ]);

      return {
        success: true,
        message: `Accepted offer from ${offer.buyerName} for ${offer.offeredQuantityKg} ${cropUnit}. Confirmed order created.`,
        remainingQuantity: saleResult.remainingQuantity,
      };
    } else if (action === 'reject') {
      setOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: 'rejected' as const } : o))
      );

      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'buyer',
          recipientUserId: offer.buyerId,
          title: 'Offer Declined by Farmer',
          titleTa: 'சலுகை நிராகரிக்கப்பட்டது',
          message: `Farmer was unable to accept your offer for ${offer.offeredQuantityKg} ${cropUnit} ${offer.cropName}.`,
          messageTa: `விவசாயி உங்கள் சலுகையை ஏற்க இயலவில்லை.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'offers',
        },
        ...prev,
      ]);

      return { success: true, message: 'Offer declined. Buyer has been notified.' };
    } else if (action === 'counter' && counterPrice) {
      const counterQty = counterQuantity || offer.offeredQuantityKg;
      setOffers(prev =>
        prev.map(o =>
          o.id === offerId
            ? {
                ...o,
                status: 'countered' as const,
                counterPricePerKg: counterPrice,
                counterQuantityKg: counterQty,
                counterMessage: counterMessage || '',
              }
            : o
        )
      );

      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'buyer',
          recipientUserId: offer.buyerId,
          title: 'Counter Offer from Farmer',
          titleTa: 'விவசாயியிடமிருந்து மாற்று சலுகை',
          message: `Farmer countered with ₹${counterPrice}/${unitSingular} for ${counterQty} ${cropUnit} ${offer.cropName}.`,
          messageTa: `விவசாயி மாற்று சலுகை அனுப்பியுள்ளார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'offers',
        },
        ...prev,
      ]);

      return { success: true, message: `Counter offer of ₹${counterPrice}/${unitSingular} sent to buyer.` };
    }

    return { success: false, message: 'Invalid action.' };
  };

  const respondToCounterOffer = (
    offerId: string,
    action: 'accept' | 'reject'
  ): { success: boolean; message: string } => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer || offer.status !== 'countered') {
      return { success: false, message: 'Counter offer not found or already processed.' };
    }

    const crop = cropsRef.current.find(c => c.id === offer.cropListingId);
    const cropUnit = offer.unit || crop?.unit || 'KG';
    const unitSingular = cropUnit === 'Coconuts' ? 'Coconut' : cropUnit === 'Pieces' ? 'Piece' : cropUnit;
    const finalPrice = offer.counterPricePerKg || offer.offeredPricePerKg;
    const finalQty = offer.counterQuantityKg || offer.offeredQuantityKg;

    if (action === 'accept') {
      if (!crop) return { success: false, message: 'Crop listing not found.' };

      const ledger = computeSalesLedger(crop.totalQuantityKg, crop.sales);
      if (ledger.remainingQuantity <= 0 || crop.isSoldOut) {
        return { success: false, message: `Crop is already SOLD OUT.` };
      }
      if (finalQty > ledger.remainingQuantity) {
        return { success: false, message: `Only ${ledger.remainingQuantity} ${cropUnit} is currently available.` };
      }

      // Execute sale
      const saleResult = recordPartialSale(
        offer.cropListingId,
        offer.buyerId,
        offer.buyerName,
        finalQty,
        finalPrice,
        offer.id
      );

      if (!saleResult.success) return saleResult;

      setOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: 'accepted' as const, orderId: saleResult.orderId } : o))
      );

      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'farmer',
          recipientUserId: crop.farmerId,
          title: 'Buyer Accepted Your Counter Offer!',
          titleTa: 'வியாபாரி உங்கள் மாற்று சலுகையை ஏற்றுக்கொண்டார்!',
          message: `${offer.buyerName} accepted your counter offer for ${finalQty} ${cropUnit} ${crop.cropName} at ₹${finalPrice}/${unitSingular}. Order confirmed!`,
          messageTa: `வியாபாரி உங்கள் மாற்று சலுகையை ஏற்றுக்கொண்டார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'orders',
        },
        ...prev,
      ]);

      return {
        success: true,
        message: `Counter offer accepted! Confirmed order created for ${finalQty} ${cropUnit} @ ₹${finalPrice}/${unitSingular}.`,
      };
    } else {
      setOffers(prev =>
        prev.map(o => (o.id === offerId ? { ...o, status: 'rejected' as const } : o))
      );

      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'farmer',
          recipientUserId: crop?.farmerId,
          title: 'Counter Offer Declined',
          titleTa: 'மாற்று சலுகை நிராகரிக்கப்பட்டது',
          message: `${offer.buyerName} declined counter offer for ${offer.cropName}.`,
          messageTa: `வியாபாரி மாற்று சலுகையை ஏற்கவில்லை.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'myCrops',
        },
        ...prev,
      ]);

      return { success: true, message: 'Counter offer declined.' };
    }
  };

  const addBuyerRequirement = (reqData: Partial<BuyerRequirement>) => {
    const newReq: BuyerRequirement = {
      id: `req_${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerTrust: currentUser.trust,
      cropNeeded: reqData.cropNeeded || 'Coconut',
      cropNeededTa: reqData.cropNeededTa || 'தேங்காய்',
      requiredQuantityKg: reqData.requiredQuantityKg || 2000,
      unit: reqData.unit || 'Coconuts',
      preferredQuality: reqData.preferredQuality || 'Grade A - Premium Mature Coconuts',
      preferredLocation: reqData.preferredLocation || 'Pollachi / Coimbatore',
      requiredDate: reqData.requiredDate || '2026-10-06',
      targetPricePerKg: reqData.targetPricePerKg || 31,
      transportRequirement: reqData.transportRequirement || 'Buyer will arrange transport',
      status: 'open',
    };
    setBuyerRequirements(prev => [newReq, ...prev]);
  };

  const bookWorker = (bookingData: Partial<WorkerBooking>) => {
    const targetWorker = workers.find(w => w.id === bookingData.workerId);
    if (!targetWorker) {
      return { success: false, message: 'Worker profile not found' };
    }

    const bookingDate = bookingData.date || '2026-10-06';
    if (targetWorker.busyDates.includes(bookingDate)) {
      return { success: false, message: 'This worker or team is already booked on this date' };
    }

    const totalCharge = bookingData.totalCharge || targetWorker.dailyCharge;
    const workerPlatformFee = Math.round(totalCharge * 0.02); // 2% booking fee
    const newBookingId = `wb_${Date.now()}`;

    const newBooking: WorkerBooking = {
      id: newBookingId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerMobile: currentUser.mobile,
      workerId: targetWorker.id,
      workerName: targetWorker.name,
      workerTrust: targetWorker.trust,
      crop: bookingData.crop || 'Coconut',
      workType: bookingData.workType || 'Harvesting & Field Work',
      date: bookingDate,
      startTime: bookingData.startTime || '07:00 AM',
      endTime: bookingData.endTime || '02:00 PM',
      timeSlot: bookingData.timeSlot || '07:00 AM - 02:00 PM',
      workersRequired: bookingData.workersRequired || (targetWorker.isTeam ? targetWorker.teamSize : 1),
      farmLocation: bookingData.farmLocation || `${currentUser.village || 'Anamalai'}, ${currentUser.district}`,
      expectedWagePerWorker: bookingData.expectedWagePerWorker || Math.round(totalCharge / (bookingData.workersRequired || 1)),
      totalCharge,
      platformFee: workerPlatformFee,
      status: 'requested', // Farmer request -> Awaiting worker confirmation
      notes: bookingData.notes || '',
    };

    setWorkerBookings(prev => [newBooking, ...prev]);

    // Sync to Farmer Calendar as REQUEST PENDING
    const calEvent: FarmCalendarEvent = {
      id: `cal_wb_${newBooking.id}`,
      title: `Worker Request Pending - ${targetWorker.name}`,
      titleTa: `பணியாளர் கோரிக்கை நிலுவையில் உள்ளது - ${targetWorker.name}`,
      date: bookingDate,
      time: newBooking.timeSlot,
      type: 'worker_booking',
      relatedEntityName: targetWorker.name,
      weatherAlert: false,
      status: 'requested',
      details: `${newBooking.workersRequired} workers requested for ${newBooking.workType}. Awaiting worker team confirmation.`,
      bookingId: newBooking.id,
      bookingStatus: 'requested',
    };
    setCalendarEvents(prev => [...prev, calEvent]);

    // Send notification to worker
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'worker',
        title: 'New Worker Request',
        titleTa: 'புதிய பண்ணை பணி கோரிக்கை',
        message: `Farmer ${currentUser.name} requested ${newBooking.workersRequired} workers for ${newBooking.workType} on ${bookingDate} (${newBooking.farmLocation}).`,
        messageTa: `விவசாயி ${currentUser.name} ${bookingDate}-ல் ${newBooking.workersRequired} பணியாளர்களை கோரியுள்ளார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'workers',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Worker Request Sent! Awaiting ${targetWorker.name} confirmation.`,
    };
  };

  const acceptWorkerBooking = (bookingId: string) => {
    const booking = workerBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setWorkerBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'confirmed' as const } : b))
    );

    // Update worker's busy dates
    setWorkers(prev =>
      prev.map(w =>
        w.id === booking.workerId
          ? {
              ...w,
              busyDates: [...w.busyDates.filter(d => d !== booking.date), booking.date],
              availableDates: w.availableDates.filter(d => d !== booking.date),
              completedJobs: w.completedJobs + 1,
            }
          : w
      )
    );

    // Update Farm Calendar event to CONFIRMED
    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId || ev.id === `cal_wb_${bookingId}`
          ? {
              ...ev,
              title: `Workers Confirmed - ${booking.workerName}`,
              titleTa: `பணியாளர்கள் உறுதிப்படுத்தப்பட்டது - ${booking.workerName}`,
              status: 'scheduled' as const,
              bookingStatus: 'confirmed',
              details: `${booking.workersRequired} workers confirmed for ${booking.workType}. Wage: ₹${booking.totalCharge}`,
            }
          : ev
      )
    );

    // Record 2% platform fee in Admin Revenue
    const workerPlatformFee = booking.platformFee || Math.round(booking.totalCharge * 0.02);
    setRevenueSectors(prev =>
      prev.map(sec => {
        if (sec.sector === 'worker') {
          return {
            ...sec,
            transactionCount: sec.transactionCount + 1,
            bookingValue: sec.bookingValue + booking.totalCharge,
            platformRevenue: sec.platformRevenue + workerPlatformFee,
          };
        }
        return sec;
      })
    );

    // Notify farmer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Worker Request Confirmed',
        titleTa: 'பணியாளர் கோரிக்கை ஏற்றுக்கொள்ளப்பட்டது',
        message: `${booking.workerName} accepted your ${booking.workType} request for ${booking.date}.`,
        messageTa: `${booking.workerName} உங்கள் ${booking.workType} கோரிக்கையை ஏற்றுக்கொண்டனர்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'calendar',
      },
      ...prev,
    ]);
  };

  const rejectWorkerBooking = (bookingId: string, reason?: string) => {
    const booking = workerBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setWorkerBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'rejected' as const, notes: reason || b.notes } : b))
    );

    // Update calendar event to cancelled
    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId || ev.id === `cal_wb_${bookingId}`
          ? {
              ...ev,
              title: `Worker Request Rejected - ${booking.workerName}`,
              status: 'cancelled' as const,
              bookingStatus: 'rejected',
            }
          : ev
      )
    );

    // Notify farmer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Worker Request Declined',
        titleTa: 'பணியாளர் கோரிக்கை நிராகரிக்கப்பட்டது',
        message: `${booking.workerName} was unable to accept your request for ${booking.date}. Please browse other available teams.`,
        messageTa: `${booking.workerName} உங்கள் கோரிக்கையை ஏற்க இயலவில்லை.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'workers',
      },
      ...prev,
    ]);
  };

  const updateWorkerBookingStatus = (
    bookingId: string,
    status: 'in_progress' | 'completed' | 'cancelled'
  ) => {
    setWorkerBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId || ev.id === `cal_wb_${bookingId}`
          ? {
              ...ev,
              status: status === 'in_progress' ? ('in_progress' as const) : status === 'completed' ? ('completed' as const) : ('cancelled' as const),
              bookingStatus: status,
            }
          : ev
      )
    );
  };

  const postLabourRequirement = (reqData: Partial<ReverseWorkerRequest>) => {
    const newReq: ReverseWorkerRequest = {
      id: `rwr_${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerMobile: currentUser.mobile,
      crop: reqData.crop || 'Coconut',
      workType: reqData.workType || 'Coconut Harvesting & Tree Climbing',
      date: reqData.date || '2026-10-05',
      timeSlot: reqData.timeSlot || '07:00 AM - 02:00 PM',
      workersRequired: reqData.workersRequired || 6,
      location: reqData.location || `${currentUser.village || 'Pollachi'}, ${currentUser.district}`,
      expectedDailyWage: reqData.expectedDailyWage || 600,
      notes: reqData.notes || '',
      responses: [],
      status: 'open',
    };

    setLabourRequirements(prev => [newReq, ...prev]);

    // Send broadcast notification to workers
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'worker',
        title: 'New Labour Requirement Posted',
        titleTa: 'புதிய பண்ணை வேலைவாய்ப்பு',
        message: `${newReq.workersRequired} workers needed for ${newReq.workType} in ${newReq.location} on ${newReq.date} (₹${newReq.expectedDailyWage}/person).`,
        messageTa: `${newReq.location}-ல் ${newReq.date}-க்கு ${newReq.workersRequired} பணியாளர்கள் தேவை.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'workers',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Labour requirement posted! Status: OPEN FOR WORKERS. Nearby teams can now express interest.`,
    };
  };

  const expressWorkerInterest = (requirementId: string, workerData?: Partial<WorkerProfile>) => {
    const req = labourRequirements.find(r => r.id === requirementId);
    if (!req) return { success: false, message: 'Requirement not found' };

    const worker = workers.find(w => w.id === (workerData?.id || currentUser.id)) || workers[0];
    const alreadyResponded = req.responses.some(r => r.workerId === worker.id);
    if (alreadyResponded) {
      return { success: false, message: 'You have already expressed interest for this job.' };
    }

    const newResponse = {
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone || currentUser.mobile,
      teamSize: worker.isTeam ? worker.teamSize : 1,
      proposedWage: req.expectedDailyWage,
      rating: worker.trust.positiveFeedbackScore,
      completedJobs: worker.completedJobs,
      location: worker.area,
    };

    setLabourRequirements(prev =>
      prev.map(r => (r.id === requirementId ? { ...r, responses: [...r.responses, newResponse] } : r))
    );

    // Notify farmer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Worker Team Interested in Your Job',
        titleTa: 'பணியாளர் குழு விருப்பம் தெரிவித்தது',
        message: `${worker.name} (${newResponse.teamSize} workers) expressed interest in your ${req.workType} job for ${req.date}.`,
        messageTa: `${worker.name} உங்கள் பணிக்கு விருப்பம் தெரிவித்துள்ளனர்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'workers',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Interest expressed! Farmer ${req.farmerName} has been notified and will make the final selection.`,
    };
  };

  const confirmLabourApplicant = (
    requirementId: string,
    workerId: string
  ): { success: boolean; message: string; remainingWorkers?: number } => {
    const req = labourRequirements.find(r => r.id === requirementId);
    if (!req) return { success: false, message: 'Requirement not found' };

    const resp = req.responses.find(res => res.workerId === workerId);
    if (!resp) return { success: false, message: 'Applicant response not found' };

    if (resp.status === 'confirmed') {
      return { success: false, message: `${resp.workerName} is already confirmed for this requirement.` };
    }

    const alreadyConfirmed = req.confirmedWorkersCount || 0;
    const remainingSpots = Math.max(0, req.workersRequired - alreadyConfirmed);

    if (remainingSpots <= 0 || req.status === 'assigned') {
      return {
        success: false,
        message: `Requirement is already fully filled (${req.workersRequired}/${req.workersRequired} confirmed). Cannot add more workers.`,
        remainingWorkers: 0,
      };
    }

    const capacity = resp.isIndividual ? 1 : (resp.teamSize || 1);

    // PREVENT OVER-CONFIRMATION
    if (capacity > remainingSpots) {
      return {
        success: false,
        message: `Cannot confirm ${resp.workerName} (${capacity} workers). Only ${remainingSpots} worker spot${remainingSpots > 1 ? 's' : ''} remaining!`,
        remainingWorkers: remainingSpots,
      };
    }

    const newConfirmed = alreadyConfirmed + capacity;
    const newRemaining = Math.max(0, req.workersRequired - newConfirmed);
    const isFullyFilled = newConfirmed >= req.workersRequired;
    const newStatus: ReverseWorkerRequest['status'] = isFullyFilled ? 'assigned' : 'partially_filled';

    // Update shared Labour Requirement
    setLabourRequirements(prev =>
      prev.map(r =>
        r.id === requirementId
          ? {
              ...r,
              confirmedWorkersCount: newConfirmed,
              status: newStatus,
              assignedWorkerId: isFullyFilled ? workerId : r.assignedWorkerId,
              assignedWorkerName: isFullyFilled ? resp.workerName : r.assignedWorkerName,
              responses: r.responses.map(res =>
                res.workerId === workerId ? { ...res, status: 'confirmed' as const } : res
              ),
            }
          : r
      )
    );

    // Create shared WorkerBooking with status 'confirmed'
    const worker = workers.find(w => w.id === workerId);
    const wage = resp.proposedWage || req.expectedDailyWage;
    const totalWage = capacity * wage;
    const platformFee = Math.round(totalWage * 0.02);
    const newBookingId = `wb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const newBooking: WorkerBooking = {
      id: newBookingId,
      farmerId: req.farmerId,
      farmerName: req.farmerName,
      farmerMobile: req.farmerMobile || currentUser.mobile,
      workerId: workerId,
      workerName: resp.workerName,
      workerTrust: worker?.trust || {
        level: 'star',
        title: 'Community Star',
        completedTransactions: 68,
        fulfilmentRate: 98,
        isVerified: true,
        positiveFeedbackScore: 4.95,
        cancellationRate: 0.8,
        reasons: ['Experienced Agricultural Specialist', 'Punctual Field Attendance'],
      },
      crop: req.crop || 'Coconut',
      workType: req.workType,
      date: req.date,
      timeSlot: req.timeSlot,
      workersRequired: capacity,
      farmLocation: req.location,
      expectedWagePerWorker: wage,
      totalCharge: totalWage,
      platformFee,
      status: 'confirmed',
      notes: `Staffed from Labour Requirement #${requirementId} (${capacity} worker${capacity > 1 ? 's' : ''}). ${newConfirmed}/${req.workersRequired} total confirmed.`,
    };

    setWorkerBookings(prev => [newBooking, ...prev]);

    // Farm Calendar Event: Confirmed Booking
    const calEvent: FarmCalendarEvent = {
      id: `cal_wb_${newBooking.id}`,
      title: `Workers Confirmed - ${resp.workerName} (${capacity} worker${capacity > 1 ? 's' : ''})`,
      titleTa: `பணியாளர் உறுதிப்படுத்தப்பட்டது - ${resp.workerName}`,
      date: req.date,
      time: req.timeSlot,
      type: 'worker_booking',
      relatedEntityName: resp.workerName,
      weatherAlert: false,
      status: 'scheduled',
      bookingId: newBooking.id,
      bookingStatus: 'confirmed',
      details: `${capacity} worker${capacity > 1 ? 's' : ''} confirmed for ${req.workType}. Total wage: ₹${totalWage}. Requirement staffing: ${newConfirmed}/${req.workersRequired}.`,
    };
    setCalendarEvents(prev => [...prev, calEvent]);

    // Update worker busy dates
    if (worker) {
      setWorkers(prev =>
        prev.map(w =>
          w.id === workerId
            ? {
                ...w,
                busyDates: [...w.busyDates.filter(d => d !== req.date), req.date],
              }
            : w
        )
      );
    }

    // Record 2% platform fee in Admin Revenue
    setRevenueSectors(prev =>
      prev.map(sec => {
        if (sec.sector === 'worker') {
          return {
            ...sec,
            transactionCount: sec.transactionCount + 1,
            bookingValue: sec.bookingValue + totalWage,
            platformRevenue: sec.platformRevenue + platformFee,
          };
        }
        return sec;
      })
    );

    // Notify worker
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'worker',
        recipientUserId: workerId,
        title: 'Job Confirmed by Farmer!',
        titleTa: 'வேலை வாய்ப்பு உறுதி செய்யப்பட்டது!',
        message: `Farmer ${req.farmerName} confirmed your ${capacity} worker(s) for ${req.workType} on ${req.date}.`,
        messageTa: `விவசாயி ${req.farmerName} உங்கள் பணியை உறுதி செய்துள்ளார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'bookings',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: isFullyFilled
        ? `FILLED & ASSIGNED! Confirmed ${resp.workerName} (${capacity} worker${capacity > 1 ? 's' : ''}). Required = ${req.workersRequired}, Confirmed = ${newConfirmed}, Remaining = 0.`
        : `Confirmed ${resp.workerName} (${capacity} worker${capacity > 1 ? 's' : ''}). Staffed: ${newConfirmed}/${req.workersRequired}. ${newRemaining} spot${newRemaining > 1 ? 's' : ''} remaining.`,
      remainingWorkers: newRemaining,
    };
  };

  const acceptLabourRequirementTeam = (requirementId: string, workerId: string) => {
    return confirmLabourApplicant(requirementId, workerId);
  };

  const confirmIndividualWorker = (requirementId: string, workerId: string) => {
    return confirmLabourApplicant(requirementId, workerId);
  };

  const cancelWorkerBooking = (bookingId: string) => {
    const booking = workerBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setWorkerBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );

    // Restore worker availability
    setWorkers(prev =>
      prev.map(w =>
        w.id === booking.workerId
          ? {
              ...w,
              busyDates: w.busyDates.filter(d => d !== booking.date),
              availableDates: [...new Set([...w.availableDates, booking.date])],
            }
          : w
      )
    );

    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId ? { ...ev, status: 'cancelled' as const, bookingStatus: 'cancelled' } : ev
      )
    );

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'worker',
        recipientUserId: booking.workerId,
        title: 'Worker Booking Cancelled by Farmer',
        titleTa: 'பணியாளர் முன்பதிவு ரத்து செய்யப்பட்டது',
        message: `${booking.farmerName} cancelled the booking for ${booking.workType} on ${booking.date}. Your schedule is freed.`,
        messageTa: `${booking.farmerName} முன்பதிவை ரத்து செய்துள்ளார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'workers',
      },
      ...prev,
    ]);
  };

  const requestWorkerReschedule = (bookingId: string, newDate: string, newTimeSlot: string) => {
    setWorkerBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'reschedule_requested' as const,
              rescheduleDate: newDate,
              rescheduleTimeSlot: newTimeSlot,
            }
          : b
      )
    );

    const booking = workerBookings.find(b => b.id === bookingId);
    if (booking) {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'worker',
          recipientUserId: booking.workerId,
          title: 'Reschedule Request from Farmer',
          titleTa: 'தேதி மாற்றக் கோரிக்கை',
          message: `${booking.farmerName} requested to reschedule ${booking.workType} to ${newDate} (${newTimeSlot}).`,
          messageTa: `${booking.farmerName} மாற்று தேதியை கோரியுள்ளார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'workers',
        },
        ...prev,
      ]);
    }
  };

  const approveWorkerReschedule = (bookingId: string) => {
    const booking = workerBookings.find(b => b.id === bookingId);
    if (!booking || !booking.rescheduleDate) return;

    const newDate = booking.rescheduleDate;
    const newSlot = booking.rescheduleTimeSlot || booking.timeSlot;

    setWorkerBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              date: newDate,
              timeSlot: newSlot,
              status: 'confirmed' as const,
              rescheduleDate: undefined,
              rescheduleTimeSlot: undefined,
            }
          : b
      )
    );

    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId
          ? {
              ...ev,
              date: newDate,
              time: newSlot,
              status: 'scheduled' as const,
              bookingStatus: 'confirmed',
              title: `Workers Confirmed (Rescheduled) - ${booking.workerName}`,
            }
          : ev
      )
    );

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        recipientUserId: booking.farmerId,
        title: 'Worker Reschedule Approved!',
        titleTa: 'பணியாளர் தேதி மாற்றம் ஏற்கப்பட்டது!',
        message: `${booking.workerName} approved rescheduling to ${newDate} (${newSlot}).`,
        messageTa: `${booking.workerName} மாற்று தேதியை ஏற்றுக்கொண்டார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'calendar',
      },
      ...prev,
    ]);
  };

  const cancelLabourRequirement = (requirementId: string) => {
    setLabourRequirements(prev =>
      prev.map(r => (r.id === requirementId ? { ...r, status: 'cancelled' as const } : r))
    );
  };

  const bookMachinery = (bookingData: Partial<MachineryBooking>) => {
    const targetMachine = machinery.find(m => m.id === bookingData.machineId);
    if (!targetMachine) {
      return { success: false, message: 'Machinery not found' };
    }

    const bookingDate = bookingData.date || '2026-10-06';
    const timeSlot = bookingData.timeSlot || '08:00 AM - 12:00 PM';

    // CHECK FOR DOUBLE BOOKING ON THIS INDIVIDUAL MACHINE'S CALENDAR
    const existingSlot = targetMachine.schedule.find(
      s => s.date === bookingDate && s.timeSlot === timeSlot
    );

    if (existingSlot && existingSlot.status === 'booked') {
      return {
        success: false,
        message: `Double-booking prevented! ${targetMachine.machineName} is already booked on ${bookingDate} (${timeSlot}). Sonalika Tractor and Rotavator remain available!`,
      };
    }

    if (existingSlot && existingSlot.status === 'maintenance') {
      return {
        success: false,
        message: `${targetMachine.machineName} is under scheduled maintenance on ${bookingDate} (${timeSlot}) and cannot be booked.`,
      };
    }

    const duration = bookingData.durationHours || 4;
    const estimatedCost = duration * targetMachine.hourlyRate;
    const machPlatformFee = Math.round(estimatedCost * 0.02); // 2% machinery fee
    const newBookingId = `mb_${Date.now()}`;

    const newBooking: MachineryBooking = {
      id: newBookingId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerMobile: currentUser.mobile,
      farmerLocation: bookingData.farmerLocation || `${currentUser.taluk || 'Pollachi'}, ${currentUser.district}`,
      machineId: targetMachine.id,
      machineName: targetMachine.machineName,
      providerId: targetMachine.providerId,
      providerName: targetMachine.providerName,
      providerTrust: targetMachine.providerTrust || {
        level: 'gold',
        title: 'Active Member',
        completedTransactions: 28,
        fulfilmentRate: 97,
        isVerified: true,
        positiveFeedbackScore: 4.85,
        cancellationRate: 1.0,
        reasons: ['28 Verified Tractor Bookings', 'Dedicated Machine Maintenance', 'Verified Equipment Papers'],
      },
      crop: bookingData.crop || 'Coconut',
      workPurpose: bookingData.workPurpose || 'Grove haulage and farm collection',
      date: bookingDate,
      timeSlot,
      durationHours: duration,
      estimatedCost,
      platformFee: machPlatformFee,
      status: 'requested', // Status is REQUESTED, NOT CONFIRMED
      notes: bookingData.notes || '',
    };

    setMachineryBookings(prev => [newBooking, ...prev]);

    // Mark slot on THIS INDIVIDUAL MACHINE as 'slot_held', other machines remain completely untouched!
    setMachinery(prev =>
      prev.map(m => {
        if (m.id === targetMachine.id) {
          const updatedSchedule = [
            ...m.schedule.filter(s => !(s.date === bookingDate && s.timeSlot === timeSlot)),
            {
              date: bookingDate,
              timeSlot,
              status: 'slot_held' as const,
              bookingId: newBooking.id,
              farmerName: currentUser.name,
            },
          ];
          return { ...m, schedule: updatedSchedule };
        }
        return m;
      })
    );

    // Sync to Farmer Calendar as REQUEST PENDING
    const calEvent: FarmCalendarEvent = {
      id: `cal_mb_${newBooking.id}`,
      title: `Machinery Request Pending - ${targetMachine.machineName}`,
      titleTa: `இயந்திர கோரிக்கை நிலுவையில் உள்ளது - ${targetMachine.machineNameTa || targetMachine.machineName}`,
      date: bookingDate,
      time: timeSlot,
      type: 'machinery_booking',
      relatedEntityName: targetMachine.providerName,
      weatherAlert: false,
      status: 'requested',
      details: `${duration} hours requested for ${newBooking.workPurpose}. Awaiting provider confirmation.`,
      bookingId: newBooking.id,
      bookingStatus: 'requested',
    };
    setCalendarEvents(prev => [...prev, calEvent]);

    // Send notification to provider
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'machinery',
        title: 'New Machinery Booking Request',
        titleTa: 'புதிய இயந்திர முன்பதிவு கோரிக்கை',
        message: `${currentUser.name} requested ${targetMachine.machineName} for ${bookingDate} (${timeSlot}) at ${newBooking.farmerLocation}.`,
        messageTa: `${currentUser.name} ${bookingDate}-ல் ${targetMachine.machineName} கோரியுள்ளார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'machinery',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Machinery booking request sent to ${targetMachine.providerName}. Slot temporarily held pending provider confirmation.`,
    };
  };

  const acceptMachineryBooking = (bookingId: string) => {
    const booking = machineryBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setMachineryBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'confirmed' as const } : b))
    );

    // Update slot on this machine to 'booked'
    setMachinery(prev =>
      prev.map(m => {
        if (m.id === booking.machineId) {
          const updatedSchedule = m.schedule.map(s =>
            s.date === booking.date && s.timeSlot === booking.timeSlot
              ? { ...s, status: 'booked' as const, bookingId: booking.id, farmerName: booking.farmerName }
              : s
          );
          return { ...m, schedule: updatedSchedule };
        }
        return m;
      })
    );

    // Calendar: Tractor Confirmed
    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId || ev.id === `cal_mb_${bookingId}`
          ? {
              ...ev,
              title: `Tractor Confirmed - ${booking.machineName}`,
              titleTa: `டிராக்டர் முன்பதிவு உறுதிப்படுத்தப்பட்டது - ${booking.machineName}`,
              status: 'scheduled' as const,
              bookingStatus: 'confirmed',
              details: `${booking.durationHours} hours confirmed. Estimated charge: ₹${booking.estimatedCost}`,
            }
          : ev
      )
    );

    // Record in Admin Revenue
    const machPlatformFee = booking.platformFee || Math.round(booking.estimatedCost * 0.02);
    setRevenueSectors(prev =>
      prev.map(sec => {
        if (sec.sector === 'machinery') {
          return {
            ...sec,
            transactionCount: sec.transactionCount + 1,
            bookingValue: sec.bookingValue + booking.estimatedCost,
            platformRevenue: sec.platformRevenue + machPlatformFee,
          };
        }
        return sec;
      })
    );

    // Notify farmer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Machinery Booking Confirmed',
        titleTa: 'இயந்திர முன்பதிவு உறுதி செய்யப்பட்டது',
        message: `${booking.providerName} accepted your booking for ${booking.machineName} on ${booking.date}.`,
        messageTa: `${booking.providerName} ${booking.date}-க்கான இயந்திர முன்பதிவை ஏற்றுக்கொண்டார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'calendar',
      },
      ...prev,
    ]);
  };

  const rejectMachineryBooking = (bookingId: string, reason?: string) => {
    const booking = machineryBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setMachineryBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'rejected' as const, notes: reason || b.notes } : b))
    );

    // Free the held slot on this machine
    setMachinery(prev =>
      prev.map(m => {
        if (m.id === booking.machineId) {
          const updatedSchedule = m.schedule.map(s =>
            s.date === booking.date && s.timeSlot === booking.timeSlot && s.status === 'slot_held'
              ? { ...s, status: 'available' as const, bookingId: undefined, farmerName: undefined }
              : s
          );
          return { ...m, schedule: updatedSchedule };
        }
        return m;
      })
    );

    // Calendar: cancelled
    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId || ev.id === `cal_mb_${bookingId}`
          ? {
              ...ev,
              title: `Machinery Request Rejected - ${booking.machineName}`,
              status: 'cancelled' as const,
              bookingStatus: 'rejected',
            }
          : ev
      )
    );

    // Notify farmer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Machinery Request Declined',
        titleTa: 'இயந்திர கோரிக்கை நிராகரிக்கப்பட்டது',
        message: `${booking.providerName} could not accommodate your booking for ${booking.machineName} on ${booking.date}.`,
        messageTa: `${booking.providerName} உங்கள் இயந்திர கோரிக்கையை ஏற்க இயலவில்லை.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'machinery',
      },
      ...prev,
    ]);
  };

  const cancelMachineryBooking = (bookingId: string) => {
    const booking = machineryBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setMachineryBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );

    // Free slot
    setMachinery(prev =>
      prev.map(m => {
        if (m.id === booking.machineId) {
          const updatedSchedule = m.schedule.map(s =>
            s.date === booking.date && s.timeSlot === booking.timeSlot
              ? { ...s, status: 'available' as const, bookingId: undefined, farmerName: undefined }
              : s
          );
          return { ...m, schedule: updatedSchedule };
        }
        return m;
      })
    );

    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId ? { ...ev, status: 'cancelled' as const, bookingStatus: 'cancelled' } : ev
      )
    );
  };

  const requestMachineryReschedule = (bookingId: string, newDate: string, newTimeSlot: string) => {
    setMachineryBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'reschedule_requested' as const,
              rescheduleDate: newDate,
              rescheduleTimeSlot: newTimeSlot,
            }
          : b
      )
    );

    const booking = machineryBookings.find(b => b.id === bookingId);
    if (booking) {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'machinery',
          title: 'Reschedule Request Received',
          titleTa: 'தேதி மாற்றக் கோரிக்கை',
          message: `${booking.farmerName} requested to reschedule ${booking.machineName} to ${newDate} (${newTimeSlot}).`,
          messageTa: `${booking.farmerName} மாற்று தேதியை கோரியுள்ளார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'machinery',
        },
        ...prev,
      ]);
    }
  };

  const approveMachineryReschedule = (bookingId: string) => {
    const booking = machineryBookings.find(b => b.id === bookingId);
    if (!booking || !booking.rescheduleDate) return;

    const newDate = booking.rescheduleDate;
    const newSlot = booking.rescheduleTimeSlot || booking.timeSlot;

    // Free old slot and book new slot
    setMachinery(prev =>
      prev.map(m => {
        if (m.id === booking.machineId) {
          const freed = m.schedule.map(s =>
            s.date === booking.date && s.timeSlot === booking.timeSlot
              ? { ...s, status: 'available' as const, bookingId: undefined, farmerName: undefined }
              : s
          );
          const updated = [
            ...freed.filter(s => !(s.date === newDate && s.timeSlot === newSlot)),
            {
              date: newDate,
              timeSlot: newSlot,
              status: 'booked' as const,
              bookingId: booking.id,
              farmerName: booking.farmerName,
            },
          ];
          return { ...m, schedule: updated };
        }
        return m;
      })
    );

    setMachineryBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              date: newDate,
              timeSlot: newSlot,
              status: 'confirmed' as const,
              rescheduleDate: undefined,
              rescheduleTimeSlot: undefined,
            }
          : b
      )
    );

    // Update calendar event
    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === bookingId
          ? {
              ...ev,
              date: newDate,
              time: newSlot,
              status: 'scheduled' as const,
              bookingStatus: 'confirmed',
              title: `Tractor Confirmed (Rescheduled) - ${booking.machineName}`,
            }
          : ev
      )
    );

    // Notify farmer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Reschedule Approved!',
        titleTa: 'தேதி மாற்றம் ஏற்றுக்கொள்ளப்பட்டது',
        message: `${booking.providerName} approved your reschedule for ${booking.machineName} to ${newDate} (${newSlot}).`,
        messageTa: `${booking.providerName} மாற்று தேதியை ஏற்றுக்கொண்டார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'calendar',
      },
      ...prev,
    ]);
  };

  const updateMachineryBookingStatus = (bookingId: string, status: MachineryBooking['status']) => {
    const booking = machineryBookings.find(b => b.id === bookingId);
    if (!booking) return;

    setMachineryBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );

    if (status === 'completed') {
      // Free machine slot
      setMachinery(prev =>
        prev.map(m => {
          if (m.id === booking.machineId) {
            const updatedSchedule = m.schedule.map(s =>
              s.date === booking.date && s.timeSlot === booking.timeSlot
                ? { ...s, status: 'completed' as const }
                : s
            );
            return { ...m, schedule: updatedSchedule };
          }
          return m;
        })
      );

      setCalendarEvents(prev =>
        prev.map(ev =>
          ev.bookingId === bookingId
            ? {
                ...ev,
                title: `Machinery Service Completed - ${booking.machineName}`,
                titleTa: `இயந்திர பணி நிறைவு பெற்றது - ${booking.machineName}`,
                status: 'completed' as const,
                bookingStatus: 'completed',
              }
            : ev
        )
      );

      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'farmer',
          title: 'Machinery Service Completed',
          titleTa: 'இயந்திர சேவை நிறைவடைந்தது',
          message: `${booking.providerName} has marked ${booking.machineName} service as completed.`,
          messageTa: `${booking.providerName} சேவையை நிறைவு செய்தார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'machinery',
        },
        ...prev,
      ]);
    } else if (status === 'dispatched' || status === 'in_progress' || status === 'in_service') {
      setCalendarEvents(prev =>
        prev.map(ev =>
          ev.bookingId === bookingId
            ? {
                ...ev,
                bookingStatus: status,
                details: `Status: ${status.replace('_', ' ').toUpperCase()} (${booking.machineName})`,
              }
            : ev
        )
      );
    }
  };

  const postMachineryRequirement = (req: Partial<MachineryRequirement>) => {
    const newId = `mreq_${Date.now()}`;
    const newReq: MachineryRequirement = {
      id: newId,
      farmerId: req.farmerId || currentUser.id,
      farmerName: req.farmerName || currentUser.name,
      farmerMobile: req.farmerMobile || currentUser.mobile,
      machineType: req.machineType || 'Tractor 45HP',
      attachment: req.attachment,
      date: req.date || new Date().toISOString().split('T')[0],
      timeSlot: req.timeSlot || 'Morning (06:00 - 10:00)',
      durationHours: req.durationHours || 4,
      farmLocation: req.farmLocation || `${currentUser.village}, ${currentUser.taluk}`,
      crop: req.crop,
      workPurpose: req.workPurpose,
      maxBudget: req.maxBudget || 3200,
      notes: req.notes,
      status: 'open',
      responses: [],
    };

    setMachineryRequirements(prev => [newReq, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'machinery',
        title: 'New Farm Machine Requirement Posted',
        titleTa: 'புதிய இயந்திரத் தேவை வெளியிடப்பட்டது',
        message: `${newReq.farmerName} in ${newReq.farmLocation} needs a ${newReq.machineType} for ${newReq.durationHours} hrs.`,
        messageTa: `${newReq.farmerName} ${newReq.machineType} தேவை என பதிவிட்டுள்ளார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'machinery',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: 'Machinery requirement posted successfully. Nearby machine providers have been notified.',
    };
  };

  const respondToMachineryRequirement = (reqId: string, proposedRate: number, notes?: string) => {
    const target = machineryRequirements.find(r => r.id === reqId);
    if (!target) {
      return { success: false, message: 'Requirement not found.' };
    }

    const newResponse = {
      providerId: currentUser.id,
      providerName: currentUser.name,
      proposedRate,
      notes,
      createdAt: new Date().toISOString(),
    };

    setMachineryRequirements(prev =>
      prev.map(r =>
        r.id === reqId
          ? {
              ...r,
              responses: [...(r.responses || []), newResponse],
            }
          : r
      )
    );

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Machinery Proposal Received',
        titleTa: 'இயந்திர சேவைக்கான விலை பெறப்பட்டது',
        message: `${currentUser.name} offered ₹${proposedRate}/hr for your ${target.machineType} requirement.`,
        messageTa: `${currentUser.name} ₹${proposedRate}/hr விலையை முன்மொழிந்தார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'machinery',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Proposal of ₹${proposedRate}/hr submitted to ${target.farmerName}.`,
    };
  };

  const createDeliveryRequest = (reqData: Partial<DeliveryRequest>) => {
    const fee = reqData.estimatedFee || 1400;
    const platformFee = Math.round(fee * 0.02);
    const newId = `del_${Date.now()}`;
    const newDelivery: DeliveryRequest = {
      id: newId,
      orderId: reqData.orderId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerMobile: currentUser.mobile,
      buyerId: reqData.buyerId || 'user_buyer_annapoorna',
      buyerName: reqData.buyerName || 'Wholesale Buyer Mandi',
      pickupLocation: reqData.pickupLocation || `${currentUser.village || 'Anamalai'}, ${currentUser.district}`,
      dropLocation: reqData.dropLocation || 'Mettupalayam Road Wholesale Market, Coimbatore',
      cropName: reqData.cropName || 'Coconut',
      quantityKg: reqData.quantityKg || 700,
      unit: reqData.unit || 'Coconuts',
      preferredDate: reqData.preferredDate || '2026-10-06',
      preferredTime: reqData.preferredTime || 'Morning (08:30 AM)',
      vehicleRequirement: reqData.vehicleRequirement || '1.5-Ton Covered Produce Truck',
      notes: reqData.notes || '',
      estimatedFee: fee,
      platformFee,
      status: 'requested', // Status is REQUESTED, NOT CONFIRMED
      timeline: [
        {
          status: 'requested',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note: `Transport requested by farmer for ${reqData.quantityKg || 700} ${reqData.unit || 'Coconuts'} ${reqData.cropName || 'Coconut'}.`,
        },
      ],
    };

    setDeliveryRequests(prev => [newDelivery, ...prev]);

    // Calendar: Logistics Request Pending
    const calEvent: FarmCalendarEvent = {
      id: `cal_del_${newDelivery.id}`,
      title: `Logistics Request Pending - ${newDelivery.cropName} (${newDelivery.quantityKg} ${newDelivery.unit})`,
      titleTa: `சரக்கு போக்குவரத்து கோரிக்கை நிலுவையில் உள்ளது`,
      date: newDelivery.preferredDate,
      time: newDelivery.preferredTime,
      type: 'logistics',
      cropName: newDelivery.cropName,
      quantityKg: newDelivery.quantityKg,
      unit: newDelivery.unit,
      weatherAlert: false,
      status: 'requested',
      details: `Pickup from ${newDelivery.pickupLocation} to ${newDelivery.dropLocation}. Awaiting logistics partner confirmation.`,
      bookingId: newDelivery.id,
      bookingStatus: 'requested',
    };
    setCalendarEvents(prev => [...prev, calEvent]);

    // Notify logistics partners
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'logistics',
        title: 'New Transport Job Request',
        titleTa: 'புதிய சரக்கு போக்குவரத்து கோரிக்கை',
        message: `${currentUser.name} requested transport for ${newDelivery.quantityKg} ${newDelivery.unit} ${newDelivery.cropName} on ${newDelivery.preferredDate}.`,
        messageTa: `${newDelivery.preferredDate}-ல் சரக்கு போக்குவரத்து கோரிக்கை வந்துள்ளது.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'logistics',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: 'Logistics request created! Status: LOGISTICS REQUESTED. Awaiting logistics partner confirmation.',
    };
  };

  const acceptDeliveryRequest = (deliveryId: string, partnerId?: string) => {
    const partner = logisticsPartners.find(p => p.id === partnerId) || logisticsPartners[0];
    const delivery = deliveryRequests.find(d => d.id === deliveryId);
    if (!delivery) return;

    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setDeliveryRequests(prev =>
      prev.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: 'ACCEPTED' as const,
            assignedPartnerId: partner.id,
            assignedPartnerName: partner.companyName,
            driverName: partner.contactPerson,
            driverMobile: partner.mobile,
            vehicleNumber: partner.vehicleNumber,
            timeline: [
              ...d.timeline,
              {
                status: 'ACCEPTED',
                timestamp: timeStr,
                note: `Job accepted by ${partner.companyName}. Driver ${partner.contactPerson} (${partner.vehicleNumber}) assigned.`,
              },
            ],
          };
        }
        return d;
      })
    );

    // Calendar: Logistics Confirmed
    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === deliveryId || ev.id === `cal_del_${deliveryId}`
          ? {
              ...ev,
              title: `Logistics Confirmed - ${partner.companyName}`,
              titleTa: `சரக்கு வாகனம் உறுதி செய்யப்பட்டது - ${partner.companyName}`,
              status: 'scheduled' as const,
              bookingStatus: 'confirmed',
              relatedEntityName: `${partner.companyName} (${partner.vehicleNumber})`,
              details: `Transport confirmed for ${delivery.quantityKg} ${delivery.unit}. Driver: ${partner.contactPerson} (${partner.mobile}).`,
            }
          : ev
      )
    );

    // Notify farmer and buyer
    setNotifications(prev => [
      {
        id: `notif_f_${Date.now()}`,
        recipientRole: 'farmer',
        recipientUserId: delivery.farmerId,
        title: 'Logistics Request Accepted!',
        titleTa: 'சரக்கு போக்குவரத்து ஏற்கப்பட்டது!',
        message: `${partner.companyName} accepted your transport request for ${delivery.quantityKg} ${delivery.unit || 'KG'} ${delivery.cropName}.`,
        messageTa: `${partner.companyName} உங்கள் சரக்கு போக்குவரத்து கோரிக்கையை ஏற்றுக்கொண்டது.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'logistics',
      },
      {
        id: `notif_b_${Date.now()}`,
        recipientRole: 'buyer',
        recipientUserId: delivery.buyerId,
        title: 'Logistics Partner Assigned for Incoming Produce',
        titleTa: 'சரக்கு போக்குவரத்து நிறுவனம் நியமிக்கப்பட்டது',
        message: `${partner.companyName} will haul ${delivery.quantityKg} ${delivery.unit || 'KG'} ${delivery.cropName} from ${delivery.farmerName}.`,
        messageTa: `${partner.companyName} சரக்கு போக்குவரத்தை கவனிக்கும்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'logistics',
      },
      ...prev,
    ]);
  };

  const assignDriverAndVehicle = (
    deliveryId: string,
    driverName: string,
    driverMobile: string,
    vehicleNumber: string
  ) => {
    const delivery = deliveryRequests.find(d => d.id === deliveryId);
    if (!delivery) return { success: false, message: 'Delivery not found' };

    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setDeliveryRequests(prev =>
      prev.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: 'DRIVER_ASSIGNED' as const,
            driverName,
            driverMobile,
            vehicleNumber,
            timeline: [
              ...d.timeline,
              {
                status: 'DRIVER_ASSIGNED',
                timestamp: timeStr,
                note: `Driver ${driverName} (${driverMobile}) assigned with vehicle ${vehicleNumber}.`,
              },
            ],
          };
        }
        return d;
      })
    );

    setNotifications(prev => [
      {
        id: `notif_drv_f_${Date.now()}`,
        recipientRole: 'farmer',
        recipientUserId: delivery.farmerId,
        title: 'Driver & Vehicle Assigned',
        titleTa: 'ஓட்டுநர் & வாகனம் ஒதுக்கப்பட்டது',
        message: `Driver ${driverName} (${vehicleNumber}, Ph: ${driverMobile}) assigned for pickup of ${delivery.cropName}.`,
        messageTa: `ஓட்டுநர் ${driverName} (${vehicleNumber}) ஒதுக்கப்பட்டார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'logistics',
      },
      {
        id: `notif_drv_b_${Date.now()}`,
        recipientRole: 'buyer',
        recipientUserId: delivery.buyerId,
        title: 'Driver Assigned for Delivery',
        titleTa: 'சரக்கு ஓட்டுநர் விவரம்',
        message: `Driver ${driverName} (${vehicleNumber}) assigned for incoming produce delivery.`,
        messageTa: `ஓட்டுநர் ${driverName} (${vehicleNumber}) ஒதுக்கப்பட்டார்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'logistics',
      },
      ...prev,
    ]);

    return { success: true, message: `Driver ${driverName} and Vehicle ${vehicleNumber} assigned successfully.` };
  };

  const rejectDeliveryRequest = (deliveryId: string, reason?: string) => {
    const delivery = deliveryRequests.find(d => d.id === deliveryId);
    if (!delivery) return;

    setDeliveryRequests(prev =>
      prev.map(d =>
        d.id === deliveryId
          ? {
              ...d,
              status: 'REJECTED' as const,
              timeline: [
                ...d.timeline,
                {
                  status: 'REJECTED',
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  note: reason || 'Logistics provider declined job due to route schedule conflict.',
                },
              ],
            }
          : d
      )
    );

    setCalendarEvents(prev =>
      prev.map(ev =>
        ev.bookingId === deliveryId || ev.id === `cal_del_${deliveryId}`
          ? { ...ev, status: 'cancelled' as const, bookingStatus: 'rejected', title: 'Logistics Request Declined' }
          : ev
      )
    );
  };

  const updateDeliveryStatus = (
    deliveryId: string,
    newStatus: DeliveryRequest['status'],
    note?: string
  ) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const delivery = deliveryRequests.find(d => d.id === deliveryId);

    setDeliveryRequests(prev =>
      prev.map(d => {
        if (d.id === deliveryId) {
          const defaultNotes: Record<string, string> = {
            PICKUP_SCHEDULED: 'Driver confirmed pickup window at farm gate.',
            pickup_scheduled: 'Driver confirmed pickup window at farm gate.',
            PICKED_UP: 'Produce inspected and loaded into vehicle at farm gate.',
            picked_up: 'Produce inspected and loaded into vehicle at farm gate.',
            IN_TRANSIT: 'Vehicle departed farm on highway route towards buyer destination.',
            in_transit: 'Vehicle departed farm on highway route towards buyer destination.',
            DELIVERED: 'Produce unloaded, weighed and verified at buyer premises.',
            delivered: 'Produce unloaded, weighed and verified at buyer premises.',
            COMPLETED: 'Buyer confirmed produce received. Shipment COMPLETED.',
            completed: 'Buyer confirmed produce received. Shipment COMPLETED.',
          };
          return {
            ...d,
            status: newStatus,
            timeline: [
              ...d.timeline,
              {
                status: newStatus,
                timestamp: timeStr,
                note: note || defaultNotes[newStatus] || `Status updated to ${String(newStatus).replace('_', ' ')}.`,
              },
            ],
          };
        }
        return d;
      })
    );

    // If marked delivered, update related order
    if (newStatus === 'DELIVERED' || newStatus === 'delivered' || newStatus === 'AWAITING_BUYER_CONFIRMATION') {
      if (delivery && delivery.orderId) {
        setOrders(prev =>
          prev.map(o => (o.id === delivery.orderId ? { ...o, orderStatus: 'delivered' } : o))
        );
      }
    }

    // Role-correct Notifications
    if (delivery) {
      const statusUpper = String(newStatus).toUpperCase();
      let notifTitle = `Delivery Status: ${statusUpper}`;
      let notifMsg = `Consignment #${deliveryId} status updated to ${statusUpper}.`;

      if (statusUpper === 'PICKED_UP') {
        notifTitle = 'Produce Picked Up at Farm Gate';
        notifMsg = `Driver ${delivery.driverName || 'assigned'} picked up ${delivery.quantityKg} ${delivery.unit || 'KG'} ${delivery.cropName}.`;
      } else if (statusUpper === 'IN_TRANSIT') {
        notifTitle = 'Shipment In Transit';
        notifMsg = `Vehicle ${delivery.vehicleNumber || ''} is in transit towards ${delivery.buyerName}.`;
      } else if (statusUpper === 'DELIVERED' || statusUpper === 'AWAITING_BUYER_CONFIRMATION') {
        notifTitle = 'Produce Delivered at Destination!';
        notifMsg = `Produce delivered to ${delivery.buyerName}. Buyer: Please confirm produce received.`;
      }

      setNotifications(prev => [
        {
          id: `notif_st_f_${Date.now()}`,
          recipientRole: 'farmer',
          recipientUserId: delivery.farmerId,
          title: notifTitle,
          titleTa: notifTitle,
          message: notifMsg,
          messageTa: notifMsg,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'logistics',
        },
        {
          id: `notif_st_b_${Date.now()}`,
          recipientRole: 'buyer',
          recipientUserId: delivery.buyerId,
          title: notifTitle,
          titleTa: notifTitle,
          message: notifMsg,
          messageTa: notifMsg,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'logistics',
        },
        ...prev,
      ]);
    }
  };

  const confirmBuyerProduceReceived = (deliveryId: string) => {
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const delivery = deliveryRequests.find(d => d.id === deliveryId);

    setDeliveryRequests(prev =>
      prev.map(d => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status: 'COMPLETED' as const,
            timeline: [
              ...d.timeline,
              {
                status: 'COMPLETED',
                timestamp: timeStr,
                note: 'Buyer verified produce quantity and quality at destination. Delivery COMPLETED.',
              },
            ],
          };
        }
        return d;
      })
    );

    if (delivery && delivery.orderId) {
      setOrders(prev =>
        prev.map(o => (o.id === delivery.orderId ? { ...o, orderStatus: 'completed' } : o))
      );
    }

    if (delivery) {
      setNotifications(prev => [
        {
          id: `notif_cmp_f_${Date.now()}`,
          recipientRole: 'farmer',
          recipientUserId: delivery.farmerId,
          title: 'Buyer Confirmed Produce Received! ✓',
          titleTa: 'சரக்கு பெறப்பட்டது உறுதி செய்யப்பட்டது! ✓',
          message: `Buyer ${delivery.buyerName} confirmed receipt for ${delivery.quantityKg} ${delivery.unit || 'KG'} ${delivery.cropName}. Delivery COMPLETED.`,
          messageTa: `வியாபாரி சரக்கை பெற்றுக்கொண்டதை உறுதி செய்தார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'orders',
        },
        {
          id: `notif_cmp_l_${Date.now()}`,
          recipientRole: 'logistics',
          recipientUserId: delivery.assignedPartnerId,
          title: 'Delivery Confirmed & Completed! ✓',
          titleTa: 'சரக்கு விநியோகம் நிறைவடைந்தது! ✓',
          message: `Buyer confirmed receipt for Consignment #${deliveryId}. Delivery successfully COMPLETED.`,
          messageTa: `சரக்கு விநியோகம் வெற்றிகரமாக முடிந்தது.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'logistics',
        },
        ...prev,
      ]);
    }
  };

  const submitKycVerification = (userId: string, role: UserRole, kycDetails: any) => {
    const newReq: VerificationRequest = {
      id: `vreq_${Date.now()}`,
      userId,
      userName: currentUser.name,
      userRole: role,
      mobile: currentUser.mobile,
      district: currentUser.district,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
      kycSummary: kycDetails || {},
    };

    setVerificationRequests(prev => [newReq, ...prev]);
    setCurrentUserState(prev => ({
      ...prev,
      verificationStatus: 'pending',
      verificationSubmittedAt: newReq.submittedAt,
    }));

    return {
      success: true,
      message: 'KYC documents submitted for admin verification. Status: VERIFICATION_PENDING.',
    };
  };

  const approveKycVerification = (requestId: string) => {
    setVerificationRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'verified' as const } : r))
    );
  };

  const rejectKycVerification = (requestId: string, reason: string) => {
    setVerificationRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected' as const, rejectionReason: reason } : r))
    );
  };

  const recordBuyerPayment = (
    orderId: string,
    amount: number,
    method: 'UPI' | 'Bank Transfer' | 'Cash',
    referenceId?: string,
    proofUrl?: string
  ) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const newPayment: PaymentRecord = {
            id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            amount,
            method,
            referenceId: referenceId || `DIR-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            notes: `Direct ${method} payment recorded by buyer.`,
            proofUrl: proofUrl?.trim() || undefined,
            status: 'RECORDED',
          };
          const updatedPayments = [...o.payments, newPayment];

          // Calculate settlement using ONLY farmer-confirmed payments
          const confirmedPaid = updatedPayments
            .filter(p => p.status === 'CONFIRMED_BY_FARMER')
            .reduce((sum, p) => sum + p.amount, 0);
          const remainingBalance = Math.max(0, o.cropValue - confirmedPaid);

          return {
            ...o,
            payments: updatedPayments,
            totalPaid: confirmedPaid,
            remainingBalance,
            settlementStatus: 'awaiting_farmer_confirmation',
          };
        }
        return o;
      })
    );

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'farmer',
        title: 'Payment Recorded - Action Required',
        titleTa: 'பணம் செலுத்தப்பட்டது - சரிபார்க்கவும்',
        message: `Buyer recorded payment of ₹${amount.toLocaleString('en-IN')}. Please verify in your bank/UPI account and confirm receipt.`,
        messageTa: `வியாபாரி ₹${amount.toLocaleString('en-IN')} செலுத்தியதாக பதிவு செய்துள்ளார். உங்கள் கணக்கில் சரிபார்த்து உறுதிப்படுத்தவும்.`,
        timestamp: 'Just now',
        isRead: false,
        linkTab: 'orders',
      },
      ...prev,
    ]);
  };

  const confirmFarmerPaymentReceipt = (orderId: string, paymentId?: string) => {
    let createdRecord: DigitalTransactionRecord | null = null;
    let settledCropValue = 0;
    let confirmedPaymentAmount = 0;

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedPayments = o.payments.map(p => {
            if (paymentId) {
              if (p.id === paymentId) {
                confirmedPaymentAmount = p.amount;
                return { ...p, status: 'CONFIRMED_BY_FARMER' as const };
              }
              return p;
            } else {
              if (p.status === 'RECORDED') {
                confirmedPaymentAmount += p.amount;
                return { ...p, status: 'CONFIRMED_BY_FARMER' as const };
              }
              return p;
            }
          });

          // Calculate settlement using ONLY farmer-confirmed payments
          const confirmedTotal = updatedPayments
            .filter(p => p.status === 'CONFIRMED_BY_FARMER')
            .reduce((sum, p) => sum + p.amount, 0);
          const remainingBalance = Math.max(0, o.cropValue - confirmedTotal);
          const isFullySettled = confirmedTotal >= o.cropValue;
          const hasPendingRecorded = updatedPayments.some(p => p.status === 'RECORDED');

          const newSettlementStatus: Order['settlementStatus'] = isFullySettled
            ? 'settlement_completed'
            : hasPendingRecorded
            ? 'awaiting_farmer_confirmation'
            : confirmedTotal > 0
            ? 'partial_payment'
            : 'unpaid';

          if (isFullySettled) {
            settledCropValue = o.cropValue;
            createdRecord = {
              transactionId: `TXN-${Date.now().toString().slice(-6)}`,
              orderId: o.id,
              farmerName: o.farmerName,
              buyerName: o.buyerName,
              cropName: o.cropName,
              quantityKg: o.quantityKg,
              pricePerKg: o.pricePerKg,
              unit: o.unit,
              totalCropValue: o.cropValue,
              payments: updatedPayments,
              settlementDate: new Date().toISOString().split('T')[0],
              deliveryStatus: 'Produce Received & Verified',
              isSettled: true,
            };
          }

          return {
            ...o,
            payments: updatedPayments,
            totalPaid: confirmedTotal,
            remainingBalance,
            settlementStatus: newSettlementStatus,
            orderStatus: isFullySettled ? 'completed' : o.orderStatus,
          };
        }
        return o;
      })
    );

    // Only generate the final Digital Transaction Record after 100% of the order value has been confirmed by the farmer.
    if (createdRecord) {
      setDigitalTransactionRecord(createdRecord);
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'all',
          title: 'Settlement Completed Successfully',
          titleTa: 'பரிவர்த்தனை வெற்றிகரமாக முடிந்தது',
          message: `Direct settlement of ₹${settledCropValue.toLocaleString('en-IN')} confirmed for Order #${orderId}. Digital transaction record created.`,
          messageTa: `ஆர்டர் #${orderId}-க்கான ₹${settledCropValue.toLocaleString('en-IN')} பரிவர்த்தனை வெற்றிகரமாக முடிந்தது.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'orders',
        },
        ...prev,
      ]);
    } else {
      const order = orders.find(o => o.id === orderId);
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          recipientRole: 'buyer',
          title: 'Payment Confirmed by Farmer',
          titleTa: 'விவசாயி பணம் கிடைத்ததை உறுதி செய்தார்',
          message: `Farmer ${order?.farmerName || 'Seller'} confirmed receipt of ₹${confirmedPaymentAmount.toLocaleString('en-IN')} for Order #${orderId}.`,
          messageTa: `விவசாயி ஆர்டர் #${orderId}-க்கான ₹${confirmedPaymentAmount.toLocaleString('en-IN')} தொகை கிடைத்ததை உறுதி செய்தார்.`,
          timestamp: 'Just now',
          isRead: false,
          linkTab: 'orders',
        },
        ...prev,
      ]);
    }
  };

  const raisePaymentDispute = (orderId: string, reason: string, paymentId?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updatedPayments = o.payments.map(p => {
            if (paymentId && p.id === paymentId) {
              return { ...p, status: 'DISPUTED' as const };
            }
            if (!paymentId && p.status === 'RECORDED') {
              return { ...p, status: 'DISPUTED' as const };
            }
            return p;
          });
          return {
            ...o,
            payments: updatedPayments,
            settlementStatus: 'disputed',
            disputeReason: reason,
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find(o => o.id === orderId);
    const targetPayment = targetOrder?.payments.find(p => p.id === paymentId);
    const payInfo = targetPayment
      ? ` for ₹${targetPayment.amount.toLocaleString('en-IN')} (${targetPayment.method} Ref: ${targetPayment.referenceId || 'N/A'})`
      : '';

    const newIssue: AdminIssue = {
      id: `iss_${Date.now()}`,
      category: 'Payment Issue',
      reportedBy: targetOrder?.farmerName || 'Farmer',
      targetEntity: targetOrder?.buyerName || 'Buyer',
      relatedTransactionId: orderId,
      description: `Payment confirmation failed${payInfo}. Farmer reported: "${reason}"`,
      adminNotes: ['Issue flagged directly to admin dispute console. Escalating to local mandi field officer.'],
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setAdminIssues(prev => [newIssue, ...prev]);
  };

  const addCalendarEvent = (eventData: Partial<FarmCalendarEvent>) => {
    const newEvent: FarmCalendarEvent = {
      id: `cal_${Date.now()}`,
      title: eventData.title || 'Farm Activity',
      titleTa: eventData.titleTa || 'பண்ணை செயல்பாடு',
      date: eventData.date || '2026-10-10',
      time: eventData.time || '08:00 AM',
      type: eventData.type || 'harvest',
      cropName: eventData.cropName,
      quantityKg: eventData.quantityKg,
      relatedEntityName: eventData.relatedEntityName,
      weatherAlert: eventData.weatherAlert || false,
      status: 'scheduled',
      details: eventData.details || '',
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const toggleFavourite = (type: keyof FavouritesMap, id: string) => {
    setFavourites(prev => {
      const exists = prev[type].includes(id);
      return {
        ...prev,
        [type]: exists ? prev[type].filter(item => item !== id) : [...prev[type], id],
      };
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const adminApproveVerification = (entityId: string, role: string) => {
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        recipientRole: 'all',
        title: 'Partner Verified by Admin',
        titleTa: 'நிர்வாகியால் சரிபார்க்கப்பட்டது',
        message: `Entity ${entityId} (${role}) verified. Trust ring upgraded to Active / Trusted Member.`,
        messageTa: `சுயவிவரம் சரிபார்க்கப்பட்டு நம்பக வளையம் புதுப்பிக்கப்பட்டது.`,
        timestamp: 'Just now',
        isRead: false,
      },
      ...prev,
    ]);
  };

  const adminResolveIssue = (issueId: string, note: string) => {
    setAdminIssues(prev =>
      prev.map(i =>
        i.id === issueId
          ? {
              ...i,
              status: 'resolved',
              adminNotes: [...i.adminNotes, `[Resolved]: ${note}`],
            }
          : i
      )
    );
  };

  const runDemoStory = () => {
    // Execute the complete Kumar coconut harvest demo story
    switchRole('farmer');
    setActiveTabState('myCrops');

    // 1. Reset crop coconut to original 2000 Coconuts with empty sales ledger
    const coconutCrop = cropsRef.current.find(c => c.id === 'crop_coconut_2000');
    if (coconutCrop) {
      const resetCoconut: CropListing = {
        ...coconutCrop,
        totalQuantityKg: 2000,
        soldQuantityKg: 0,
        remainingQuantityKg: 2000,
        unit: 'Coconuts',
        pricePerKg: 30,
        isSoldOut: false,
        sales: [],
      };
      cropsRef.current = cropsRef.current.map(c => (c.id === 'crop_coconut_2000' ? resetCoconut : c));
      setCrops(prev => prev.map(c => (c.id === 'crop_coconut_2000' ? resetCoconut : c)));
    }

    // Reset offers on coconut to pending
    setOffers(prev =>
      prev.map(o =>
        o.cropListingId === 'crop_coconut_2000' ? { ...o, status: 'pending' as const } : o
      )
    );

    // 2. Step 1: Buyer 1 (Murugan Mandi) purchases 800 Coconuts
    setTimeout(() => {
      recordPartialSale(
        'crop_coconut_2000',
        'user_buyer_murugan',
        'Murugan Wholesale Agro Mandi',
        800,
        30
      );
    }, 600);

    // 3. Step 2: Buyer 2 (Annapoorna Fresh Foods) purchases 700 Coconuts
    setTimeout(() => {
      recordPartialSale(
        'crop_coconut_2000',
        'user_buyer_annapoorna',
        'Annapoorna Fresh Foods',
        700,
        31
      );
    }, 1800);

    // 4. Step 3: Buyer 3 (Kaveri Agro Exports) purchases 500 Coconuts -> 100% SOLD OUT!
    setTimeout(() => {
      recordPartialSale(
        'crop_coconut_2000',
        'user_buyer_new',
        'Kaveri Agro Exports',
        500,
        30
      );
    }, 3200);
  };

  const resetToDefaults = () => {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(LOCAL_STORAGE_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    const defaultCrops = SEED_CROPS.map(normalizeCropWithLedger);
    cropsRef.current = defaultCrops;
    setCrops(defaultCrops);
    setOffers(SEED_OFFERS);
    setBuyerRequirements(SEED_BUYER_REQUIREMENTS);
    setWorkers(SEED_WORKERS);
    setWorkerBookings(SEED_WORKER_BOOKINGS);
    setMachinery(SEED_MACHINERY);
    setMachineryBookings(SEED_MACHINERY_BOOKINGS);
    setAgriStores(SEED_AGRI_STORES);
    setAgriProducts(SEED_AGRI_PRODUCTS);
    setLogisticsPartners(SEED_LOGISTICS_PARTNERS);
    setDeliveryRequests(SEED_DELIVERY_REQUESTS);
    setOrders(SEED_ORDERS);
    setCalendarEvents(SEED_CALENDAR_EVENTS);
    setNotifications(SEED_NOTIFICATIONS);
    setAdminIssues(SEED_ADMIN_ISSUES);
    setRevenueSectors(SEED_REVENUE_SECTORS);
    setFavourites({
      farmers: ['user_farmer_kumar'],
      workers: ['worker_marimuthu'],
      machinery: ['mach_tractor_01'],
      stores: ['store_cauvery_bio'],
    });
    switchRole('farmer');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentRole,
        setCurrentRole: setCurrentRoleState,
        currentUser,
        setCurrentUser: setCurrentUserState,
        activeTab,
        setActiveTab: setActiveTabState,
        whyTrustRingModalUser,
        setWhyTrustRingModalUser,
        crops,
        offers,
        buyerRequirements,
        marketPrices,
        workers,
        workerBookings,
        labourRequirements,
        machinery,
        machineryBookings,
        machineryRequirements,
        agriStores,
        agriProducts,
        logisticsPartners,
        deliveryRequests,
        verificationRequests,
        orders,
        calendarEvents,
        weatherForecast,
        notifications,
        adminIssues,
        revenueSectors,
        awards,
        favourites,
        selectedMachineForCalendar,
        setSelectedMachineForCalendar,
        switchRole,
        addCropListing,
        recordPartialSale,
        submitCropOffer,
        respondToOffer,
        respondToCounterOffer,
        addBuyerRequirement,
        bookWorker,
        acceptWorkerBooking,
        rejectWorkerBooking,
        updateWorkerBookingStatus,
        postLabourRequirement,
        expressWorkerInterest,
        acceptLabourRequirementTeam,
        confirmIndividualWorker,
        cancelLabourRequirement,
        cancelWorkerBooking,
        requestWorkerReschedule,
        approveWorkerReschedule,
        bookMachinery,
        acceptMachineryBooking,
        rejectMachineryBooking,
        cancelMachineryBooking,
        requestMachineryReschedule,
        approveMachineryReschedule,
        updateMachineryBookingStatus,
        postMachineryRequirement,
        respondToMachineryRequirement,
        createDeliveryRequest,
        acceptDeliveryRequest,
        assignDriverAndVehicle,
        rejectDeliveryRequest,
        updateDeliveryStatus,
        confirmBuyerProduceReceived,
        submitKycVerification,
        approveKycVerification,
        rejectKycVerification,
        recordBuyerPayment,
        confirmFarmerPaymentReceipt,
        raisePaymentDispute,
        addCalendarEvent,
        toggleFavourite,
        markNotificationRead,
        adminApproveVerification,
        adminResolveIssue,
        runDemoStory,
        resetToDefaults,
        triggerSoldOutCelebration,
        digitalTransactionRecord,
        setDigitalTransactionRecord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
