import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Phone,
  ArrowRight,
  Info,
  Plus,
  Check,
  X,
  UserCheck,
  Package,
  CheckCheck,
  Navigation,
  User,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { DeliveryRequest, UserRole } from '../../types';

export const LogisticsView: React.FC = () => {
  const {
    t,
    deliveryRequests,
    logisticsPartners,
    orders,
    createDeliveryRequest,
    acceptDeliveryRequest,
    assignDriverAndVehicle,
    rejectDeliveryRequest,
    updateDeliveryStatus,
    confirmBuyerProduceReceived,
    currentUser,
    currentRole,
    switchRole,
    setActiveTab,
  } = useApp();

  // Active perspective tab: 'farmer' | 'buyer' | 'logistics'
  const [activeRoleView, setActiveRoleView] = useState<UserRole>(
    currentRole === 'buyer' ? 'buyer' : currentRole === 'logistics' ? 'logistics' : 'farmer'
  );

  // Logistics partner inner sub-tab
  const [logisticsSubTab, setLogisticsSubTab] = useState<
    'requests' | 'active' | 'completed' | 'vehicles' | 'profile'
  >('requests');

  // Modal / Form state for Create Transport Request
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState('Kumar Farm, Anamalai Road, Pollachi');
  const [dropLocation, setDropLocation] = useState('Annapoorna Fresh Foods, Mettupalayam Road, Coimbatore');
  const [cropName, setCropName] = useState('Coconut');
  const [quantity, setQuantity] = useState(700);
  const [unit, setUnit] = useState('Coconuts');
  const [preferredDate, setPreferredDate] = useState('2026-10-06');
  const [preferredTime, setPreferredTime] = useState('Morning (08:30 AM)');
  const [vehicleRequirement, setVehicleRequirement] = useState('1.5-Ton Covered Produce Truck');
  const [notes, setNotes] = useState('Freshly harvested coconuts packed in crates. Requires covered truck for rain protection.');
  const [createFeedback, setCreateFeedback] = useState<string | null>(null);

  // Driver Assignment Modal State
  const [activeAssignDeliveryId, setActiveAssignDeliveryId] = useState<string | null>(null);
  const [assignDriverName, setAssignDriverName] = useState('S. Shanmugam');
  const [assignDriverMobile, setAssignDriverMobile] = useState('9842411999');
  const [assignVehicleNumber, setAssignVehicleNumber] = useState('TN 37 CY 8842');

  // Normalize status helper
  const isStatus = (current: string, target: string) => {
    return (current || '').toUpperCase() === target.toUpperCase();
  };

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
          DRIVER ASSIGNED
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
    if (s === 'REJECTED' || s === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-900 border border-rose-300">
          <X className="w-3.5 h-3.5 text-rose-600" />
          {s}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800">
        {status}
      </span>
    );
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      setCropName(ord.cropName);
      setQuantity(ord.quantityKg);
      setUnit(ord.unit || 'Coconuts');
      setDropLocation(`${ord.buyerName} Delivery Mandi`);
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = 1400;

    const res = createDeliveryRequest({
      orderId: selectedOrderId || undefined,
      pickupLocation,
      dropLocation,
      cropName,
      quantityKg: quantity,
      unit,
      preferredDate,
      preferredTime,
      vehicleRequirement,
      notes,
      estimatedFee: fee,
    });

    if (res.success) {
      setCreateFeedback(res.message);
      setTimeout(() => {
        setCreateFeedback(null);
        setShowCreateModal(false);
      }, 1400);
    }
  };

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

  // Helper timeline milestones index
  const getTimelineStepIndex = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'TRANSPORT_REQUESTED' || s === 'REQUESTED') return 0;
    if (s === 'ACCEPTED') return 1;
    if (s === 'DRIVER_ASSIGNED' || s === 'PICKUP_SCHEDULED' || s === 'ASSIGNED') return 2;
    if (s === 'PICKED_UP') return 3;
    if (s === 'IN_TRANSIT') return 4;
    if (s === 'DELIVERED' || s === 'AWAITING_BUYER_CONFIRMATION' || s === 'REACHED_BUYER') return 5;
    if (s === 'COMPLETED') return 6;
    return 0;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-amber-900/10 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Shared Farm Produce Logistics Tracking
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Single source of truth shared by Farmer, Buyer, and Logistics Partner
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Role Quick View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-2 hidden sm:inline">
            Role Perspective:
          </span>
          <button
            onClick={() => {
              setActiveRoleView('farmer');
              switchRole('farmer');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRoleView === 'farmer'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-200'
            }`}
          >
            Farmer View
          </button>
          <button
            onClick={() => {
              setActiveRoleView('buyer');
              switchRole('buyer');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRoleView === 'buyer'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-purple-900 hover:bg-slate-200'
            }`}
          >
            Buyer View
          </button>
          <button
            onClick={() => {
              setActiveRoleView('logistics');
              switchRole('logistics');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRoleView === 'logistics'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-amber-900 hover:bg-slate-200'
            }`}
          >
            Logistics Partner View
          </button>
        </div>
      </div>

      {/* No Fake GPS Policy Info Bar */}
      <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-800 shrink-0" />
          <span>
            <strong>Status-Driven Progression:</strong> Real operational status updates without fake GPS maps. Status updates sync in real time across Farmer, Buyer, and Logistics Partner consoles.
          </span>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Request Transport</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* ROLE 1: FARMER LOGISTICS VIEW                              */}
      {/* ========================================================= */}
      {activeRoleView === 'farmer' && (
        <div className="space-y-5">
          {/* Section Sub-header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Farmer Haulage & Consignment Tracking</span>
                <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                  {deliveryRequests.length} Active Shipments
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Monitor produce pickup from farm gate to buyer destination mandi
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Request Produce Transport</span>
            </button>
          </div>

          {/* Consignments List */}
          <div className="space-y-4">
            {deliveryRequests.map(delivery => {
              const currentStepIdx = getTimelineStepIndex(delivery.status);
              const partner =
                logisticsPartners.find(p => p.id === delivery.assignedPartnerId) || logisticsPartners[0];
              const lastUpdatedNote =
                delivery.timeline && delivery.timeline.length > 0
                  ? delivery.timeline[delivery.timeline.length - 1]
                  : null;

              return (
                <div
                  key={delivery.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-extrabold text-slate-900">
                          Consignment #{delivery.id.toUpperCase()}
                        </span>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <span className="text-xs font-bold text-emerald-900 block mt-0.5">
                        Crop: {delivery.quantityKg.toLocaleString('en-IN')} {delivery.unit || 'KG'} {delivery.cropName}
                        {delivery.orderId ? ` · Order #${delivery.orderId.toUpperCase()}` : ''}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-500 block">Transport Charge</span>
                      <span className="text-lg font-bold text-slate-900 tabular-nums">
                        ₹{delivery.estimatedFee.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold block">
                        Platform Fee (2%): ₹{delivery.platformFee || Math.round(delivery.estimatedFee * 0.02)}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Pickup Details */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Pickup Point (Farm Gate)
                      </span>
                      <div className="font-bold text-slate-900">{delivery.farmerName}</div>
                      <p className="text-slate-700">{delivery.pickupLocation}</p>
                      <div className="text-[11px] text-slate-500 pt-1">
                        Scheduled: <strong>{delivery.preferredDate} ({delivery.preferredTime})</strong>
                      </div>
                    </div>

                    {/* Drop Details */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                        Delivery Destination (Buyer Mandi)
                      </span>
                      <div className="font-bold text-slate-900">{delivery.buyerName || 'Wholesale Mandi'}</div>
                      <p className="text-slate-700">{delivery.dropLocation}</p>
                      <div className="text-[11px] text-slate-500 pt-1">
                        Vehicle Req: <strong>{delivery.vehicleRequirement || 'Produce Truck'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Carrier & Driver Card */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <TrustRingAvatar user={{ name: partner.companyName }} trust={partner.trust} size="md" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                          Assigned Logistics Partner
                        </span>
                        <h4 className="font-bold text-slate-900">{delivery.assignedPartnerName || partner.companyName}</h4>
                        <div className="text-slate-700 font-medium mt-0.5">
                          Driver: <strong>{delivery.driverName || partner.contactPerson}</strong> · Vehicle: <strong>{delivery.vehicleNumber || partner.vehicleNumber}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {delivery.driverMobile && (
                        <a
                          href={`tel:${delivery.driverMobile}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Driver ({delivery.driverMobile})</span>
                        </a>
                      )}
                      <a
                        href={`tel:${partner.mobile}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        <span>Call Partner</span>
                      </a>
                    </div>
                  </div>

                  {/* Status Timeline Milestone Progress Bar */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                        Haulage Milestone Progress
                      </span>
                      {lastUpdatedNote && (
                        <span className="text-[11px] text-slate-500">
                          Last Updated: <strong>{lastUpdatedNote.timestamp}</strong>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1 text-[11px]">
                      {[
                        { label: 'Requested', step: 0 },
                        { label: 'Accepted', step: 1 },
                        { label: 'Driver Assigned', step: 2 },
                        { label: 'Picked Up', step: 3 },
                        { label: 'In Transit', step: 4 },
                        { label: 'Delivered', step: 5 },
                        { label: 'Completed', step: 6 },
                      ].map((st, i) => {
                        const isDone = currentStepIdx >= st.step;
                        const isCurrent = currentStepIdx === st.step;
                        return (
                          <div
                            key={i}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center font-bold ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                                : isCurrent
                                ? 'bg-amber-100 text-amber-950 border-amber-400 animate-pulse'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            <span className="text-xs">{isDone ? '✓' : '○'}</span>
                            <span className="text-[10px] mt-0.5 leading-tight">{st.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline Logs */}
                  <div className="space-y-1 text-xs pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block">Activity Log:</span>
                    {delivery.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                        <span className="text-slate-400 tabular-nums font-mono">{item.timestamp}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-800">{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ROLE 2: BUYER DELIVERY VIEW                                */}
      {/* ========================================================= */}
      {activeRoleView === 'buyer' && (
        <div className="space-y-5">
          {/* Section Sub-header */}
          <div className="pb-2 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Buyer Incoming Produce Deliveries</span>
              <span className="text-xs bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full font-bold">
                {deliveryRequests.length} Incoming Consignments
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Track incoming produce shipments. When delivered, verify quantity and click <strong>[Confirm Produce Received]</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {deliveryRequests.map(delivery => {
              const isDeliveredState =
                isStatus(delivery.status, 'DELIVERED') ||
                isStatus(delivery.status, 'AWAITING_BUYER_CONFIRMATION') ||
                isStatus(delivery.status, 'REACHED_BUYER');
              const isCompletedState = isStatus(delivery.status, 'COMPLETED');
              const currentStepIdx = getTimelineStepIndex(delivery.status);

              return (
                <div
                  key={delivery.id}
                  className={`rounded-3xl border shadow-2xs p-6 space-y-4 ${
                    isDeliveredState
                      ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/50'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-extrabold text-slate-900">
                          Incoming Consignment #{delivery.id.toUpperCase()}
                        </span>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <span className="text-xs font-bold text-purple-900 block mt-0.5">
                        Crop: {delivery.quantityKg.toLocaleString('en-IN')} {delivery.unit || 'KG'} {delivery.cropName}
                        {delivery.orderId ? ` · Order #${delivery.orderId.toUpperCase()}` : ''}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-500 block">Farmer / Seller:</span>
                      <span className="text-sm font-bold text-slate-900">{delivery.farmerName}</span>
                      <span className="text-xs text-slate-600 block">{delivery.pickupLocation}</span>
                    </div>
                  </div>

                  {/* Logistics Carrier Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Logistics Partner</span>
                      <span className="font-bold text-slate-800">{delivery.assignedPartnerName || 'Kongu Agri Express'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Driver & Phone</span>
                      <span className="font-bold text-slate-800">{delivery.driverName || 'S. Shanmugam'} ({delivery.driverMobile || '9842411999'})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Vehicle Number</span>
                      <span className="font-bold text-slate-800">{delivery.vehicleNumber || 'TN 37 CY 8842'}</span>
                    </div>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Delivery Milestone Progress
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-[10px]">
                      {[
                        { label: 'Requested', step: 0 },
                        { label: 'Accepted', step: 1 },
                        { label: 'Driver Assigned', step: 2 },
                        { label: 'Picked Up', step: 3 },
                        { label: 'In Transit', step: 4 },
                        { label: 'Delivered', step: 5 },
                        { label: 'Completed', step: 6 },
                      ].map((st, i) => {
                        const isDone = currentStepIdx >= st.step;
                        return (
                          <div
                            key={i}
                            className={`p-1.5 rounded-lg border text-center font-bold ${
                              isDone ? 'bg-purple-100 text-purple-950 border-purple-300' : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            <span>{isDone ? '✓' : '○'} {st.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PROMINENT BUYER ACTION BUTTON FOR CONFIRM RECEIPT */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {isDeliveredState && (
                      <div className="w-full bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                            <span>Produce Delivered & Unloaded at Mandi</span>
                          </div>
                          <p className="text-xs text-emerald-800 mt-0.5">
                            Please verify crop weight & quality. Click button to complete delivery and release settlement.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            confirmBuyerProduceReceived(delivery.id);
                          }}
                          className="w-full sm:w-auto px-5 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
                        >
                          <CheckCheck className="w-4 h-4" />
                          <span>[Confirm Produce Received]</span>
                        </button>
                      </div>
                    )}

                    {isCompletedState && (
                      <div className="w-full p-3 bg-emerald-100/70 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-950 font-bold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>✓ Produce Received & Confirmed by Buyer. Order is ready for direct settlement.</span>
                        </span>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="px-3 py-1 bg-emerald-800 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Go to Settlement →
                        </button>
                      </div>
                    )}

                    {!isDeliveredState && !isCompletedState && (
                      <div className="text-xs text-slate-500 font-medium">
                        Current Status: <strong>{String(delivery.status).replace('_', ' ').toUpperCase()}</strong> · Driver en route.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ROLE 3: LOGISTICS PARTNER VIEW                             */}
      {/* ========================================================= */}
      {activeRoleView === 'logistics' && (
        <div className="space-y-5">
          {/* Section Sub-header */}
          <div className="pb-2 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Logistics Partner Operational Console</span>
              <span className="text-xs bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full font-bold">
                Annai Transport Logistics (Pollachi)
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Manage transport requests, dispatch drivers/trucks, and mark delivery milestones
            </p>
          </div>

          {/* Logistics Console Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setLogisticsSubTab('requests')}
              className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                logisticsSubTab === 'requests'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Transport Requests ({deliveryRequests.filter(d => isStatus(d.status, 'TRANSPORT_REQUESTED') || isStatus(d.status, 'REQUESTED')).length})
            </button>
            <button
              onClick={() => setLogisticsSubTab('active')}
              className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                logisticsSubTab === 'active'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Active Deliveries ({deliveryRequests.filter(d => !isStatus(d.status, 'TRANSPORT_REQUESTED') && !isStatus(d.status, 'REQUESTED') && !isStatus(d.status, 'COMPLETED') && !isStatus(d.status, 'REJECTED')).length})
            </button>
            <button
              onClick={() => setLogisticsSubTab('completed')}
              className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                logisticsSubTab === 'completed'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Completed Deliveries ({deliveryRequests.filter(d => isStatus(d.status, 'COMPLETED')).length})
            </button>
            <button
              onClick={() => setLogisticsSubTab('vehicles')}
              className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                logisticsSubTab === 'vehicles'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              My Vehicles / Drivers ({logisticsPartners.length})
            </button>
          </div>

          {/* SUBTAB 1: INCOMING TRANSPORT REQUESTS */}
          {logisticsSubTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryRequests
                .filter(d => isStatus(d.status, 'TRANSPORT_REQUESTED') || isStatus(d.status, 'REQUESTED'))
                .map(d => (
                  <div
                    key={d.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Farmer Request</span>
                        <h4 className="text-sm font-bold text-slate-900">{d.farmerName}</h4>
                        <div className="text-xs text-slate-600 mt-0.5">{d.pickupLocation}</div>
                      </div>
                      {getStatusBadge(d.status)}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Crop & Quantity:</span>
                        <span className="font-bold text-slate-800">
                          {d.quantityKg} {d.unit || 'KG'} {d.cropName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Buyer Destination:</span>
                        <span className="font-semibold text-slate-800 truncate block">{d.dropLocation}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Preferred Time:</span>
                        <span className="font-semibold text-slate-800">{d.preferredDate} ({d.preferredTime})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Transport Rate:</span>
                        <span className="font-extrabold text-emerald-800">₹{d.estimatedFee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {d.notes && <p className="text-xs text-slate-600 italic">&ldquo;{d.notes}&rdquo;</p>}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          acceptDeliveryRequest(d.id, 'log_kongu_transport');
                          setActiveAssignDeliveryId(d.id);
                        }}
                        className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Job & Assign Driver</span>
                      </button>
                      <button
                        onClick={() => rejectDeliveryRequest(d.id, 'No vehicle available on route')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

              {deliveryRequests.filter(d => isStatus(d.status, 'TRANSPORT_REQUESTED') || isStatus(d.status, 'REQUESTED')).length === 0 && (
                <div className="col-span-2 p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                  No pending transport requests at the moment.
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 2: ACTIVE DELIVERIES & DISPATCH */}
          {logisticsSubTab === 'active' && (
            <div className="space-y-4">
              {deliveryRequests
                .filter(d => !isStatus(d.status, 'TRANSPORT_REQUESTED') && !isStatus(d.status, 'REQUESTED') && !isStatus(d.status, 'COMPLETED') && !isStatus(d.status, 'REJECTED'))
                .map(d => (
                  <div
                    key={d.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-900">Consignment #{d.id.toUpperCase()}</span>
                        <div className="text-xs text-slate-600">
                          {d.farmerName} → {d.buyerName || 'Buyer Mandi'} ({d.quantityKg} {d.unit || 'KG'} {d.cropName})
                        </div>
                      </div>
                      {getStatusBadge(d.status)}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Assigned Driver:</span>
                        <span className="font-bold text-slate-800">{d.driverName || 'Not Assigned'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Driver Phone:</span>
                        <span className="font-bold text-slate-800">{d.driverMobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Vehicle Number:</span>
                        <span className="font-bold text-slate-800">{d.vehicleNumber || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => setActiveAssignDeliveryId(d.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Change Driver / Vehicle
                      </button>

                      <div className="flex items-center gap-2 flex-wrap">
                        {(!isStatus(d.status, 'PICKED_UP') && !isStatus(d.status, 'IN_TRANSIT') && !isStatus(d.status, 'DELIVERED')) && (
                          <button
                            onClick={() => updateDeliveryStatus(d.id, 'PICKED_UP', 'Driver inspected and loaded crop at farm gate.')}
                            className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                          >
                            [Confirm Pickup at Farm]
                          </button>
                        )}

                        {isStatus(d.status, 'PICKED_UP') && (
                          <button
                            onClick={() => updateDeliveryStatus(d.id, 'IN_TRANSIT', 'Vehicle en route on highway to buyer location.')}
                            className="px-3 py-1.5 bg-cyan-800 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                          >
                            [Start Trip → In Transit]
                          </button>
                        )}

                        {isStatus(d.status, 'IN_TRANSIT') && (
                          <button
                            onClick={() => updateDeliveryStatus(d.id, 'DELIVERED', 'Produce arrived and unloaded at buyer मंडी.')}
                            className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                          >
                            [Mark Delivered at Buyer Location]
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* SUBTAB 3: COMPLETED DELIVERIES */}
          {logisticsSubTab === 'completed' && (
            <div className="space-y-3">
              {deliveryRequests
                .filter(d => isStatus(d.status, 'COMPLETED'))
                .map(d => (
                  <div
                    key={d.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Consignment #{d.id.toUpperCase()}</div>
                      <div className="text-slate-600">
                        {d.quantityKg} {d.unit || 'KG'} {d.cropName} · {d.farmerName} → {d.buyerName}
                      </div>
                    </div>
                    <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-xl">
                      ✓ COMPLETED & CONFIRMED BY BUYER
                    </span>
                  </div>
                ))}
            </div>
          )}

          {/* SUBTAB 4: FLEET & VEHICLES */}
          {logisticsSubTab === 'vehicles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logisticsPartners.map(p => (
                <div key={p.id} className="p-5 bg-white rounded-3xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{p.companyName}</h4>
                    <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      {p.trust.title}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Lead: <strong>{p.contactPerson}</strong> ({p.mobile})
                  </div>
                  <div className="text-xs text-slate-800 font-semibold">
                    Vehicle: {p.vehicleType} · Reg: {p.vehicleNumber}
                  </div>
                  <div className="text-xs text-slate-500">
                    Capacity: {p.capacityKg.toLocaleString('en-IN')} KG · Districts: {p.serviceDistricts.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: REQUEST TRANSPORT FORM                           */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-xl w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Request Produce Transport</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              {orders.length > 0 && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Link to Crop Order (Optional):
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={e => handleOrderSelect(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="">-- Manual Entry / Custom Transport --</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>
                        Order #{o.id.toUpperCase()} - {o.cropName} ({o.quantityKg} {o.unit || 'KG'}) → {o.buyerName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Delivery Destination</label>
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={e => setDropLocation(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Crop</label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={e => setCropName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Coconuts">Coconuts</option>
                    <option value="KG">KG</option>
                    <option value="Quintals">Quintals</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Vehicle Type</label>
                <select
                  value={vehicleRequirement}
                  onChange={e => setVehicleRequirement(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                >
                  <option value="1.5-Ton Covered Produce Truck">1.5-Ton Covered Produce Truck (Bolero / Dost)</option>
                  <option value="3.5-Ton Covered Mandi Carrier">3.5-Ton Covered Mandi Carrier</option>
                  <option value="Tractor Farm Trailer (Short Haul)">Tractor Farm Trailer (Short Haul)</option>
                  <option value="Refrigerated Van (Perishables)">Refrigerated Van (Perishables)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-950">
                <div>
                  <span className="text-[10px] text-emerald-800 block">Estimated Haulage Rate:</span>
                  <span className="text-base font-bold">₹1,400</span>
                </div>
                <div className="text-right text-[11px] text-emerald-800">
                  <span className="block font-semibold">Platform Service Fee (2%): ₹28</span>
                  <span>Payment settled upon buyer delivery receipt</span>
                </div>
              </div>

              {createFeedback && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl font-bold text-center">
                  {createFeedback}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Submit Transport Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ASSIGN DRIVER & VEHICLE                           */}
      {/* ========================================================= */}
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
