import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  AlertCircle,
  Phone,
  ShieldCheck,
  Search,
  Check,
  X,
  Play,
  CheckCircle,
  UserCheck,
  Briefcase,
  Layers,
  ArrowRight,
  Mic,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';
import { WorkerProfile, WorkerBooking, ReverseWorkerRequest } from '../../types';

export const WorkerMarketplace: React.FC = () => {
  const {
    t,
    language,
    workers,
    workerBookings,
    labourRequirements,
    bookWorker,
    acceptWorkerBooking,
    rejectWorkerBooking,
    updateWorkerBookingStatus,
    postLabourRequirement,
    expressWorkerInterest,
    acceptLabourRequirementTeam,
    currentUser,
    currentRole,
    switchRole,
    voicePreFill,
    setVoicePreFill,
    setIsVoiceAssistantOpen,
  } = useApp();

  const isWorkerRole = currentRole === 'worker';

  // Navigation tab within the worker marketplace
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'my_requests' | 'labour_requirements' | 'worker_dashboard'>(
    isWorkerRole ? 'worker_dashboard' : 'browse'
  );

  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<WorkerProfile | null>(null);
  const [selectedWorkerForCalendar, setSelectedWorkerForCalendar] = useState<WorkerProfile | null>(null);
  const [showPostRequirementModal, setShowPostRequirementModal] = useState(false);

  // Booking form state
  const [workType, setWorkType] = useState('Coconut Harvesting & Tree Climbing');
  const [crop, setCrop] = useState('Coconut');
  const [bookingDate, setBookingDate] = useState('2026-10-05');
  const [startTime, setStartTime] = useState('07:00 AM');
  const [endTime, setEndTime] = useState('02:00 PM');
  const [timeSlot, setTimeSlot] = useState('07:00 AM - 02:00 PM');
  const [workersNeeded, setWorkersNeeded] = useState(6);
  const [farmLocation, setFarmLocation] = useState('Anamalai Road, Pollachi');
  const [expectedWage, setExpectedWage] = useState(600);
  const [notes, setNotes] = useState('Need 6 experienced coconut tree climbers and collection workers for 2,000 coconut harvest.');
  const [bookingFeedback, setBookingFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Post Labour Requirement form state
  const [reqCrop, setReqCrop] = useState('Coconut');
  const [reqCropCustom, setReqCropCustom] = useState('');
  const [reqWorkType, setReqWorkType] = useState('Coconut Harvesting');
  const [reqWorkTypeCustom, setReqWorkTypeCustom] = useState('');
  const [reqDate, setReqDate] = useState('2026-10-05');
  const [reqTimeSlot, setReqTimeSlot] = useState('07:00 AM - 02:00 PM');
  const [reqWorkersNeeded, setReqWorkersNeeded] = useState(6);
  const [reqLocation, setReqLocation] = useState('Pollachi, Coimbatore');
  const [reqExpectedWage, setReqExpectedWage] = useState(600);
  const [reqNotes, setReqNotes] = useState('Urgent harvesting for 2,000 coconuts grove. Direct farm payment.');
  const [postFeedback, setPostFeedback] = useState<string | null>(null);

  // Handle Voice Assistant Pre-fill
  React.useEffect(() => {
    if (voicePreFill && voicePreFill.intent === 'POST_LABOUR_REQ' && voicePreFill.labourDetails) {
      const details = voicePreFill.labourDetails;
      setReqCrop(details.crop || 'Coconut');
      setReqWorkType(details.workType || 'Coconut Harvesting');
      setReqWorkersNeeded(details.workersNeeded || 6);
      setReqDate(details.date || '2026-10-05');
      setReqTimeSlot(details.timeSlot || '07:00 AM - 02:00 PM');
      setReqLocation(details.location || 'Pollachi, Coimbatore');
      if (details.notes) setReqNotes(details.notes);

      // Open post requirement modal for manual confirmation
      setShowPostRequirementModal(true);
      setActiveSubTab('labour_requirements');

      // Clear voicePreFill
      setVoicePreFill(null);
    }
  }, [voicePreFill]);

  const skillsList = [
    'All',
    'Coconut Harvesting',
    'Coconut Tree Climbing',
    'Coconut Collection',
    'Loading',
    'Coconut De-husking',
    'Paddy Harvesting',
    'Tomato Harvest',
    'Tractor Operation',
    'Power Sprayer Operation',
  ];

  const filteredWorkers = workers.filter(w => {
    if (selectedSkillFilter === 'All') return true;
    return w.skills.some(s => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));
  });

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
            <CheckCircle className="w-3 h-3 text-slate-600" />
            COMPLETED
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <X className="w-3 h-3 text-rose-600" />
            REJECTED
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
            CANCELLED
          </span>
        );
      case 'reschedule_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            RESCHEDULE REQUESTED
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

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerForBooking) return;

    const totalWage = workersNeeded * expectedWage;
    const platformFee = Math.round(totalWage * 0.02);

    const res = bookWorker({
      workerId: selectedWorkerForBooking.id,
      crop,
      workType,
      date: bookingDate,
      startTime,
      endTime,
      timeSlot: `${startTime} - ${endTime}`,
      workersRequired: workersNeeded,
      expectedWagePerWorker: expectedWage,
      farmLocation,
      notes,
      totalCharge: totalWage,
      platformFee,
    });

    if (res.success) {
      setBookingFeedback({
        type: 'success',
        text: `Worker Request Sent! Awaiting ${selectedWorkerForBooking.name} confirmation.`,
      });
      setTimeout(() => {
        setBookingFeedback(null);
        setSelectedWorkerForBooking(null);
        setActiveSubTab('my_requests');
      }, 1600);
    } else {
      setBookingFeedback({ type: 'error', text: res.message });
    }
  };

  const handlePostRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCrop = reqCrop === 'Other' ? reqCropCustom || 'Mixed Farm' : reqCrop;
    const finalWorkType = reqWorkType === 'Other' ? reqWorkTypeCustom || 'General Farm Work' : reqWorkType;
    const res = postLabourRequirement({
      crop: finalCrop,
      workType: finalWorkType,
      date: reqDate,
      timeSlot: reqTimeSlot,
      workersRequired: reqWorkersNeeded,
      location: reqLocation,
      expectedDailyWage: reqExpectedWage,
      notes: reqNotes,
    });

    if (res.success) {
      setPostFeedback(res.message);
      setTimeout(() => {
        setPostFeedback(null);
        setShowPostRequirementModal(false);
        setActiveSubTab('labour_requirements');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.workers.title}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.workers.subtitle} · Realistic Request → Provider Confirmation Model
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isWorkerRole && (
            <>
              <button
                onClick={() => setIsVoiceAssistantOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold transition-colors cursor-pointer"
                title="Voice Post Labour Requirement"
              >
                <Mic className="w-4 h-4 text-emerald-800 animate-pulse" />
                <span>🎤 {language === 'ta' ? 'குரல் ஆட்கள் தேவை' : 'Voice Post Labour'}</span>
              </button>

              <button
                onClick={() => setShowPostRequirementModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-700" />
                <span>Post Labour Requirement</span>
              </button>
            </>
          )}

          {/* Quick role-view switcher for prototype testing */}
          <button
            onClick={() => {
              if (currentRole === 'worker') {
                switchRole('farmer');
                setActiveSubTab('browse');
              } else {
                switchRole('worker');
                setActiveSubTab('worker_dashboard');
              }
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{currentRole === 'worker' ? 'Switch to Farmer View' : 'Switch to Worker Provider View'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('browse')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeSubTab === 'browse'
              ? 'bg-emerald-800 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          A. Browse Available Teams ({workers.length})
        </button>

        <button
          onClick={() => setActiveSubTab('my_requests')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer relative ${
            activeSubTab === 'my_requests'
              ? 'bg-emerald-800 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          My Booking Requests ({workerBookings.length})
        </button>

        <button
          onClick={() => setActiveSubTab('labour_requirements')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeSubTab === 'labour_requirements'
              ? 'bg-emerald-800 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Open Labour Requirements ({labourRequirements.length})
        </button>

        <button
          onClick={() => setActiveSubTab('worker_dashboard')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
            activeSubTab === 'worker_dashboard'
              ? 'bg-amber-800 text-white'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          Worker Provider Dashboard ({workerBookings.filter(b => b.status === 'requested').length} Pending)
        </button>
      </div>

      {/* TAB 1: BROWSE WORKER TEAMS */}
      {activeSubTab === 'browse' && (
        <div className="space-y-6">
          {/* Skills Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {skillsList.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkillFilter(skill)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedSkillFilter === skill
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map(worker => {
              return (
                <div
                  key={worker.id}
                  className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="space-y-3">
                    {/* Profile Header with Trust Ring */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <TrustRingAvatar
                          user={{ name: worker.name }}
                          trust={worker.trust}
                          size="lg"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{worker.name}</h4>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-700" />
                            <span>{worker.area}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                            {worker.isTeam ? `Team of ${worker.teamSize} Workers` : 'Individual Specialist'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rates & Stats */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Daily Charge / Person</span>
                        <span className="text-base font-bold text-emerald-800 tabular-nums">
                          ₹{worker.dailyCharge.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Completed Jobs</span>
                        <span className="text-base font-bold text-slate-800 tabular-nums">
                          {worker.completedJobs}
                        </span>
                      </div>
                    </div>

                    {/* Skills tags */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                        Specialist Skills
                      </span>
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                        {worker.skills.map((skill, idx) => (
                          <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Calendar Availability */}
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Availability:</span>
                      <button
                        onClick={() => setSelectedWorkerForCalendar(worker)}
                        className="text-emerald-800 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>View Calendar</span>
                      </button>
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedWorkerForBooking(worker);
                        setWorkersNeeded(worker.isTeam ? worker.teamSize : 1);
                        setExpectedWage(worker.dailyCharge);
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Send Booking Request</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FARMER'S BOOKING REQUESTS */}
      {activeSubTab === 'my_requests' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-center justify-between">
            <span>
              <strong>Rule Enforced:</strong> Farmer request does NOT automatically confirm workers. Status remains{' '}
              <strong className="text-amber-800">REQUESTED</strong> until accepted by the worker team.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workerBookings.map(booking => {
              const platformFee = booking.platformFee || Math.round(booking.totalCharge * 0.02);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{booking.workerName}</h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      <span className="text-xs text-slate-500">
                        {booking.workType} {booking.crop ? `· ${booking.crop}` : ''}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Total Wage:</span>
                      <span className="text-sm font-bold text-slate-900">
                        ₹{booking.totalCharge.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Date & Shift:</span>
                      <span className="font-semibold text-slate-800">{booking.date}</span>
                      <div className="text-[11px] text-slate-500">{booking.timeSlot}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Workers Required:</span>
                      <span className="font-semibold text-slate-800">
                        {booking.workersRequired} Workers (₹{booking.expectedWagePerWorker || 600}/person)
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Location: <strong>{booking.farmLocation}</strong>
                      </span>
                      <span className="text-[11px] text-emerald-800 font-semibold">
                        Platform Service Fee (2%): ₹{platformFee}
                      </span>
                    </div>
                  </div>

                  {booking.notes && (
                    <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      <strong>Notes:</strong> {booking.notes}
                    </p>
                  )}

                  {/* Status Banner */}
                  {booking.status === 'requested' && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center justify-between">
                      <span>Worker Request Sent · Awaiting Worker Team Confirmation</span>
                      <button
                        onClick={() => updateWorkerBookingStatus(booking.id, 'cancelled')}
                        className="text-[11px] text-rose-700 underline font-semibold cursor-pointer"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center justify-between">
                      <span>✓ Worker Team Confirmed! Team will arrive on {booking.date}.</span>
                      <button
                        onClick={() => updateWorkerBookingStatus(booking.id, 'in_progress')}
                        className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Start Work
                      </button>
                    </div>
                  )}

                  {booking.status === 'in_progress' && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium flex items-center justify-between">
                      <span>● Work in progress on farm field</span>
                      <button
                        onClick={() => updateWorkerBookingStatus(booking.id, 'completed')}
                        className="px-2.5 py-1 bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Complete Work
                      </button>
                    </div>
                  )}

                  {booking.status === 'completed' && (
                    <div className="p-2.5 rounded-xl bg-slate-100 text-xs text-slate-700 font-medium flex items-center justify-between">
                      <span>✓ Farm harvesting completed successfully.</span>
                      <span className="text-[11px] font-semibold text-emerald-800">Paid directly to team</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: OPEN LABOUR REQUIREMENTS */}
      {activeSubTab === 'labour_requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Open Labour Requirements ({labourRequirements.length})
            </h3>
            {!isWorkerRole && (
              <button
                onClick={() => setShowPostRequirementModal(true)}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                + Post New Requirement
              </button>
            )}
          </div>

          <div className="space-y-4">
            {labourRequirements.map(req => {
              const confirmedCount = req.confirmedWorkersCount || 0;
              const remainingSpots = Math.max(0, req.workersRequired - confirmedCount);
              const isAllFilled = remainingSpots === 0 || req.status === 'assigned';
              const isPartiallyFilled = confirmedCount > 0 && remainingSpots > 0;

              return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {req.workersRequired} {req.workType} Workers Needed
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isAllFilled
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isPartiallyFilled
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isAllFilled ? 'FILLED / ASSIGNED' : isPartiallyFilled ? 'PARTIALLY FILLED' : 'OPEN FOR WORKERS'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      Crop: {req.crop || 'Coconut'} · Location: {req.location}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Offered Wage:</span>
                    <span className="text-base font-bold text-emerald-800">
                      ₹{req.expectedDailyWage}/person/day
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date of Work:</span>
                    <span className="font-semibold text-slate-800">{req.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Shift Time:</span>
                    <span className="font-semibold text-slate-800">{req.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Farmer Contact:</span>
                    <span className="font-semibold text-slate-800">{req.farmerName}</span>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                    <strong>Notes:</strong> {req.notes}
                  </p>
                )}

                {/* Section: Interested Workers / Teams */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Interested Workers / Teams ({req.responses.length})
                    </h5>
                    <span className="text-[11px] text-emerald-800 font-semibold">
                      Required = {req.workersRequired} · Confirmed = {confirmedCount} · Remaining = {remainingSpots}
                    </span>
                  </div>

                  {req.responses.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                      No worker or team has expressed interest yet. Local agricultural specialists in Pollachi / Coimbatore are reviewing the broadcast.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {req.responses.map((resp, i) => {
                        const isIndividual = resp.isIndividual || resp.teamSize === 1;
                        const capacity = isIndividual ? 1 : (resp.teamSize || 1);
                        const isThisRespConfirmed = resp.status === 'confirmed';
                        const exceedsRemaining = capacity > remainingSpots;

                        return (
                          <div
                            key={i}
                            className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <h6 className="text-xs font-bold text-slate-900">{resp.workerName}</h6>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isIndividual ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                                }`}>
                                  {isIndividual ? 'Individual Specialist (1)' : `Worker Team (${resp.teamSize})`}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                                <div>Wage: <strong>₹{resp.proposedWage}/person/day</strong></div>
                                {resp.location && <div>Base Area: {resp.location}</div>}
                                {resp.rating && <div>Rating: ★ {resp.rating} ({resp.completedJobs || 12} jobs)</div>}
                              </div>
                            </div>

                            {isThisRespConfirmed ? (
                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 py-1.5 rounded-xl border border-emerald-200 text-center block">
                                ✓ Confirmed ({capacity} Worker{capacity > 1 ? 's' : ''})
                              </span>
                            ) : isAllFilled ? (
                              <span className="text-[11px] font-medium text-slate-400 text-center block py-1.5">
                                Requirement Fully Staffed
                              </span>
                            ) : exceedsRemaining ? (
                              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 py-1.5 rounded-xl text-center block">
                                Exceeds Remaining ({remainingSpots} spot{remainingSpots > 1 ? 's' : ''} left)
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  acceptLabourRequirementTeam(req.id, resp.workerId);
                                }}
                                className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
                              >
                                Confirm {isIndividual ? 'Individual Specialist (1)' : `Team (${capacity} Workers)`}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: WORKER ROLE / PROVIDER DASHBOARD */}
      {activeSubTab === 'worker_dashboard' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-center justify-between">
            <div>
              <strong>Worker Provider Console:</strong> Marimuthu Coconut Field Team (6 Workers, Pollachi).
              <p className="text-slate-600 mt-0.5">
                Incoming booking requests appear here. Click <strong>[Accept Request]</strong> to turn a farmer request into a <strong>CONFIRMED</strong> booking.
              </p>
            </div>
          </div>

          {/* 1. Incoming Booking Requests */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Incoming Booking Requests ({workerBookings.filter(b => b.status === 'requested').length} Pending)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workerBookings.map(b => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Farmer</span>
                      <h4 className="text-sm font-bold text-slate-900">{b.farmerName}</h4>
                      <div className="text-xs text-slate-600 mt-0.5">{b.farmLocation}</div>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Work Type:</span>
                      <span className="font-semibold text-slate-800">{b.workType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Crop:</span>
                      <span className="font-semibold text-slate-800">{b.crop || 'Coconut'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Date & Shift:</span>
                      <span className="font-semibold text-slate-800">{b.date} ({b.timeSlot})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Workers & Wage:</span>
                      <span className="font-semibold text-emerald-800">
                        {b.workersRequired} Workers (₹{b.totalCharge.toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-600 italic">
                      &ldquo;{b.notes}&rdquo;
                    </p>
                  )}

                  {b.status === 'requested' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => acceptWorkerBooking(b.id)}
                        className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>
                      <button
                        onClick={() => rejectWorkerBooking(b.id, 'Team unavailable on requested date.')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {b.status === 'confirmed' && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-emerald-800 font-bold">✓ Booking Confirmed</span>
                      <button
                        onClick={() => updateWorkerBookingStatus(b.id, 'in_progress')}
                        className="px-3 py-1.5 bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Start Work
                      </button>
                    </div>
                  )}

                  {b.status === 'in_progress' && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-blue-800 font-bold">● Work in Progress</span>
                      <button
                        onClick={() => updateWorkerBookingStatus(b.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Complete Work
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Available Farm Jobs (from Labour Requirements) */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Available Farm Jobs (Open Labour Requirements)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labourRequirements
                .filter(r => r.status === 'open')
                .map(req => {
                  const alreadyApplied = req.responses.some(
                    resp => resp.workerId === currentUser.id || resp.workerName.includes('Marimuthu')
                  );

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {req.workersRequired} Workers for {req.workType}
                          </h4>
                          <span className="text-xs text-slate-500">{req.location}</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-800">
                          ₹{req.expectedDailyWage}/person
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                        Date: <strong>{req.date}</strong> ({req.timeSlot}) · Farmer: <strong>{req.farmerName}</strong>
                      </div>

                      {req.notes && (
                        <p className="text-xs text-slate-500 italic">&ldquo;{req.notes}&rdquo;</p>
                      )}

                      <div className="pt-2 border-t border-slate-100">
                        {alreadyApplied ? (
                          <div className="text-center py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
                            ✓ You have expressed interest! Farmer will review and decide.
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              expressWorkerInterest(req.id, {
                                id: 'worker_marimuthu',
                                name: 'Marimuthu Coconut Field Team',
                                isTeam: true,
                                teamSize: 6,
                                area: 'Pollachi & Anamalai Region',
                                trust: {
                                  level: 'star',
                                  title: 'Master Agricultural Team',
                                  completedTransactions: 94,
                                  fulfilmentRate: 99,
                                  isVerified: true,
                                  positiveFeedbackScore: 4.96,
                                  cancellationRate: 0.5,
                                  reasons: ['94 Verified Harvesting Jobs', 'Prompt Team Arrival', 'Zero Crop Damage'],
                                },
                                completedJobs: 94,
                                phone: '+91 94432 11099',
                              })
                            }
                            className="w-full py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            I&apos;m Interested (Apply as Marimuthu Team)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Worker Booking Form */}
      {selectedWorkerForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Send Worker Booking Request
                </h3>
                <span className="text-xs text-slate-500">
                  Target Team: <strong>{selectedWorkerForBooking.name}</strong> ({selectedWorkerForBooking.area})
                </span>
              </div>
              <button
                onClick={() => setSelectedWorkerForBooking(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Crop</label>
                  <select
                    value={crop}
                    onChange={e => setCrop(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Coconut">Coconut (தேங்காய்)</option>
                    <option value="Paddy">Paddy / Rice (நெல்)</option>
                    <option value="Tomato">Tomato (தக்காளி)</option>
                    <option value="Turmeric">Turmeric (மஞ்சள்)</option>
                    <option value="Banana">Banana (வாழை)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Work Type</label>
                  <input
                    type="text"
                    value={workType}
                    onChange={e => setWorkType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    placeholder="e.g. Coconut Harvesting"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    placeholder="07:00 AM"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    placeholder="02:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Workers Required</label>
                  <input
                    type="number"
                    min={1}
                    value={workersNeeded}
                    onChange={e => setWorkersNeeded(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Expected Wage / Worker (₹/Day)</label>
                  <input
                    type="number"
                    min={200}
                    step={50}
                    value={expectedWage}
                    onChange={e => setExpectedWage(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={e => setFarmLocation(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  placeholder="e.g. Pollachi, Anamalai Road"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Field Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  placeholder="Specific instructions on trees, loading points, or tool requirements..."
                />
              </div>

              {/* Fee Breakdown */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 block">Total Worker Wage:</span>
                  <span className="text-base font-bold tabular-nums">
                    ₹{(workersNeeded * expectedWage).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right text-[11px] text-emerald-800">
                  <span className="block font-semibold">
                    Platform Service Fee (2%): ₹{Math.round(workersNeeded * expectedWage * 0.02)}
                  </span>
                  <span>Paid directly to workers upon shift completion</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                Notice: Submitting will send the request to <strong>{selectedWorkerForBooking.name}</strong>. The booking will only become <strong>CONFIRMED</strong> once accepted by the team.
              </div>

              {bookingFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-center font-semibold ${
                    bookingFeedback.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {bookingFeedback.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedWorkerForBooking(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Send Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Post Labour Requirement */}
      {showPostRequirementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Post Labour Requirement
                </h3>
                <span className="text-xs text-slate-500">
                  Broadcast requirement to all local teams. Status starts as &ldquo;OPEN FOR WORKERS&rdquo;.
                </span>
              </div>
              <button
                onClick={() => setShowPostRequirementModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostRequirement} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Crop</label>
                  <select
                    value={reqCrop}
                    onChange={e => setReqCrop(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Coconut">Coconut</option>
                    <option value="Paddy">Paddy / Rice</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Banana">Banana</option>
                    <option value="Turmeric">Turmeric</option>
                    <option value="Other">Other (Custom Crop)</option>
                  </select>
                  {reqCrop === 'Other' && (
                    <input
                      type="text"
                      value={reqCropCustom}
                      onChange={e => setReqCropCustom(e.target.value)}
                      placeholder="Specify custom crop..."
                      className="w-full mt-1.5 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Work Type</label>
                  <select
                    value={reqWorkType}
                    onChange={e => setReqWorkType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Harvesting">Harvesting</option>
                    <option value="Planting">Planting</option>
                    <option value="Weeding">Weeding</option>
                    <option value="Spraying">Spraying</option>
                    <option value="Coconut Tree Climbing">Coconut Tree Climbing</option>
                    <option value="Coconut Collection">Coconut Collection</option>
                    <option value="Coconut De-husking">Coconut De-husking</option>
                    <option value="Loading / Packing">Loading / Packing</option>
                    <option value="Paddy Harvesting">Paddy Harvesting</option>
                    <option value="Tomato Harvest">Tomato Harvest</option>
                    <option value="Tractor Operation">Tractor Operation</option>
                    <option value="Other">Other (Custom Work Type)</option>
                  </select>
                  {reqWorkType === 'Other' && (
                    <input
                      type="text"
                      value={reqWorkTypeCustom}
                      onChange={e => setReqWorkTypeCustom(e.target.value)}
                      placeholder="Specify custom work type..."
                      className="w-full mt-1.5 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={e => setReqDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={reqTimeSlot}
                    onChange={e => setReqTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    placeholder="07:00 AM - 02:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Workers Required</label>
                  <input
                    type="number"
                    min={1}
                    value={reqWorkersNeeded}
                    onChange={e => setReqWorkersNeeded(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Expected Wage / Worker (₹/Day)</label>
                  <input
                    type="number"
                    min={200}
                    step={50}
                    value={reqExpectedWage}
                    onChange={e => setReqExpectedWage(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={e => setReqLocation(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  placeholder="e.g. Pollachi, Coimbatore"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={reqNotes}
                  onChange={e => setReqNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                  placeholder="Add any specific requirements..."
                />
              </div>

              {postFeedback && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-center">
                  {postFeedback}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostRequirementModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Broadcast Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Worker Calendar Modal */}
      {selectedWorkerForCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedWorkerForCalendar.name} Availability
                </h3>
              </div>
              <button
                onClick={() => setSelectedWorkerForCalendar(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-700 block">Upcoming Schedule:</span>
              <div className="space-y-1.5">
                {['2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08'].map(date => {
                  const isBusy = selectedWorkerForCalendar.busyDates.includes(date);
                  return (
                    <div
                      key={date}
                      className={`p-2.5 rounded-xl flex items-center justify-between font-medium ${
                        isBusy
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{date}</span>
                      </div>
                      <span className="font-bold text-[10px] uppercase">
                        {isBusy ? 'Booked on Farm' : 'Available for Booking'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWorkerForCalendar(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
