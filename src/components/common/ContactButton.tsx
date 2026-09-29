import React from 'react';
import { Phone, MessageSquare, Lock } from 'lucide-react';
import { maskPhoneNumber } from '../../utils/contactUnlock';

export interface ContactButtonProps {
  phone?: string;
  isUnlocked: boolean;
  name?: string;
  contextText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  language?: 'ta' | 'en';
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  phone,
  isUnlocked,
  name = 'Contact',
  contextText = 'Uzhavan Connect Direct Transaction',
  size = 'md',
  className = '',
  language = 'en',
}) => {
  const isTa = language === 'ta';
  const displayPhone = isUnlocked && phone ? phone : maskPhoneNumber(phone);
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const encodedText = encodeURIComponent(
    `Hello ${name}, reaching out regarding: ${contextText} via Uzhavan Connect.`
  );

  if (!isUnlocked) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold text-xs ${className}`}>
        <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="font-mono text-slate-700">{displayPhone}</span>
        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          {isTa ? 'உறுதிப்படுத்தப்பட்ட பின் திறக்கும்' : 'Unlocked on Confirmation'}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href={`tel:${phone}`}
        className={`inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : size === 'lg' ? 'px-4 py-2.5 text-sm' : 'px-3 py-1.5 text-xs'
        }`}
        title={`Call ${name}`}
      >
        <Phone className="w-3.5 h-3.5 text-amber-300" />
        <span>{isTa ? 'அழைக்க' : 'Call'} ({displayPhone})</span>
      </a>

      <a
        href={`https://wa.me/${waPhone}?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 rounded-xl transition-colors cursor-pointer ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : size === 'lg' ? 'px-4 py-2.5 text-sm' : 'px-3 py-1.5 text-xs'
        }`}
        title={`WhatsApp ${name}`}
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};
