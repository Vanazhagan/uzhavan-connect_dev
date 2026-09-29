import { Order, CropOffer, WorkerBooking, MachineryBooking, DeliveryRequest } from '../types';

/**
 * Mask phone number for unconfirmed contacts.
 * e.g., "9842154321" -> "******4321"
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '******0000';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 4) return '******';
  const lastFour = clean.slice(-4);
  return `******${lastFour}`;
}

/**
 * Formats contact phone string based on unlock status
 */
export function formatContactPhone(phone: string | undefined, isUnlocked: boolean): string {
  if (!phone) return 'N/A';
  if (isUnlocked) return phone;
  return maskPhoneNumber(phone);
}

/**
 * Check if Farmer ↔ Buyer contact is unlocked.
 * Unlocked only AFTER Offer Accepted or Confirmed Order exists between farmer and buyer.
 */
export function isFarmerBuyerContactUnlocked(
  farmerId: string,
  buyerId: string,
  orders: Order[],
  offers: CropOffer[]
): boolean {
  if (!farmerId || !buyerId) return false;

  const hasConfirmedOrder = orders.some(
    o =>
      (o.farmerId === farmerId && o.buyerId === buyerId) ||
      (o.farmerId === buyerId && o.buyerId === farmerId)
  );
  if (hasConfirmedOrder) return true;

  const hasAcceptedOffer = offers.some(
    off =>
      off.status === 'accepted' &&
      ((off.farmerId === farmerId && off.buyerId === buyerId) ||
        (off.farmerId === buyerId && off.buyerId === farmerId))
  );
  return hasAcceptedOffer;
}

/**
 * Check if Farmer ↔ Worker contact is unlocked.
 * Unlocked only AFTER worker booking is CONFIRMED, IN_PROGRESS, or COMPLETED.
 */
export function isFarmerWorkerContactUnlocked(
  farmerId: string,
  workerId: string,
  workerBookings: WorkerBooking[]
): boolean {
  if (!farmerId || !workerId) return false;

  return workerBookings.some(
    b =>
      (b.farmerId === farmerId && b.workerId === workerId) &&
      (b.status === 'confirmed' ||
        b.status === 'accepted' ||
        b.status === 'in_progress' ||
        b.status === 'work_started' ||
        b.status === 'completed')
  );
}

/**
 * Check if Farmer ↔ Machinery Provider contact is unlocked.
 * Unlocked only AFTER machinery booking is CONFIRMED, DISPATCHED, IN_PROGRESS, or COMPLETED.
 */
export function isFarmerMachineryContactUnlocked(
  farmerId: string,
  providerId: string,
  machineryBookings: MachineryBooking[]
): boolean {
  if (!farmerId || !providerId) return false;

  return machineryBookings.some(
    b =>
      (b.farmerId === farmerId && b.providerId === providerId) &&
      (b.status === 'confirmed' ||
        b.status === 'accepted' ||
        b.status === 'dispatched' ||
        b.status === 'arrived' ||
        b.status === 'in_progress' ||
        b.status === 'in_service' ||
        b.status === 'completed')
  );
}

/**
 * Check if Logistics Partner / Driver contact is unlocked for Farmer or Buyer.
 * Unlocked only AFTER logistics partner accepts job and driver/vehicle are assigned.
 */
export function isLogisticsContactUnlocked(delivery?: DeliveryRequest): boolean {
  if (!delivery) return false;
  const status = (delivery.status || '').toLowerCase();
  const isAcceptedOrBeyond =
    status === 'accepted' ||
    status === 'assigned' ||
    status === 'driver_assigned' ||
    status === 'pickup_scheduled' ||
    status === 'picked_up' ||
    status === 'in_transit' ||
    status === 'reached_buyer' ||
    status === 'delivered' ||
    status === 'completed';

  return isAcceptedOrBeyond && Boolean(delivery.assignedPartnerId || delivery.driverName);
}
