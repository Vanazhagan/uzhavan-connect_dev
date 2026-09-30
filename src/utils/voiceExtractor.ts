export interface ExtractedLabourReq {
  crop: string;
  workType: string;
  workersNeeded: number;
  date: string;
  timeSlot: string;
  location: string;
  notes: string;
}

export interface ExtractedMachineryReq {
  machineType: string;
  attachment: string;
  crop: string;
  date: string;
  timeSlot: string;
  area: string;
  location: string;
  notes: string;
}

export interface VoiceInterpretation {
  intent:
    | 'POST_LABOUR_REQ'
    | 'POST_MACHINERY_REQ'
    | 'LOOKUP_MARKET_PRICE'
    | 'LOOKUP_BUYER_REQ'
    | 'NAVIGATE'
    | 'GUARDIAN_AI_QUERY';
  intentLabelEn: string;
  intentLabelTa: string;
  transcript: string;
  labourDetails?: ExtractedLabourReq;
  machineryDetails?: ExtractedMachineryReq;
  targetTab?: string;
  searchTopic?: string;
}

export function interpretVoiceTranscript(
  transcript: string,
  language: 'en' | 'ta' = 'en'
): VoiceInterpretation {
  const lower = transcript.toLowerCase().trim();

  // 1. LABOUR REQUIREMENT INTENT
  const isLabour =
    /worker|workers|labour|labourer|harvesting|weeding|climber|climbers|ஆட்கள்|வேலைக்காரர்கள்|வேலை ஆட்கள்|அறுவடைக்கு|வேலைக்கு|venum|tevai/i.test(
      lower
    ) &&
    !/machine|rotavator|tractor|டிராக்டர்|ரொட்டவேட்டர்/i.test(lower);

  // 2. MACHINERY REQUIREMENT INTENT
  const isMachinery =
    /rotavator|tractor|harvester|tiller|weeder|sprayer|drone|acre|acres|ரொட்டவேட்டர்|டிராக்டர்|இயந்திரம்|ஏக்கர்|eakar/i.test(
      lower
    );

  // 3. MARKET PRICE INTENT
  const isMarketPrice =
    /price|rate|vilai|cost|விலை|விகிதம்|சந்தை/i.test(lower) &&
    /what|how much|enna|என்ன|எவ்வளவு|show|கொள்ள/i.test(lower);

  // 4. BUYER REQUIREMENT INTENT
  const isBuyerReq = /buyer|buyers|requirement|requirements|கொள்முதல்|தேவை/i.test(lower) && !isLabour && !isMachinery;

  // 5. NAVIGATION INTENT
  const isNavigation = /open|go to|show|திற|காட்டு|போ/i.test(lower);

  // Extract date helper
  const extractDate = (text: string): string => {
    // Tomorrow check
    if (/tomorrow|நாளை|naalai/i.test(text)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    // Today check
    if (/today|இன்று|inru/i.test(text)) {
      return new Date().toISOString().split('T')[0];
    }
    // Month + Day regex (e.g. "October 5", "Oct 5", "அக்டோபர் 5")
    const monthMap: Record<string, string> = {
      jan: '01', january: '01',
      feb: '02', february: '02',
      mar: '03', march: '03',
      apr: '04', april: '04',
      may: '05',
      jun: '06', june: '06',
      jul: '07', july: '07',
      aug: '08', august: '08',
      sep: '09', september: '09',
      oct: '10', october: '10', அக்டோபர்: '10',
      nov: '11', november: '11', நவம்பர்: '11',
      dec: '12', december: '12', டிசம்பர்: '12',
    };

    const matchMonthDay = text.match(
      /(october|oct|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|november|nov|december|dec|அக்டோபர்|நவம்பர்|டிசம்பர்)\s*(\d{1,2})/i
    );
    if (matchMonthDay) {
      const monthStr = monthMap[matchMonthDay[1].toLowerCase()] || '10';
      const dayStr = matchMonthDay[2].padStart(2, '0');
      return `2026-${monthStr}-${dayStr}`;
    }

    const matchDayMonth = text.match(
      /(\d{1,2})\s*(st|nd|rd|th)?\s*(of)?\s*(october|oct|january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|november|nov|december|dec)/i
    );
    if (matchDayMonth) {
      const dayStr = matchDayMonth[1].padStart(2, '0');
      const monthStr = monthMap[matchDayMonth[4].toLowerCase()] || '10';
      return `2026-${monthStr}-${dayStr}`;
    }

    return '2026-10-05';
  };

  // Extract crop helper
  const extractCrop = (text: string): string => {
    if (/coconut|தேங்காய்|thenkai|தேங்காய்/i.test(text)) return 'Coconut';
    if (/paddy|rice|நெல்|nel/i.test(text)) return 'Paddy';
    if (/sugarcane|கரும்பு|karumbu/i.test(text)) return 'Sugarcane';
    if (/banana|வாழை|vaazhai/i.test(text)) return 'Banana';
    if (/groundnut|கடலை|kadalai/i.test(text)) return 'Groundnut';
    if (/turmeric|மஞ்சள்|manjal/i.test(text)) return 'Turmeric';
    if (/cotton|பருத்தி|paruthi/i.test(text)) return 'Cotton';
    if (/tomato|தக்காளி|thakkali/i.test(text)) return 'Tomato';
    return 'Coconut';
  };

  // Extract location helper
  const extractLocation = (text: string): string => {
    if (/pollachi|பொள்ளாச்சி/i.test(text)) return 'Pollachi, Coimbatore';
    if (/coimbatore|கோவை|கோயம்புத்தூர்/i.test(text)) return 'Coimbatore District';
    if (/salem|சேலம்/i.test(text)) return 'Salem District';
    if (/madurai|மதுரை/i.test(text)) return 'Madurai District';
    if (/erode|ஈரோடு/i.test(text)) return 'Erode District';
    if (/anamalai|ஆனைமலை/i.test(text)) return 'Anamalai Road, Pollachi';
    return 'Pollachi, Coimbatore';
  };

  // Extract numbers
  const extractNumber = (text: string, defaultNum: number = 6): number => {
    const numMatch = text.match(/(\d+)/);
    if (numMatch) return parseInt(numMatch[1], 10);

    // Tamil & Thanglish word numbers
    if (/ஒன்று|oruthan|one/i.test(text)) return 1;
    if (/இரண்டு|rendu|two/i.test(text)) return 2;
    if (/மூன்று|moonu|three/i.test(text)) return 3;
    if (/நான்கு|naangu|four/i.test(text)) return 4;
    if (/ஐந்து|ainthu|five/i.test(text)) return 5;
    if (/ஆறு|aaru|six/i.test(text)) return 6;
    if (/ஏழு|ezhu|seven/i.test(text)) return 7;
    if (/எட்டு|ettu|eight/i.test(text)) return 8;
    if (/ஒன்பது|onbathu|nine/i.test(text)) return 9;
    if (/பத்து|pathu|ten/i.test(text)) return 10;

    return defaultNum;
  };

  // Process LABOUR INTENT
  if (isLabour) {
    const crop = extractCrop(lower);
    const workersNeeded = extractNumber(lower, 6);
    const date = extractDate(lower);
    const location = extractLocation(lower);

    let workType = 'Harvesting';
    if (/tree climbing|climbing|மரம் ஏறுதல்/i.test(lower)) workType = 'Coconut Tree Climbing';
    else if (/weeding|களை எடுத்தல்/i.test(lower)) workType = 'Weeding & Field Cleaning';
    else if (/spraying|தெளித்தல்/i.test(lower)) workType = 'Pesticide Spraying';
    else if (/de-husking|dehusking|மட்டை உரித்தல்/i.test(lower)) workType = 'Coconut De-husking';

    let timeSlot = '07:00 AM - 02:00 PM';
    if (/evening|மாலை|maalai/i.test(lower)) timeSlot = '02:00 PM - 06:00 PM';
    else if (/morning|காலை|kaalai/i.test(lower)) timeSlot = '07:00 AM - 02:00 PM';

    return {
      intent: 'POST_LABOUR_REQ',
      intentLabelEn: 'Post Labour Requirement',
      intentLabelTa: 'வேலை ஆட்கள் தேவை பதிவு',
      transcript,
      labourDetails: {
        crop,
        workType: `${crop} ${workType}`,
        workersNeeded,
        date,
        timeSlot,
        location,
        notes: `Voice Request: Require ${workersNeeded} workers for ${crop} ${workType} on ${date}. Direct farm payment.`,
      },
    };
  }

  // Process MACHINERY INTENT
  if (isMachinery) {
    const crop = extractCrop(lower);
    const date = extractDate(lower);
    const location = extractLocation(lower);

    let machineType = 'Rotavator';
    let attachment = 'Rotavator (42-Blade Rotary Tiller)';
    if (/tractor|டிராக்டர்/i.test(lower)) {
      machineType = 'Tractor';
      attachment = '4WD Agricultural Tractor';
    } else if (/harvester|ஹார்வெஸ்டர்/i.test(lower)) {
      machineType = 'Combine Harvester';
      attachment = 'Paddy Combine Harvester';
    } else if (/drone|டிரோன்/i.test(lower)) {
      machineType = 'Drone Sprayer';
      attachment = '10L Crop Spraying Drone';
    } else if (/tiller|weeder|வீடர்/i.test(lower)) {
      machineType = 'Power Weeder';
      attachment = 'Rotary Power Weeder';
    }

    const areaMatch = lower.match(/(\d+)\s*(acres|acre|ஏக்கர்|eakar)/i);
    const area = areaMatch ? `${areaMatch[1]} Acres` : '3 Acres';

    let timeSlot = '08:00 AM - 12:00 PM';
    if (/morning|காலை|kaalai/i.test(lower)) timeSlot = '08:00 AM - 12:00 PM';
    else if (/afternoon|evening|மாலை/i.test(lower)) timeSlot = '02:00 PM - 06:00 PM';

    return {
      intent: 'POST_MACHINERY_REQ',
      intentLabelEn: 'Post Machinery Requirement',
      intentLabelTa: 'இயந்திர தேவை பதிவு',
      transcript,
      machineryDetails: {
        machineType,
        attachment,
        crop,
        date,
        timeSlot,
        area,
        location,
        notes: `Voice Request: Require ${machineType} for ${area} ${crop} field on ${date}.`,
      },
    };
  }

  // Process MARKET PRICE LOOKUP
  if (isMarketPrice) {
    const crop = extractCrop(lower);
    return {
      intent: 'LOOKUP_MARKET_PRICE',
      intentLabelEn: `Lookup Market Price for ${crop}`,
      intentLabelTa: `${crop} சந்தை விலை விவரம்`,
      transcript,
      searchTopic: crop,
      targetTab: 'marketplace',
    };
  }

  // Process BUYER REQUIREMENT LOOKUP
  if (isBuyerReq) {
    const crop = extractCrop(lower);
    return {
      intent: 'LOOKUP_BUYER_REQ',
      intentLabelEn: `View Buyer Requirements for ${crop}`,
      intentLabelTa: `${crop} கொள்முதல் தேவைகள்`,
      transcript,
      searchTopic: crop,
      targetTab: 'requirements',
    };
  }

  // Process NAVIGATION
  if (isNavigation) {
    let targetTab = 'home';
    let labelEn = 'Navigate Page';
    let labelTa = 'பக்கத்திற்கு செல்';

    if (/crop|crops|பயிர்/i.test(lower)) {
      targetTab = 'myCrops';
      labelEn = 'Navigate to My Crops';
      labelTa = 'என் பயிர்கள் பக்கத்திற்கு செல்';
    } else if (/order|orders|ஆர்டர்/i.test(lower)) {
      targetTab = 'orders';
      labelEn = 'Navigate to Orders & Settlement';
      labelTa = 'ஆர்டர்கள் பக்கத்திற்கு செல்';
    } else if (/calendar|நாட்காட்டி/i.test(lower)) {
      targetTab = 'calendar';
      labelEn = 'Navigate to Farm Calendar';
      labelTa = 'பண்ணை நாட்காட்டிக்கு செல்';
    } else if (/weather|வானிலை/i.test(lower)) {
      targetTab = 'weather';
      labelEn = 'Navigate to Farm Weather';
      labelTa = 'வானிலை பக்கத்திற்கு செல்';
    } else if (/market|marketplace|சந்தை/i.test(lower)) {
      targetTab = 'marketplace';
      labelEn = 'Navigate to Crop Marketplace';
      labelTa = 'பயிர் சந்தைக்கு செல்';
    } else if (/service|services|சேவைகள்/i.test(lower)) {
      targetTab = 'services';
      labelEn = 'Navigate to Farm Services';
      labelTa = 'பண்ணை சேவைகளுக்கு செல்';
    }

    return {
      intent: 'NAVIGATE',
      intentLabelEn: labelEn,
      intentLabelTa: labelTa,
      transcript,
      targetTab,
    };
  }

  // Default: GUARDIAN AI QUERY
  return {
    intent: 'GUARDIAN_AI_QUERY',
    intentLabelEn: 'Ask Guardian AI',
    intentLabelTa: 'கார்டியன் AI-யிடம் கேள்',
    transcript,
  };
}
