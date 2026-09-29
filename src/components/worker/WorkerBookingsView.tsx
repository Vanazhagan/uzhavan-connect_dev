import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  Play,
  Briefcase,
  Phone,
  ShieldCheck,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { WorkerBooking } from '../../types';

export const WorkerBookingsView: React.FC = () => {
  const {
    workerBookings,
    acceptWorkerBooking,
    rejectWorkerBooking,
    updateWorkerBookingStatus,
    currentUser,
    currentRole,
    switchRole,
    t,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'requested' | 'confirmed' | 'in_progress' | 'completed'>('all');
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null);

  // Filter bookings for worker view (or show all worker service bookings for easy testing)
  const myBookings = workerBookings;

  const filteredBookings = myBookings.filter(b => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'in_progress') return b.status === 'in_progress' || b.status === 'work_started';
    return b.status === statusFilter;
  });

  const counts = {
    all: myBookings.length,
    requested: myBookings.filter(b => b.status === 'requested').length,
    confirmed: myBookings.filter(b => b.status === 'confirmed').length,
    in_progress: myBookings.filter(b => b.status === 'in_progress' || b.status === 'work_started').length,
    completed: myBookings.filter(b => b.status === 'completed').length,
  };

  const handleStartWork = (bookingId: string) => {
    updateWorkerBookingStatus(bookingId, 'in_progress');
    setFeedback({ id: bookingId, type: 'success', message: 'Work started! Status updated to IN PROGRESS.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCompleteWork = (bookingId: string) => {
    updateWorkerBookingStatus(bookingId, 'completed');
    setFeedback({ id: bookingId, type: 'success', message: 'Work completed successfully! Farm job closed.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAccept = (bookingId: string) => {
    acceptWorkerBooking(bookingId);
    setFeedback({ id: bookingId, type: 'success', message: 'Booking confirmed! Synced to farm calendar.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReject = (bookingId: string) => {
    rejectWorkerBooking(bookingId, 'Team unavailable on requested date.');
    setFeedback({ id: bookingId, type: 'success', message: 'Booking declined.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const getStatusBadge = (status: WorkerBooking['status']) => {
    switch (status) {
      case 'requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            REQUESTED
          </span>
        );
      case 'confirmed':
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-600" />
            CONFIRMED
          </span>
        );
      case 'in_progress':
      case 'work_started':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            IN PROGRESS
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 text-slate-600" />
            COMPLETED
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <X className="w-3 h-3 text-rose-600" />
            {status.toUpperCase()}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Worker Service Bookings
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {myBookings.length} Total Bookings
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage incoming farmer service contracts, confirm assignments, and advance execution status.
          </p>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole('farmer')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-300"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Switch to Farmer View</span>
          </button>
        </div>
      </div>

      {/* Direct Settlement Notice */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Worker Protection Model:</strong> Direct farm wage payment upon completion. Advance booking status from Confirmed → In Progress → Completed.
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200 shrink-0">
          2% Booking Fee
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs scrollbar-none">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>All Bookings</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('requested')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'requested'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Requested (Pending Acceptance)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
            {counts.requested}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'confirmed'
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Confirmed (Ready for Field)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-900 font-bold">
            {counts.confirmed}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'in_progress'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>In Progress</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-900 font-bold">
            {counts.in_progress}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'completed'
              ? 'bg-slate-700 text-white'
              : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
            {counts.completed}
          </span>
        </button>
      </div>

      {/* Global feedback message */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              : 'bg-rose-100 text-rose-900 border border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bookings Feed */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Bookings in this Category</h4>
            <p className="text-xs text-slate-500">
              When farmers request your team or confirm you for open requirements, they will appear here.
            </p>
          </div>
        ) : (
          filteredBookings.map(b => {
            const isConfirmed = b.status === 'confirmed' || b.status === 'accepted';
            const isInProgress = b.status === 'in_progress' || b.status === 'work_started';
            const isCompleted = b.status === 'completed';
            const isRequested = b.status === 'requested';

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 sm:p-6 space-y-4 hover:border-emerald-300 transition-colors"
              >
                {/* Header: Farmer info & status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <TrustRingAvatar
                      user={{ name: b.farmerName }}
                      trust={{
                        level: 'star',
                        title: 'Verified Farmer Producer',
                        completedTransactions: 52,
                        fulfilmentRate: 99,
                        isVerified: true,
                        positiveFeedbackScore: 4.95,
                        cancellationRate: 0.5,
                        reasons: ['Verified Farm Landholder', 'Prompt Direct Wage Settlement'],
                      }}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Farmer Client
                        </span>
                        <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-700" />
                          {b.farmLocation}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{b.farmerName}</h4>
                      {b.farmerMobile && (
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>+91 {b.farmerMobile}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1.5">
                    {getStatusBadge(b.status)}
                    <span className="text-xs font-semibold text-slate-500 tabular-nums">
                      Ref: #{b.id}
                    </span>
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Work Type</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{b.workType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Scheduled Date</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      {b.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Shift Time</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      {b.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Workers & Total Wage</span>
                    <span className="font-extrabold text-emerald-800 tabular-nums mt-0.5 block">
                      {b.workersRequired} Workers (₹{b.totalCharge.toLocaleString('en-IN')})
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {b.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                    <strong>Farm Notes:</strong> &ldquo;{b.notes}&rdquo;
                  </p>
                )}

                {/* Action Controls for Worker Lifecycle Flow */}
                <div className="pt-2 border-t border-slate-100">
                  {/* Flow 1: Farmer requested -> Worker accepts or declines */}
                  {isRequested && (
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-xs text-amber-900 font-medium">
                        Farmer requested your team for this date. Accept to confirm booking.
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(b.id)}
                          className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Decline Request
                        </button>
                        <button
                          onClick={() => handleAccept(b.id)}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Flow 2: Confirmed -> Worker starts work */}
                  {isConfirmed && (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-xs text-emerald-950 font-medium">
                        ✓ Booking Confirmed. Arrive at {b.farmLocation} on {b.date}.
                      </div>
                      <button
                        onClick={() => handleStartWork(b.id)}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Start Work (Begin Field Job)</span>
                      </button>
                    </div>
                  )}

                  {/* Flow 3: In Progress -> Worker completes work */}
                  {isInProgress && (
                    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-xs text-blue-950 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span>Work currently in progress on farm field.</span>
                      </div>
                      <button
                        onClick={() => handleCompleteWork(b.id)}
                        className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                        <span>Complete Work</span>
                      </button>
                    </div>
                  )}

                  {/* Flow 4: Completed */}
                  {isCompleted && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Harvesting and farm work completed successfully.</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        ₹{b.totalCharge.toLocaleString('en-IN')} Settled Directly
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
