import React from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  User,
  Phone,
  ShieldCheck,
  PlusCircle,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { getFallbackMachineryImage } from '../../data/machineryCatalogue';

export const MachineryProviderDashboard: React.FC = () => {
  const {
    currentUser,
    machinery,
    machineryBookings,
    setActiveTab,
    language,
  } = useApp();

  const isTa = language === 'ta';

  // Provider's machine fleet
  const providerMachines =
    currentUser.role === 'machinery' || currentUser.id === 'prov_ravi_machinery'
      ? machinery
      : machinery.filter(
          m =>
            m.providerId === currentUser.id ||
            m.providerId === 'prov_ravi_machinery' ||
            m.providerName.toLowerCase().includes(currentUser.name.toLowerCase())
        );

  // Provider's bookings
  const providerBookings =
    currentUser.role === 'machinery' || currentUser.id === 'prov_ravi_machinery'
      ? machineryBookings
      : machineryBookings.filter(
          b =>
            b.providerId === currentUser.id ||
            b.providerId === 'prov_ravi_machinery' ||
            b.providerName.toLowerCase().includes(currentUser.name.toLowerCase())
        );

  // Metric counts
  const requestedCount = providerBookings.filter(b => b.status === 'requested').length;
  const confirmedCount = providerBookings.filter(
    b => b.status === 'confirmed' || b.status === 'accepted'
  ).length;
  const inProgressCount = providerBookings.filter(
    b =>
      b.status === 'dispatched' ||
      b.status === 'arrived' ||
      b.status === 'in_progress' ||
      b.status === 'in_service'
  ).length;
  const completedCount = providerBookings.filter(b => b.status === 'completed').length;
  const totalFleetCount = providerMachines.length;

  // Next upcoming service
  const upcomingBooking = providerBookings.find(
    b =>
      b.status === 'requested' ||
      b.status === 'confirmed' ||
      b.status === 'accepted' ||
      b.status === 'dispatched' ||
      b.status === 'arrived' ||
      b.status === 'in_progress'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-emerald-400 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <TrustRingAvatar
              user={currentUser}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {currentUser.name}
                </h1>
                <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  {isTa ? 'சரிபார்க்கப்பட்ட இயந்திர உரிமையாளர்' : 'Verified Equipment Owner'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
                {currentUser.businessName || 'Ravi Agricultural Machinery Hub'} · {currentUser.district}, Tamil Nadu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('bookingRequests')}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>{isTa ? 'கோரிக்கைகள் பார்க்க' : 'Booking Requests'}</span>
              {requestedCount > 0 && (
                <span className="bg-rose-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                  {requestedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('myMachinery')}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-amber-300" />
              <span>{isTa ? 'எனது இயந்திரங்கள்' : 'My Fleet'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => setActiveTab('bookingRequests')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'புதிய கோரிக்கைகள்' : 'Pending Requests'}</span>
            <div className="p-2 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{requestedCount}</div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            {requestedCount > 0 ? (isTa ? 'ஏற்க காத்திருக்கிறது' : 'Awaiting confirmation') : (isTa ? 'எதுவுமில்லை' : 'All clear')}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('bookingRequests')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'உறுதி செய்யப்பட்டது' : 'Confirmed'}</span>
            <div className="p-2 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{confirmedCount}</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {isTa ? 'அட்டவணைப்படுத்தப்பட்டது' : 'Scheduled in calendar'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('bookingRequests')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'செயல்பாட்டில்' : 'In Progress'}</span>
            <div className="p-2 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{inProgressCount}</div>
          <p className="text-[11px] text-blue-700 font-medium mt-1">
            {isTa ? 'பயணிக்கும் / வேலை' : 'Active field work'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('bookingRequests')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'நிறைவு பெற்றவை' : 'Completed'}</span>
            <div className="p-2 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{completedCount}</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {isTa ? 'மொத்த சேவைகள்' : 'Verified jobs done'}
          </p>
        </div>

        <div
          onClick={() => setActiveTab('myMachinery')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'இயந்திரப் படை' : 'Total Fleet'}</span>
            <div className="p-2 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4 text-amber-800" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalFleetCount}</div>
          <p className="text-[11px] text-amber-800 font-medium mt-1">
            {isTa ? 'கிடைக்கும் இயந்திரங்கள்' : 'Active machines listed'}
          </p>
        </div>
      </div>

      {/* Main Content Grid: Upcoming Booking & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Upcoming Service */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>{isTa ? 'அடுத்த வரவிருக்கும் சேவை' : 'Next Upcoming Rental Service'}</span>
            </h2>
            <button
              onClick={() => setActiveTab('bookingRequests')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span>{isTa ? 'அனைத்தும் பார்க்க' : 'View All Bookings'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingBooking ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
                    upcomingBooking.status === 'requested'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : upcomingBooking.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}>
                    {upcomingBooking.status.replaceAll('_', ' ')}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {upcomingBooking.machineName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">{isTa ? 'மதிப்பிடப்பட்ட தொகை' : 'Estimated Value'}</span>
                  <div className="text-lg font-black text-emerald-800">
                    ₹{upcomingBooking.estimatedCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'விவசாயி' : 'Farmer Name'}</span>
                    <strong className="text-slate-900">{upcomingBooking.farmerName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'தொடர்பு எண்' : 'Mobile Number'}</span>
                    <strong className="text-slate-900">{upcomingBooking.farmerMobile || '+91 98422 10450'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'தேதி & நேரம்' : 'Date & Time'}</span>
                    <strong className="text-slate-900">{upcomingBooking.date} ({upcomingBooking.timeSlot})</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">{isTa ? 'பண்ணை அமைவிடம்' : 'Farm Location'}</span>
                    <strong className="text-slate-900">{upcomingBooking.farmerLocation}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setActiveTab('bookingRequests')}
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>{isTa ? 'கோரிக்கையைக் கையாளுங்கள்' : 'Manage Request in Booking Hub'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                {isTa ? 'தற்போது நிலுவை சேவை எதுவுமில்லை' : 'No Pending Rental Services'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isTa
                  ? 'உங்கள் இயந்திரப் படை விவசாயிகளுக்குத் தயாராக உள்ளது.'
                  : 'Your machinery fleet is ready for new rental booking requests from local farmers.'}
              </p>
            </div>
          )}

          {/* Quick Fleet Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>{isTa ? 'இயந்திர படை கண்ணோட்டம்' : 'Fleet Status Summary'}</span>
              </h3>
              <button
                onClick={() => setActiveTab('myMachinery')}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 cursor-pointer"
              >
                {isTa ? 'படை மேலாண்மை' : 'Manage Fleet →'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {providerMachines.slice(0, 4).map(m => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70"
                >
                  <img
                    src={m.imageUrl}
                    alt={m.machineName}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = getFallbackMachineryImage(m.category);
                    }}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {m.machineName}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">{m.category}</p>
                    <span className="text-[11px] font-black text-emerald-800">
                      ₹{m.hourlyRate} / Hr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Actions & Recent Activity */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-2xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {isTa ? 'விரைவு செயல்பாடுகள்' : 'Quick Actions'}
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('bookingRequests')}
                className="w-full p-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-xl border border-amber-200/80 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>{isTa ? 'முன்பதிவு கோரிக்கைகள்' : 'Booking Requests Hub'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>

              <button
                onClick={() => setActiveTab('myMachinery')}
                className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs rounded-xl border border-emerald-200/80 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  <span>{isTa ? 'எனது இயந்திரப் படை' : 'Manage My Fleet'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>{isTa ? 'பண்ணை நாட்காட்டி' : 'Farm Calendar'}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {isTa ? 'சமீபத்திய நிகழ்வுகள்' : 'Recent Activity'}
            </h3>

            <div className="space-y-3 text-xs">
              {providerBookings.slice(0, 4).map(b => (
                <div
                  key={b.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="truncate">{b.farmerName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      b.status === 'requested'
                        ? 'bg-amber-100 text-amber-800'
                        : b.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {b.machineName} ({b.date})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
