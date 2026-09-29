import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Phone,
  Check,
  X,
  User,
  CheckCheck,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryRequest } from '../../types';

export const LogisticsDeliveriesView: React.FC = () => {
  const {
    deliveryRequests,
    logisticsPartners,
    updateDeliveryStatus,
    assignDriverAndVehicle,
  } = useApp();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Assign Driver Modal State
  const [activeAssignDeliveryId, setActiveAssignDeliveryId] = useState<string | null>(null);
  const [assignDriverName, setAssignDriverName] = useState('S. Shanmugam');
  const [assignDriverMobile, setAssignDriverMobile] = useState('9842411999');
  const [assignVehicleNumber, setAssignVehicleNumber] = useState('TN 37 CY 8842');

  const isStatus = (current: string, target: string) =>
    (current || '').toUpperCase() === target.toUpperCase();

  const getStatusBadge = (status: DeliveryRequest['status']) => {
    const s = (status || '').toUpperCase();
    if (s === 'TRANSPORT_REQUESTED' || s === 'REQUESTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          TRANSPORT REQUESTED
        </span>
      );
    }
    if (s === 'ACCEPTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300">
          <Check className="w-3.5 h-3.5 text-blue-600" />
          ACCEPTED BY PARTNER
        </span>
      );
    }
    if (s === 'DRIVER_ASSIGNED' || s === 'PICKUP_SCHEDULED' || s === 'ASSIGNED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-300">
          <Truck className="w-3.5 h-3.5 text-indigo-600" />
          PICKUP SCHEDULED / DRIVER ASSIGNED
        </span>
      );
    }
    if (s === 'PICKED_UP') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-300">
          <Package className="w-3.5 h-3.5 text-purple-600" />
          PICKED UP AT FARM
        </span>
      );
    }
    if (s === 'IN_TRANSIT') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-900 border border-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
          IN TRANSIT
        </span>
      );
    }
    if (s === 'DELIVERED' || s === 'AWAITING_BUYER_CONFIRMATION' || s === 'REACHED_BUYER') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          DELIVERED · AWAITING BUYER CONFIRMATION
        </span>
      );
    }
    if (s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          COMPLETED & CONFIRMED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800">
        {status}
      </span>
    );
  };

  // Filter accepted / active deliveries
  const activeAndCompletedDeliveries = deliveryRequests.filter(
    d => !isStatus(d.status, 'TRANSPORT_REQUESTED') && !isStatus(d.status, 'REQUESTED') && !isStatus(d.status, 'REJECTED')
  );

  const filteredDeliveries = activeAndCompletedDeliveries.filter(d => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'SCHEDULED')
      return (
        isStatus(d.status, 'ACCEPTED') ||
        isStatus(d.status, 'DRIVER_ASSIGNED') ||
        isStatus(d.status, 'PICKUP_SCHEDULED') ||
        isStatus(d.status, 'ASSIGNED')
      );
    if (statusFilter === 'PICKED_UP') return isStatus(d.status, 'PICKED_UP');
    if (statusFilter === 'IN_TRANSIT') return isStatus(d.status, 'IN_TRANSIT');
    if (statusFilter === 'DELIVERED')
      return isStatus(d.status, 'DELIVERED') || isStatus(d.status, 'REACHED_BUYER');
    if (statusFilter === 'AWAITING_CONFIRMATION')
      return isStatus(d.status, 'AWAITING_BUYER_CONFIRMATION');
    if (statusFilter === 'COMPLETED') return isStatus(d.status, 'COMPLETED');
    return true;
  });

  const handleAssignDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignDeliveryId) return;

    assignDriverAndVehicle(
      activeAssignDeliveryId,
      assignDriverName,
      assignDriverMobile,
      assignVehicleNumber
    );
    setActiveAssignDeliveryId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-800" />
            <span>Active Produce Deliveries & Haulage Records</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Operational haulage records, driver assignments, and stage transitions
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-amber-800 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({activeAndCompletedDeliveries.length})
          </button>
          <button
            onClick={() => setStatusFilter('SCHEDULED')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'SCHEDULED'
                ? 'bg-amber-800 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pickup Scheduled
          </button>
          <button
            onClick={() => setStatusFilter('PICKED_UP')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'PICKED_UP'
                ? 'bg-amber-800 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Picked Up
          </button>
          <button
            onClick={() => setStatusFilter('IN_TRANSIT')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'IN_TRANSIT'
                ? 'bg-amber-800 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Transit
          </button>
          <button
            onClick={() => setStatusFilter('DELIVERED')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'DELIVERED'
                ? 'bg-amber-800 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'COMPLETED'
                ? 'bg-amber-800 text-white font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Delivery Cards List */}
      <div className="space-y-4">
        {filteredDeliveries.map(d => {
          const lastUpdatedNote =
            d.timeline && d.timeline.length > 0 ? d.timeline[d.timeline.length - 1] : null;

          return (
            <div
              key={d.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-extrabold text-slate-900">
                      Consignment #{d.id.toUpperCase()}
                    </span>
                    {getStatusBadge(d.status)}
                  </div>
                  <span className="text-xs font-bold text-amber-900 block mt-0.5">
                    Order / Crop: {d.quantityKg.toLocaleString('en-IN')} {d.unit || 'KG'} {d.cropName}
                    {d.orderId ? ` (Order #${d.orderId.toUpperCase()})` : ''}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block">Haulage Rate</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    ₹{d.estimatedFee.toLocaleString('en-IN')}
                  </span>
                  {lastUpdatedNote && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Updated: {lastUpdatedNote.timestamp}
                    </span>
                  )}
                </div>
              </div>

              {/* Grid: Farmer / Pickup vs Buyer / Drop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Pickup (Farmer Farm Gate)
                  </span>
                  <div className="font-bold text-slate-900">{d.farmerName}</div>
                  <p className="text-slate-700">{d.pickupLocation}</p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Scheduled Pickup Date: <strong>{d.preferredDate} ({d.preferredTime})</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                    Destination (Buyer Mandi)
                  </span>
                  <div className="font-bold text-slate-900">{d.buyerName || 'Wholesale Mandi'}</div>
                  <p className="text-slate-700">{d.dropLocation}</p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Vehicle Req: <strong>{d.vehicleRequirement || 'Produce Truck'}</strong>
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle Card */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-200 text-amber-950 font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 block">
                      Assigned Haulage Unit
                    </span>
                    <div className="font-bold text-slate-900">
                      Driver: {d.driverName || 'Unassigned'} ({d.driverMobile || 'N/A'})
                    </div>
                    <div className="text-slate-600 font-medium text-[11px]">
                      Vehicle Registration: <strong>{d.vehicleNumber || 'Unassigned'}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveAssignDeliveryId(d.id);
                    setAssignDriverName(d.driverName || 'S. Shanmugam');
                    setAssignDriverMobile(d.driverMobile || '9842411999');
                    setAssignVehicleNumber(d.vehicleNumber || 'TN 37 CY 8842');
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold cursor-pointer shrink-0"
                >
                  Change Driver / Vehicle
                </button>
              </div>

              {/* Operational Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs text-slate-600 font-medium">
                  {lastUpdatedNote ? (
                    <span>
                      Latest Stage Note: <strong className="text-slate-900">&ldquo;{lastUpdatedNote.note}&rdquo;</strong>
                    </span>
                  ) : (
                    <span>Awaiting initial pickup dispatch.</span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(!isStatus(d.status, 'PICKED_UP') &&
                    !isStatus(d.status, 'IN_TRANSIT') &&
                    !isStatus(d.status, 'DELIVERED') &&
                    !isStatus(d.status, 'COMPLETED')) && (
                    <button
                      onClick={() =>
                        updateDeliveryStatus(
                          d.id,
                          'PICKED_UP',
                          'Driver inspected and loaded crop consignment at farm gate.'
                        )
                      }
                      className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>[Confirm Pickup at Farm]</span>
                    </button>
                  )}

                  {isStatus(d.status, 'PICKED_UP') && (
                    <button
                      onClick={() =>
                        updateDeliveryStatus(
                          d.id,
                          'IN_TRANSIT',
                          'Vehicle en route on highway to buyer mandi location.'
                        )
                      }
                      className="px-4 py-2 bg-cyan-800 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>[Start Trip → In Transit]</span>
                    </button>
                  )}

                  {isStatus(d.status, 'IN_TRANSIT') && (
                    <button
                      onClick={() =>
                        updateDeliveryStatus(
                          d.id,
                          'DELIVERED',
                          'Produce arrived and unloaded at buyer location. Awaiting buyer confirmation.'
                        )
                      }
                      className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>[Mark Delivered at Destination]</span>
                    </button>
                  )}

                  {(isStatus(d.status, 'DELIVERED') || isStatus(d.status, 'AWAITING_BUYER_CONFIRMATION')) && (
                    <span className="px-3 py-1.5 bg-amber-100 text-amber-950 rounded-xl text-xs font-bold border border-amber-300">
                      ✓ Delivered · Awaiting Buyer Confirmation
                    </span>
                  )}

                  {isStatus(d.status, 'COMPLETED') && (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-950 rounded-xl text-xs font-bold border border-emerald-300">
                      ✓ Completed & Buyer Confirmed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredDeliveries.length === 0 && (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No active deliveries matching the selected filter.
          </div>
        )}
      </div>

      {/* Driver & Vehicle Assignment Modal */}
      {activeAssignDeliveryId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Assign Driver & Vehicle</h3>
              <button
                onClick={() => setActiveAssignDeliveryId(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignDriverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Driver Name</label>
                <input
                  type="text"
                  value={assignDriverName}
                  onChange={e => setAssignDriverName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Driver Mobile Number</label>
                <input
                  type="text"
                  value={assignDriverMobile}
                  onChange={e => setAssignDriverMobile(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Vehicle Registration Number</label>
                <input
                  type="text"
                  value={assignVehicleNumber}
                  onChange={e => setAssignVehicleNumber(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveAssignDeliveryId(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Confirm & Assign Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
