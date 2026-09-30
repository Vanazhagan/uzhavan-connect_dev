import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  X,
  Send,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  User,
  Bot,
  Mic,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  getFarmerSalesMetrics,
  getFarmerOfferMetrics,
  getFarmerCropMetrics,
  getFarmerPaymentMetrics,
  getFarmerBookingMetrics,
  getFarmerDetailedBuyerList,
  getBuyerMetrics,
  getWorkerMetrics,
  getMachineryMetrics,
  getLogisticsMetrics,
  getMarketPriceInfo,
} from '../../utils/appDataHelpers';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isSafetyWarning?: boolean;
  actionTab?: string;
  actionTabLabel?: string;
}

// Clean text renderer that removes raw markdown symbols (** or ###) and styles HTML output
const renderFormattedText = (text: string) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace(/^###\s*/, '').replaceAll('**', '');
          return (
            <div key={idx} className="font-bold text-slate-900 text-xs mt-2 mb-1">
              {headingText}
            </div>
          );
        }

        const parts = line.split(/(\*\*.*?\*\*)/g);

        return (
          <div key={idx} className={trimmed === '' ? 'h-1' : ''}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-bold text-slate-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const GuardianAI: React.FC = () => {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    currentUser,
    language,
    crops,
    offers,
    buyerRequirements,
    marketPrices,
    workerBookings,
    labourRequirements,
    machineryBookings,
    machineryRequirements,
    deliveryRequests,
    orders,
    notifications,
    favourites,
    setIsVoiceAssistantOpen,
    voiceTranscriptForGuardian,
    setVoiceTranscriptForGuardian,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roleLabels: Record<'en' | 'ta', Record<UserRole, string>> = {
    en: {
      farmer: 'Farmer Producer',
      buyer: 'Traders & Buyers',
      worker: 'Labour Leader / Specialist',
      machinery: 'Machinery Owner',
      logistics: 'Logistics Partner',
      agri_input: 'Agri-Input Store',
      admin: 'Platform Admin',
    },
    ta: {
      farmer: 'விவசாயி',
      buyer: 'வியாபாரி',
      worker: 'தொழிலாளர் தலைவர்',
      machinery: 'இயந்திர உரிமையாளர்',
      logistics: 'போக்குவரத்து பங்காளி',
      agri_input: 'வேளாண் கடை',
      admin: 'நிர்வாகி',
    },
  };

  const getPageLabel = (tab: string, lang: 'en' | 'ta'): string => {
    if (lang === 'ta') {
      switch (tab) {
        case 'home':
          return currentRole === 'farmer'
            ? 'விவசாயி டாஷ்போர்டு'
            : currentRole === 'buyer'
            ? 'வியாபாரி டாஷ்போர்டு'
            : currentRole === 'worker'
            ? 'தொழிலாளர் டாஷ்போர்டு'
            : 'முகப்பு பக்கம்';
        case 'marketplace':
          return currentRole === 'farmer' ? 'சந்தை வாய்ப்புகள்' : 'பயிர் சந்தை';
        case 'myCrops':
          return 'எனது பயிர்கள் (விற்பனை ஏடு)';
        case 'requirements':
        case 'jobRequests':
          return 'வேலை / தேவைகள் கோரிக்கைகள்';
        case 'offers':
          return 'வியாபாரி சலுகைகள்';
        case 'orders':
          return 'ஆர்டர்கள் & கட்டணங்கள்';
        case 'bookings':
          return 'சேவை முன்பதிவுகள்';
        case 'services':
        case 'workers':
          return 'தொழிலாளர் சந்தை';
        case 'machinery':
        case 'myMachinery':
          return 'இயந்திர மையம்';
        case 'logistics':
        case 'deliveryRequests':
          return 'சரக்கு போக்குவரத்து';
        case 'calendar':
          return 'பண்ணை நாட்காட்டி';
        case 'weather':
          return 'பண்ணை வானிலை';
        case 'profile':
          return 'சுயவிவரம் & நம்பிக்கை வளையம்';
        case 'favFarmers':
          return 'விருப்பமான விவசாயிகள்';
        default:
          return tab;
      }
    }

    switch (tab) {
      case 'home':
        return currentRole === 'farmer'
          ? 'Farmer Dashboard'
          : currentRole === 'buyer'
          ? 'Buyer Dashboard'
          : currentRole === 'worker'
          ? 'Worker Dashboard'
          : 'Home Dashboard';
      case 'marketplace':
        return currentRole === 'farmer' ? 'Market Opportunities' : 'Crop Marketplace';
      case 'myCrops':
        return 'My Crops (Sales Ledger)';
      case 'requirements':
      case 'jobRequests':
        return 'Open Labour / Buyer Requirements';
      case 'offers':
        return 'Buyer Offers';
      case 'orders':
        return 'Orders & Payments';
      case 'bookings':
        return 'Service Bookings';
      case 'services':
      case 'workers':
        return 'Labour Marketplace';
      case 'machinery':
      case 'myMachinery':
        return 'Machinery Hub';
      case 'logistics':
      case 'deliveryRequests':
        return 'Logistics & Track Delivery';
      case 'calendar':
        return 'Farm Calendar';
      case 'weather':
        return 'Farm Weather';
      case 'profile':
        return 'User Profile & Trust Ring';
      case 'favFarmers':
        return 'Favourite Farmers';
      default:
        return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  // Role-keyed conversation histories: { [userId_role]: Message[] }
  const [roleHistories, setRoleHistories] = useState<Record<string, Message[]>>({});

  const historyKey = `${currentUser.id}_${currentRole}`;

  const getWelcomeMessageTextForRole = (
    role: UserRole,
    lang: 'en' | 'ta',
    userName: string,
    pageLabel: string
  ): string => {
    const firstName = userName.split(' ')[0] || userName;
    const roleTitle = roleLabels[lang][role] || role;

    if (lang === 'ta') {
      return `வணக்கம் ${firstName}! 🛡️ நான் **கார்டியன் AI**, உழவன் கனெக்ட்டின் நேரலை தகவல் மற்றும் பாதுகாப்பு உதவியாளர்.

நீங்கள் **${roleTitle}** கணக்கில், **${pageLabel}** பக்கத்தில் உள்ளீர்கள்.

உங்கள் தற்போதைய நேரலை தரவுகள் (விற்பனை, சலுகைகள், இருப்பு, முன்பதிவுகள்) அல்லது செயலி பாதுகாப்பு பற்றி கேட்கலாம்!`;
    }

    return `Vanakkam ${firstName}! 🛡️ I am **Guardian AI**, your live application context & safety assistant for Uzhavan Connect.

Logged in as **${roleTitle}** on **${pageLabel}**.

Ask me about your live account data (monthly sales, stock, pending offers, worker/machinery bookings) or workflow safety!`;
  };

  const createInitialWelcomeMessage = (role: UserRole, lang: 'en' | 'ta'): Message => ({
    id: `msg_welcome_${role}`,
    sender: 'assistant',
    text: getWelcomeMessageTextForRole(role, lang, currentUser.name, getPageLabel(activeTab, lang)),
    timestamp: 'Just now',
  });

  const currentMessages =
    roleHistories[historyKey] || [createInitialWelcomeMessage(currentRole, language)];

  // Sync initial welcome message when language/activeTab/role changes if no chat turns exist
  useEffect(() => {
    setRoleHistories(prev => {
      const existing = prev[historyKey];
      if (!existing || (existing.length === 1 && existing[0].id.startsWith('msg_welcome_'))) {
        return {
          ...prev,
          [historyKey]: [createInitialWelcomeMessage(currentRole, language)],
        };
      }
      return prev;
    });
  }, [historyKey, language, activeTab]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, isOpen]);

  // Handle Voice Assistant query passed into Guardian AI
  useEffect(() => {
    if (voiceTranscriptForGuardian && voiceTranscriptForGuardian.trim()) {
      setIsOpen(true);
      handleSendMessage(voiceTranscriptForGuardian);
      setVoiceTranscriptForGuardian(null);
    }
  }, [voiceTranscriptForGuardian]);

  // LIVE CONTEXT-AWARE RESPONSE ENGINE
  const generateGuardianResponse = (userQuery: string): Message => {
    const q = userQuery.trim();
    const qLower = q.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isTa = language === 'ta';

    // 1. SAFETY QUERY CHECK
    if (
      qLower.includes('otp') ||
      qLower.includes('password') ||
      qLower.includes('pin') ||
      qLower.includes('credential') ||
      qLower.includes('கடவுச்சொல்') ||
      qLower.includes('ரகசிய எண்') ||
      qLower.includes('asking me for otp')
    ) {
      return {
        id: `resp_${Date.now()}`,
        sender: 'assistant',
        isSafetyWarning: true,
        text: isTa
          ? `🚨 **பாதுகாப்பு எச்சரிக்கை — OTP அல்லது கடவுச்சொல்லை எப்போதும் பகிர வேண்டாம்!**\n\n1. **உங்கள் OTP**, வங்கி PIN அல்லது கடவுச்சொல்லை யாருடனும் பகிரக்கூடாது.\n2. உழவன் கனெக்ட் ஊழியர்களோ அல்லது பயன்பாட்டாளர்களோ உங்களிடம் OTP கேட்க மாட்டார்கள்.\n3. யாராவது அவசரமாக OTP கேட்டால், உடனடியாக **நிர்வாகியிடம் புகாரளிக்கவும்**.`
          : `🚨 **CRITICAL SAFETY WARNING — NEVER SHARE OTP OR PASSWORDS!**\n\n1. **NEVER share your OTP**, bank PIN, or login credentials with anyone.\n2. Uzhavan Connect staff or buyers/farmers will **NEVER** ask for your OTP.\n3. Stop communication immediately if someone demands an OTP code.`,
        timestamp: timeStr,
        actionTab: 'profile',
        actionTabLabel: isTa ? 'சுயவிவரம் பார்க்க' : 'View Account Security',
      };
    }

    if (
      qLower.includes('advance') ||
      qLower.includes('send money before') ||
      qLower.includes('pay before') ||
      qLower.includes('முன்பணம்') ||
      qLower.includes('பணம் கேக்குறாங்க') ||
      qLower.includes('suspicious')
    ) {
      return {
        id: `resp_${Date.now()}`,
        sender: 'assistant',
        isSafetyWarning: true,
        text: isTa
          ? `🚨 **பாதுகாப்பு எச்சரிக்கை — முன்பணம் அனுப்ப வேண்டாம்!**\n\n1. முன்பதிவு நிலை **உறுதி செய்யப்பட்டது (Confirmed)** என மாறிய பிறகே கட்டணம் செலுத்த வேண்டும்.\n2. நபரின் **நம்பிக்கை வளையக் குறியீட்டை (Trust Ring)** சரிபார்க்கவும்.\n3. சந்தேகத்திற்குரிய பணக் கோரிக்கைகள் இருந்தால் நிர்வாகியிடம் புகாரளிக்கவும்.`
          : `🚨 **SAFETY WARNING — UNSAFE ADVANCE PAYMENT REQUEST!**\n\n1. **Do NOT send advance money** outside the official booking or order flow.\n2. Verify the party's **Trust Ring Profile** inside Uzhavan Connect.\n3. Official bookings require status confirmation inside the app (**Requested → Confirmed**) before payment is due.`,
        timestamp: timeStr,
        actionTab: 'orders',
        actionTabLabel: isTa ? 'பதிவுகளைச் சரிபார்க்க' : 'Check Orders & Booking Status',
      };
    }

    // 2. FARMER DATA QUERIES
    if (currentRole === 'farmer') {
      // Monthly Sales Query
      if (
        (qLower.includes('month') || qLower.includes('மாதம்') || qLower.includes('மாத விற்பனை')) &&
        (qLower.includes('sale') || qLower.includes('sales') || qLower.includes('total') || qLower.includes('விற்பனை') || qLower.includes('தொகை'))
      ) {
        const salesMetrics = getFarmerSalesMetrics(currentUser.id, currentUser.name, crops);
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்களின் இந்த மாத (செப்டம்பர் 2026) உறுதிப்படுத்தப்பட்ட மொத்த விற்பனை **₹${salesMetrics.thisMonthSales.toLocaleString('en-IN')}** ஆகும் (${salesMetrics.totalBuyersCount} வாங்குபவர்).`
            : `Your total confirmed sales this month (Sept 2026) are **₹${salesMetrics.thisMonthSales.toLocaleString('en-IN')}** across ${salesMetrics.totalBuyersCount} confirmed buyer transaction(s).`,
          timestamp: timeStr,
          actionTab: 'orders',
          actionTabLabel: isTa ? 'விற்பனை ஏடு பார்க்க' : 'View Sales Ledger & Orders',
        };
      }

      // Yearly Sales Query
      if (
        (qLower.includes('year') || qLower.includes('annual') || qLower.includes('ஆண்டு') || qLower.includes('வருடம்')) &&
        (qLower.includes('sale') || qLower.includes('sales') || qLower.includes('total') || qLower.includes('விற்பனை'))
      ) {
        const salesMetrics = getFarmerSalesMetrics(currentUser.id, currentUser.name, crops);
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்களின் இந்த ஆண்டு (2026) உறுதிப்படுத்தப்பட்ட மொத்த விற்பனை **₹${salesMetrics.thisYearSales.toLocaleString('en-IN')}** ஆகும்.`
            : `Your total confirmed sales this year (2026) are **₹${salesMetrics.thisYearSales.toLocaleString('en-IN')}**.`,
          timestamp: timeStr,
          actionTab: 'orders',
          actionTabLabel: isTa ? 'ஆர்டர்கள் பார்க்க' : 'View Orders & Settlements',
        };
      }

      // Detailed Buyers Query (Confirmed Buyers & Pending Offers)
      if (
        qLower.includes('buyer') ||
        qLower.includes('buyers') ||
        qLower.includes('bought') ||
        qLower.includes('purchased') ||
        qLower.includes('purchase') ||
        qLower.includes('customer') ||
        qLower.includes('customers') ||
        qLower.includes('client') ||
        qLower.includes('clients') ||
        qLower.includes('வாங்குபவர்') ||
        qLower.includes('வாங்குபவர்கள்') ||
        qLower.includes('வியாபாரி') ||
        qLower.includes('வியாபாரிகள்') ||
        qLower.includes('வாங்கியுள்ளனர்') ||
        qLower.includes('வாங்கியவர்') ||
        qLower.includes('வாங்கியவர்கள்') ||
        qLower.includes('யார் வாங்கியுள்ளனர்') ||
        qLower.includes('கொள்முதல்')
      ) {
        const buyerData = getFarmerDetailedBuyerList(currentUser.id, currentUser.name, crops, orders, offers);

        if (isTa) {
          let text = '';
          if (buyerData.confirmedBuyers.length > 0) {
            text += `### உறுதிப்படுத்தப்பட்ட வாங்குபவர்கள் (Active / Confirmed Buyers):\n`;
            buyerData.confirmedBuyers.forEach((b, idx) => {
              text += `${idx + 1}. **${b.buyerName}**\n   - பயிர்: ${b.cropName}\n   - அளவு: ${b.quantity.toLocaleString('en-IN')} ${b.unit}\n   - நிலை: ${b.status}\n`;
            });
          }

          if (buyerData.pendingBuyerOffers.length > 0) {
            if (text) text += `\n`;
            text += `### நிலுவையில் உள்ள வியாபாரி சலுகைகள் (Pending Buyer Offers):\n`;
            buyerData.pendingBuyerOffers.forEach((b, idx) => {
              text += `${idx + 1}. **${b.buyerName}**\n   - பயிர்: ${b.cropName}\n   - அளவு: ${b.quantity.toLocaleString('en-IN')} ${b.unit}\n   - நிலை: விவசாயி ஒப்புதலுக்கு காத்திருக்கிறது\n`;
            });
          }

          if (!buyerData.hasAnyBuyers) {
            text = `உங்களிடம் தற்போது உறுதிப்படுத்தப்பட்ட வாங்குபவர்களோ அல்லது நிலுவையில் உள்ள சலுகைகளோ இல்லை.`;
          }

          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: text.trim(),
            timestamp: timeStr,
            actionTab: 'orders',
            actionTabLabel: 'ஆர்டர்கள் & விற்பனை ஏடு பார்க்க',
          };
        } else {
          let text = '';
          if (buyerData.confirmedBuyers.length > 0) {
            text += `### Active / Confirmed Buyers:\n`;
            buyerData.confirmedBuyers.forEach((b, idx) => {
              text += `${idx + 1}. **${b.buyerName}**\n   - Crop: ${b.cropName}\n   - Quantity: ${b.quantity.toLocaleString('en-IN')} ${b.unit}\n   - Status: ${b.status}\n`;
            });
          }

          if (buyerData.pendingBuyerOffers.length > 0) {
            if (text) text += `\n`;
            text += `### Pending Buyer Offers:\n`;
            buyerData.pendingBuyerOffers.forEach((b, idx) => {
              text += `${idx + 1}. **${b.buyerName}**\n   - Crop: ${b.cropName}\n   - Quantity: ${b.quantity.toLocaleString('en-IN')} ${b.unit}\n   - Status: Waiting for Farmer Approval\n`;
            });
          }

          if (!buyerData.hasAnyBuyers) {
            text = `You currently have no active/confirmed buyers or pending offers in your farm ledger.`;
          }

          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: text.trim(),
            timestamp: timeStr,
            actionTab: 'orders',
            actionTabLabel: 'View Buyers & Orders',
          };
        }
      }

      // Pending Offers Query
      if (
        qLower.includes('pending offer') ||
        qLower.includes('offers') ||
        qLower.includes('suffer') ||
        qLower.includes('சலுகை') ||
        qLower.includes('சலுகைகள்')
      ) {
        if (qLower.includes('pending') || qLower.includes('how many') || qLower.includes('count') || qLower.includes('நிலுவை') || qLower.includes('எத்தனை')) {
          const offerMetrics = getFarmerOfferMetrics(currentUser.id, currentUser.name, offers);
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `உங்களுக்கு தற்போது **${offerMetrics.pendingOffersCount}** நிலுவையில் உள்ள வியாபாரி விலை சலுகை(கள்) வந்துள்ளன.`
              : `You currently have **${offerMetrics.pendingOffersCount}** pending buyer offer(s) awaiting your decision.`,
            timestamp: timeStr,
            actionTab: 'myCrops',
            actionTabLabel: isTa ? 'சலுகைகளைப் பார்க்க' : 'Review Offers on My Crops',
          };
        }
      }

      // Specific Crop Stock / Remaining or Sold Query
      const cropKeywords = ['coconut', 'paddy', 'groundnut', 'black gram', 'green gram', 'onion', 'sugarcane', 'banana', 'sunflower', 'maize', 'corn', 'தேங்காய்', 'நெல்', 'நிலக்கடலை', 'உளுந்து', 'பாசிப்பயறு', 'வெங்காயம்', 'கரும்பு', 'வாழை', 'சூரியகாந்தி', 'மக்காச்சோளம்'];
      const mentionedCrop = cropKeywords.find(k => qLower.includes(k));

      if (mentionedCrop) {
        const cropMetrics = getFarmerCropMetrics(currentUser.id, currentUser.name, crops);
        const cropMatch = cropMetrics.findCropByName(mentionedCrop);

        if (qLower.includes('remain') || qLower.includes('left') || qLower.includes('stock') || qLower.includes('balance') || qLower.includes('மீதம்') || qLower.includes('இருப்பு')) {
          if (cropMatch) {
            const unitName = cropMatch.unit === 'Coconuts' ? (isTa ? 'தேங்காய்கள்' : 'Coconuts') : (cropMatch.unit || 'KG');
            return {
              id: `resp_${Date.now()}`,
              sender: 'assistant',
              text: isTa
                ? `உங்கள் **${cropMatch.cropNameTa || cropMatch.cropName}** பயிரில் **${cropMatch.remainingQuantityKg.toLocaleString('en-IN')} ${unitName}** இருப்பு மீதம் உள்ளது.`
                : `Your **${cropMatch.cropName}** listing has **${cropMatch.remainingQuantityKg.toLocaleString('en-IN')} ${unitName}** remaining out of ${cropMatch.totalQuantityKg.toLocaleString('en-IN')} total harvest.`,
              timestamp: timeStr,
              actionTab: 'myCrops',
              actionTabLabel: isTa ? 'பயிர் இருப்பைப் பார்க்க' : 'View My Crops Stock',
            };
          } else {
            return {
              id: `resp_${Date.now()}`,
              sender: 'assistant',
              text: isTa
                ? `உங்களிடம் தற்போது **${mentionedCrop}** விளைபொருள் விற்பனைப் பதிவு எதுவும் இல்லை.`
                : `You currently have no active **${mentionedCrop}** listing in your farm ledger.`,
              timestamp: timeStr,
              actionTab: 'myCrops',
              actionTabLabel: isTa ? 'புதிய பயிர் சேர்க்க' : 'Add New Crop Harvest',
            };
          }
        }

        if (qLower.includes('sold') || qLower.includes('sale') || qLower.includes('விற்பனை')) {
          if (cropMatch) {
            const unitName = cropMatch.unit === 'Coconuts' ? (isTa ? 'தேங்காய்கள்' : 'Coconuts') : (cropMatch.unit || 'KG');
            return {
              id: `resp_${Date.now()}`,
              sender: 'assistant',
              text: isTa
                ? `நீங்கள் **${cropMatch.cropNameTa || cropMatch.cropName}** பயிரில் **${cropMatch.soldQuantityKg.toLocaleString('en-IN')} ${unitName}** விற்பனை செய்துள்ளீர்கள்.`
                : `You have sold **${cropMatch.soldQuantityKg.toLocaleString('en-IN')} ${unitName}** of **${cropMatch.cropName}**.`,
              timestamp: timeStr,
              actionTab: 'myCrops',
              actionTabLabel: isTa ? 'விற்பனை ஏடு பார்க்க' : 'View Sales Ledger',
            };
          }
        }
      }

      // Sold Out Crops Query
      if (qLower.includes('sold out') || qLower.includes('which crops sold') || qLower.includes('முடிந்தது') || qLower.includes('முழுமையாக விற்ற')) {
        const cropMetrics = getFarmerCropMetrics(currentUser.id, currentUser.name, crops);
        const listText = cropMetrics.soldOutCrops.length > 0
          ? cropMetrics.soldOutCrops.map(c => (isTa ? c.cropNameTa || c.cropName : c.cropName)).join(', ')
          : (isTa ? 'எதுவுமில்லை. அனைத்து பயிர்களிலும் இருப்பு உள்ளது.' : 'None. All listed crops currently have remaining stock.');

        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `முழுமையாக விற்பனையான பயிர்கள்: **${listText}**`
            : `Sold out crops in your ledger: **${listText}**`,
          timestamp: timeStr,
          actionTab: 'myCrops',
          actionTabLabel: isTa ? 'பயிர்களைப் பார்க்க' : 'View My Crops',
        };
      }

      // Active Crops Query
      if (
        qLower.includes('selling') ||
        qLower.includes('active crops') ||
        qLower.includes('my crops') ||
        qLower.includes('என்ன பயிர்கள்') ||
        qLower.includes('என் பயிர்கள்')
      ) {
        const cropMetrics = getFarmerCropMetrics(currentUser.id, currentUser.name, crops);
        const cropList = cropMetrics.activeCrops.map(c =>
          `${isTa ? c.cropNameTa || c.cropName : c.cropName} (${c.remainingQuantityKg.toLocaleString('en-IN')} ${c.unit || 'KG'})`
        ).join(', ');

        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `நீங்கள் தற்போது **${cropMetrics.activeCrops.length}** பயிர்களை விற்பனை செய்கிறீர்கள்: **${cropList}**.`
            : `You are currently selling **${cropMetrics.activeCrops.length}** crop(s): **${cropList}**.`,
          timestamp: timeStr,
          actionTab: 'myCrops',
          actionTabLabel: isTa ? 'பயிர் ஏடு பார்க்க' : 'Manage My Crop Listings',
        };
      }

      // Payment Received / Pending Payment Query
      if (qLower.includes('payment') || qLower.includes('received') || qLower.includes('pending payment') || qLower.includes('பணம்') || qLower.includes('தொகை')) {
        const paymentMetrics = getFarmerPaymentMetrics(currentUser.id, currentUser.name, orders);
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `நீங்கள் **₹${paymentMetrics.totalReceived.toLocaleString('en-IN')}** பெற்றுள்ளீர்கள் (உறுதி செய்யப்பட்டது), நிலுவையில் உள்ள தொகை: **₹${paymentMetrics.totalPending.toLocaleString('en-IN')}**.`
            : `You have received **₹${paymentMetrics.totalReceived.toLocaleString('en-IN')}** (farmer confirmed), with **₹${paymentMetrics.totalPending.toLocaleString('en-IN')}** pending settlement.`,
          timestamp: timeStr,
          actionTab: 'orders',
          actionTabLabel: isTa ? 'கட்டணங்கள் பார்க்க' : 'View Orders & Settlements',
        };
      }

      // Worker Booking Query
      if (qLower.includes('worker') || qLower.includes('labour') || qLower.includes('தொழிலாளர்') || qLower.includes('பணியாளர்')) {
        const bookingMetrics = getFarmerBookingMetrics(currentUser.id, currentUser.name, workerBookings, machineryBookings, deliveryRequests);
        if (bookingMetrics.upcomingWorkerBooking) {
          const wb = bookingMetrics.upcomingWorkerBooking;
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `அடுத்த தொழிலாளர் முன்பதிவு: **${wb.workerName}**, பணி: **${wb.workType}**, தேதி: **${wb.date}** (${wb.timeSlot}) - நிலை: **${wb.status}**.`
              : `Your next worker booking is **${wb.workerName}** on **${wb.date}** (${wb.timeSlot}) for ${wb.workType} (Status: ${wb.status.toUpperCase()}).`,
            timestamp: timeStr,
            actionTab: 'services',
            actionTabLabel: isTa ? 'தொழிலாளர் பக்கம் பார்க்க' : 'Manage Worker Bookings',
          };
        } else {
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `உங்களிடம் தற்போது வரவிருக்கும் தொழிலாளர் முன்பதிவுகள் எதுவும் இல்லை.`
              : `You currently have no upcoming active worker bookings.`,
            timestamp: timeStr,
            actionTab: 'services',
            actionTabLabel: isTa ? 'தொழிலாளர்களை முன்பதிவு செய்ய' : 'Book Farm Workers',
          };
        }
      }

      // Machinery Booking Query
      if (qLower.includes('machinery') || qLower.includes('machine') || qLower.includes('tractor') || qLower.includes('இயந்திரம்')) {
        const bookingMetrics = getFarmerBookingMetrics(currentUser.id, currentUser.name, workerBookings, machineryBookings, deliveryRequests);
        if (bookingMetrics.activeMachineryBooking) {
          const mb = bookingMetrics.activeMachineryBooking;
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `இயந்திர முன்பதிவு: **${mb.machineName}**, தேதி: **${mb.date}** (${mb.timeSlot}) - நிலை: **${mb.status}**.`
              : `Your active machinery booking is **${mb.machineName}** on **${mb.date}** (${mb.timeSlot}) - Status: ${mb.status.toUpperCase()}.`,
            timestamp: timeStr,
            actionTab: 'machinery',
            actionTabLabel: isTa ? 'இயந்திர மையம் பார்க்க' : 'Manage Machinery Bookings',
          };
        } else {
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `உங்களிடம் தற்போது இயந்திர முன்பதிவுகள் எதுவும் இல்லை.`
              : `You currently have no active machinery bookings.`,
            timestamp: timeStr,
            actionTab: 'machinery',
            actionTabLabel: isTa ? 'இயந்திரம் முன்பதிவு செய்ய' : 'Rent Farm Machinery',
          };
        }
      }

      // Logistics Status Query
      if (qLower.includes('logistics') || qLower.includes('delivery') || qLower.includes('shipment') || qLower.includes('transport') || qLower.includes('சரக்கு') || qLower.includes('போக்குவரத்து')) {
        const bookingMetrics = getFarmerBookingMetrics(currentUser.id, currentUser.name, workerBookings, machineryBookings, deliveryRequests);
        if (bookingMetrics.activeDelivery) {
          const del = bookingMetrics.activeDelivery;
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `சரக்கு விநியோக நிலை: **${del.cropName}** (${del.quantityKg} கிலோ) - நிலை: **${del.status}**.`
              : `Active shipment: Delivery #${del.id} (${del.cropName}, ${del.quantityKg} KG) - Status: **${del.status.replaceAll('_', ' ').toUpperCase()}**.`,
            timestamp: timeStr,
            actionTab: 'logistics',
            actionTabLabel: isTa ? 'சரக்கு கண்காணிப்பு' : 'Track Delivery',
          };
        } else {
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `உங்களிடம் தற்போது தீவிர சரக்கு கோரிக்கைகள் எதுவும் இல்லை.`
              : `You currently have no active logistics delivery requests.`,
            timestamp: timeStr,
            actionTab: 'logistics',
            actionTabLabel: isTa ? 'சரக்கு போக்குவரத்து புக் செய்ய' : 'Request Logistics Transport',
          };
        }
      }
    }

    // 3. BUYER DATA QUERIES
    if (currentRole === 'buyer') {
      const buyerMetrics = getBuyerMetrics(currentUser.id, currentUser.name, offers, orders, buyerRequirements, deliveryRequests, favourites);

      if (qLower.includes('offer') || qLower.includes('offers') || qLower.includes('சலுகை')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `நீங்கள் மொத்தம் **${buyerMetrics.sentOffersCount}** சலுகைகளை அனுப்பியுள்ளீர்கள் (**${buyerMetrics.pendingOffersCount}** நிலுவையில் உள்ளன, **${buyerMetrics.acceptedOffersCount}** ஏற்றுக்கொள்ளப்பட்டன).`
            : `You have sent **${buyerMetrics.sentOffersCount}** offer(s) total (**${buyerMetrics.pendingOffersCount}** pending farmer response, **${buyerMetrics.acceptedOffersCount}** accepted).`,
          timestamp: timeStr,
          actionTab: 'offers',
          actionTabLabel: isTa ? 'என் சலுகைகளைப் பார்க்க' : 'View My Offers',
        };
      }

      if (qLower.includes('order') || qLower.includes('accepted') || qLower.includes('ஆர்டர்')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்களுக்கு **${buyerMetrics.buyerOrdersCount}** உறுதிப்படுத்தப்பட்ட கொள்முதல் ஆர்டர்கள் உள்ளன.`
            : `You have **${buyerMetrics.buyerOrdersCount}** confirmed crop purchase order(s).`,
          timestamp: timeStr,
          actionTab: 'orders',
          actionTabLabel: isTa ? 'ஆர்டர்கள் பார்க்க' : 'View Orders & Settlements',
        };
      }

      if (qLower.includes('payment') || qLower.includes('pending') || qLower.includes('கட்டணம்')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்கள் நிலுவை கட்டணத் தொகை: **₹${buyerMetrics.pendingPayments.toLocaleString('en-IN')}**.`
            : `Your total pending payment balance across orders is **₹${buyerMetrics.pendingPayments.toLocaleString('en-IN')}**.`,
          timestamp: timeStr,
          actionTab: 'orders',
          actionTabLabel: isTa ? 'பணம் செலுத்த' : 'Settle Payments',
        };
      }

      if (qLower.includes('delivery') || qLower.includes('transit') || qLower.includes('சரக்கு')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்களுக்கு **${buyerMetrics.activeDeliveries.length}** சரக்கு விநியோகம் வழியில் உள்ளது.`
            : `You have **${buyerMetrics.activeDeliveries.length}** active delivery shipment(s) in transit.`,
          timestamp: timeStr,
          actionTab: 'orders',
          actionTabLabel: isTa ? 'சரக்கு விவரங்கள்' : 'Track Deliveries',
        };
      }
    }

    // 4. WORKER DATA QUERIES
    if (currentRole === 'worker') {
      const workerMetrics = getWorkerMetrics(currentUser.id, currentUser.name, workerBookings, labourRequirements);

      if (qLower.includes('job') || qLower.includes('available') || qLower.includes('வேலை') || qLower.includes('பணி')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்கள் பகுதியில் **${workerMetrics.availableJobsCount}** திறந்தவெளி பண்ணை வேலைகள் உள்ளன. உங்களுக்கு **${workerMetrics.confirmedBookingsCount}** உறுதிப்படுத்தப்பட்ட வேலைகள் உள்ளன.`
            : `There are **${workerMetrics.availableJobsCount}** open labour requirements available. You have **${workerMetrics.confirmedBookingsCount}** confirmed booking(s).`,
          timestamp: timeStr,
          actionTab: 'jobRequests',
          actionTabLabel: isTa ? 'வேலைகளைப் பார்க்க' : 'Browse Available Jobs',
        };
      }

      if (qLower.includes('next') || qLower.includes('who booked') || qLower.includes('start') || qLower.includes('அடுத்த')) {
        if (workerMetrics.upcomingBooking) {
          const ub = workerMetrics.upcomingBooking;
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `அடுத்த பணி: **${ub.farmerName}** பண்ணையில் **${ub.workType}**, தேதி: **${ub.date}** (${ub.timeSlot}).`
              : `Your next booking is **${ub.workType}** for **${ub.farmerName}** on **${ub.date}** (${ub.timeSlot}).`,
            timestamp: timeStr,
            actionTab: 'bookings',
            actionTabLabel: isTa ? 'முன்பதிவுகள் பார்க்க' : 'View My Bookings',
          };
        }
      }

      if (qLower.includes('completed') || qLower.includes('முடித்த')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `நீங்கள் மொத்தம் **${workerMetrics.completedJobsCount}** பண்ணை வேலைகளை வெற்றிகரமாக முடித்துள்ளீர்கள்.`
            : `You have completed **${workerMetrics.completedJobsCount}** farm job(s) with verified ratings.`,
          timestamp: timeStr,
          actionTab: 'profile',
          actionTabLabel: isTa ? 'சுயவிவரம் பார்க்க' : 'View Worker Profile',
        };
      }
    }

    // 5. MACHINERY PROVIDER DATA QUERIES
    if (currentRole === 'machinery') {
      const machMetrics = getMachineryMetrics(currentUser.id, currentUser.name, machineryBookings, machineryRequirements);

      if (qLower.includes('booking') || qLower.includes('request') || qLower.includes('machine') || qLower.includes('கோரிக்கை')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்களுக்கு **${machMetrics.bookingRequestsCount}** புதிய கோரிக்கைகளும் **${machMetrics.confirmedBookingsCount}** உறுதிப்படுத்தப்பட்ட வாடகை முன்பதிவுகளும் உள்ளன.`
            : `You have **${machMetrics.bookingRequestsCount}** pending booking request(s) and **${machMetrics.confirmedBookingsCount}** confirmed booking(s).`,
          timestamp: timeStr,
          actionTab: 'bookingRequests',
          actionTabLabel: isTa ? 'கோரிக்கைகளைப் பார்க்க' : 'View Booking Requests',
        };
      }
    }

    // 6. LOGISTICS PARTNER DATA QUERIES
    if (currentRole === 'logistics') {
      const logMetrics = getLogisticsMetrics(currentUser.id, currentUser.name, deliveryRequests);

      if (qLower.includes('transport') || qLower.includes('delivery') || qLower.includes('transit') || qLower.includes('சரக்கு')) {
        return {
          id: `resp_${Date.now()}`,
          sender: 'assistant',
          text: isTa
            ? `உங்களுக்கு **${logMetrics.pendingRequestsCount}** புதிய கோரிக்கைகளும் **${logMetrics.inTransitCount}** பயணிக்கும் சரக்கு விநியோகமும் உள்ளன.`
            : `You have **${logMetrics.pendingRequestsCount}** new transport request(s) and **${logMetrics.inTransitCount}** delivery in transit.`,
          timestamp: timeStr,
          actionTab: 'deliveryRequests',
          actionTabLabel: isTa ? 'சரக்குகளைப் பார்க்க' : 'View Transport Requests',
        };
      }
    }

    // 7. MARKET PRICE REFERENCE QUERIES (ALL ROLES)
    if (
      qLower.includes('price') ||
      qLower.includes('rate') ||
      qLower.includes('mandi') ||
      qLower.includes('சந்தை') ||
      qLower.includes('விலை')
    ) {
      const cropKeywords = ['coconut', 'paddy', 'groundnut', 'black gram', 'green gram', 'onion', 'sugarcane', 'banana', 'sunflower', 'maize', 'corn', 'தேங்காய்', 'நெல்', 'நிலக்கடலை', 'உளுந்து', 'பாசிப்பயறு', 'வெங்காயம்', 'கரும்பு', 'வாழை', 'சூரியகாந்தி', 'மக்காச்சோளம்'];
      const mentionedCrop = cropKeywords.find(k => qLower.includes(k));

      if (mentionedCrop) {
        const item = getMarketPriceInfo(mentionedCrop, marketPrices);
        if (item) {
          return {
            id: `resp_${Date.now()}`,
            sender: 'assistant',
            text: isTa
              ? `📊 **மாதிரி குறிப்புச் சந்தை விலை** (${item.marketName}):\n\n- **${item.cropNameTa || item.cropName}** விலை: **₹${item.referencePrice} / ${item.unit}** (${item.location}).\n- புதுப்பிக்கப்பட்டது: ${item.lastUpdated}.\n\n*குறிப்பு: இது மண்டை விலை வழிகாட்டுதலுக்கான மாதிரி குறிப்பு விலையாகும்.*`
              : `📊 **Sample Reference Price** (${item.marketName}):\n\n- **${item.cropName}** benchmark rate is **₹${item.referencePrice} / ${item.unit}** (${item.location}).\n- Last updated: ${item.lastUpdated}.\n\n*Note: Demo reference price for mandi benchmark guidance, not official government price.*`,
            timestamp: timeStr,
            actionTab: 'marketplace',
            actionTabLabel: isTa ? 'சந்தை விலைகளைப் பார்க்க' : 'Check Market Prices',
          };
        }
      }
    }

    // 8. FALLBACK WORKFLOW & NAVIGATION GUIDANCE
    if (
      qLower.includes('sell') ||
      qLower.includes('coconut') ||
      qLower.includes('தேங்காய்') ||
      qLower.includes('விற்கலாம்') ||
      qLower.includes('விற்பனை')
    ) {
      return {
        id: `resp_${Date.now()}`,
        sender: 'assistant',
        text: isTa
          ? `🌴 **பயிர்/தேங்காய் விற்பனை செய்யும் முறை**:\n\n1. 'My Crops' பக்கத்திற்குச் செல்லவும்.\n2. '+ List New Crop Harvest' கிளிக் செய்யவும்.\n3. பயிர் விவரங்கள், அளவு, எதிர்பார்த்த விலையை உள்ளிடவும்.\n4. 'சந்தை வாய்ப்புகள்' என்பதில் வியாபாரி சலுகைகளை ஆய்வு செய்து ஏற்கலாம்.\n5. வியாபாரி நேரடி பணம் செலுத்திய பின் 'பணம் பெறப்பட்டது' எனப் பதிவு செய்யவும்.`
          : `🌴 **How to Sell Crop (e.g. Coconut)**:\n\n1. Go to **My Crops**.\n2. Click **+ List New Crop Harvest**.\n3. Enter crop details, quantity, and expected rate.\n4. Review buyer proposals under **Market Opportunities**.\n5. Once buyer pays directly, confirm payment receipt!`,
        timestamp: timeStr,
        actionTab: 'myCrops',
        actionTabLabel: isTa ? 'எனது பயிர்கள் பக்கத்திற்குச் செல்ல' : 'Go to My Crops Page',
      };
    }

    if (
      qLower.includes('track') ||
      qLower.includes('logistics') ||
      qLower.includes('கண்காணிப்பு') ||
      qLower.includes('போக்குவரத்து')
    ) {
      return {
        id: `resp_${Date.now()}`,
        sender: 'assistant',
        text: isTa
          ? `🚚 **சரக்கு போக்குவரத்து கண்காணிப்பு**:\n\n1. **சரக்கு போக்குவரத்து** பக்கத்திற்குச் செல்லவும்.\n2. வாகன எண், ஓட்டுநர் பெயர் மற்றும் தற்போதைய நிலையைக் காணலாம்.`
          : `🚚 **How to Track Delivery & Logistics**:\n\n1. Go to **Logistics & Track Delivery**.\n2. View vehicle registration, driver contact, and live status.`,
        timestamp: timeStr,
        actionTab: 'logistics',
        actionTabLabel: isTa ? 'சரக்கு கண்காணிப்புக்குச் செல்ல' : 'Go to Logistics Page',
      };
    }

    // General fallback
    return {
      id: `resp_${Date.now()}`,
      sender: 'assistant',
      text: isTa
        ? `I have checked your live application state for **${getPageLabel(activeTab, 'ta')}**.

உங்களின் தற்போதைய டாஷ்போர்டு புள்ளிவிவரங்கள், சலுகைகள், கட்டணங்கள் அல்லது முன்பதிவுகள் பற்றி என்னிடம் மேலும் தெளிவாகக் கேட்கலாம்!`
        : `I have checked your live application state for **${getPageLabel(activeTab, 'en')}**.

Ask me specifically about your monthly sales, remaining stock, buyer offers, or active worker/machinery bookings!`,
      timestamp: timeStr,
      actionTab: 'home',
      actionTabLabel: isTa ? 'டாஷ்போர்டுக்குச் செல்ல' : 'Go to Dashboard',
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetKey = historyKey;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: timeStr,
    };

    setRoleHistories(prev => {
      const currentList = prev[targetKey] || [createInitialWelcomeMessage(currentRole, language)];
      return {
        ...prev,
        [targetKey]: [...currentList, userMsg],
      };
    });

    if (!textToSend) setInputQuery('');

    // Generate Guardian AI Response dynamically from current live state
    setTimeout(() => {
      const assistantMsg = generateGuardianResponse(query);
      setRoleHistories(prev => {
        const currentList = prev[targetKey] || [createInitialWelcomeMessage(currentRole, language)];
        return {
          ...prev,
          [targetKey]: [...currentList, assistantMsg],
        };
      });
    }, 280);
  };

  // Suggestion Chips based on Role & Language
  const getSuggestionChips = (): { label: string; query: string }[] => {
    const isTa = language === 'ta';

    if (currentRole === 'farmer') {
      if (isTa) {
        return [
          { label: 'இந்த மாத விற்பனை?', query: 'இந்த மாதம் மொத்த விற்பனை எவ்வளவு?' },
          { label: 'என் வாங்குபவர்கள் யார்?', query: 'தற்போதைய வாங்குபவர்கள் பட்டியல்' },
          { label: 'எத்தனை சலுகைகள்?', query: 'எத்தனை சலுகைகள் நிலுவையில் உள்ளன?' },
          { label: 'தேங்காய் மீதம் எவ்வளவு?', query: 'தேங்காய் எவ்வளவு மீதம் உள்ளது?' },
          { label: 'தேங்காய் சந்தை விலை?', query: 'தேங்காய் சந்தை விலை என்ன?' },
          { label: 'பாதுகாப்பு உதவி', query: 'OTP share பண்ணலாமா?' },
        ];
      }
      return [
        { label: 'This month sale?', query: 'this month total sale' },
        { label: 'Show my buyers?', query: 'now active buyer list out' },
        { label: 'Pending offers?', query: 'how many pending offers' },
        { label: 'Coconut remaining?', query: 'how much coconut remains' },
        { label: 'Coconut market price?', query: 'what is coconut market price' },
        { label: 'Safety Help', query: 'Is OTP sharing safe?' },
      ];
    }

    if (currentRole === 'buyer') {
      if (isTa) {
        return [
          { label: 'அனுப்பிய சலுகைகள்?', query: 'நான் எத்தனை சலுகைகள் அனுப்பியுள்ளேன்?' },
          { label: 'ஆர்டர்கள் நிலை?', query: 'எனது ஆர்டர்கள் என்ன?' },
          { label: 'சரக்கு போக்குவரத்து?', query: 'சரக்கு விநியோகம் நிலை என்ன?' },
          { label: 'பாதுகாப்பு உதவி', query: 'பாதுகாப்பு உதவி' },
        ];
      }
      return [
        { label: 'Sent offers?', query: 'how many offers sent' },
        { label: 'Confirmed orders?', query: 'what confirmed orders do I have' },
        { label: 'Delivery in transit?', query: 'what delivery is in transit' },
        { label: 'Safety Help', query: 'Safety Help' },
      ];
    }

    if (currentRole === 'worker') {
      if (isTa) {
        return [
          { label: 'வேலை வாய்ப்புகள்?', query: 'எத்தனை வேலைகள் உள்ளன?' },
          { label: 'அடுத்த வேலை?', query: 'எனது அடுத்த வேலை என்ன?' },
          { label: 'முடித்த வேலைகள்?', query: 'எத்தனை முடித்த வேலைகள் உள்ளன?' },
          { label: 'பாதுகாப்பு உதவி', query: 'பாதுகாப்பு உதவி' },
        ];
      }
      return [
        { label: 'Available jobs?', query: 'how many jobs available' },
        { label: 'Next job?', query: 'what is my next job' },
        { label: 'Completed jobs?', query: 'how many completed jobs' },
        { label: 'Safety Help', query: 'Safety Help' },
      ];
    }

    if (currentRole === 'machinery') {
      if (isTa) {
        return [
          { label: 'முன்பதிவு கோரிக்கைகள்?', query: 'எத்தனை முன்பதிவு கோரிக்கைகள் உள்ளன?' },
          { label: 'பாதுகாப்பு உதவி', query: 'பாதுகாப்பு உதவி' },
        ];
      }
      return [
        { label: 'Booking requests?', query: 'how many booking requests' },
        { label: 'Safety Help', query: 'Safety Help' },
      ];
    }

    if (currentRole === 'logistics') {
      if (isTa) {
        return [
          { label: 'சரக்கு கோரிக்கைகள்?', query: 'எத்தனை சரக்கு கோரிக்கைகள் உள்ளன?' },
          { label: 'பாதுகாப்பு உதவி', query: 'பாதுகாப்பு உதவி' },
        ];
      }
      return [
        { label: 'Transport requests?', query: 'how many transport requests' },
        { label: 'Safety Help', query: 'Safety Help' },
      ];
    }

    return [
      { label: language === 'ta' ? 'பாதுகாப்பு உதவி' : 'Safety Help', query: 'Safety Help' },
    ];
  };

  const chips = getSuggestionChips();

  return (
    <>
      {/* Persistent Floating Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-900 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-400/40"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          <span>🛡️ {language === 'ta' ? 'கார்டியன் AI' : 'Guardian AI'}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Side Drawer Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-400/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-2xl border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white">Guardian AI</h3>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                      LIVE APP CONTEXT
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/90 font-medium">
                    {language === 'ta'
                      ? 'செயலி நேரலை தகவல்கள் & பாதுகாப்பு உதவியாளர்'
                      : 'Live Application Context & Safety Assistant'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Pill Bar */}
            <div className="px-4 py-2 bg-emerald-950/90 border-b border-amber-900/20 flex items-center justify-between text-[11px] text-emerald-200">
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'ta' ? 'பங்கு:' : 'Role:'}{' '}
                  <strong className="text-white">{roleLabels[language][currentRole]}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'ta' ? 'பக்கம்:' : 'Page:'}{' '}
                  <strong className="text-white">{getPageLabel(activeTab, language)}</strong>
                </span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {currentMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                    {msg.sender === 'user' ? (
                      <span>{language === 'ta' ? 'நீங்கள்' : 'You'}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-800 font-bold">
                        <Shield className="w-3 h-3 text-amber-600" /> Guardian AI
                      </span>
                    )}
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm shadow-2xs space-y-2 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-800 text-white rounded-tr-none font-medium'
                        : msg.isSafetyWarning
                        ? 'bg-rose-50 text-rose-950 border border-rose-200 rounded-tl-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {msg.isSafetyWarning && (
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs pb-1 border-b border-rose-200">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          {language === 'ta' ? 'பாதுகாப்பு விழிப்பூட்டல்' : 'SECURITY ALERT'}
                        </span>
                      </div>
                    )}

                    <div>{renderFormattedText(msg.text)}</div>

                    {msg.actionTab && (
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setActiveTab(msg.actionTab!);
                            setIsOpen(false);
                          }}
                          className="w-full py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{msg.actionTabLabel || (language === 'ta' ? 'பக்கத்திற்குச் செல்ல' : 'Go to Page')}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-3 bg-white border-t border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-500 mb-2">
                {language === 'ta' ? 'விரைவு கேள்விகள் (நேரலை தரவுகள்):' : 'Quick Questions (Live App Data):'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.query)}
                    className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-full transition-all cursor-pointer hover:scale-102 active:scale-98"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <button
                onClick={() => setIsVoiceAssistantOpen(true)}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-xl transition-all cursor-pointer shrink-0"
                title="Voice Query / குரல் கேள்வி"
              >
                <Mic className="w-4 h-4 text-amber-800" />
              </button>
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  language === 'ta'
                    ? 'கேள்வி கேட்கவும்... (எ.கா. இந்த மாத விற்பனை எவ்வளவு?)'
                    : 'Ask about live sales, offers, stock, or safety...'
                }
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim()}
                className="p-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 text-center font-medium">
              🛡️ {language === 'ta' ? 'உழவன் கனெக்ட் பாதுகாக்கப்பட்ட AI உதவியாளர்' : 'Uzhavan Connect Secured Context AI Assistant'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
