import React, { useState } from 'react';
import {
  User,
  Building,
  Phone,
  ShieldCheck,
  Truck,
  MapPin,
  FileText,
  Settings,
  CheckCircle2,
  Plus,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustRingAvatar } from '../common/TrustRingAvatar';

export const LogisticsProfileView: React.FC = () => {
  const { currentUser, logisticsPartners } = useApp();

  const partnerInfo = logisticsPartners[0] || {
    id: 'log_kongu_transport',
    companyName: 'Annai Transport Logistics',
    contactPerson: 'K. Senthil Kumar',
    mobile: '9842211000',
    vehicleType: '1.5-Ton Covered Produce Truck',
    vehicleNumber: 'TN 37 CY 8842',
    capacityKg: 3500,
    serviceDistricts: ['Coimbatore', 'Tiruppur', 'Erode', 'Dindigul'],
  };

  const [companyName, setCompanyName] = useState(partnerInfo.companyName);
  const [contactPerson, setContactPerson] = useState(partnerInfo.contactPerson);
  const [mobile, setMobile] = useState(partnerInfo.mobile);
  const [serviceDistricts, setServiceDistricts] = useState(partnerInfo.serviceDistricts.join(', '));
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Sample drivers and vehicles list
  const driversList = [
    { id: 'drv_1', name: 'S. Shanmugam', mobile: '9842411999', licenseNo: 'TN37 2018004821', status: 'Active / Assigned' },
    { id: 'drv_2', name: 'M. Palanisamy', mobile: '9443188200', licenseNo: 'TN38 2015009123', status: 'Available' },
    { id: 'drv_3', name: 'R. Velusamy', mobile: '9789123411', licenseNo: 'TN37 2020003112', status: 'Available' },
  ];

  const fleetList = [
    { id: 'vh_1', regNo: 'TN 37 CY 8842', type: '1.5-Ton Bolero Covered Truck', capacity: '1,500 KG', status: 'In Service' },
    { id: 'vh_2', regNo: 'TN 38 BX 5521', type: '3.5-Ton Mandi Carrier', capacity: '3,500 KG', status: 'Available' },
    { id: 'vh_3', regNo: 'TN 37 AK 9901', type: 'Refrigerated Produce Van', capacity: '2,000 KG', status: 'Available' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-800" />
            <span>Logistics Partner Business Profile & Fleet Management</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Partner verification, active vehicles, drivers list, and service area settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Identity & Verification Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4 text-center">
            <div className="flex justify-center">
              <TrustRingAvatar
                user={{
                  name: companyName,
                  role: 'logistics',
                  district: 'Coimbatore',
                  trust: currentUser.trust,
                  isVerified: true,
                }}
                size="xl"
              />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{companyName}</h3>
              <p className="text-xs text-slate-500">{contactPerson} · Lead Carrier</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-semibold space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>KYC & Transport License Verified</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Verified Carrier with 0% direct farmer fee compliance.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mobile Contact:</span>
                <span className="font-bold text-slate-900">{mobile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Primary District:</span>
                <span className="font-bold text-slate-900">Coimbatore / Pollachi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Trust Tier:</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {currentUser.trust.title}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance Documents */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-emerald-800" />
              <span>Compliance Documents & Verification</span>
            </h4>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Commercial Vehicle Goods Permit</span>
                  <span className="text-[10px] text-slate-400">Permit # TN37-GP-2024-9122</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Verified
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">GSTIN / Business Registration</span>
                  <span className="text-[10px] text-slate-400">33AABCU9603R1ZM</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Verified
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Goods Transit Insurance</span>
                  <span className="text-[10px] text-slate-400">Coverage up to ₹10,00,000</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ✓ Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Drivers, Vehicles & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Fleet Vehicles */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-800" />
                <span>Registered Vehicles / Fleet ({fleetList.length})</span>
              </h3>
              <button className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {fleetList.map(vh => (
                <div key={vh.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{vh.regNo}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {vh.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{vh.type}</p>
                  <span className="text-[11px] text-slate-500 block pt-1">
                    Payload Capacity: <strong>{vh.capacity}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Registered Drivers */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-800" />
                <span>Registered Drivers ({driversList.length})</span>
              </h3>
              <button className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Driver</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {driversList.map(drv => (
                <div
                  key={drv.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-slate-900">{drv.name}</span>
                    <div className="text-[11px] text-slate-500">
                      Mobile: <strong>{drv.mobile}</strong> · License: {drv.licenseNo}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-xl self-start sm:self-center">
                    {drv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Service Area Settings Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-700" />
              <span>Carrier Contact Settings & Operating Districts</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Business / Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Service Area Districts</label>
                  <input
                    type="text"
                    value={serviceDistricts}
                    onChange={e => setServiceDistricts(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    placeholder="Coimbatore, Tiruppur, Erode, Dindigul"
                    required
                  />
                </div>
              </div>

              {savedFeedback && (
                <div className="p-3 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-center">
                  ✓ Profile settings saved successfully!
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Settings</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
