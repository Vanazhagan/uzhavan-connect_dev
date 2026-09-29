import React from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  User,
  UserCheck,
  ArrowRight,
  Play,
  ShieldCheck,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';

export const WorkerDashboard: React.FC = () => {
  const {
    currentUser,
    switchRole,
    labourRequirements,
    workerBookings,
    setActiveTab,
    updateWorkerBookingStatus,
  } = useApp();

  // Counts for dashboard metrics
  const availableJobsCount = labourRequirements.length;
  
  const confirmedBookings = workerBookings.filter(
    b => b.status === 'confirmed' || b.status === 'accepted'
  );
  const confirmedBookingsCount = confirmedBookings.length;

  const inProgressBookings = workerBookings.filter(
    b => b.status === 'in_progress' || b.status === 'work_started'
  );
  const inProgressCount = inProgressBookings.length;

  const completedBookings = workerBookings.filter(b => b.status === 'completed');
  const completedJobsCount = completedBookings.length;

  // Find upcoming confirmed booking (or in-progress if available)
  const upcomingBooking =
    inProgressBookings[0] ||
    confirmedBookings[0] ||
    workerBookings.find(b => b.status === 'requested');

  return (
    <div className="space-y-6 pb-12">
      {/* Worker Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-amber-900/10 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <TrustRingAvatar user={currentUser} size="lg" interactive={true} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Labour Team Leader
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {currentUser.taluk ? `${currentUser.taluk}, ` : ''}{currentUser.district}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {currentUser.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                {currentUser.mobile && (
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Phone className="w-3 h-3 text-slate-400" />
                    +91 {currentUser.mobile}
                  </span>
                )}
                <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Uzhavan Partner
                </span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => switchRole('farmer')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-300"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Switch to Farmer View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bar / Count Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Available Jobs */}
        <div
          onClick={() => setActiveTab('jobRequests')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Jobs</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {availableJobsCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Browse <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Farmer-posted field openings</p>
        </div>

        {/* Card 2: Confirmed Bookings */}
        <div
          onClick={() => setActiveTab('bookings')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Confirmed Bookings</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tabular-nums">
              {confirmedBookingsCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Ready for field execution</p>
        </div>

        {/* Card 3: In Progress */}
        <div
          onClick={() => setActiveTab('bookings')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 tabular-nums">
              {inProgressCount}
            </span>
            <span className="text-[11px] font-bold text-blue-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Active ongoing farm jobs</p>
        </div>

        {/* Card 4: Completed Jobs */}
        <div
          onClick={() => setActiveTab('bookings')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Jobs</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {completedJobsCount}
            </span>
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Finished & direct settled</p>
        </div>
      </div>

      {/* Upcoming Confirmed Booking Card */}
      <div className="bg-white rounded-3xl border border-amber-900/10 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Upcoming Confirmed Booking</h3>
          </div>
          {upcomingBooking && (
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline underline-offset-2 cursor-pointer"
            >
              View All Bookings
            </button>
          )}
        </div>

        {upcomingBooking ? (
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <TrustRingAvatar
                  user={{ name: upcomingBooking.farmerName }}
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
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {upcomingBooking.farmLocation}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {upcomingBooking.farmerName}
                  </h4>
                  {upcomingBooking.farmerMobile && (
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>+91 {upcomingBooking.farmerMobile}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    upcomingBooking.status === 'in_progress' || upcomingBooking.status === 'work_started'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : upcomingBooking.status === 'confirmed' || upcomingBooking.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {upcomingBooking.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Ref: #{upcomingBooking.id}
                </span>
              </div>
            </div>

            {/* Grid specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Work Type</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {upcomingBooking.workType}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Scheduled Date</span>
                <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  {upcomingBooking.date}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Shift Time</span>
                <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  {upcomingBooking.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Workers & Total Wage</span>
                <span className="font-extrabold text-emerald-800 tabular-nums mt-0.5 block">
                  {upcomingBooking.workersRequired} Workers (₹{upcomingBooking.totalCharge.toLocaleString('en-IN')})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
              <span className="text-xs text-slate-600">
                Crop: <strong className="text-slate-800">{upcomingBooking.crop || 'Coconut / Farm Crop'}</strong>
              </span>
              <button
                onClick={() => setActiveTab('bookings')}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-emerald-200" />
                <span>Go to Worker Bookings</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Upcoming Confirmed Booking</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You do not have any confirmed worker bookings right now. Check available farmer jobs to submit team interest.
            </p>
            <button
              onClick={() => setActiveTab('jobRequests')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-200" />
              <span>Browse Open Labour Jobs</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Browse Jobs */}
          <button
            onClick={() => setActiveTab('jobRequests')}
            className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all text-left cursor-pointer group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                <span>Browse Jobs</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Apply to farmer-posted field labour requirements
              </p>
            </div>
          </button>

          {/* Action 2: My Bookings */}
          <button
            onClick={() => setActiveTab('bookings')}
            className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all text-left cursor-pointer group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                <span>My Bookings</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage service contracts, confirmations & execution
              </p>
            </div>
          </button>

          {/* Action 3: Farm Calendar */}
          <button
            onClick={() => setActiveTab('calendar')}
            className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all text-left cursor-pointer group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                <span>Farm Calendar</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                View scheduled harvesting dates & field commitments
              </p>
            </div>
          </button>

          {/* Action 4: My Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className="p-4 bg-white rounded-2xl border border-amber-900/10 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all text-left cursor-pointer group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-purple-800" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                <span>My Profile</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Update team capacity, daily rates & trust ring
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
