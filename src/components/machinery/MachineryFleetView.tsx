import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Edit3,
  MapPin,
  ShieldCheck,
  X,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MachineItem } from '../../types';
import { getFallbackMachineryImage, MACHINERY_CATEGORIES } from '../../data/machineryCatalogue';

export const MachineryFleetView: React.FC = () => {
  const { currentUser, machinery, language } = useApp();
  const isTa = language === 'ta';

  // State for specs and edit schedule modals
  const [selectedSpecsMachine, setSelectedSpecsMachine] = useState<MachineItem | null>(null);
  const [selectedScheduleMachine, setSelectedScheduleMachine] = useState<MachineItem | null>(null);
  const [showAddMachineModal, setShowAddMachineModal] = useState(false);

  // New Machine Form state
  const [newMachineName, setNewMachineName] = useState('');
  const [newCategory, setNewCategory] = useState<MachineItem['category']>('Tractor');
  const [newBrandModel, setNewBrandModel] = useState('');
  const [newHourlyRate, setNewHourlyRate] = useState(1200);
  const [newDailyRate, setNewDailyRate] = useState(8000);
  const [newLocation, setNewLocation] = useState(currentUser.district || 'Pollachi');

  // Provider's machinery list
  const providerFleet =
    currentUser.role === 'machinery' || currentUser.id === 'prov_ravi_machinery'
      ? machinery
      : machinery.filter(
          m =>
            m.providerId === currentUser.id ||
            m.providerId === 'prov_ravi_machinery' ||
            m.providerName.toLowerCase().includes(currentUser.name.toLowerCase())
        );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-amber-600" />
              <span>{isTa ? 'எனது இயந்திரப் படை' : 'My Equipment Fleet'}</span>
            </h1>
            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-amber-300">
              {providerFleet.length} {isTa ? 'இயந்திரங்கள்' : 'Machines'}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {isTa
              ? 'உங்கள் வேளாண் இயந்திரங்களின் வாடகை விலை, கிடைக்கும் நாட்கள் மற்றும் அட்டவணையை நிர்வகிக்கவும்.'
              : 'Manage rental pricing, active schedule slots, and specifications for your equipment fleet.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddMachineModal(true)}
          className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>{isTa ? '+ புதிய இயந்திரம் சேர்க்க' : '+ Add Machine to Fleet'}</span>
        </button>
      </div>

      {/* Machinery Catalogue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providerFleet.map(machine => {
          const bookedSlotsCount = machine.schedule.filter(
            s => s.status === 'booked' || s.status === 'slot_held'
          ).length;

          return (
            <div
              key={machine.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={machine.imageUrl}
                  alt={machine.machineName}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = getFallbackMachineryImage(machine.category);
                  }}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold text-slate-900 shadow-sm border border-slate-200">
                  {machine.category}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-900/90 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs border border-amber-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isTa ? 'சரிபார்க்கப்பட்டது' : 'Verified'}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                        {machine.machineName}
                      </h2>
                      {machine.machineNameTa && (
                        <p className="text-xs font-semibold text-amber-900/80 mt-0.5">
                          {machine.machineNameTa}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {machine.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {machine.attachments.map((att, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200"
                      >
                        + {att}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{isTa ? 'மணி நேரக் கட்டணம்' : 'Hourly Rate'}</span>
                      <span className="text-base font-black text-emerald-800">
                        ₹{machine.hourlyRate.toLocaleString('en-IN')} <span className="text-xs font-bold text-slate-500">/ Hr</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{isTa ? 'நாள் கட்டணம்' : 'Daily Rate'}</span>
                      <span className="text-sm font-extrabold text-slate-800">
                        ₹{machine.dailyRate.toLocaleString('en-IN')} / Day
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{machine.baseLocation}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-800 font-bold">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {bookedSlotsCount > 0 ? `${bookedSlotsCount} Booked Slots` : 'Fully Available'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedSpecsMachine(machine)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isTa ? 'விவரங்கள்' : 'View Specs'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedScheduleMachine(machine)}
                      className="py-2 px-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isTa ? 'அட்டவணை' : 'Edit Schedule'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Specs */}
      {selectedSpecsMachine && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedSpecsMachine.machineName}
                </h3>
                <p className="text-xs text-amber-800 font-semibold">
                  {selectedSpecsMachine.category} · {selectedSpecsMachine.brandModel}
                </p>
              </div>
              <button
                onClick={() => setSelectedSpecsMachine(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedSpecsMachine.imageUrl}
              alt={selectedSpecsMachine.machineName}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = getFallbackMachineryImage(selectedSpecsMachine.category);
              }}
              className="w-full h-48 object-cover rounded-2xl border border-slate-200"
            />

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-extrabold text-slate-900 block mb-1">{isTa ? 'விளக்கம்' : 'Description'}</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  {selectedSpecsMachine.description}
                </p>
              </div>

              <div>
                <span className="font-extrabold text-slate-900 block mb-1">{isTa ? 'இணைப்புகள் / கருவிகள்' : 'Attachments Included'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSpecsMachine.attachments.map((att, idx) => (
                    <span key={idx} className="bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                      ✓ {att}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 font-semibold">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{isTa ? 'குறைந்தபட்ச முன்பதிவு' : 'Min Duration'}</span>
                  <span className="text-slate-900 font-bold">{selectedSpecsMachine.minBookingDurationHours} Hours</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">{isTa ? 'சேவை எல்லை' : 'Service Radius'}</span>
                  <span className="text-slate-900 font-bold">{selectedSpecsMachine.serviceRadiusKm} KM</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedSpecsMachine(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              {isTa ? 'மூடு' : 'Close Details'}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Edit Schedule */}
      {selectedScheduleMachine && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedScheduleMachine.machineName} — {isTa ? 'அட்டவணை' : 'Schedule Slots'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isTa ? 'நாட்களைக் கிடைப்பதாகவோ அல்லது பராமரிப்பாகவோ மாற்றவும்.' : 'Toggle slot availability or mark days for maintenance.'}
                </p>
              </div>
              <button
                onClick={() => setSelectedScheduleMachine(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {selectedScheduleMachine.schedule.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div>
                    <strong className="text-slate-900">{slot.date}</strong>
                    <span className="text-slate-500 block text-[11px]">{slot.timeSlot}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                    slot.status === 'booked'
                      ? 'bg-rose-100 text-rose-800'
                      : slot.status === 'slot_held'
                      ? 'bg-amber-100 text-amber-800'
                      : slot.status === 'maintenance'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedScheduleMachine(null)}
              className="w-full py-2.5 bg-amber-800 text-white font-bold text-xs rounded-xl hover:bg-amber-900 transition-colors"
            >
              {isTa ? 'அட்டவணையைச் சேமி' : 'Save & Close Schedule'}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add New Machine */}
      {showAddMachineModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {isTa ? '+ புதிய இயந்திரம் சேர்க்க' : '+ Add Equipment to Fleet'}
              </h3>
              <button
                onClick={() => setShowAddMachineModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{isTa ? 'இயந்திர பெயர்' : 'Machine Name'}</label>
                <input
                  type="text"
                  value={newMachineName}
                  onChange={e => setNewMachineName(e.target.value)}
                  placeholder="e.g. Sonalika 50HP Heavy Tractor"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{isTa ? 'வகை' : 'Category'}</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                >
                  {MACHINERY_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isTa ? 'மணி நேர கட்டணம்' : 'Hourly Rate (₹)'}</label>
                  <input
                    type="number"
                    value={newHourlyRate}
                    onChange={e => setNewHourlyRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{isTa ? 'நாள் கட்டணம்' : 'Daily Rate (₹)'}</label>
                  <input
                    type="number"
                    value={newDailyRate}
                    onChange={e => setNewDailyRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddMachineModal(false)}
              className="w-full py-2.5 bg-amber-800 text-white font-bold text-xs rounded-xl hover:bg-amber-900 transition-colors"
            >
              {isTa ? 'இயந்திரத்தைப் பதிவு செய்க' : 'Save Machine to Fleet'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
