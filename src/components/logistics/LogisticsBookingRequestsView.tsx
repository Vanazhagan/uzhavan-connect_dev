import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Check,
  X,
  Truck,
  User,
  ShieldCheck,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LogisticsBookingRequestsView: React.FC = () => {
  const {
    deliveryRequests,
    acceptDeliveryRequest,
    rejectDeliveryRequest,
    assignDriverAndVehicle,
  } = useApp();

  // Driver Assignment Modal State
  const [activeAssignDeliveryId, setActiveAssignDeliveryId] = useState<string | null>(null);
  const [assignDriverName, setAssignDriverName] = useState('S. Shanmugam');
  const [assignDriverMobile, setAssignDriverMobile] = useState('9842411999');
  const [assignVehicleNumber, setAssignVehicleNumber] = useState('TN 37 CY 8842');

  const isStatus = (current: string, target: string) =>
    (current || '').toUpperCase() === target.toUpperCase();

  // Incoming pending requests
  const pendingRequests = deliveryRequests.filter(
    d => isStatus(d.status, 'TRANSPORT_REQUESTED') || isStatus(d.status, 'REQUESTED')
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-800" />
            <span>Incoming Farm Transport Requests</span>
            <span className="text-xs bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full font-bold">
              {pendingRequests.length} Pending
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Farmer haulage requests requiring carrier acceptance and driver dispatch
          </p>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingRequests.map(d => (
          <div
            key={d.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Transport Booking Request #{d.id.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-slate-900">{d.farmerName}</h3>
                <span className="text-xs font-semibold text-emerald-800 block">
                  Crop: {d.quantityKg.toLocaleString('en-IN')} {d.unit || 'KG'} {d.cropName}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                PENDING ACCEPTANCE
              </span>
            </div>

            {/* Route & Schedule Info */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Pickup Location (Farm Gate)
                  </span>
                  <p className="text-slate-800 font-medium truncate">{d.pickupLocation}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-purple-800 uppercase block">
                    Delivery Destination (Buyer Mandi)
                  </span>
                  <p className="text-slate-800 font-medium truncate">{d.dropLocation}</p>
                  <span className="text-[10px] text-slate-500 block">
                    Buyer: <strong>{d.buyerName || 'Wholesale Mandi'}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Required Date & Time:</span>
                  <span className="font-bold text-slate-800">
                    {d.preferredDate} ({d.preferredTime})
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Estimated Haulage Rate:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    ₹{d.estimatedFee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {d.vehicleRequirement && (
                <div className="text-[11px] text-slate-600 font-medium">
                  Vehicle Requirement: <strong>{d.vehicleRequirement}</strong>
                </div>
              )}

              {d.notes && (
                <div className="text-[11px] text-slate-600 italic bg-white p-2 rounded-xl border border-slate-200">
                  &ldquo;{d.notes}&rdquo;
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  acceptDeliveryRequest(d.id, 'log_kongu_transport');
                  setActiveAssignDeliveryId(d.id);
                }}
                className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Accept Request & Assign Driver</span>
              </button>

              <button
                onClick={() => rejectDeliveryRequest(d.id, 'No vehicle available on specified date')}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {pendingRequests.length === 0 && (
          <div className="col-span-2 p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            No incoming transport requests at the moment. Accepted bookings appear under Deliveries tab.
          </div>
        )}
      </div>

      {/* Assign Driver & Vehicle Modal */}
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
