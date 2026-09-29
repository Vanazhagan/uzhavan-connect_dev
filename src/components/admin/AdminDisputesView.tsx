import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, MessageSquare, ShieldAlert, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDisputesView: React.FC = () => {
  const { adminIssues, adminResolveIssue } = useApp();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Resolved'>('All');

  const filteredIssues = adminIssues.filter(issue => {
    if (statusFilter === 'Open') return issue.status !== 'resolved';
    if (statusFilter === 'Resolved') return issue.status === 'resolved';
    return true;
  });

  const handleResolve = (issueId: string) => {
    if (!adminNoteText.trim()) return;
    adminResolveIssue(issueId, adminNoteText);
    setAdminNoteText('');
    setSelectedIssueId(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Disputes & Ground Issues Console</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage escalated payment issues, crop quality disputes, labor booking conflicts, and logistics delays.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs">
          {(['All', 'Open', 'Resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors ${
                statusFilter === tab
                  ? 'bg-rose-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Disputes Cards */}
      <div className="space-y-4">
        {filteredIssues.map(issue => (
          <div
            key={issue.id}
            className="p-5 bg-white rounded-3xl border border-amber-900/10 shadow-xs space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                {issue.category}
              </span>
              <span
                className={`font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase ${
                  issue.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {issue.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-slate-800 text-sm">
                From: <span className="text-slate-900 font-bold">{issue.reportedBy}</span> vs{' '}
                <span className="text-slate-900 font-bold">{issue.targetEntity}</span>
              </div>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Admin Audit Notes */}
            {issue.adminNotes && issue.adminNotes.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 space-y-1">
                <span className="font-bold block text-slate-800">Admin Actions & Resolution Notes:</span>
                {issue.adminNotes.map((note, i) => (
                  <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Resolution Input */}
            {issue.status !== 'resolved' && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type resolution note and mark resolved..."
                  value={selectedIssueId === issue.id ? adminNoteText : ''}
                  onChange={e => {
                    setSelectedIssueId(issue.id);
                    setAdminNoteText(e.target.value);
                  }}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white transition-colors"
                />
                <button
                  onClick={() => handleResolve(issue.id)}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer shadow-2xs"
                >
                  Resolve Dispute
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-400 italic bg-white rounded-3xl border border-slate-200">
            No disputes found matching this status filter.
          </div>
        )}
      </div>
    </div>
  );
};
