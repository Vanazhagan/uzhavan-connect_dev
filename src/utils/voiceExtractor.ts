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
  const norm = transcript.toLowerCase().trim();

  // ----------------------------------------------------------------------
  // 1. APPLICATION DATA QUERY & LIVE DATA QUESTIONS
  // Must be checked FIRST before navigation or form pre-fill!
  // Handles natural grammar variations like "how many buyers are completed payment"
  // ----------------------------------------------------------------------
  const isDataQuery =
    // Question stems & counting keywords
    /how many|how much|total|count|who completed|which orders|what is my|what is total|show my|tell me|who bought|purchased from|buyers count|payment status/i.test(norm) ||
    // Specific payment / buyer / order status phrases
    /completed payment|complete payment|completed payments|payments completed|payments are completed|who completed|buyers completed|buyer completed|payment completed|buyers purchased|buyers bought|purchased from me|bought from me|payment received|payments pending|payment pending|orders completed|orders settled|orders unpaid|settled orders|unpaid orders|stock remaining|remaining stock|sold out|monthly sale|annual sale|this month sale/i.test(norm) ||
    // Tamil live-data query words
    /எத்தனை|எவ்வளவு|யார்|எந்த|முடிந்த|நிலுவை|பெறப்பட்டது|வாங்கியவர்கள்|விற்பனை தொகை/i.test(norm);

  // Check explicit navigation commands
  const isExplicitNavCommand =
    /^(open|go to|show|navigate to|திற|போ|செல்)\s+(buyer requirement|buyer requirements|my crops|machinery|worker bookings|orders|calendar|weather|marketplace|services|job requests)/i.test(norm);

  // ----------------------------------------------------------------------
  // 2. EXPLICIT NAVIGATION COMMAND (ONLY when explicit)
  // ----------------------------------------------------------------------
  if (isExplicitNavCommand && !isDataQuery) {
    let targetTab = 'home';
    let labelEn = 'Navigate Page';
    let labelTa = 'பக்கத்திற்கு செல்';

    if (/crop|crops|பயிர்/i.test(norm)) {
      targetTab = 'myCrops';
      labelEn = 'Navigate to My Crops';
      labelTa = 'என் பயிர்கள் பக்கத்திற்கு செல்';
    } else if (/order|orders|ஆர்டர்/i.test(norm)) {
      targetTab = 'orders';
      labelEn = 'Navigate to Orders & Settlement';
      labelTa = 'ஆர்டர்கள் பக்கத்திற்கு செல்';
    } else if (/requirement|requirements|தேவைகள்|கொள்முதல்/i.test(norm)) {
      targetTab = 'requirements';
      labelEn = 'Navigate to Buyer Requirements';
      labelTa = 'கொள்முதல் தேவைகள் பக்கத்திற்கு செல்';
    } else if (/machinery|machine|இயந்திரம்/i.test(norm)) {
      targetTab = 'myMachinery';
      labelEn = 'Navigate to Machinery Hub';
      labelTa = 'இயந்திர மையம் பக்கத்திற்கு செல்';
    } else if (/worker|labour|booking|வேலை/i.test(norm)) {
      targetTab = 'services';
      labelEn = 'Navigate to Labour Marketplace';
      labelTa = 'தொழிலாளர் பக்கத்திற்கு செல்';
    } else if (/calendar|நாட்காட்டி/i.test(norm)) {
      targetTab = 'calendar';
      labelEn = 'Navigate to Farm Calendar';
      labelTa = 'பண்ணை நாட்காட்டிக்கு செல்';
    } else if (/weather|வானிலை/i.test(norm)) {
      targetTab = 'weather';
      labelEn = 'Navigate to Farm Weather';
      labelTa = 'வானிலை பக்கத்திற்கு செல்';
    } else if (/market|marketplace|சந்தை/i.test(norm)) {
      targetTab = 'marketplace';
      labelEn = 'Navigate to Crop Marketplace';
      labelTa = 'பயிர் சந்தைக்கு செல்';
    }

    return {
      intent: 'NAVIGATE',
      intentLabelEn: labelEn,
      intentLabelTa: labelTa,
      transcript,
      targetTab,
    };
  }

  // ----------------------------------------------------------------------
  // 3. APPLICATION DATA QUERY -> GUARDIAN AI
  // ----------------------------------------------------------------------
  if (isDataQuery) {
    return {
      intent: 'GUARDIAN_AI_QUERY',
      intentLabelEn: 'Ask Guardian AI (Live App Data)',
      intentLabelTa: 'கார்டியன் AI-யிடம் கேள் (நேரலை தரவு)',
      transcript,
    };
  }

  // Helpers for extraction
  const extractDate = (text: string): string => {
    if (/tomorrow|நாளை|naalai/i.test(text)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    if (/today|இன்று|inru/i.test(text)) {
      return new Date().toISOString().split('T')[0];
    }
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

  const extractCrop = (text: string): string => {
    if (/coconut|தேங்காய்|thenkai/i.test(text)) return 'Coconut';
    if (/paddy|rice|நெல்|nel/i.test(text)) return 'Paddy';
    if (/sugarcane|கரும்பு|karumbu/i.test(text)) return 'Sugarcane';
    if (/banana|வாழை|vaazhai/i.test(text)) return 'Banana';
    if (/groundnut|கடலை|kadalai/i.test(text)) return 'Groundnut';
    if (/turmeric|மஞ்சள்|manjal/i.test(text)) return 'Turmeric';
    if (/cotton|பருத்தி|paruthi/i.test(text)) return 'Cotton';
    if (/tomato|தக்காளி|thakkali/i.test(text)) return 'Tomato';
    return 'Coconut';
  };

  const extractLocation = (text: string): string => {
    if (/pollachi|பொள்ளாச்சி/i.test(text)) return 'Pollachi, Coimbatore';
    if (/coimbatore|கோவை|கோயம்புத்தூர்/i.test(text)) return 'Coimbatore District';
    if (/salem|சேலம்/i.test(text)) return 'Salem District';
    if (/madurai|மதுரை/i.test(text)) return 'Madurai District';
    if (/erode|ஈரோடு/i.test(text)) return 'Erode District';
    if (/anamalai|ஆனைமலை/i.test(text)) return 'Anamalai Road, Pollachi';
    return 'Pollachi, Coimbatore';
  };

  const extractNumber = (text: string, defaultNum: number = 6): number => {
    const numMatch = text.match(/(\d+)/);
    if (numMatch) return parseInt(numMatch[1], 10);

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

  // ----------------------------------------------------------------------
  // 4. LABOUR REQUIREMENT FORM PRE-FILL
  // Explicit request for workers / labour
  // ----------------------------------------------------------------------
  const hasLabourKeywords = /worker|workers|labour|labourer|harvesting|weeding|climber|climbers|ஆட்கள்|வேலைக்காரர்கள்|வேலை ஆட்கள்/i.test(norm);
  const hasRequestKeywords = /need|want|require|venum|tevai|வேண்டும்|தேவை/i.test(norm);

  if (hasLabourKeywords && (hasRequestKeywords || /\d+/.test(norm))) {
    const crop = extractCrop(norm);
    const workersNeeded = extractNumber(norm, 6);
    const date = extractDate(norm);
    const location = extractLocation(norm);

    let workType = 'Harvesting';
    if (/tree climbing|climbing|மரம் ஏறுதல்/i.test(norm)) workType = 'Coconut Tree Climbing';
    else if (/weeding|களை எடுத்தல்/i.test(norm)) workType = 'Weeding & Field Cleaning';
    else if (/spraying|தெளித்தல்/i.test(norm)) workType = 'Pesticide Spraying';
    else if (/de-husking|dehusking|மட்டை உரித்தல்/i.test(norm)) workType = 'Coconut De-husking';

    let timeSlot = '07:00 AM - 02:00 PM';
    if (/evening|மாலை|maalai/i.test(norm)) timeSlot = '02:00 PM - 06:00 PM';
    else if (/morning|காலை|kaalai/i.test(norm)) timeSlot = '07:00 AM - 02:00 PM';

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

  // ----------------------------------------------------------------------
  // 5. MACHINERY REQUIREMENT FORM PRE-FILL
  // Explicit request for machines
  // ----------------------------------------------------------------------
  const hasMachineKeywords = /rotavator|tractor|harvester|tiller|weeder|sprayer|drone|ரொட்டவேட்டர்|டிராக்டர்|இயந்திரம்/i.test(norm);

  if (hasMachineKeywords && (hasRequestKeywords || /\d+/.test(norm) || /acre|acres|ஏக்கர்/i.test(norm))) {
    const crop = extractCrop(norm);
    const date = extractDate(norm);
    const location = extractLocation(norm);

    let machineType = 'Rotavator';
    let attachment = 'Rotavator (42-Blade Rotary Tiller)';
    if (/tractor|டிராக்டர்/i.test(norm)) {
      machineType = 'Tractor';
      attachment = '4WD Agricultural Tractor';
    } else if (/harvester|ஹார்வெஸ்டர்/i.test(norm)) {
      machineType = 'Combine Harvester';
      attachment = 'Paddy Combine Harvester';
    } else if (/drone|டிரோன்/i.test(norm)) {
      machineType = 'Drone Sprayer';
      attachment = '10L Crop Spraying Drone';
    } else if (/tiller|weeder|வீடர்/i.test(norm)) {
      machineType = 'Power Weeder';
      attachment = 'Rotary Power Weeder';
    }

    const areaMatch = norm.match(/(\d+)\s*(acres|acre|ஏக்கர்|eakar)/i);
    const area = areaMatch ? `${areaMatch[1]} Acres` : '3 Acres';

    let timeSlot = '08:00 AM - 12:00 PM';
    if (/morning|காலை|kaalai/i.test(norm)) timeSlot = '08:00 AM - 12:00 PM';
    else if (/afternoon|evening|மாலை/i.test(norm)) timeSlot = '02:00 PM - 06:00 PM';

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

  // ----------------------------------------------------------------------
  // 6. MARKET PRICE LOOKUP
  // ----------------------------------------------------------------------
  if (/price|rate|vilai|cost|விலை|விகிதம்|சந்தை/i.test(norm) && /what|how much|enna|என்ன|எவ்வளவு|show|check/i.test(norm)) {
    const crop = extractCrop(norm);
    return {
      intent: 'LOOKUP_MARKET_PRICE',
      intentLabelEn: `Lookup Market Price for ${crop}`,
      intentLabelTa: `${crop} சந்தை விலை விவரம்`,
      transcript,
      searchTopic: crop,
      targetTab: 'marketplace',
    };
  }

  // ----------------------------------------------------------------------
  // 7. BUYER REQUIREMENT LOOKUP
  // ----------------------------------------------------------------------
  if (/buyer|buyers|requirement|requirements|கொள்முதல்|தேவை/i.test(norm) && /search|lookup|view|show/i.test(norm)) {
    const crop = extractCrop(norm);
    return {
      intent: 'LOOKUP_BUYER_REQ',
      intentLabelEn: `View Buyer Requirements for ${crop}`,
      intentLabelTa: `${crop} கொள்முதல் தேவைகள்`,
      transcript,
      searchTopic: crop,
      targetTab: 'requirements',
    };
  }

  // ----------------------------------------------------------------------
  // 8. FALLBACK TO GUARDIAN AI QUERY
  // ----------------------------------------------------------------------
  return {
    intent: 'GUARDIAN_AI_QUERY',
    intentLabelEn: 'Ask Guardian AI',
    intentLabelTa: 'கார்டியன் AI-யிடம் கேள்',
    transcript,
  };
}
