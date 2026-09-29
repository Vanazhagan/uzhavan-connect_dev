import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  User,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  Play,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MachineryBooking } from '../../types';

export const MachineryBookingRequestsView: React.FC = () => {
  const {
    currentUser,
    machineryBookings,
    acceptMachineryBooking,
    rejectMachineryBooking,
    updateMachineryBookingStatus,
    language,
  } = useApp();

  const isTa = language === 'ta';
  const [activeFilter, setActiveTabFilter] = useState<'all' | 'requested' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Filter provider bookings
  const providerBookings =
    currentUser.role === 'machinery' || currentUser.id === 'prov_ravi_machinery'
      ? machineryBookings
      : machineryBookings.filter(
          b =>
            b.providerId === currentUser.id ||
            b.providerId === 'prov_ravi_machinery' ||
            b.providerName.toLowerCase().includes(currentUser.name.toLowerCase())
        );

  const filteredBookings = providerBookings.filter(b => {
    if (activeFilter === 'requested') return b.status === 'requested';
    if (activeFilter === 'confirmed')
      return (
        b.status === 'confirmed' ||
        b.status === 'accepted' ||
        b.status === 'dispatched' ||
        b.status === 'arrived' ||
        b.status === 'in_progress' ||
        b.status === 'in_service'
      );
    if (activeFilter === 'completed') return b.status === 'completed';
    if (activeFilter === 'cancelled') return b.status === 'rejected' || b.status === 'cancelled';
    return true;
  });

  const pendingCount = providerBookings.filter(b => b.status === 'requested').length;
  const activeCount = providerBookings.filter(
    b =>
      b.status === 'confirmed' ||
      b.status === 'accepted' ||
      b.status === 'dispatched' ||
      b.status === 'arrived' ||
      b.status === 'in_progress' ||
      b.status === 'in_service'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-600" />
                <span>{isTa ? 'இயந்திர முன்பதிவு கோரிக்கைகள்' : 'Machinery Rental Booking Requests'}</span>
              </h1>
              {pendingCount > 0 && (
                <span className="bg-rose-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                  {pendingCount} {isTa ? 'நிலுவை' : 'Pending'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {isTa
                ? 'விவசாயிகளிடமிருந்து வரும் இயந்திர வாடகை முன்பதிவு கோரிக்கைகளை ஆய்வு செய்து ஏற்கவும்.'
                : 'Review incoming rental requests, dispatch machinery, and manage field service progression.'}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isTa ? 'அனைத்தும்' : 'All Bookings'} ({providerBookings.length})
          </button>

          <button
            onClick={() => setActiveTabFilter('requested')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'requested'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>{isTa ? 'புதிய கோரிக்கைகள்' : 'Pending Requests'}</span>
            {pendingCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTabFilter('confirmed')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'confirmed'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isTa ? 'உறுதிப்படுத்தப்பட்டவை & செயல்பாட்டில்' : 'Confirmed & Active'} ({activeCount})
          </button>

          <button
            onClick={() => setActiveTabFilter('completed')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'completed'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isTa ? 'நிறைவு பெற்றவை' : 'Completed'}
          </button>

          <button
            onClick={() => setActiveTabFilter('cancelled')}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'cancelled'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isTa ? 'நிராகரிக்கப்பட்டவை' : 'Declined / Cancelled'}
          </button>
        </div>
      </div>

      {/* Booking Cards Stream */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const isPending = booking.status === 'requested';
            const isConfirmed = booking.status === 'confirmed' || booking.status === 'accepted';
            const isDispatched = booking.status === 'dispatched';
            const isArrived = booking.status === 'arrived';
            const isInProgress = booking.status === 'in_progress' || booking.status === 'in_service';
            const isCompleted = booking.status === 'completed';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4 hover:shadow-md transition-all"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80">
                      <Truck className="w-6 h-6 text-amber-800" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-slate-900">
                          {booking.machineName}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : isCompleted
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}>
                          {booking.status.replaceAll('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isTa ? 'நோக்கம்:' : 'Purpose:'} <strong className="text-slate-800">{booking.workPurpose || 'Agricultural Field Operations'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{isTa ? 'வாடகைத் தொகை' : 'Estimated Value'}</span>
                    <span className="text-lg font-black text-emerald-800">
                      ₹{booking.estimatedCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'விவசாயி' : 'Farmer'}</span>
                      <strong className="text-slate-900 truncate block">{booking.farmerName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'தொலைபேசி' : 'Phone'}</span>
                      <strong className="text-slate-900">{booking.farmerMobile || '+91 98422 10450'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'தேதி & நேரம்' : 'Date & Slot'}</span>
                      <strong className="text-slate-900">{booking.date} ({booking.timeSlot})</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'அமைவிடம்' : 'Farm Location'}</span>
                      <strong className="text-slate-900 truncate block">{booking.farmerLocation}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    {booking.notes && <span>Note: {booking.notes}</span>}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isPending && (
                      <>
                        <button
                          onClick={() => rejectMachineryBooking(booking.id)}
                          className="flex-1 sm:flex-initial py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          {isTa ? 'நிராகரி' : 'Decline'}
                        </button>
                        <button
                          onClick={() => acceptMachineryBooking(booking.id)}
                          className="flex-1 sm:flex-initial py-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4 text-amber-300" />
                          <span>{isTa ? 'கோரிக்கையை ஏற்றுக்கொள்' : 'Accept Rental Request'}</span>
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <button
                        onClick={() => updateMachineryBookingStatus(booking.id, 'dispatched')}
                        className="w-full sm:w-auto py-2 px-4 bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-amber-300" />
                        <span>{isTa ? 'இயந்திரத்தை அனுப்பு (Dispatch)' : 'Dispatch Machine to Farm'}</span>
                      </button>
                    )}

                    {isDispatched && (
                      <button
                        onClick={() => updateMachineryBookingStatus(booking.id, 'arrived')}
                        className="w-full sm:w-auto py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-amber-300" />
                        <span>{isTa ? 'பண்ணையை அடைந்தது (Mark Arrived)' : 'Mark Arrived at Farm'}</span>
                      </button>
                    )}

                    {isArrived && (
                      <button
                        onClick={() => updateMachineryBookingStatus(booking.id, 'in_progress')}
                        className="w-full sm:w-auto py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-4 h-4 text-amber-300" />
                        <span>{isTa ? 'வேலையைத் தொடங்கு (Start Work)' : 'Start Field Operation'}</span>
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => updateMachineryBookingStatus(booking.id, 'completed')}
                        className="w-full sm:w-auto py-2 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCheck className="w-4 h-4 text-amber-300" />
                        <span>{isTa ? 'சேவையை நிறைவு செய் (Complete)' : 'Complete Service'}</span>
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isTa ? 'சேவை வெற்றிகரமாக முடிந்தது' : 'Service Completed & Verified'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {isTa ? 'கோரிக்கைகள் எதுவும் இல்லை' : 'No Booking Requests Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isTa
              ? 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டியில் கோரிக்கைகள் எதுவும் கிடைக்கவில்லை.'
              : 'There are no booking requests matching the selected filter.'}
          </p>
        </div>
      )}
    </div>
  );
};
