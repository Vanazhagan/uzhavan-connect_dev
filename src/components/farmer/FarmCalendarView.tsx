import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  AlertTriangle,
  Users,
  Wrench,
  Layers,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmCalendarEvent } from '../../types';

export const FarmCalendarView: React.FC = () => {
  const {
    t,
    language,
    currentRole,
    currentUser,
    calendarEvents,
    workerBookings,
    machinery,
    machineryBookings,
    deliveryRequests,
    addCalendarEvent,
    setActiveTab,
  } = useApp();

  const isTa = language === 'ta';
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [cropName, setCropName] = useState('Coconut');
  const [expectedDate, setExpectedDate] = useState('2026-10-10');
  const [expectedQty, setExpectedQty] = useState(2000);
  const [farmField, setFarmField] = useState('North Acre Plot (Grove Section)');
  const [notes, setNotes] = useState('Planned coconut harvest into grove collection yard for wholesale buyers.');

  // If user is logged in as MACHINERY PROVIDER, render Machinery Rental Schedule Calendar
  if (currentRole === 'machinery') {
    const providerFleet = machinery;
    const providerBookings = machineryBookings;

    const requestedCount = providerBookings.filter(b => b.status === 'requested').length;
    const confirmedCount = providerBookings.filter(
      b => b.status === 'confirmed' || b.status === 'accepted'
    ).length;
    const activeCount = providerBookings.filter(
      b =>
        b.status === 'dispatched' ||
        b.status === 'arrived' ||
        b.status === 'in_progress' ||
        b.status === 'in_service'
    ).length;

    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-amber-600" />
                <span>
                  {isTa ? 'இயந்திர வாடகை & சேவை நாட்காட்டி' : 'Machinery Rental & Equipment Calendar'}
                </span>
              </h2>
              <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-amber-300">
                {currentUser.businessName || 'Ravi Agricultural Machinery Hub'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {isTa
                ? 'உங்கள் இயந்திரப் படையின் முன்பதிவுகள், களப் பணிகள் மற்றும் கிடைக்கும் நேரங்களை நாட்காட்டியில் பார்க்கவும்.'
                : 'Real-time equipment schedule, farmer booking allocations, and machine slot availability matrix.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('bookingRequests')}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {isTa ? 'முன்பதிவு கோரிக்கைகள்' : 'Manage Bookings'}
            </button>
            <button
              onClick={() => setActiveTab('myMachinery')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {isTa ? 'இயந்திரப் படை' : 'View Fleet'}
            </button>
          </div>
        </div>

        {/* Metric KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'மொத்த இயந்திரங்கள்' : 'Total Fleet'}</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{providerFleet.length}</div>
            <span className="text-[11px] text-amber-800 font-medium">{isTa ? 'சேவையில் உள்ளன' : 'Listed in hub'}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'உறுதி செய்யப்பட்டது' : 'Confirmed Jobs'}</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">{confirmedCount}</div>
            <span className="text-[11px] text-emerald-700 font-medium">{isTa ? 'அட்டவணைப்படுத்தப்பட்டது' : 'In schedule'}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'களத்தில் இயங்குபவை' : 'Active In Field'}</span>
            <div className="text-2xl font-black text-blue-800 mt-1">{activeCount}</div>
            <span className="text-[11px] text-blue-700 font-medium">{isTa ? 'வேலையில் உள்ளது' : 'Dispatched / Working'}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500">{isTa ? 'புதிய கோரிக்கைகள்' : 'Pending Requests'}</span>
            <div className="text-2xl font-black text-amber-800 mt-1">{requestedCount}</div>
            <span className="text-[11px] text-amber-700 font-medium">{isTa ? 'ஒப்புதலுக்கு காத்திருக்கிறது' : 'Awaiting confirmation'}</span>
          </div>
        </div>

        {/* Scheduled Equipment Bookings List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              <span>{isTa ? 'அட்டவணைப்படுத்தப்பட்ட இயந்திர முன்பதிவுகள்' : 'Scheduled Equipment Reservations'}</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {providerBookings.length} {isTa ? 'முன்பதிவுகள்' : 'Bookings'}
            </span>
          </div>

          <div className="space-y-3">
            {providerBookings.map(b => (
              <div
                key={b.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-extrabold text-slate-900">{b.machineName}</strong>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'requested'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span>Farmer: <strong>{b.farmerName}</strong></span>
                    <span>·</span>
                    <span>Date: <strong>{b.date} ({b.timeSlot})</strong></span>
                    <span>·</span>
                    <span>Location: <strong>{b.farmerLocation}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-800 block">
                    ₹{b.estimatedCost.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => setActiveTab('bookingRequests')}
                    className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                  >
                    {isTa ? 'விவரங்கள் →' : 'View Details →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Schedule Slots Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>{isTa ? 'இயந்திரங்கள் நேர स्लாட் நிலை' : 'Equipment Availability & Slot Allocations'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providerFleet.slice(0, 6).map(machine => (
              <div key={machine.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="truncate">{machine.machineName}</span>
                  <span className="text-emerald-800 font-black">₹{machine.hourlyRate}/Hr</span>
                </div>
                <div className="space-y-1">
                  {machine.schedule.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-slate-200/60">
                      <span className="text-slate-700 font-semibold">{slot.date} ({slot.timeSlot})</span>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        slot.status === 'booked' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {slot.status === 'booked' ? `Booked (${slot.farmerName || 'Farmer'})` : 'Available'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventUnit = cropName === 'Coconut' ? 'Coconuts' : 'KG';
    const newEvent: Partial<FarmCalendarEvent> = {
      title: `${cropName} Harvest Plan (${expectedQty.toLocaleString('en-IN')} ${eventUnit})`,
      titleTa: `${cropName} அறுவடை திட்டம் (${expectedQty.toLocaleString('en-IN')} ${eventUnit})`,
      date: expectedDate,
      time: '07:00 AM - 01:00 PM',
      type: 'harvest',
      cropName,
      quantityKg: expectedQty,
      unit: eventUnit,
      weatherAlert: false,
      status: 'scheduled',
      details: `${farmField} · ${notes}`,
    };

    addCalendarEvent(newEvent);
    setShowAddModal(false);
  };

  // Dynamically compute real booking statuses for the planned harvest preparation
  const activeWorkerBooking = workerBookings.find(
    b => b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'completed'
  ) || workerBookings.find(b => b.status === 'requested') || workerBookings[0];

  const activeMachineryBooking = machineryBookings.find(
    b => b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'completed'
  ) || machineryBookings.find(b => b.status === 'requested' || b.status === 'reschedule_requested') || machineryBookings[0];

  const activeLogisticsDelivery = deliveryRequests.find(
    d => d.status !== 'requested' && d.status !== 'rejected'
  ) || deliveryRequests.find(d => d.status === 'requested') || deliveryRequests[0];

  const workerStatusConfirmed = activeWorkerBooking && (activeWorkerBooking.status === 'confirmed' || activeWorkerBooking.status === 'in_progress' || activeWorkerBooking.status === 'completed');
  const machineryStatusConfirmed = activeMachineryBooking && (activeMachineryBooking.status === 'confirmed' || activeMachineryBooking.status === 'in_progress' || activeMachineryBooking.status === 'completed');
  const logisticsStatusConfirmed = activeLogisticsDelivery && (activeLogisticsDelivery.status !== 'requested' && activeLogisticsDelivery.status !== 'rejected');

  const getEventIcon = (type: FarmCalendarEvent['type']) => {
    switch (type) {
      case 'harvest':
        return <Layers className="w-4 h-4 text-emerald-700" />;
      case 'worker_booking':
        return <Users className="w-4 h-4 text-blue-700" />;
      case 'machinery_booking':
        return <Wrench className="w-4 h-4 text-amber-700" />;
      case 'buyer_pickup':
        return <Truck className="w-4 h-4 text-purple-700" />;
      case 'logistics':
        return <Truck className="w-4 h-4 text-teal-700" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-slate-700" />;
    }
  };

  const getBadgeStyle = (event: FarmCalendarEvent) => {
    if (event.status === 'requested' || event.bookingStatus === 'requested') {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (event.status === 'cancelled' || event.bookingStatus === 'rejected') {
      return 'bg-rose-100 text-rose-900 border-rose-300';
    }
    switch (event.type) {
      case 'harvest':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'worker_booking':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'machinery_booking':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'buyer_pickup':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'logistics':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.calendar.title}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.calendar.subtitle} · Dynamically Synchronized with Real Provider Confirmation Statuses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.calendar.addPlan}</span>
        </button>
      </div>

      {/* Harvest Pre-Planning Callout Box */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 border border-emerald-200/80 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h4 className="text-sm font-bold text-emerald-950">
              Harvest Plan: 2,000 Coconut Harvest (October 5–10)
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            Integrated Plan
          </span>
        </div>

        <p className="text-xs text-slate-700">
          Preparation status reflects provider confirmations in real time:
        </p>

        {/* Dynamic status indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Workers Card */}
          <button
            onClick={() => setActiveTab('workers')}
            className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer group flex items-center justify-between ${
              workerStatusConfirmed
                ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-300'
                : 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 shrink-0 ${workerStatusConfirmed ? 'text-emerald-700' : 'text-amber-700'}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Workers: {workerStatusConfirmed ? 'Workers Confirmed' : 'Worker Request Pending'}
                </div>
                <div className={`text-[10px] font-semibold ${workerStatusConfirmed ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {activeWorkerBooking
                    ? `${activeWorkerBooking.workerName} · ${activeWorkerBooking.workersRequired} workers (${activeWorkerBooking.status.toUpperCase()})`
                    : '6 Workers · Action Required'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800" />
          </button>

          {/* Machinery Card */}
          <button
            onClick={() => setActiveTab('machinery')}
            className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer group flex items-center justify-between ${
              machineryStatusConfirmed
                ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-300'
                : 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wrench className={`w-4 h-4 shrink-0 ${machineryStatusConfirmed ? 'text-emerald-700' : 'text-amber-700'}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Machinery: {machineryStatusConfirmed ? 'Tractor Confirmed' : 'Machinery Request Pending'}
                </div>
                <div className={`text-[10px] font-semibold ${machineryStatusConfirmed ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {activeMachineryBooking
                    ? `${activeMachineryBooking.machineName} (${activeMachineryBooking.status.toUpperCase()})`
                    : 'Mahindra Tractor · Action Required'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800" />
          </button>

          {/* Logistics Card */}
          <button
            onClick={() => setActiveTab('logistics')}
            className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer group flex items-center justify-between ${
              logisticsStatusConfirmed
                ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-300'
                : 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className={`w-4 h-4 shrink-0 ${logisticsStatusConfirmed ? 'text-emerald-700' : 'text-amber-700'}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  Logistics: {logisticsStatusConfirmed ? 'Logistics Confirmed' : 'Logistics Request Pending'}
                </div>
                <div className={`text-[10px] font-semibold ${logisticsStatusConfirmed ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {activeLogisticsDelivery
                    ? `Oct 6 · ${activeLogisticsDelivery.quantityKg} ${activeLogisticsDelivery.unit || 'Coconuts'} (${activeLogisticsDelivery.status.toUpperCase()})`
                    : 'Oct 6 · Transport Needed'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-800" />
          </button>
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {t.calendar.upcomingEvents}
        </h3>

        <div className="space-y-3">
          {calendarEvents.map(event => {
            const isPending = event.status === 'requested' || event.bookingStatus === 'requested';

            return (
              <div
                key={event.id}
                className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {language === 'ta' ? event.titleTa : event.title}
                      </h4>
                      {event.relatedEntityName && (
                        <span className="text-xs text-slate-500">
                          Provider / Unit: {event.relatedEntityName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                        event
                      )}`}
                    >
                      {isPending ? 'REQUEST PENDING' : event.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 tabular-nums">
                      {event.date}
                    </span>
                  </div>
                </div>

                {event.details && (
                  <p className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    {event.details}
                  </p>
                )}

                {/* Weather Alert if tied to this date */}
                {event.weatherAlert && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Weather Alert:</strong> {event.weatherNote} (Informs the farmer; schedule remains under farmer command).
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Harvest Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t.calendar.addPlan}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.crops.cropName}
                  </label>
                  <select
                    value={cropName}
                    onChange={e => setCropName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800"
                  >
                    <option value="Tomato">Tomato (தக்காளி)</option>
                    <option value="Paddy">Paddy / Rice (நெல்)</option>
                    <option value="Coconut">Coconut (தேங்காய்)</option>
                    <option value="Onion">Small Onion (சின்ன வெங்காயம்)</option>
                    <option value="Turmeric">Turmeric (மஞ்சள்)</option>
                    <option value="Maize">Maize / Corn (மக்காச்சோளம்)</option>
                    <option value="Banana">Banana (வாழை)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.calendar.expectedDate}
                  </label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={e => setExpectedDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.calendar.expectedQty}
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={expectedQty}
                    onChange={e => setExpectedQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Farm Field / Acre
                  </label>
                  <input
                    type="text"
                    value={farmField}
                    onChange={e => setFarmField(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                    placeholder="e.g. North Plot"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.calendar.notes}
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
                  placeholder="Notes regarding harvesting crates, worker shifts, or irrigation schedule..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {t.calendar.saveEvent}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
