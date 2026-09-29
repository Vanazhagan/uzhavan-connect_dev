import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, CheckCircle2, Clock, XCircle, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, VerificationStatus } from '../../types';

export const AdminUsersView: React.FC = () => {
  const {
    t,
    crops,
    workers,
    machinery,
    logisticsPartners,
    agriStores,
    verificationRequests,
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Assemble full platform user list from app context state
  const mockSystemUsers = [
    {
      id: 'user_farmer_kumar',
      name: 'Suresh Kumar',
      role: 'farmer' as UserRole,
      location: 'Pollachi, Coimbatore',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'green',
      trustTitle: 'Trusted Member',
      accountStatus: 'Active',
      mobile: '******3210',
    },
    {
      id: 'user_farmer_velu',
      name: 'Velusamy Gounder',
      role: 'farmer' as UserRole,
      location: 'Gobichettipalayam, Erode',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'gold',
      trustTitle: 'Active Member',
      accountStatus: 'Active',
      mobile: '******8765',
    },
    {
      id: 'user_buyer_murugan',
      name: 'Murugan Wholesale Mandi',
      role: 'buyer' as UserRole,
      location: 'Mettupalayam Road, Coimbatore',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'star',
      trustTitle: 'Community Star',
      accountStatus: 'Active',
      mobile: '******4411',
    },
    {
      id: 'user_buyer_new',
      name: 'Kaveri Agro Exports',
      role: 'buyer' as UserRole,
      location: 'Salem',
      verificationStatus: 'VERIFICATION_PENDING' as VerificationStatus,
      trustLevel: 'grey',
      trustTitle: 'New Member',
      accountStatus: 'Pending Verification',
      mobile: '******9918',
    },
    {
      id: 'worker_marimuthu',
      name: 'Marimuthu Harvest Team',
      role: 'worker' as UserRole,
      location: 'Pollachi, Coimbatore',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'gold',
      trustTitle: 'Active Member',
      accountStatus: 'Active',
      mobile: '******1928',
    },
    {
      id: 'prov_ravi_machinery',
      name: 'Ravi Machinery Services',
      role: 'machinery' as UserRole,
      location: 'Pollachi, Coimbatore',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'gold',
      trustTitle: 'Active Member',
      accountStatus: 'Active',
      mobile: '******3445',
    },
    {
      id: 'user_logistics_vettri',
      name: 'Vettri Rural Express Logistics',
      role: 'logistics' as UserRole,
      location: 'Pollachi, Coimbatore',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'gold',
      trustTitle: 'Active Member',
      accountStatus: 'Active',
      mobile: '******8999',
    },
    {
      id: 'store_cauvery_bio',
      name: 'Cauvery Bio Inputs & Seeds',
      role: 'agri_input' as UserRole,
      location: 'Erode',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'green',
      trustTitle: 'Trusted Member',
      accountStatus: 'Active',
      mobile: '******4567',
    },
    {
      id: 'user_admin',
      name: 'Uzhavan Platform Ops Admin',
      role: 'admin' as UserRole,
      location: 'Central Admin Console',
      verificationStatus: 'VERIFIED' as VerificationStatus,
      trustLevel: 'star',
      trustTitle: 'System Admin',
      accountStatus: 'System Master',
      mobile: '******0000',
    },
  ];

  const filteredUsers = mockSystemUsers.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Ecosystem User Management</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit registered platform accounts, view verified trust ring status, role designations, and mobile masking.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          Total Registered Users: {mockSystemUsers.length}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-amber-900/10 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or district..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white transition-colors outline-hidden"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {['All', 'Farmer', 'Buyer', 'Worker', 'Machinery', 'Logistics', 'Agri_Input', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                roleFilter.toLowerCase() === r.toLowerCase()
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User / Business</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">District / Location</th>
                <th className="px-5 py-3.5">Verification</th>
                <th className="px-5 py-3.5">Trust Ring</th>
                <th className="px-5 py-3.5">Contact (Masked)</th>
                <th className="px-5 py-3.5">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">
                    <div>{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">{u.id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 capitalize border border-slate-200">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{u.location}</td>
                  <td className="px-5 py-4">
                    {u.verificationStatus === 'VERIFIED' || u.verificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        Pending KYC
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-700">{u.trustTitle}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500">{u.mobile}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {u.accountStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            No users matched your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
