import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Phone, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t, switchRole, setCurrentUser } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp' | 'admin'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('Coimbatore');
  const [taluk, setTaluk] = useState('Pollachi');
  const [village, setVillage] = useState('Anamalai');
  const [otp, setOtp] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }
    setAuthError('');
    setAuthMode('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate prototype OTP
    if (otp !== '123456') {
      setAuthError('Invalid OTP. Use Demo OTP: 123456');
      return;
    }

    switchRole(selectedRole);
    if (name) {
      setCurrentUser({
        id: `user_${Date.now()}`,
        name: name || 'Kumar Thangavel',
        role: selectedRole,
        mobile,
        district,
        taluk,
        village,
        preferredLanguage: 'ta',
        verificationStatus: 'verified',
        trust: {
          level: 'green',
          title: 'Trusted Member',
          completedTransactions: 3,
          fulfilmentRate: 100,
          isVerified: true,
          positiveFeedbackScore: 5.0,
          cancellationRate: 0,
          reasons: ['Mobile OTP Verified', 'Profile Established'],
        },
      });
    }

    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@demo.com' && adminPassword === 'admin123') {
      switchRole('admin');
      onClose();
    } else {
      setAuthError('Invalid Admin credentials. Use admin@demo.com / admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-200 font-bold flex items-center justify-center text-sm">
              உ
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {authMode === 'admin'
                ? 'Admin Console Login'
                : authMode === 'otp'
                ? 'Verify OTP'
                : authMode === 'register'
                ? 'Create Uzhavan Profile'
                : 'Log In to Uzhavan Connect'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Credentials Reminder Tag */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Hackathon Demo Credentials:
          </span>
          <div className="text-[11px] text-amber-900/90 leading-relaxed">
            <div>• Prototype OTP: <code className="font-bold bg-amber-200/60 px-1 py-0.5 rounded">123456</code></div>
            <div>• Prototype Admin: <code className="font-bold bg-amber-200/60 px-1 py-0.5 rounded">admin@demo.com</code> / <code className="font-bold bg-amber-200/60 px-1 py-0.5 rounded">admin123</code></div>
          </div>
        </div>

        {authError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form Body */}
        {authMode === 'admin' ? (
          /* Admin Login */
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="admin@demo.com"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="admin123"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Sign In to Admin Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthError('');
                setAuthMode('login');
              }}
              className="w-full text-center text-slate-500 hover:text-slate-800 text-xs"
            >
              Back to Standard Login
            </button>
          </form>
        ) : authMode === 'otp' ? (
          /* OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <p className="text-slate-600">
              Enter the 6-digit OTP sent to <strong className="text-slate-900">+91 {mobile}</strong>. (Use Demo OTP: <strong className="text-emerald-800">123456</strong>)
            </p>
            <div>
              <label className="block font-medium text-slate-700 mb-1">6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full p-3 text-center tracking-widest text-lg bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Verify OTP & Enter
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full text-center text-slate-500 hover:text-slate-800 text-xs"
            >
              Change Mobile Number
            </button>
          </form>
        ) : (
          /* Standard Login & Registration */
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Select Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
              >
                <option value="farmer">Farmer (விவசாயி)</option>
                <option value="buyer">Buyer / Agro Trader (வியாபாரி)</option>
                <option value="worker">Farm Worker / Team (பண்ணை தொழிலாளர்)</option>
                <option value="machinery">Machinery Provider (இயந்திர உரிமையாளர்)</option>
                <option value="logistics">Logistics Partner (சரக்கு போக்குவரத்து)</option>
                <option value="agri_input">Agri Input Store (உரங்கள் & விதைகள்)</option>
              </select>
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Kumar Thangavel"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">District</label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 text-[11px]"
                    >
                      <option>Coimbatore</option>
                      <option>Pollachi</option>
                      <option>Erode</option>
                      <option>Salem</option>
                      <option>Thanjavur</option>
                      <option>Madurai</option>
                      <option>Tiruppur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Taluk</label>
                    <input
                      type="text"
                      value={taluk}
                      onChange={e => setTaluk(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 text-[11px]"
                      placeholder="Taluk"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Village</label>
                    <input
                      type="text"
                      value={village}
                      onChange={e => setVillage(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 text-[11px]"
                      placeholder="Village"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-medium text-slate-700 mb-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="9842154321"
                  className="w-full pl-12 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Get Demo OTP (123456)
            </button>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-emerald-800 hover:underline font-semibold"
              >
                {authMode === 'login' ? 'New here? Register' : 'Have account? Login'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthMode('admin');
                }}
                className="text-slate-500 hover:text-slate-800 font-medium"
              >
                Admin Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
