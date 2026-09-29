import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  AlertCircle,
  Check,
  X,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AdminVerificationView: React.FC = () => {
  const {
    verificationRequests,
    approveKycVerification,
    rejectKycVerification,
    adminApproveVerification,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectReasonModalId, setRejectReasonModalId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  // Default initial queue if state empty
  const [demoQueue, setDemoQueue] = useState([
    {
      id: 'user_buyer_new',
      userName: 'Kaveri Agro Exports',
      userRole: 'buyer' as UserRole,
      district: 'Salem',
      submittedAt: '2026-10-02 09:30',
      status: 'VERIFICATION_PENDING',
      kycSummary: {
        businessName: 'Kaveri Agro Exports Pvt Ltd',
        gstOrPanMasked: 'GST: 33AABCK9918P1Z3',
        idType: 'GSTIN Registration',
      },
    },
    {
      id: 'user_worker_new',
      userName: 'Thirunavukarasu Field Team',
      userRole: 'worker' as UserRole,
      district: 'Madurai',
      submittedAt: '2026-10-02 11:15',
      status: 'VERIFICATION_PENDING',
      kycSummary: {
        idType: '6 Farm Labor ID cards',
        idNumberMasked: 'TN-LAB-99201',
      },
    },
    {
      id: 'user_mach_new',
      userName: 'Marutham Harvester Fleet',
      userRole: 'machinery' as UserRole,
      district: 'Thanjavur',
      submittedAt: '2026-10-02 14:00',
      status: 'VERIFICATION_PENDING',
      kycSummary: {
        vehicleRcMasked: 'Commercial RC TN-49-AZ-8812',
        idType: 'Commercial RC & Insurance',
      },
    },
    {
      id: 'user_farmer_kumar',
      userName: 'Suresh Kumar',
      userRole: 'farmer' as UserRole,
      district: 'Coimbatore',
      submittedAt: '2026-09-28 10:00',
      status: 'VERIFIED',
      kycSummary: {
        landRecordRefMasked: 'Patta/Chitta Ref: 88219/Pollachi',
        idType: 'Farmer Identity Proof',
      },
    },
    {
      id: 'user_buyer_murugan',
      userName: 'Murugan Wholesale Mandi',
      userRole: 'buyer' as UserRole,
      district: 'Coimbatore',
      submittedAt: '2026-09-25 12:00',
      status: 'VERIFIED',
      kycSummary: {
        businessName: 'Murugan Wholesale Agro Mandi',
        gstOrPanMasked: 'GST: 33AAACM4411P1Z5',
        idType: 'Mandatory Mandi License',
      },
    },
  ]);

  // Combine verificationRequests context with demoQueue
  const allRequests = [...verificationRequests, ...demoQueue.filter(dq => !verificationRequests.some(vr => vr.id === dq.id))];

  const filteredRequests = allRequests.filter(req => {
    const st = req.status;
    if (filterTab === 'pending') return st === 'VERIFICATION_PENDING' || st === 'pending';
    if (filterTab === 'approved') return st === 'VERIFIED' || st === 'verified';
    if (filterTab === 'rejected') return st === 'REJECTED' || st === 'rejected';
    return true;
  });

  const handleApprove = (id: string, role: string) => {
    approveKycVerification(id);
    adminApproveVerification(id, role);
    setDemoQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'VERIFIED' } : item));
  };

  const handleConfirmReject = (id: string) => {
    if (!rejectionReasonText.trim()) return;
    rejectKycVerification(id, rejectionReasonText);
    setDemoQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'REJECTED', rejectionReason: rejectionReasonText } : item));
    setRejectReasonModalId(null);
    setRejectionReasonText('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Ecosystem KYC & Partner Verification</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Admin review center for identity proofs, trade licenses, vehicle RCs, and farm records.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
              filterTab === 'pending'
                ? 'bg-amber-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review ({allRequests.filter(r => r.status === 'VERIFICATION_PENDING' || r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
              filterTab === 'approved'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved ({allRequests.filter(r => r.status === 'VERIFIED' || r.status === 'verified').length})
          </button>
          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
              filterTab === 'rejected'
                ? 'bg-rose-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected ({allRequests.filter(r => r.status === 'REJECTED' || r.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map(req => (
          <div
            key={req.id}
            className="p-5 bg-white rounded-3xl border border-amber-900/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{req.userName}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 capitalize border border-slate-200">
                  {req.userRole}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">· {req.district}</span>
              </div>

              {/* KYC Summary Details */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-slate-700">
                <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                  Document / KYC Proof Submitted:
                </div>
                {(req.kycSummary as any)?.businessName && <div>Business: <strong>{(req.kycSummary as any).businessName}</strong></div>}
                {(req.kycSummary as any)?.gstOrPanMasked && <div>GST/PAN: <code className="bg-white px-1.5 py-0.5 rounded border">{(req.kycSummary as any).gstOrPanMasked}</code></div>}
                {(req.kycSummary as any)?.drivingLicenceMasked && <div>Driving License: <code className="bg-white px-1.5 py-0.5 rounded border">{(req.kycSummary as any).drivingLicenceMasked}</code></div>}
                {(req.kycSummary as any)?.vehicleRcMasked && <div>Vehicle RC: <code className="bg-white px-1.5 py-0.5 rounded border">{(req.kycSummary as any).vehicleRcMasked}</code></div>}
                {(req.kycSummary as any)?.landRecordRefMasked && <div>Land Record / Patta Ref: <code className="bg-white px-1.5 py-0.5 rounded border">{(req.kycSummary as any).landRecordRefMasked}</code></div>}
                {(req.kycSummary as any)?.idType && <div className="text-emerald-800 font-medium">Type: {(req.kycSummary as any).idType}</div>}
              </div>

              <div className="text-[11px] text-slate-400">
                Submitted at: {req.submittedAt}
              </div>

              {(req as any).rejectionReason && (
                <div className="p-2 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-[11px]">
                  <strong>Rejection Reason:</strong> {(req as any).rejectionReason}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {(req.status === 'VERIFICATION_PENDING' || req.status === 'pending') && (
                <>
                  <button
                    onClick={() => handleApprove(req.id, req.userRole)}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve KYC
                  </button>
                  <button
                    onClick={() => setRejectReasonModalId(req.id)}
                    className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}

              {(req.status === 'VERIFIED' || req.status === 'verified') && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  VERIFIED & APPROVED
                </span>
              )}

              {(req.status === 'REJECTED' || req.status === 'rejected') && (
                <span className="px-3 py-1.5 bg-rose-100 text-rose-800 font-bold rounded-xl border border-rose-300 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  REJECTED
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-400 italic bg-white rounded-3xl border border-slate-200">
            No verification requests found in this tab.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectReasonModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Reject Verification Request</h3>
            <p className="text-xs text-slate-600">Please provide a clear reason for rejecting this verification request.</p>
            <textarea
              rows={3}
              value={rejectionReasonText}
              onChange={e => setRejectionReasonText(e.target.value)}
              placeholder="e.g. GSTIN document unclear, or Patta reference does not match district..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectReasonModalId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmReject(rejectReasonModalId)}
                className="px-4 py-2 bg-rose-800 text-white text-xs font-semibold rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
