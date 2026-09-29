import {
  CropListing,
  CropOffer,
  Order,
  BuyerRequirement,
  WorkerBooking,
  ReverseWorkerRequest,
  MachineryBooking,
  MachineryRequirement,
  DeliveryRequest,
  MarketPriceItem,
} from '../types';
import { computeSalesLedger } from '../context/AppContext';

export interface FavouritesMap {
  farmers: string[];
  workers: string[];
  machinery: string[];
  stores: string[];
}

/**
 * Shared calculation helper for Farmer Sales Metrics
 */
export function getFarmerSalesMetrics(farmerId: string, farmerName: string, crops: CropListing[]) {
  const farmerCrops = crops.filter(
    c => c.farmerId === farmerId || (c.farmerName && c.farmerName.toLowerCase() === farmerName.toLowerCase())
  );

  const currentMonth = '2026-09';
  const currentYear = '2026';

  let thisMonthSales = 0;
  let thisYearSales = 0;
  const buyerIdSet = new Set<string>();
  const buyerNameSet = new Set<string>();

  farmerCrops.forEach(crop => {
    const ledger = computeSalesLedger(crop.totalQuantityKg, crop.sales);
    ledger.validSales.forEach(sale => {
      if (sale.buyerId) buyerIdSet.add(sale.buyerId);
      if (sale.buyerName) buyerNameSet.add(sale.buyerName);

      const saleDate = sale.date || '2026-09-25';
      const amount = sale.totalAmount || sale.quantityKg * sale.pricePerKg;

      if (saleDate.startsWith(currentYear)) {
        thisYearSales += amount;
      }
      if (saleDate.startsWith(currentMonth)) {
        thisMonthSales += amount;
      }
    });
  });

  return {
    farmerCrops,
    thisMonthSales,
    thisYearSales,
    totalBuyersCount: buyerIdSet.size,
    uniqueBuyerNames: Array.from(buyerNameSet),
  };
}

export interface BuyerSummaryItem {
  buyerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  totalAmount?: number;
  pricePerKg?: number;
  status: string;
  isPendingOffer?: boolean;
}

/**
 * Helper to get detailed buyer list (Confirmed + Pending) for Farmer
 */
export function getFarmerDetailedBuyerList(
  farmerId: string,
  farmerName: string,
  crops: CropListing[],
  orders: Order[],
  offers: CropOffer[]
) {
  const farmerCrops = crops.filter(
    c => c.farmerId === farmerId || (c.farmerName && c.farmerName.toLowerCase() === farmerName.toLowerCase())
  );

  const confirmedBuyers: BuyerSummaryItem[] = [];
  const confirmedKeySet = new Set<string>();

  // 1. Collect from crop sales ledgers
  farmerCrops.forEach(crop => {
    const ledger = computeSalesLedger(crop.totalQuantityKg, crop.sales);
    ledger.validSales.forEach(sale => {
      const key = `${sale.buyerName}_${crop.cropName}_${sale.quantityKg}`;
      if (!confirmedKeySet.has(key)) {
        confirmedKeySet.add(key);
        confirmedBuyers.push({
          buyerName: sale.buyerName,
          cropName: crop.cropName,
          quantity: sale.quantityKg,
          unit: crop.unit === 'Coconuts' ? 'Coconuts' : (crop.unit || 'KG'),
          totalAmount: sale.totalAmount || sale.quantityKg * sale.pricePerKg,
          pricePerKg: sale.pricePerKg,
          status: 'Confirmed Sale',
        });
      }
    });
  });

  // 2. Collect from orders
  const farmerOrders = orders.filter(
    o => o.farmerId === farmerId || (o.farmerName && o.farmerName.toLowerCase() === farmerName.toLowerCase())
  );

  farmerOrders.forEach(ord => {
    const key = `${ord.buyerName}_${ord.cropName}_${ord.quantityKg}`;
    if (!confirmedKeySet.has(key)) {
      confirmedKeySet.add(key);
      const statusStr = ord.settlementStatus === 'settlement_completed' ? 'Settlement Completed' : 'Confirmed Order';
      confirmedBuyers.push({
        buyerName: ord.buyerName,
        cropName: ord.cropName,
        quantity: ord.quantityKg,
        unit: ord.unit || 'KG',
        totalAmount: ord.cropValue,
        pricePerKg: ord.pricePerKg,
        status: statusStr,
      });
    }
  });

  // 3. Collect pending offers
  const farmerOffers = offers.filter(
    o => (o.farmerId === farmerId || (o.farmerName && o.farmerName.toLowerCase() === farmerName.toLowerCase())) && o.status === 'pending'
  );

  const pendingBuyerOffers: BuyerSummaryItem[] = farmerOffers.map(off => ({
    buyerName: off.buyerName || 'Wholesale Buyer',
    cropName: off.cropName,
    quantity: off.offeredQuantityKg,
    unit: off.unit || (off.cropName === 'Coconut' ? 'Coconuts' : 'KG'),
    totalAmount: off.totalCropValue || off.offeredQuantityKg * off.offeredPricePerKg,
    pricePerKg: off.offeredPricePerKg,
    status: 'Waiting for Farmer Approval',
    isPendingOffer: true,
  }));

  return {
    confirmedBuyers,
    pendingBuyerOffers,
    hasAnyBuyers: confirmedBuyers.length > 0 || pendingBuyerOffers.length > 0,
  };
}

/**
 * Shared helper for Farmer Pending Offers
 */
export function getFarmerOfferMetrics(farmerId: string, farmerName: string, offers: CropOffer[]) {
  const farmerOffers = offers.filter(
    o => o.farmerId === farmerId || (o.farmerName && o.farmerName.toLowerCase() === farmerName.toLowerCase())
  );

  const pendingOffers = farmerOffers.filter(o => o.status === 'pending');

  return {
    farmerOffers,
    pendingOffers,
    pendingOffersCount: pendingOffers.length,
    totalOffersCount: farmerOffers.length,
  };
}

/**
 * Shared helper for Farmer Crop Listings
 */
export function getFarmerCropMetrics(farmerId: string, farmerName: string, crops: CropListing[]) {
  const farmerCrops = crops.filter(
    c => c.farmerId === farmerId || (c.farmerName && c.farmerName.toLowerCase() === farmerName.toLowerCase())
  );

  const activeCrops = farmerCrops.filter(c => !c.isSoldOut && c.remainingQuantityKg > 0);
  const soldOutCrops = farmerCrops.filter(c => c.isSoldOut || c.remainingQuantityKg === 0);

  const findCropByName = (cropNameQuery: string) => {
    const norm = cropNameQuery.toLowerCase().trim();
    return farmerCrops.find(
      c =>
        c.cropName.toLowerCase().includes(norm) ||
        (c.cropNameTa && c.cropNameTa.toLowerCase().includes(norm)) ||
        norm.includes(c.cropName.toLowerCase())
    );
  };

  return {
    farmerCrops,
    activeCrops,
    soldOutCrops,
    findCropByName,
  };
}

/**
 * Shared helper for Farmer Payments
 */
export function getFarmerPaymentMetrics(farmerId: string, farmerName: string, orders: Order[]) {
  const farmerOrders = orders.filter(
    o => o.farmerId === farmerId || (o.farmerName && o.farmerName.toLowerCase() === farmerName.toLowerCase())
  );

  let totalReceived = 0;
  let totalPending = 0;

  farmerOrders.forEach(ord => {
    const paid = ord.totalPaid || 0;
    const remaining = typeof ord.remainingBalance === 'number' ? ord.remainingBalance : Math.max(0, ord.cropValue - paid);
    totalReceived += paid;
    totalPending += remaining;
  });

  return {
    farmerOrders,
    totalReceived,
    totalPending,
  };
}

/**
 * Shared helper for Farmer Services / Bookings
 */
export function getFarmerBookingMetrics(
  farmerId: string,
  farmerName: string,
  workerBookings: WorkerBooking[],
  machineryBookings: MachineryBooking[],
  deliveryRequests: DeliveryRequest[]
) {
  const farmerWorkerBookings = workerBookings.filter(
    b => b.farmerId === farmerId || (b.farmerName && b.farmerName.toLowerCase() === farmerName.toLowerCase())
  );
  const upcomingWorkerBooking = farmerWorkerBookings.find(
    b => b.status === 'confirmed' || b.status === 'requested' || b.status === 'in_progress'
  );

  const farmerMachineryBookings = machineryBookings.filter(
    b => b.farmerId === farmerId || (b.farmerName && b.farmerName.toLowerCase() === farmerName.toLowerCase())
  );
  const activeMachineryBooking = farmerMachineryBookings.find(
    b => b.status === 'confirmed' || b.status === 'requested' || b.status === 'in_progress'
  );

  const farmerDeliveryRequests = deliveryRequests.filter(
    d => d.farmerId === farmerId || (d.farmerName && d.farmerName.toLowerCase() === farmerName.toLowerCase())
  );
  const activeDelivery = farmerDeliveryRequests.find(
    d => d.status === 'in_transit' || d.status === 'pickup_scheduled' || d.status === 'accepted' || d.status === 'requested'
  );

  return {
    workerBookings: farmerWorkerBookings,
    upcomingWorkerBooking,
    machineryBookings: farmerMachineryBookings,
    activeMachineryBooking,
    deliveryRequests: farmerDeliveryRequests,
    activeDelivery,
  };
}

/**
 * Shared helper for Buyer metrics
 */
export function getBuyerMetrics(
  buyerId: string,
  buyerName: string,
  offers: CropOffer[],
  orders: Order[],
  buyerRequirements: BuyerRequirement[],
  deliveryRequests: DeliveryRequest[],
  favourites?: FavouritesMap
) {
  const buyerOffers = offers.filter(
    o => o.buyerId === buyerId || (o.buyerName && o.buyerName.toLowerCase().includes(buyerName.toLowerCase()))
  );
  const pendingOffers = buyerOffers.filter(o => o.status === 'pending');
  const acceptedOffers = buyerOffers.filter(o => o.status === 'accepted');

  const buyerOrders = orders.filter(
    o => o.buyerId === buyerId || (o.buyerName && o.buyerName.toLowerCase().includes(buyerName.toLowerCase()))
  );

  let pendingPayments = 0;
  buyerOrders.forEach(o => {
    const paid = o.totalPaid || 0;
    const rem = typeof o.remainingBalance === 'number' ? o.remainingBalance : Math.max(0, o.cropValue - paid);
    pendingPayments += rem;
  });

  const activeReqs = buyerRequirements.filter(r => r.buyerId === buyerId || r.status === 'open');
  const activeDeliveries = deliveryRequests.filter(
    d => (d.buyerId === buyerId || d.buyerName === buyerName) && (d.status === 'in_transit' || d.status === 'pickup_scheduled')
  );

  return {
    sentOffersCount: buyerOffers.length,
    pendingOffersCount: pendingOffers.length,
    acceptedOffersCount: acceptedOffers.length,
    buyerOrdersCount: buyerOrders.length,
    buyerOrders,
    pendingPayments,
    activeReqsCount: activeReqs.length,
    activeDeliveries,
    favFarmersCount: favourites?.farmers?.length || 0,
  };
}

/**
 * Shared helper for Worker metrics
 */
export function getWorkerMetrics(
  workerUserId: string,
  workerName: string,
  workerBookings: WorkerBooking[],
  labourRequirements: ReverseWorkerRequest[]
) {
  const myBookings = workerBookings.filter(
    b =>
      b.workerId === workerUserId ||
      (b.workerName && b.workerName.toLowerCase().includes(workerName.toLowerCase()))
  );

  const confirmedBookings = myBookings.filter(b => b.status === 'confirmed');
  const inProgressBookings = myBookings.filter(b => b.status === 'in_progress');
  const completedBookings = myBookings.filter(b => b.status === 'completed');

  const upcomingBooking = confirmedBookings[0] || myBookings.find(b => b.status === 'requested');

  const openJobs = labourRequirements.filter(r => r.status === 'open');

  return {
    availableJobsCount: openJobs.length,
    confirmedBookingsCount: confirmedBookings.length,
    inProgressCount: inProgressBookings.length,
    completedJobsCount: completedBookings.length,
    upcomingBooking,
    myBookings,
  };
}

/**
 * Shared helper for Machinery Provider metrics
 */
export function getMachineryMetrics(
  providerId: string,
  providerName: string,
  machineryBookings: MachineryBooking[],
  machineryRequirements: MachineryRequirement[]
) {
  const myBookings = machineryBookings.filter(
    b =>
      b.providerId === providerId ||
      (b.providerName && b.providerName.toLowerCase().includes(providerName.toLowerCase()))
  );

  const pendingRequests = myBookings.filter(b => b.status === 'requested');
  const confirmedBookings = myBookings.filter(b => b.status === 'confirmed');
  const inProgressBooking = myBookings.find(b => b.status === 'in_progress');
  const upcomingBooking = confirmedBookings[0];

  const openRequests = machineryRequirements.filter(r => r.status === 'open');

  return {
    bookingRequestsCount: pendingRequests.length,
    confirmedBookingsCount: confirmedBookings.length,
    inProgressBooking,
    upcomingBooking,
    openRequestsCount: openRequests.length,
  };
}

/**
 * Shared helper for Logistics Partner metrics
 */
export function getLogisticsMetrics(
  partnerId: string,
  partnerName: string,
  deliveryRequests: DeliveryRequest[]
) {
  const myDeliveries = deliveryRequests.filter(
    d =>
      d.assignedPartnerId === partnerId ||
      (d.assignedPartnerName && d.assignedPartnerName.toLowerCase().includes(partnerName.toLowerCase()))
  );

  const pendingRequests = deliveryRequests.filter(d => d.status === 'requested');
  const inTransitDeliveries = myDeliveries.filter(d => d.status === 'in_transit' || d.status === 'pickup_scheduled');
  const completedDeliveries = myDeliveries.filter(d => d.status === 'delivered');

  const activeDelivery = inTransitDeliveries[0];

  return {
    pendingRequestsCount: pendingRequests.length,
    inTransitCount: inTransitDeliveries.length,
    completedCount: completedDeliveries.length,
    activeDelivery,
  };
}

/**
 * Shared helper for Market Reference Prices
 */
export function getMarketPriceInfo(cropQuery: string, marketPrices: MarketPriceItem[]) {
  const norm = cropQuery.toLowerCase().trim();
  const match = marketPrices.find(
    p =>
      p.cropName.toLowerCase().includes(norm) ||
      (p.cropNameTa && p.cropNameTa.toLowerCase().includes(norm)) ||
      norm.includes(p.cropName.toLowerCase())
  );
  return match || null;
}
