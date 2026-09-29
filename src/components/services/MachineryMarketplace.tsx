import React, { useState } from 'react';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  Filter,
  Info,
  Check,
  X,
  UserCheck,
  Search,
  Truck,
  Phone,
  MessageSquare,
  Sparkles,
  Layers,
  Clock3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MachineItem, MachineryBooking, MachineryRequirement } from '../../types';
import {
  MACHINERY_CATALOGUE,
  MACHINERY_CATEGORIES,
  TRACTOR_ATTACHMENTS,
  MACHINERY_WORK_PURPOSES,
  MachineryCatalogueItem,
  getFallbackMachineryImage,
} from '../../data/machineryCatalogue';
import { TrustRingAvatar } from '../common/TrustRingAvatar';

export const MachineryMarketplace: React.FC = () => {
  const {
    t,
    language,
    machinery,
    machineryBookings,
    machineryRequirements,
    bookMachinery,
    acceptMachineryBooking,
    rejectMachineryBooking,
    cancelMachineryBooking,
    requestMachineryReschedule,
    approveMachineryReschedule,
    updateMachineryBookingStatus,
    postMachineryRequirement,
    respondToMachineryRequirement,
    currentUser,
    currentRole,
    switchRole,
    selectedMachineForCalendar,
    setSelectedMachineForCalendar,
  } = useApp();

  const isMachineryRole = currentRole === 'machinery';
  const isTa = language === 'ta';

  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'my_bookings' | 'incoming_requirements' | 'provider_dashboard'>(
    isMachineryRole ? 'provider_dashboard' : 'browse'
  );

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedPurposeFilter, setSelectedPurposeFilter] = useState<string>('All');

  // Modals & Selection State
  const [selectedMachineForDetails, setSelectedMachineForDetails] = useState<MachineItem | null>(null);
  const [selectedMachineForBooking, setSelectedMachineForBooking] = useState<MachineItem | null>(null);
  const [showPostReqModal, setShowPostReqModal] = useState(false);
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState<MachineryBooking | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-10-06');
  const [timeSlot, setTimeSlot] = useState('08:00 AM - 12:00 PM');
  const [durationHours, setDurationHours] = useState(4);
  const [selectedAttachment, setSelectedAttachment] = useState('Rotavator (42-Blade Rotary Tiller)');
  const [farmLocation, setFarmLocation] = useState('Anamalai Road, Pollachi');
  const [workPurpose, setWorkPurpose] = useState('Land Preparation & Soil Rotavation');
  const [crop, setCrop] = useState('Paddy');
  const [notes, setNotes] = useState('Require 42-blade rotavator for fine soil pulverization.');
  const [bookingFeedback, setBookingFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reschedule Form State
  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-10-07');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState('02:00 PM - 06:00 PM');

  // Post Requirement Form State
  const [reqMachineType, setReqMachineType] = useState('Tractor');
  const [reqAttachment, setReqAttachment] = useState('Rotavator (42-Blade)');
  const [reqCrop, setReqCrop] = useState('Paddy');
  const [reqPurpose, setReqPurpose] = useState('Land Preparation');
  const [reqDate, setReqDate] = useState('2026-10-08');
  const [reqTimeSlot, setReqTimeSlot] = useState('08:00 AM - 12:00 PM');
  const [reqDuration, setReqDuration] = useState(4);
  const [reqAcreage, setReqAcreage] = useState('3 Acres');
  const [reqLocation, setReqLocation] = useState('Anamalai Road, Pollachi, Coimbatore');
  const [reqBudget, setReqBudget] = useState(3400);
  const [reqNotes, setReqNotes] = useState('Need heavy rotavator for wet paddy puddling.');
  const [reqFeedback, setReqFeedback] = useState<string | null>(null);

  // Provider Requirement Response State
  const [respondingReqId, setRespondingReqId] = useState<string | null>(null);
  const [proposedRate, setProposedRate] = useState<number>(850);
  const [proposalNotes, setProposalNotes] = useState<string>('Available with experienced operator and fuel included.');

  const districtsList = ['All', 'Pollachi', 'Coimbatore', 'Erode', 'Salem', 'Thanjavur', 'Tiruvarur', 'Dindigul'];
  const cropFilterList = ['All', 'Paddy', 'Coconut', 'Maize', 'Groundnut', 'Sugarcane', 'Cotton', 'Vegetables'];

  // Filtered Machinery logic
  const filteredMachinery = machinery.filter(m => {
    if (selectedCategory !== 'All' && m.category !== selectedCategory) {
      // Allow category matching via code or name
      const catObj = MACHINERY_CATEGORIES.find(c => c.id === selectedCategory);
      if (catObj && m.category !== catObj.name && m.category !== catObj.id) return false;
    }

    if (selectedDistrict !== 'All' && !m.baseLocation.toLowerCase().includes(selectedDistrict.toLowerCase())) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.machineName.toLowerCase().includes(q) || (m.machineNameTa && m.machineNameTa.toLowerCase().includes(q));
      const matchProvider = m.providerName.toLowerCase().includes(q);
      const matchLoc = m.baseLocation.toLowerCase().includes(q);
      const matchCat = m.category.toLowerCase().includes(q);
      if (!matchName && !matchProvider && !matchLoc && !matchCat) return false;
    }

    return true;
  });

  const getStatusBadge = (status: MachineryBooking['status']) => {
    switch (status) {
      case 'requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {isTa ? 'கோரிக்கை அனுப்பப்பட்டது (Slot Held)' : 'REQUESTED / SLOT HELD'}
          </span>
        );
      case 'confirmed':
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-600" />
            {isTa ? 'உறுதி செய்யப்பட்டது' : 'CONFIRMED'}
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-400">
            <Truck className="w-3 h-3 text-amber-700" />
            {isTa ? 'இயந்திரம் அனுப்பப்பட்டது' : 'DISPATCHED'}
          </span>
        );
      case 'arrived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-300">
            <MapPin className="w-3 h-3 text-blue-600" />
            {isTa ? 'பண்ணைக்கு வந்துவிட்டது' : 'ARRIVED AT FARM'}
          </span>
        );
      case 'in_progress':
      case 'in_service':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-950 border border-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            {isTa ? 'வேலை நடக்கிறது' : 'SERVICE IN PROGRESS'}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            {isTa ? 'வேலை முடிந்தது' : 'COMPLETED'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <X className="w-3 h-3 text-rose-600" />
            {isTa ? 'நிராகரிக்கப்பட்டது' : 'REJECTED'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
            {isTa ? 'ரத்து செய்யப்பட்டது' : 'CANCELLED'}
          </span>
        );
      case 'reschedule_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-400">
            <Clock3 className="w-3 h-3 text-amber-700" />
            {isTa ? 'தேதி மாற்றம் கேட்கப்பட்டுள்ளது' : 'RESCHEDULE REQUESTED'}
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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachineForBooking) return;

    const res = bookMachinery({
      machineId: selectedMachineForBooking.id,
      date: bookingDate,
      timeSlot,
      durationHours,
      farmerLocation: farmLocation,
      workPurpose: `${workPurpose}${selectedMachineForBooking.category === 'Tractor' ? ` (${selectedAttachment})` : ''}`,
      crop,
      notes,
    });

    if (res.success) {
      setBookingFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        setBookingFeedback(null);
        setSelectedMachineForBooking(null);
        setActiveSubTab('my_bookings');
      }, 1800);
    } else {
      setBookingFeedback({ type: 'error', text: res.message });
    }
  };

  const handlePostRequirementSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const res = postMachineryRequirement({
      machineType: reqMachineType,
      attachment: reqMachineType === 'Tractor' ? reqAttachment : undefined,
      crop: reqCrop,
      workPurpose: reqPurpose,
      date: reqDate,
      timeSlot: reqTimeSlot,
      durationHours: reqDuration,
      farmLocation: reqLocation,
      maxBudget: reqBudget,
      notes: `${reqAcreage} · ${reqNotes}`,
    });

    if (res.success) {
      setReqFeedback(res.message);
      setTimeout(() => {
        setReqFeedback(null);
        setShowPostReqModal(false);
        setActiveSubTab('my_bookings');
      }, 1800);
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBookingTarget) return;

    requestMachineryReschedule(rescheduleBookingTarget.id, newRescheduleDate, newRescheduleSlot);
    setRescheduleBookingTarget(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isTa ? 'வேளாண் இயந்திர மையம்' : 'Farm Machinery Hub'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
              {isTa ? '12 முக்கிய இயந்திரங்கள்' : 'Approved Machinery Fleet'}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {isTa
              ? 'தமிழ்நாடு விவசாயிகளுக்கான டிராக்டர்கள், ரோட்டவேட்டர், ஹார்வெஸ்டர் மற்றும் தெளிப்பு ட்ரோன்கள்.'
              : 'Practical hiring of verified tractors, implements, combine harvesters & spraying drones across Tamil Nadu.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPostReqModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-amber-800" />
            <span>{isTa ? '+ இயந்திர தேவை பதிவிட' : '+ Post Machinery Need'}</span>
          </button>

          {/* Quick role-view switcher */}
          <button
            onClick={() => {
              if (currentRole === 'machinery') {
                switchRole('farmer');
                setActiveSubTab('browse');
              } else {
                switchRole('machinery');
                setActiveSubTab('provider_dashboard');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <UserCheck className="w-4 h-4 text-amber-300" />
            <span>{currentRole === 'machinery' ? (isTa ? 'விவசாயி பார்வையில்' : 'Switch to Farmer View') : (isTa ? 'இயந்திர உரிமையாளர் பார்வையில்' : 'Switch to Provider View')}</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('browse')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'browse'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-amber-300" />
          <span>{isTa ? 'இயந்திரங்கள்' : 'Browse Fleet'} ({machinery.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('my_bookings')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'my_bookings'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-amber-300" />
          <span>{isTa ? 'எனது முன்பதிவுகள்' : 'My Rentals & Requests'} ({machineryBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('incoming_requirements')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'incoming_requirements'
              ? 'bg-amber-800 text-white shadow-2xs'
              : 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>{isTa ? 'விவசாயி தேவைகள்' : 'Farmer Machinery Requirements'} ({machineryRequirements.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('provider_dashboard')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'provider_dashboard'
              ? 'bg-amber-900 text-white shadow-2xs'
              : 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>{isTa ? 'உரிமையாளர் மையம்' : 'Provider Dashboard'} ({machineryBookings.filter(b => b.status === 'requested' || b.status === 'reschedule_requested').length} Action)</span>
        </button>
      </div>

      {/* TAB 1: BROWSE MACHINERY CATALOGUE */}
      {activeSubTab === 'browse' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {MACHINERY_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {isTa ? cat.nameTa : cat.name}
                </button>
              ))}
            </div>

            {/* Practical Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isTa ? 'இயந்திரம் / இடம் தேடுக...' : 'Search machine name or location...'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white"
                >
                  <option value="All">{isTa ? 'அனைத்து மாவட்டங்கள்' : 'All Districts / Locations'}</option>
                  {districtsList.filter(d => d !== 'All').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedCropFilter}
                  onChange={e => setSelectedCropFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white"
                >
                  <option value="All">{isTa ? 'அனைத்து பயிர்கள்' : 'All Target Crops'}</option>
                  {cropFilterList.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Machinery Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachinery.map(machine => {
              const bookedSlotsCount = machine.schedule.filter(s => s.status === 'booked').length;
              const heldSlotsCount = machine.schedule.filter(s => s.status === 'slot_held').length;

              return (
                <div
                  key={machine.id}
                  className="bg-white rounded-3xl border border-amber-900/10 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    {/* Machine Specific Image */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={machine.imageUrl}
                        alt={machine.machineName}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = getFallbackMachineryImage(machine.category || machine.machineName);
                        }}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold text-slate-900 shadow-sm border border-slate-200">
                        ₹{machine.hourlyRate} <span className="text-[10px] text-slate-500 font-medium">/ hr</span>
                        {machine.dailyRate && (
                          <span className="text-[10px] text-emerald-800 font-bold ml-1">· ₹{machine.dailyRate}/day</span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-emerald-950/90 text-amber-300 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-400/30">
                        {machine.category}
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {isTa && machine.machineNameTa ? machine.machineNameTa : machine.machineName}
                        </h3>
                        <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span>{machine.baseLocation}</span>
                        </div>
                      </div>

                      {/* Provider Info */}
                      <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">PROVIDER</span>
                          <span className="font-bold text-slate-900">{machine.providerName}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                          Verified Fleet
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {machine.description}
                      </p>

                      {/* Attachments */}
                      {machine.attachments && machine.attachments.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Attachments / Features
                          </span>
                          <div className="flex flex-wrap gap-1 text-[11px]">
                            {machine.attachments.map((att, i) => (
                              <span key={i} className="bg-emerald-50 text-emerald-900 border border-emerald-100 px-2 py-0.5 rounded-lg font-medium">
                                {att}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Availability status */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{bookedSlotsCount} booked {heldSlotsCount > 0 ? `· ${heldSlotsCount} held` : '· Available'}</span>
                        </div>

                        <button
                          onClick={() => setSelectedMachineForDetails(machine)}
                          className="text-emerald-800 font-bold hover:underline cursor-pointer"
                        >
                          View Specs →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={() => setSelectedMachineForBooking(machine)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-amber-300" />
                      <span>{isTa ? 'முன்பதிவு செய்ய' : 'Request Rental'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FARMER'S RENTAL REQUESTS */}
      {activeSubTab === 'my_bookings' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-950">
            <strong>Realistic Rental Lifecycle:</strong> Submitting a rental request places the slot in <strong>REQUESTED / SLOT HELD</strong>. The machine is locked as <strong>CONFIRMED</strong> once the provider accepts.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machineryBookings.map(b => {
              const platformFee = b.platformFee || Math.round(b.estimatedCost * 0.02);
              const isConfirmed = b.status === 'confirmed' || b.status === 'dispatched' || b.status === 'arrived' || b.status === 'in_progress' || b.status === 'completed';

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{b.machineName}</h4>
                        {getStatusBadge(b.status)}
                      </div>
                      <span className="text-xs text-slate-500">
                        Provider: {b.providerName} · {b.crop || 'Crop'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Rental Value:</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        ₹{b.estimatedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Date & Shift Slot:</span>
                      <span className="font-semibold text-slate-800">{b.date}</span>
                      <div className="text-[11px] text-slate-500">{b.timeSlot}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Duration & Purpose:</span>
                      <span className="font-semibold text-slate-800">{b.durationHours} Hours</span>
                      <div className="text-[11px] text-slate-500 truncate">{b.workPurpose}</div>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-600">
                        Location: <strong>{b.farmerLocation}</strong>
                      </span>
                      <span className="text-[11px] text-emerald-800 font-bold">
                        Platform Fee (2%): ₹{platformFee}
                      </span>
                    </div>
                  </div>

                  {/* Phone Contact Unlocking */}
                  <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">PROVIDER CONTACT</span>
                      {isConfirmed ? (
                        <span className="font-bold text-emerald-950 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-700" />
                          <a href={`tel:${b.farmerMobile || '9842019283'}`} className="hover:underline">
                            +91 98420 19283
                          </a>
                        </span>
                      ) : (
                        <span className="font-medium text-slate-400 italic">******3210 (Unlocks upon Confirmation)</span>
                      )}
                    </div>

                    {isConfirmed && (
                      <a
                        href="https://wa.me/919842019283"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-800 text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 text-amber-300" />
                        WhatsApp
                      </a>
                    )}
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-600 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                      <strong>Notes:</strong> {b.notes}
                    </p>
                  )}

                  {/* Actions based on status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    {b.status === 'requested' && (
                      <>
                        <span className="text-amber-800 font-medium">Awaiting {b.providerName} confirmation</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cancelMachineryBooking(b.id)}
                            className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                          >
                            Cancel Request
                          </button>
                          <button
                            onClick={() => {
                              setRescheduleBookingTarget(b);
                              setNewRescheduleDate(b.date);
                              setNewRescheduleSlot(b.timeSlot);
                            }}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold cursor-pointer"
                          >
                            Reschedule
                          </button>
                        </div>
                      </>
                    )}

                    {b.status === 'confirmed' && (
                      <>
                        <span className="text-emerald-800 font-bold">✓ Booking Confirmed & Slot Locked</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setRescheduleBookingTarget(b);
                              setNewRescheduleDate(b.date);
                              setNewRescheduleSlot(b.timeSlot);
                            }}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold cursor-pointer"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => cancelMachineryBooking(b.id)}
                            className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}

                    {b.status === 'reschedule_requested' && (
                      <div className="w-full p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center justify-between">
                        <span>Reschedule requested to {b.rescheduleDate} ({b.rescheduleTimeSlot}). Awaiting provider approval.</span>
                        <button
                          onClick={() => cancelMachineryBooking(b.id)}
                          className="text-xs text-rose-700 underline font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {b.status === 'dispatched' && (
                      <div className="w-full p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center justify-between text-xs font-semibold">
                        <span>🚚 Machine & Operator En Route to your field</span>
                        <button
                          onClick={() => cancelMachineryBooking(b.id)}
                          className="text-xs text-rose-700 underline font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {b.status === 'arrived' && (
                      <div className="w-full p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 flex items-center justify-between text-xs font-semibold">
                        <span>📍 Machine Arrived at Farm Location</span>
                        <span className="text-[11px] text-blue-800">Ready to start</span>
                      </div>
                    )}

                    {(b.status === 'in_progress' || b.status === 'in_service') && (
                      <div className="w-full p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 flex items-center justify-between text-xs font-semibold">
                        <span>⚡ Service Currently In Progress at farm</span>
                        <span className="text-[11px] text-blue-800 animate-pulse">Live Operation</span>
                      </div>
                    )}

                    {b.status === 'completed' && (
                      <div className="w-full p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs font-semibold">
                        <span>✓ Job Completed Successfully & Payment Settled</span>
                        <span className="text-[11px] text-emerald-700">Fulfilled</span>
                      </div>
                    )}

                    {b.status === 'rejected' && (
                      <span className="text-rose-800 font-medium">Request declined by provider. Slot freed.</span>
                    )}

                    {b.status === 'cancelled' && (
                      <span className="text-slate-500 font-medium">Booking cancelled. Slot freed.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FARMER MACHINERY REQUIREMENTS */}
      {activeSubTab === 'incoming_requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Farmer Posted Machinery Requirements ({machineryRequirements.length})
              </h3>
              <p className="text-xs text-slate-500">
                Direct equipment needs broadcast by regional farmers seeking machinery quotes.
              </p>
            </div>

            <button
              onClick={() => setShowPostReqModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Post Need</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machineryRequirements.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Farmer Request</span>
                    <h4 className="text-sm font-bold text-slate-900">{req.machineType}</h4>
                    {req.attachment && (
                      <span className="inline-block text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium mt-1">
                        Attachment: {req.attachment}
                      </span>
                    )}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    req.status === 'open'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Date & Shift:</span>
                    <span className="font-bold text-slate-800">{req.date} ({req.timeSlot || 'Day Shift'})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Duration & Location:</span>
                    <span className="font-semibold">{req.durationHours} hrs · {req.farmLocation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Target Crop & Purpose:</span>
                    <span className="font-semibold">{req.crop || 'General'} · {req.workPurpose || 'Farm prep'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Max Budget:</span>
                    <span className="font-extrabold text-emerald-800">₹{req.maxBudget.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100 italic">
                    &ldquo;{req.notes}&rdquo;
                  </p>
                )}

                {/* Provider Actions */}
                <div className="pt-2 border-t border-slate-100">
                  {respondingReqId === req.id ? (
                    <div className="space-y-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">Proposed Rate (₹/hr)</label>
                          <input
                            type="number"
                            value={proposedRate}
                            onChange={e => setProposedRate(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block">Notes</label>
                          <input
                            type="text"
                            value={proposalNotes}
                            onChange={e => setProposalNotes(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            respondToMachineryRequirement(req.id, proposedRate, proposalNotes);
                            setRespondingReqId(null);
                          }}
                          className="flex-1 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Submit Proposal
                        </button>
                        <button
                          onClick={() => setRespondingReqId(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingReqId(req.id)}
                      className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isTa ? 'ஆஃபர் அனுப்ப' : 'Submit Rental Offer'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROVIDER DASHBOARD */}
      {activeSubTab === 'provider_dashboard' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Machinery Fleet Console (Ravi Farm Machinery Services):</strong>
              <p className="mt-0.5">
                Manage incoming equipment requests, lock individual machine schedules, and progress service stages (**Dispatch → Arrive → Start → Complete**).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Incoming Rental Requests ({machineryBookings.filter(b => b.status === 'requested' || b.status === 'reschedule_requested').length} Action Required)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machineryBookings.map(b => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Farmer</span>
                      <h4 className="text-sm font-bold text-slate-900">{b.farmerName}</h4>
                      <div className="text-xs text-slate-600 mt-0.5">{b.farmerLocation}</div>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Requested Unit:</span>
                      <span className="font-bold text-slate-800">{b.machineName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Purpose & Crop:</span>
                      <span className="font-semibold text-slate-800">{b.workPurpose}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Date & Shift:</span>
                      <span className="font-semibold text-slate-800">{b.date} ({b.timeSlot})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Rental Estimate:</span>
                      <span className="font-bold text-emerald-800">
                        {b.durationHours} hrs · ₹{b.estimatedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-600 italic">
                      &ldquo;{b.notes}&rdquo;
                    </p>
                  )}

                  {/* Reschedule Request Handler */}
                  {b.status === 'reschedule_requested' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-2">
                      <div>
                        <strong>Reschedule Request:</strong> Farmer requested to move to{' '}
                        <strong>{b.rescheduleDate}</strong> ({b.rescheduleTimeSlot}).
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveMachineryReschedule(b.id)}
                          className="flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Approve Reschedule
                        </button>
                        <button
                          onClick={() => rejectMachineryBooking(b.id, 'Reschedule slot not feasible')}
                          className="px-3 py-1.5 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Provider Lifecycle Actions */}
                  {b.status === 'requested' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => acceptMachineryBooking(b.id)}
                        className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-amber-300" />
                        <span>Accept & Lock Slot</span>
                      </button>
                      <button
                        onClick={() => rejectMachineryBooking(b.id, 'Unit booked for maintenance or prior commitment.')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {b.status === 'confirmed' && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-emerald-800 font-bold">✓ Confirmed & Slot Locked</span>
                      <button
                        onClick={() => updateMachineryBookingStatus(b.id, 'dispatched')}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-300" />
                        <span>Dispatch Machine →</span>
                      </button>
                    </div>
                  )}

                  {b.status === 'dispatched' && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-amber-800 font-bold">🚚 Dispatched En Route</span>
                      <button
                        onClick={() => updateMachineryBookingStatus(b.id, 'arrived')}
                        className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Mark Machine Arrived →</span>
                      </button>
                    </div>
                  )}

                  {b.status === 'arrived' && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-blue-800 font-bold">📍 Arrived at Farm</span>
                      <button
                        onClick={() => updateMachineryBookingStatus(b.id, 'in_progress')}
                        className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        Start Service →
                      </button>
                    </div>
                  )}

                  {(b.status === 'in_progress' || b.status === 'in_service') && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-blue-800 font-bold">⚡ Service In Progress</span>
                      <button
                        onClick={() => updateMachineryBookingStatus(b.id, 'completed')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        Complete Service & Release Slot ✓
                      </button>
                    </div>
                  )}

                  {b.status === 'completed' && (
                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-semibold flex items-center justify-between">
                      <span className="text-emerald-800">✓ Service Completed</span>
                      <span className="text-slate-400">Unit slot released & available</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Machine Specifications & Details Modal */}
      {selectedMachineForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isTa && selectedMachineForDetails.machineNameTa ? selectedMachineForDetails.machineNameTa : selectedMachineForDetails.machineName}
                </h3>
                <span className="text-xs text-emerald-800 font-semibold">
                  {selectedMachineForDetails.category} · {selectedMachineForDetails.baseLocation}
                </span>
              </div>
              <button
                onClick={() => setSelectedMachineForDetails(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={selectedMachineForDetails.imageUrl}
                alt={selectedMachineForDetails.machineName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = getFallbackMachineryImage(selectedMachineForDetails.category || selectedMachineForDetails.machineName);
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                ₹{selectedMachineForDetails.hourlyRate} / hour
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedMachineForDetails.description}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">BRAND / MODEL</span>
                <span className="font-bold text-slate-900">{selectedMachineForDetails.brandModel}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">PROVIDER</span>
                <span className="font-bold text-slate-900">{selectedMachineForDetails.providerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">MINIMUM BOOKING</span>
                <span className="font-semibold text-slate-800">{selectedMachineForDetails.minBookingDurationHours || 2} Hours</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">SERVICE RADIUS</span>
                <span className="font-semibold text-slate-800">{selectedMachineForDetails.serviceRadiusKm || 25} KM Radius</span>
              </div>
            </div>

            {selectedMachineForDetails.attachments && selectedMachineForDetails.attachments.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-900 block">Available Implements & Attachments:</span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {selectedMachineForDetails.attachments.map((att, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-xl font-semibold">
                      ✓ {att}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setSelectedMachineForBooking(selectedMachineForDetails);
                  setSelectedMachineForDetails(null);
                }}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Wrench className="w-4 h-4 text-amber-300" />
                <span>Request Equipment Rental</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Request Booking Modal */}
      {selectedMachineForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Equipment Rental
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedMachineForBooking.machineName} · {selectedMachineForBooking.providerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedMachineForBooking(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {bookingFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  bookingFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {bookingFeedback.text}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              {/* Attachment selector for Tractor */}
              {selectedMachineForBooking.category === 'Tractor' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Select Required Implement / Attachment:</label>
                  <select
                    value={selectedAttachment}
                    onChange={e => setSelectedAttachment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    {TRACTOR_ATTACHMENTS.map(att => (
                      <option key={att.id} value={att.name}>
                        {isTa ? att.nameTa : att.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Required Date:</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Shift Time Slot:</label>
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning)</option>
                    <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM (Afternoon)</option>
                    <option value="08:00 AM - 04:00 PM">08:00 AM - 04:00 PM (Full Day)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Duration (Hours):</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={durationHours}
                    onChange={e => setDurationHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Target Crop:</label>
                  <select
                    value={crop}
                    onChange={e => setCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Paddy">Paddy</option>
                    <option value="Coconut">Coconut</option>
                    <option value="Maize">Maize</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Banana">Banana</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Work Purpose / Operation:</label>
                <select
                  value={workPurpose}
                  onChange={e => setWorkPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {MACHINERY_WORK_PURPOSES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Farm Location Address:</label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={e => setFarmLocation(e.target.value)}
                  placeholder="e.g. Anamalai Road, Pollachi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Notes for Operator:</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              {/* Cost Calculation & Platform Fee breakdown */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Estimated Rental ({durationHours} hrs × ₹{selectedMachineForBooking.hourlyRate}/hr):</span>
                  <span className="font-bold">₹{(durationHours * selectedMachineForBooking.hourlyRate).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Platform Service Fee (2%):</span>
                  <span>₹{Math.round(durationHours * selectedMachineForBooking.hourlyRate * 0.02)}</span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1 border-t border-emerald-200/60 italic">
                  *2% platform service fee applies to machinery booking value. Zero crop commission deducted.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-amber-300" />
                <span>Submit Rental Request</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Post Machinery Requirement Modal */}
      {showPostReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isTa ? 'புதிய இயந்திர தேவை பதிவிட' : 'Post Machinery Requirement'}
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast custom equipment needs to verified regional providers.
                </p>
              </div>
              <button
                onClick={() => setShowPostReqModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reqFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold">
                {reqFeedback}
              </div>
            )}

            <form onSubmit={handlePostRequirementSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Machinery Type Needed:</label>
                <select
                  value={reqMachineType}
                  onChange={e => setReqMachineType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {MACHINERY_CATALOGUE.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({isTa ? m.nameTa : m.category})
                    </option>
                  ))}
                </select>
              </div>

              {reqMachineType === 'Tractor' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Required Implement / Attachment:</label>
                  <select
                    value={reqAttachment}
                    onChange={e => setReqAttachment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    {TRACTOR_ATTACHMENTS.map(a => (
                      <option key={a.id} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Target Crop:</label>
                  <select
                    value={reqCrop}
                    onChange={e => setReqCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {cropFilterList.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Work Operation:</label>
                  <select
                    value={reqPurpose}
                    onChange={e => setReqPurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {MACHINERY_WORK_PURPOSES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Required Date:</label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={e => setReqDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Time Slot:</label>
                  <select
                    value={reqTimeSlot}
                    onChange={e => setReqTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning)</option>
                    <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM (Afternoon)</option>
                    <option value="08:00 AM - 04:00 PM">08:00 AM - 04:00 PM (Full Day)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Farm Acreage / Area:</label>
                  <input
                    type="text"
                    value={reqAcreage}
                    onChange={e => setReqAcreage(e.target.value)}
                    placeholder="e.g. 3 Acres"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Max Expected Budget (₹):</label>
                  <input
                    type="number"
                    value={reqBudget}
                    onChange={e => setReqBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-emerald-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Farm Location (Village, Taluk, District):</label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={e => setReqLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Additional Notes:</label>
                <textarea
                  value={reqNotes}
                  onChange={e => setReqNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Broadcast Machinery Requirement</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Reschedule Modal */}
      {rescheduleBookingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Reschedule
                </h3>
                <p className="text-xs text-slate-500">
                  {rescheduleBookingTarget.machineName} · {rescheduleBookingTarget.providerName}
                </p>
              </div>
              <button
                onClick={() => setRescheduleBookingTarget(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">New Required Date:</label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={e => setNewRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">New Shift Slot:</label>
                <select
                  value={newRescheduleSlot}
                  onChange={e => setNewRescheduleSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning)</option>
                  <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM (Afternoon)</option>
                  <option value="08:00 AM - 04:00 PM">08:00 AM - 04:00 PM (Full Day)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs">
                Requesting a new slot sends a reschedule proposal to <strong>{rescheduleBookingTarget.providerName}</strong>. If approved, old slot is released and new slot is locked.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-xl shadow-2xs"
              >
                Submit Reschedule Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
