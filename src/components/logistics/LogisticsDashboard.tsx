import React from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  UserCheck,
  MapPin,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Navigation,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LogisticsDashboard: React.FC = () => {
  const {
    deliveryRequests,
    logisticsPartners,
    setActiveTab,
    currentUser,
  } = useApp();

  const isStatus = (current: string, target: string) =>
    (current || '').toUpperCase() === target.toUpperCase();

  // Metrics
  const pendingRequestsCount = deliveryRequests.filter(
    d => isStatus(d.status, 'TRANSPORT_REQUESTED') || isStatus(d.status, 'REQUESTED')
  ).length;

  const activeDeliveries = deliveryRequests.filter(
    d =>
      !isStatus(d.status, 'TRANSPORT_REQUESTED') &&
      !isStatus(d.status, 'REQUESTED') &&
      !isStatus(d.status, 'COMPLETED') &&
      !isStatus(d.status, 'REJECTED') &&
      !isStatus(d.status, 'CANCELLED')
  );

  const activeDeliveriesCount = activeDeliveries.length;

  const inTransitCount = deliveryRequests.filter(d => isStatus(d.status, 'IN_TRANSIT')).length;

  const deliveredTodayCount = deliveryRequests.filter(
    d => isStatus(d.status, 'DELIVERED') || isStatus(d.status, 'COMPLETED')
  ).length;

  // Partner Fleet details
  const currentPartner = logisticsPartners[0] || {
    companyName: 'Annai Transport Logistics',
    contactPerson: 'K. Senthil Kumar',
    mobile: '9842211000',
    vehicleType: '1.5 Ton Covered Truck',
    vehicleNumber: 'TN 37 CY 8842',
    capacityKg: 3500,
  };

  const availableDriversCount = 4;
  const availableVehiclesCount = 3;

  // Next pickup
  const nextPickup = deliveryRequests.find(
    d => isStatus(d.status, 'TRANSPORT_REQUESTED') || isStatus(d.status, 'ACCEPTED') || isStatus(d.status, 'PICKUP_SCHEDULED')
  );

  // Recent activity aggregated from all timelines
  const recentActivities = deliveryRequests
    .flatMap(d =>
      (d.timeline || []).map(t => ({
        deliveryId: d.id,
        cropName: d.cropName,
        farmerName: d.farmerName,
        buyerName: d.buyerName,
        timestamp: t.timestamp,
        note: t.note,
        status: t.status,
      }))
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-emerald-900 p-6 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
              Logistics Partner Portal
            </span>
            <span className="text-xs text-amber-200">Verified Carrier</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{currentPartner.companyName}</h1>
          <p className="text-xs text-amber-100/90 mt-1">
            Haulage Operations Dashboard · Pollachi & Coimbatore Region
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>View Transport Requests ({pendingRequestsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('deliveryRequests')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Active Shipments</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl">
          <span className="text-[11px] font-extrabold text-amber-900 uppercase block">Pending Requests</span>
          <div className="text-2xl font-black text-amber-950 mt-1">{pendingRequestsCount}</div>
          <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">Awaiting Acceptance</span>
        </div>

        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
          <span className="text-[11px] font-extrabold text-emerald-900 uppercase block">Active Deliveries</span>
          <div className="text-2xl font-black text-emerald-950 mt-1">{activeDeliveriesCount}</div>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">Dispatched / En Route</span>
        </div>

        <div className="p-4 bg-cyan-50/80 border border-cyan-200 rounded-2xl">
          <span className="text-[11px] font-extrabold text-cyan-900 uppercase block">In Transit</span>
          <div className="text-2xl font-black text-cyan-950 mt-1">{inTransitCount}</div>
          <span className="text-[10px] text-cyan-800 font-semibold block mt-0.5">On Highway</span>
        </div>

        <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl">
          <span className="text-[11px] font-extrabold text-purple-900 uppercase block">Delivered Today</span>
          <div className="text-2xl font-black text-purple-950 mt-1">{deliveredTodayCount}</div>
          <span className="text-[10px] text-purple-800 font-semibold block mt-0.5">Completed at Mandi</span>
        </div>

        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl">
          <span className="text-[11px] font-extrabold text-blue-900 uppercase block">Available Drivers</span>
          <div className="text-2xl font-black text-blue-950 mt-1">{availableDriversCount}</div>
          <span className="text-[10px] text-blue-800 font-semibold block mt-0.5">Ready for Dispatch</span>
        </div>

        <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
          <span className="text-[11px] font-extrabold text-slate-700 uppercase block">Available Fleet</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{availableVehiclesCount}</div>
          <span className="text-[10px] text-slate-600 font-semibold block mt-0.5">Trucks & Trailers</span>
        </div>
      </div>

      {/* Main Grid: Next Pickup & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Scheduled Pickup & Quick Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Scheduled Pickup Highlight */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Next Scheduled Farm Pickup</h3>
                  <p className="text-xs text-slate-500">Immediate priority consignment</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs text-emerald-800 font-bold hover:underline"
              >
                View All Requests →
              </button>
            </div>

            {nextPickup ? (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Consignment #{nextPickup.id.toUpperCase()} · {nextPickup.quantityKg} {nextPickup.unit || 'KG'} {nextPickup.cropName}
                    </span>
                    <span className="text-xs text-slate-600">
                      Farmer: <strong>{nextPickup.farmerName}</strong>
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-200 text-amber-950 font-extrabold text-[11px] rounded-lg">
                    Rate: ₹{nextPickup.estimatedFee.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-amber-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Pickup Location</span>
                    <p className="text-slate-800 font-medium truncate">{nextPickup.pickupLocation}</p>
                    <span className="text-[11px] text-emerald-800 font-bold mt-1 block">
                      Scheduled: {nextPickup.preferredDate} ({nextPickup.preferredTime})
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-amber-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Drop Destination</span>
                    <p className="text-slate-800 font-medium truncate">{nextPickup.dropLocation}</p>
                    <span className="text-[11px] text-purple-800 font-bold mt-1 block">
                      Buyer: {nextPickup.buyerName || 'Wholesale Mandi'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
                  >
                    Manage Request & Assign Driver →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                No scheduled pickups pending. Check back soon for new farmer haulage requests!
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Operational Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('bookings')}
                className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Accept Transport Requests
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Review {pendingRequestsCount} incoming haulage requests
                </p>
              </button>

              <button
                onClick={() => setActiveTab('deliveryRequests')}
                className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
                  <Truck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Update Trip Status
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mark Picked Up, In Transit, or Delivered
                </p>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Manage Drivers & Fleet
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Update vehicles, drivers & service areas
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Activity Stream */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Recent Activity Stream</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((act, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      #{act.deliveryId.toUpperCase()} · {act.cropName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-700">{act.note}</p>
                  <div className="text-[10px] text-slate-500">
                    {act.farmerName} → {act.buyerName || 'Mandi'}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">No recent activity recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
