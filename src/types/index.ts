export type UserRole =
  | 'farmer'
  | 'buyer'
  | 'worker'
  | 'machinery'
  | 'logistics'
  | 'agri_input'
  | 'admin';

export type SupportedLanguage = 'en' | 'ta';

export type TrustRingLevel = 'grey' | 'gold' | 'green' | 'star';

export interface TrustMetrics {
  level: TrustRingLevel;
  title: string;
  completedTransactions: number;
  fulfilmentRate: number; // e.g. 96 for 96%
  isVerified: boolean;
  positiveFeedbackScore: number; // e.g. 4.9 out of 5
  cancellationRate: number; // e.g. 2%
  reasons: string[];
}

export type VerificationStatus =
  | 'NOT_VERIFIED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'verified'
  | 'pending'
  | 'rejected';

export interface VerificationDocument {
  docType: string;
  docNumberMasked: string;
  submittedAt: string;
  proofName?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  mobile: string;
  district: string;
  submittedAt: string;
  status: VerificationStatus;
  rejectionReason?: string;
  kycSummary: {
    idType?: string;
    idNumberMasked?: string;
    businessName?: string;
    gstOrPanMasked?: string;
    drivingLicenceMasked?: string;
    vehicleRcMasked?: string;
    landRecordRefMasked?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  mobile: string;
  email?: string;
  avatarUrl?: string;
  district: string;
  taluk?: string;
  village?: string;
  preferredLanguage: 'ta' | 'en';
  trust: TrustMetrics;
  // Specific role attributes
  farmSize?: string;
  mainCrops?: string[];
  irrigationType?: string;
  buyerType?: 'Wholesaler' | 'Retailer' | 'Exporter' | 'Food Processing' | 'Local Market';
  businessName?: string;
  gstNumber?: string;
  skills?: string[];
  isTeam?: boolean;
  teamSize?: number;
  dailyRate?: number;
  hourlyRate?: number;
  vehicleType?: string;
  vehicleNumber?: string;
  capacity?: string;
  storeName?: string;
  storeAddress?: string;
  verificationStatus: VerificationStatus;
  verificationReason?: string;
  verificationSubmittedAt?: string;
}

export interface CropSaleRecord {
  id?: string;
  cropListingId: string;
  offerId?: string;
  buyerId: string;
  buyerName: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  date: string;
  acceptedAt: string;
  unit?: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerDistrict: string;
  farmerTrust: TrustMetrics;
  cropName: string;
  cropNameTa: string;
  variety?: string;
  imageUrl: string;
  totalQuantityKg: number;
  soldQuantityKg: number;
  remainingQuantityKg: number;
  pricePerKg: number;
  unit?: string; // 'KG' | 'Coconuts' | 'Pieces'
  harvestDate: string;
  qualityGrade: 'Grade A - Premium' | 'Grade B - Standard' | 'Fair Average';
  cultivationType: 'Natural / Organic' | 'Integrated Pest Management' | 'Conventional';
  description: string;
  openForOffers: boolean;
  sales: CropSaleRecord[];
  isSoldOut: boolean;
  publishedDate: string;
}

export interface CropOffer {
  id: string;
  cropListingId: string;
  cropName: string;
  buyerId: string;
  buyerName: string;
  buyerLocation?: string;
  buyerTrust: TrustMetrics;
  farmerId?: string;
  farmerName?: string;
  farmerTrust?: TrustMetrics;
  farmerDistrict?: string;
  offeredQuantityKg: number;
  offeredPricePerKg: number;
  totalCropValue?: number;
  pickupTerms: 'Farm Pickup by Buyer' | 'Farmer Arranged Logistics' | 'Direct Mandi Delivery';
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPricePerKg?: number;
  counterQuantityKg?: number;
  counterMessage?: string;
  createdAt: string;
  unit?: string;
  orderId?: string;
}

export interface MarketPriceItem {
  id: string;
  cropName: string;
  cropNameTa: string;
  referencePrice: number;
  unit: string;
  marketName: string;
  location: string;
  lastUpdated: string;
  priceTrend?: 'up' | 'down' | 'stable';
  isSampleReference: boolean;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerTrust: TrustMetrics;
  cropNeeded: string;
  cropNeededTa: string;
  requiredQuantityKg: number;
  preferredQuality: string;
  preferredLocation: string;
  requiredDate: string;
  targetPricePerKg: number;
  transportRequirement: string;
  status: 'open' | 'fulfilled' | 'closed';
  unit?: string;
}

export interface GroupSellingLot {
  id: string;
  cropName: string;
  cropNameTa: string;
  targetLotKg: number;
  pricePerKg: number;
  district: string;
  status: 'pooling' | 'ready_for_buyers' | 'sold';
  contributors: {
    farmerId: string;
    farmerName: string;
    quantityKg: number;
  }[];
}

export interface FarmWeatherDay {
  date: string;
  dayName: string;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain Expected' | 'Heavy Showers' | 'Clear Sky';
  conditionTa: string;
  tempCelsius: number;
  tempHigh: number;
  tempLow: number;
  rainChancePercent: number;
  humidityPercent: number;
  windSpeedKmh: number;
  advisory: string;
  advisoryTa: string;
  hasAlert: boolean;
}

export interface FarmCalendarEvent {
  id: string;
  title: string;
  titleTa: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'harvest' | 'worker_booking' | 'machinery_booking' | 'buyer_pickup' | 'logistics' | 'weather_alert';
  cropName?: string;
  quantityKg?: number;
  unit?: string;
  relatedEntityName?: string;
  weatherNote?: string;
  weatherAlert?: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'requested';
  details?: string;
  bookingId?: string;
  bookingStatus?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  isTeam: boolean;
  teamSize: number;
  area: string;
  skills: string[];
  dailyCharge: number;
  hourlyCharge?: number;
  trust: TrustMetrics;
  availableDates: string[]; // dates available
  busyDates: string[]; // booked dates
  completedJobs: number;
  phone: string;
}

export interface WorkerBooking {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  workerId: string;
  workerName: string;
  workerTrust: TrustMetrics;
  crop?: string;
  workType: string;
  date: string;
  startTime?: string;
  endTime?: string;
  timeSlot: string;
  workersRequired: number;
  farmLocation: string;
  expectedWagePerWorker?: number;
  totalCharge: number;
  platformFee?: number;
  status:
    | 'requested'
    | 'accepted'
    | 'confirmed'
    | 'in_progress'
    | 'work_started'
    | 'completed'
    | 'rejected'
    | 'cancelled'
    | 'reschedule_requested';
  notes?: string;
  rescheduleDate?: string;
  rescheduleTimeSlot?: string;
}

export interface ReverseWorkerRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile?: string;
  crop?: string;
  workType: string;
  date: string;
  timeSlot: string;
  workersRequired: number;
  confirmedWorkersCount?: number;
  location: string;
  expectedDailyWage: number;
  wageType?: 'per_day' | 'per_hour' | 'per_tree';
  notes?: string;
  responses: {
    workerId: string;
    workerName: string;
    workerPhone?: string;
    teamSize: number;
    isIndividual?: boolean;
    proposedWage: number;
    rating?: number;
    completedJobs?: number;
    location?: string;
    status?: 'interested' | 'confirmed' | 'rejected';
  }[];
  status: 'open' | 'partially_filled' | 'assigned' | 'cancelled';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
}

export interface MachineScheduleSlot {
  date: string; // YYYY-MM-DD
  timeSlot: string; // '08:00 - 12:00' | '14:00 - 18:00' | 'Full Day'
  status: 'available' | 'booked' | 'slot_held' | 'maintenance' | 'completed';
  bookingId?: string;
  farmerName?: string;
}

export interface MachineItem {
  id: string;
  providerId: string;
  providerName: string;
  machineName: string;
  machineNameTa: string;
  category:
    | 'Tractor'
    | 'Rotavator'
    | 'Power Tiller'
    | 'Power Weeder'
    | 'Paddy Transplanter'
    | 'Combine Harvester'
    | 'Reaper'
    | 'Power Sprayer'
    | 'Drone Sprayer'
    | 'Drone Spraying Service'
    | 'Coconut Tree Climbing Machine'
    | 'Tree Climbing Machine'
    | 'Maize Sheller'
    | 'Tractor Trailer / Tipper'
    | 'Farm Trailer'
    | 'Brush Cutter'
    | 'Weeder'
    | 'Seeder / Seed Drill'
    | 'Water Pump'
    | 'Thresher'
    | 'Baler';
  brandModel: string;
  attachments: string[];
  imageUrl: string;
  hourlyRate: number;
  dailyRate: number;
  minBookingDurationHours: number;
  serviceRadiusKm: number;
  baseLocation: string;
  schedule: MachineScheduleSlot[];
  description: string;
  providerTrust?: TrustMetrics;
}

export interface MachineryBooking {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile?: string;
  farmerLocation: string;
  machineId: string;
  machineName: string;
  providerId: string;
  providerName: string;
  providerTrust: TrustMetrics;
  crop?: string;
  workPurpose?: string;
  date: string;
  timeSlot: string;
  durationHours: number;
  estimatedCost: number;
  platformFee?: number;
  notes?: string;
  status:
    | 'requested'
    | 'accepted'
    | 'confirmed'
    | 'dispatched'
    | 'arrived'
    | 'in_progress'
    | 'in_service'
    | 'completed'
    | 'rejected'
    | 'cancelled'
    | 'reschedule_requested';
  rescheduleDate?: string;
  rescheduleTimeSlot?: string;
}

export interface MachineryRequirement {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile?: string;
  machineType: string;
  attachment?: string;
  date: string;
  timeSlot?: string;
  durationHours: number;
  farmLocation: string;
  crop?: string;
  workPurpose?: string;
  maxBudget: number;
  notes?: string;
  status: 'open' | 'fulfilled' | 'cancelled';
  responses?: {
    providerId: string;
    providerName: string;
    proposedRate: number;
    notes?: string;
    createdAt: string;
  }[];
}

export interface AgriStore {
  id: string;
  storeName: string;
  ownerName: string;
  district: string;
  taluk: string;
  village: string;
  address: string;
  mobile: string;
  categories: string[];
  imageUrl: string;
  trust: TrustMetrics;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
}

export interface AgriProduct {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  nameTa: string;
  category: 'Seeds' | 'Fertilizers / Nutrients' | 'Crop Protection Products' | 'Basic Agricultural Supplies';
  price: number;
  unit: string;
  inStock: boolean;
  imageUrl: string;
  description: string;
  manufacturerInfo: string;
}

export interface LogisticsPartnerProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  vehicleType: string;
  vehicleNumber: string;
  capacityKg: number;
  serviceDistricts: string[];
  trust: TrustMetrics;
}

export interface DeliveryRequest {
  id: string;
  orderId?: string;
  farmerId: string;
  farmerName: string;
  farmerMobile?: string;
  buyerId?: string;
  buyerName?: string;
  pickupLocation: string;
  dropLocation: string;
  cropName: string;
  quantityKg: number;
  unit?: string;
  preferredDate: string;
  preferredTime: string;
  vehicleRequirement?: string;
  notes?: string;
  assignedPartnerId?: string;
  assignedPartnerName?: string;
  driverName?: string;
  driverMobile?: string;
  vehicleNumber?: string;
  estimatedFee: number;
  platformFee?: number;
  status:
    | 'TRANSPORT_REQUESTED'
    | 'ACCEPTED'
    | 'DRIVER_ASSIGNED'
    | 'PICKUP_SCHEDULED'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'AWAITING_BUYER_CONFIRMATION'
    | 'COMPLETED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'requested'
    | 'accepted'
    | 'assigned'
    | 'pickup_scheduled'
    | 'picked_up'
    | 'in_transit'
    | 'reached_buyer'
    | 'delivered'
    | 'completed'
    | 'rejected'
    | 'cancelled';
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
}

export type PaymentStatus = 'RECORDED' | 'CONFIRMED_BY_FARMER' | 'DISPUTED';

export interface PaymentRecord {
  id: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer' | 'Cash';
  referenceId?: string;
  timestamp: string;
  notes?: string;
  proofUrl?: string;
  proof?: string;
  status?: PaymentStatus;
}

export interface Order {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerTrust: TrustMetrics;
  buyerId: string;
  buyerName: string;
  buyerTrust: TrustMetrics;
  cropListingId: string;
  cropName: string;
  quantityKg: number;
  pricePerKg: number;
  unit?: string;
  cropValue: number;
  buyerPlatformFee: number; // 2% of crop value
  totalPayableByBuyer: number; // cropValue + buyerPlatformFee
  pickupTerms: string;
  orderStatus: 'confirmed' | 'logistics_assigned' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  settlementStatus: 'unpaid' | 'partial_payment' | 'awaiting_farmer_confirmation' | 'settlement_completed' | 'disputed';
  payments: PaymentRecord[];
  totalPaid: number;
  remainingBalance: number;
  createdAt: string;
  deliveryId?: string;
  disputeReason?: string;
}

export interface DigitalTransactionRecord {
  transactionId: string;
  orderId: string;
  farmerName: string;
  buyerName: string;
  cropName: string;
  quantityKg: number;
  pricePerKg: number;
  unit?: string;
  totalCropValue: number;
  payments: PaymentRecord[];
  settlementDate: string;
  deliveryStatus: string;
  isSettled: boolean;
}

export interface AppNotification {
  id: string;
  recipientRole: UserRole | 'all';
  recipientUserId?: string;
  title: string;
  titleTa: string;
  message: string;
  messageTa: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface AdminIssue {
  id: string;
  category:
    | 'Payment Issue'
    | 'Crop Order Issue'
    | 'Worker Booking Issue'
    | 'Machinery Booking Issue'
    | 'Logistics Issue';
  reportedBy: string;
  targetEntity: string;
  relatedTransactionId?: string;
  description: string;
  adminNotes: string[];
  status: 'open' | 'reviewing' | 'resolved';
  createdAt: string;
}

export interface RevenueSectorMetric {
  sector: 'buyer_crop' | 'worker' | 'machinery' | 'logistics' | 'farmer_selling' | 'agri_input';
  name: string;
  nameTa: string;
  transactionCount: number;
  bookingValue: number;
  feeRatePercent: number; // e.g. 2
  platformRevenue: number;
  isFreePlatformService: boolean; // true for farmer crop (0%) and agri input (0%)
}

export interface UzhavanAward {
  id: string;
  title: string;
  titleTa: string;
  category: 'farmer' | 'buyer' | 'worker' | 'machinery' | 'logistics';
  recipientName: string;
  district: string;
  criteria: string;
  criteriaTa: string;
  badge: string;
}
