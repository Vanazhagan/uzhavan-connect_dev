import React, { useState } from 'react';
import { ShieldCheck, X, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, language, submitKycVerification } = useApp();
  const isTa = language === 'ta';

  // Role-specific form fields
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [businessName, setBusinessName] = useState(currentUser.businessName || '');
  const [district, setDistrict] = useState(currentUser.district || 'Coimbatore');
  const [taluk, setTaluk] = useState(currentUser.taluk || 'Pollachi');
  const [village, setVillage] = useState(currentUser.village || 'Anamalai');
  const [idType, setIdType] = useState('Aadhaar (Demo Reference)');
  const [idLastFour, setIdLastFour] = useState('8901');
  const [gstOrPan, setGstOrPan] = useState(currentUser.gstNumber || '33AAAAA0000A1Z5');
  const [drivingLicence, setDrivingLicence] = useState('TN-37-2022-0098421');
  const [vehicleRc, setVehicleRc] = useState(currentUser.vehicleNumber || 'TN 37 CY 4052');
  const [landRef, setLandRecordRef] = useState('Patta No. 1042 / Survey 405/2A');
  const [docNotes, setDocNotes] = useState('Demo Identity Verification Document uploaded for Admin Review.');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const kycDetails = {
      idType,
      idNumberMasked: `ID ending in ${idLastFour} (Demo)`,
      businessName: businessName || fullName,
      gstOrPanMasked: gstOrPan ? `GST/PAN: ${gstOrPan.slice(0, 4)}...${gstOrPan.slice(-3)}` : undefined,
      drivingLicenceMasked: drivingLicence ? `DL: ${drivingLicence.slice(0, 4)}...${drivingLicence.slice(-4)}` : undefined,
      vehicleRcMasked: vehicleRc ? `RC: ${vehicleRc}` : undefined,
      landRecordRefMasked: landRef ? `Land Ref: ${landRef}` : undefined,
      documents: [
        {
          docType: idType,
          docNumberMasked: `Ending in ${idLastFour}`,
          submittedAt: new Date().toISOString().split('T')[0],
          proofName: 'Demo Identity Document Reference (Hackathon Safe)',
        },
      ],
    };

    submitKycVerification(currentUser.id, currentUser.role, kycDetails);
    setIsSubmittedSuccess(true);
  };

  const currentStatus = currentUser.verificationStatus || 'NOT_VERIFIED';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150 border border-slate-200">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <h3 className="text-lg font-black text-slate-900">
                {isTa ? 'அடையாள & கணக்கு சரிபார்ப்பு (KYC)' : 'Identity & Profile KYC Verification'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTa
                ? 'உங்கள் கணக்கை சரிபார்த்து Uzhavan Connect தளத்தில் சரிபார்க்கப்பட்ட முத்திரையைப் பெறுங்கள்.'
                : 'Role-based document submission for Admin Verification & Official Badge'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Verification Status Banner */}
        <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
          currentStatus === 'VERIFIED' || currentStatus === 'verified'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : currentStatus === 'VERIFICATION_PENDING' || currentStatus === 'pending'
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : currentStatus === 'REJECTED' || currentStatus === 'rejected'
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between font-extrabold">
            <span className="flex items-center gap-1.5">
              {currentStatus === 'VERIFIED' || currentStatus === 'verified' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : currentStatus === 'VERIFICATION_PENDING' || currentStatus === 'pending' ? (
                <Clock className="w-4 h-4 text-amber-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>
                {currentStatus === 'VERIFIED' || currentStatus === 'verified'
                  ? (isTa ? 'கணக்கு சரிபார்க்கப்பட்டது (Verified ✓)' : 'Profile Verified ✓')
                  : currentStatus === 'VERIFICATION_PENDING' || currentStatus === 'pending'
                  ? (isTa ? 'அட்மின் ஆய்வு நிலுவையில் உள்ளது' : 'Verification Submitted — Pending Admin Review')
                  : currentStatus === 'REJECTED' || currentStatus === 'rejected'
                  ? (isTa ? 'சரிபார்ப்பு நிராகரிக்கப்பட்டது' : 'Verification Declined by Admin')
                  : (isTa ? 'சரிபார்க்கப்படவில்லை' : 'Not Yet Verified')}
              </span>
            </span>
            <span className="uppercase text-[10px] px-2 py-0.5 rounded font-bold border bg-white/80">
              {currentStatus}
            </span>
          </div>

          <p className="text-[11px] text-slate-600">
            {currentStatus === 'VERIFIED' || currentStatus === 'verified'
              ? (isTa
                  ? 'உங்கள் கணக்கு அட்மினால் சரிபார்க்கப்பட்டது. உங்கள் பொது சுயவிவரத்தில் சரிபார்க்கப்பட்ட பேட்ஜ் தோன்றும்.'
                  : 'Your account identity is officially verified. Verification badge is visible on your profile.')
              : currentStatus === 'VERIFICATION_PENDING' || currentStatus === 'pending'
              ? (isTa
                  ? 'ஆவணங்கள் பெறப்பட்டன. அட்மின் ஒப்புதல் அளித்தவுடன் சரிபார்க்கப்பட்ட பேட்ஜ் வழங்கப்படும்.'
                  : 'Your document submission is queued in Admin Verification Requests. Admin review required for final badge.')
              : (isTa
                  ? 'தயவுசெய்து சரியான சான்றுகளை உள்ளிட்டு அட்மின் ஆய்வுக்கு அனுப்பவும்.'
                  : 'Upload valid role document placeholders below. Admin will review and issue your badge.')}
          </p>
          {currentUser.verificationReason && (
            <div className="mt-2 text-rose-800 font-medium text-[11px]">
              Rejection Note: {currentUser.verificationReason}
            </div>
          )}
        </div>

        {isSubmittedSuccess ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-extrabold text-emerald-950">
              {isTa ? 'சரிபார்ப்பு கோரிக்கை அனுப்பப்பட்டது!' : 'KYC Verification Submitted!'}
            </h4>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto">
              {isTa
                ? 'உங்கள் கோரிக்கை அட்மின் ஆய்வுக்கு அனுப்பப்பட்டுள்ளது. அட்மின் ஒப்புதல் அளித்ததும் உங்கள் கணக்கு சரிபார்க்கப்படும்.'
                : 'Document submission queued in Admin Verification Queue. Status updated to VERIFICATION PENDING.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              {isTa ? 'மூடு' : 'Close Modal'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isTa ? 'முழு பெயர்' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isTa ? 'மாவட்டம்' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            {currentUser.role === 'farmer' && (
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-3">
                <span className="font-extrabold text-emerald-900 block">{isTa ? 'விவசாயி சான்று விவரங்கள்' : 'Farmer / Land Verification Details'}</span>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isTa ? 'பட்டா / நில சான்று எண்' : 'Land Record / Patta Reference'}
                  </label>
                  <input
                    type="text"
                    value={landRef}
                    onChange={e => setLandRecordRef(e.target.value)}
                    placeholder="e.g. Patta No. 1042 / Survey 405/2A"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            )}

            {currentUser.role === 'buyer' && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-3">
                <span className="font-extrabold text-blue-900 block">{isTa ? 'வணிக சான்று விவரங்கள்' : 'Buyer & Trade Verification Details'}</span>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isTa ? 'நிறுவன பெயர்' : 'Business / Mandi Name'}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isTa ? 'GST / PAN எண்' : 'GSTIN / PAN Reference'}
                  </label>
                  <input
                    type="text"
                    value={gstOrPan}
                    onChange={e => setGstOrPan(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            )}

            {currentUser.role === 'logistics' && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                <span className="font-extrabold text-amber-900 block">{isTa ? 'போக்குவரத்து ஓட்டுநர் & வாகன சான்று' : 'Driver Licence & Vehicle RC Verification'}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Driving Licence</label>
                    <input
                      type="text"
                      value={drivingLicence}
                      onChange={e => setDrivingLicence(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Vehicle RC Number</label>
                    <input
                      type="text"
                      value={vehicleRc}
                      onChange={e => setVehicleRc(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Document Reference Placeholder */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block flex items-center gap-1">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>{isTa ? 'ஆவண குறிப்பு (Hackathon Safe)' : 'Identity Document Placeholder'}</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {isTa
                  ? 'பாதுகாப்பு காரணங்களுக்காக உண்மையான ஆதார் படங்களைச் சேமிக்க வேண்டாம். டெமோ குறிப்பு சான்று மட்டுமே சேமிக்கப்படும்.'
                  : 'For privacy safety, no raw Aadhaar images or full government IDs are saved to local storage.'}
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={idType}
                  onChange={e => setIdType(e.target.value)}
                  className="p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="Aadhaar (Demo Reference)">Aadhaar Ref</option>
                  <option value="Voter ID (Demo Reference)">Voter ID Ref</option>
                  <option value="Pan Card (Demo Reference)">PAN Ref</option>
                  <option value="Trade License (Demo)">Trade License</option>
                </select>
                <input
                  type="text"
                  value={idLastFour}
                  onChange={e => setIdLastFour(e.target.value)}
                  placeholder="Last 4 Digits"
                  maxLength={4}
                  className="w-28 p-2 bg-white border border-slate-300 rounded-lg font-mono text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{isTa ? 'அட்மின் ஆய்வுக்கு சமர்ப்பிக்கவும்' : 'Submit for Admin Verification Review'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
