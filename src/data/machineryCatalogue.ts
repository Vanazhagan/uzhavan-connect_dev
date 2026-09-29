import { MACHINERY_ASSET_IMAGES } from '../assets/images';

export interface MachineryCatalogueItem {
  id: string;
  name: string;
  nameTa: string;
  category: 'Tractor & Implements' | 'Land Preparation' | 'Paddy Machinery' | 'Spraying' | 'Coconut & Horticulture' | 'Post Harvest';
  categoryCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  imageUrl: string;
  description: string;
  descriptionTa: string;
  supportedPurposes: string[];
  supportedCrops: string[];
  pricingUnit: string;
  typicalRate: number;
  providerType: string;
  availableAttachments?: string[];
}

export const MACHINERY_CATEGORIES = [
  { id: 'All', name: 'All Machinery', nameTa: 'அனைத்து இயந்திரங்கள்' },
  { id: 'Tractor & Implements', name: 'Tractor & Implements', nameTa: 'டிராக்டர் & உழவு கருவிகள்' },
  { id: 'Land Preparation', name: 'Land Preparation', nameTa: 'நிலம் ஆயத்தம் செய்தல்' },
  { id: 'Paddy Machinery', name: 'Paddy Machinery', nameTa: 'நெல் சாகுபடி இயந்திரங்கள்' },
  { id: 'Spraying', name: 'Spraying Services', nameTa: 'மருந்து தெளிப்பு இயந்திரங்கள்' },
  { id: 'Coconut & Horticulture', name: 'Coconut & Horticulture', nameTa: 'தென்னை & தோட்டக்கலை' },
  { id: 'Post Harvest', name: 'Post Harvest', nameTa: 'அறுவடை பின்சார் இயந்திரங்கள்' },
];

export const TRACTOR_ATTACHMENTS = [
  { id: 'rotavator', name: 'Rotavator (42-Blade Rotary Tiller)', nameTa: 'ரோட்டவேட்டர்' },
  { id: 'cultivator', name: '9-Tyne Heavy Cultivator', nameTa: 'கால்டிவேட்டர்' },
  { id: 'plough', name: 'Disc Plough / Mouldboard Plough', nameTa: 'டிஸ்க் பிளவ் / ஏர்' },
  { id: 'trailer', name: '4-Ton Hydraulic Tipping Trailer', nameTa: 'டிரெய்லர் / டிப்பர்' },
  { id: 'seed_drill', name: 'Automatic Seed & Fertilizer Drill', nameTa: 'விதை விதைக்கும் கருவி' },
  { id: 'ridger', name: '2-Row Channel Ridger', nameTa: 'பாத்தி அமைக்கும் கருவி' },
];

export const MACHINERY_WORK_PURPOSES = [
  'Land Preparation',
  'Ploughing',
  'Rotavation',
  'Sowing',
  'Transplanting',
  'Weeding',
  'Spraying',
  'Harvesting',
  'Shelling',
  'Farm Transport',
  'Coconut Climbing',
  'Other',
];

export const getFallbackMachineryImage = (categoryOrName: string): string => {
  const norm = (categoryOrName || '').toLowerCase();
  if (norm.includes('climb') || norm.includes('tree') || norm.includes('coconut') || norm.includes('palm')) {
    return MACHINERY_ASSET_IMAGES.coconutClimber;
  }
  if (norm.includes('transplanter') || norm.includes('rice') || norm.includes('paddy trans')) {
    return MACHINERY_ASSET_IMAGES.paddyTransplanter;
  }
  if (norm.includes('harvester') || norm.includes('combine')) {
    return MACHINERY_ASSET_IMAGES.combineHarvester;
  }
  if (norm.includes('weeder')) {
    return MACHINERY_ASSET_IMAGES.powerWeeder;
  }
  if (norm.includes('trailer') || norm.includes('tipper') || norm.includes('trolley')) {
    return MACHINERY_ASSET_IMAGES.tractorTrailer;
  }
  if (norm.includes('rotavator')) {
    return MACHINERY_ASSET_IMAGES.rotavator;
  }
  if (norm.includes('tiller')) {
    return MACHINERY_ASSET_IMAGES.powerTiller;
  }
  if (norm.includes('drone')) {
    return MACHINERY_ASSET_IMAGES.droneSprayer;
  }
  if (norm.includes('sprayer')) {
    return MACHINERY_ASSET_IMAGES.powerSprayer;
  }
  if (norm.includes('sheller') || norm.includes('corn') || norm.includes('maize')) {
    return MACHINERY_ASSET_IMAGES.maizeSheller;
  }
  if (norm.includes('reaper')) {
    return MACHINERY_ASSET_IMAGES.reaper;
  }
  return MACHINERY_ASSET_IMAGES.tractor;
};

export const MACHINERY_CATALOGUE: MachineryCatalogueItem[] = [
  {
    id: 'cat_tractor',
    name: 'Tractor',
    nameTa: 'டிராக்டர் (45HP / 50HP)',
    category: 'Tractor & Implements',
    categoryCode: 'A',
    imageUrl: MACHINERY_ASSET_IMAGES.tractor,
    description: 'Heavy duty 45HP-50HP agricultural tractors with dual PTO for ploughing, land preparation, subsoiling, and trailer haulage.',
    descriptionTa: 'நிலம் உழுவதற்கும், ரோட்டவேட்டர் மற்றும் சரக்கு டிரெய்லர் இயக்குவதற்கும் ஏற்ற அதிக திறன் கொண்ட டிராக்டர்கள்.',
    supportedPurposes: ['Land Preparation', 'Ploughing', 'Rotavation', 'Farm Transport', 'Sowing'],
    supportedCrops: ['Paddy', 'Coconut', 'Sugarcane', 'Maize', 'Groundnut', 'All Crops'],
    pricingUnit: '₹ / Hour',
    typicalRate: 850,
    providerType: 'Custom Hiring Centre / Tractor Owner',
    availableAttachments: [
      'Rotavator (42-Blade)',
      '9-Tyne Cultivator',
      'Disc Plough',
      '4-Ton Hydraulic Trailer',
      'Laser Land Leveller',
      'Seed Drill',
    ],
  },
  {
    id: 'cat_rotavator',
    name: 'Rotavator',
    nameTa: 'ரோட்டவேட்டர் (மண் நுண்மையாக்கும் கருவி)',
    category: 'Land Preparation',
    categoryCode: 'B',
    imageUrl: MACHINERY_ASSET_IMAGES.rotavator,
    description: 'Precision tractor-mounted rotary tiller with boron steel blades for soil pulverization, bed preparation, and paddy mud puddling.',
    descriptionTa: 'கட்டிகளை உடைத்து மண்ணை நைஸாக நுண்மையாக்கி நாற்று நடுவதற்கு ஏதுவாக தயார் செய்யும் கருவி.',
    supportedPurposes: ['Land Preparation', 'Rotavation'],
    supportedCrops: ['Paddy', 'Sugarcane', 'Groundnut', 'Maize', 'Vegetables'],
    pricingUnit: '₹ / Acre',
    typicalRate: 1500,
    providerType: 'Custom Hiring Centre',
  },
  {
    id: 'cat_power_tiller',
    name: 'Power Tiller',
    nameTa: 'பவர் டில்லர் (இருசக்கர உழவு இயந்திரம்)',
    category: 'Land Preparation',
    categoryCode: 'B',
    imageUrl: MACHINERY_ASSET_IMAGES.powerTiller,
    description: 'Walk-behind 12HP-15HP diesel power tiller ideal for smallholdings, wet paddy field puddling, and narrow inter-row tilling.',
    descriptionTa: 'சிறிய பண்ணைகள் மற்றும் நெல் வயல்களில் சேறு உழுவதற்கு ஏற்ற எளிதான பவர் டில்லர்.',
    supportedPurposes: ['Land Preparation', 'Rotavation', 'Weeding'],
    supportedCrops: ['Paddy', 'Vegetables', 'Sugarcane', 'Banana'],
    pricingUnit: '₹ / Acre',
    typicalRate: 1200,
    providerType: 'Agri Service Co-op / Equipment Owner',
  },
  {
    id: 'cat_power_weeder',
    name: 'Power Weeder',
    nameTa: 'பவர் வீடர் (களை எடுக்கும் இயந்திரம்)',
    category: 'Land Preparation',
    categoryCode: 'B',
    imageUrl: MACHINERY_ASSET_IMAGES.powerWeeder,
    description: 'Compact 7HP petrol/diesel power weeder designed for inter-row weeding and soil aeration in sugarcane, maize, and cotton crops.',
    descriptionTa: 'பயிர்களுக்கு இடையே உள்ள களைகளை விரைவாக அகற்றி மண்ணைக் கிளறிவிடும் பவர் வீடர்.',
    supportedPurposes: ['Weeding', 'Land Preparation'],
    supportedCrops: ['Sugarcane', 'Maize', 'Cotton', 'Vegetables', 'Coconut'],
    pricingUnit: '₹ / Acre',
    typicalRate: 800,
    providerType: 'Local Equipment Hiring Centre',
  },
  {
    id: 'cat_paddy_transplanter',
    name: 'Paddy Transplanter',
    nameTa: 'நெல் நாற்று நடும் இயந்திரம்',
    category: 'Paddy Machinery',
    categoryCode: 'C',
    imageUrl: MACHINERY_ASSET_IMAGES.paddyTransplanter,
    description: '4-row and 8-row self-propelled riding paddy transplanters for uniform mat seedling planting with optimal hill spacing.',
    descriptionTa: 'நெல் நாற்றுகளை சீரான இடைவெளியில் விரைவாகவும் துல்லியமாகவும் நடும் நவீன இயந்திரம்.',
    supportedPurposes: ['Transplanting', 'Sowing'],
    supportedCrops: ['Paddy'],
    pricingUnit: '₹ / Acre',
    typicalRate: 2200,
    providerType: 'Delta Paddy Machinery Fleet',
  },
  {
    id: 'cat_combine_harvester',
    name: 'Combine Harvester',
    nameTa: 'கம்பைன் ஹார்வெஸ்டர் (நெல் அறுவடை இயந்திரம்)',
    category: 'Paddy Machinery',
    categoryCode: 'C',
    imageUrl: MACHINERY_ASSET_IMAGES.combineHarvester,
    description: 'Track-type and wheel-type combine harvesters for paddy cutting, threshing, cleaning, and bagging in marshy and dry fields.',
    descriptionTa: 'நெல் அறுவடை, கதிரடித்தல், தூற்றுதல் ஆகியவற்றை ஒரே நேரத்தில் செய்யும் அதிநவீன இயந்திரம்.',
    supportedPurposes: ['Harvesting'],
    supportedCrops: ['Paddy', 'Maize', 'Sunflower'],
    pricingUnit: '₹ / Hour',
    typicalRate: 2400,
    providerType: 'Harvest Fleet Owner',
  },
  {
    id: 'cat_reaper',
    name: 'Reaper',
    nameTa: 'ரீப்பர் (பயிர் வெட்டும் கருவி)',
    category: 'Paddy Machinery',
    categoryCode: 'C',
    imageUrl: MACHINERY_ASSET_IMAGES.reaper,
    description: 'Self-propelled 3.5HP crop reaper for neat ground-level cutting and side-conveying of paddy, sesame, and millet stalks.',
    descriptionTa: 'நெல் மற்றும் தானிய பயிர்களை தரைமட்டத்தில் சுத்தமாக வெட்டி வரிசையாக அடுக்கும் ரீப்பர்.',
    supportedPurposes: ['Harvesting'],
    supportedCrops: ['Paddy', 'Maize', 'Sunflower', 'Groundnut'],
    pricingUnit: '₹ / Acre',
    typicalRate: 1400,
    providerType: 'Local Custom Hiring Centre',
  },
  {
    id: 'cat_power_sprayer',
    name: 'Power Sprayer',
    nameTa: 'பவர் ஸ்ப்ரேயர் (மருந்து தெளிக்கும் இயந்திரம்)',
    category: 'Spraying',
    categoryCode: 'D',
    imageUrl: MACHINERY_ASSET_IMAGES.powerSprayer,
    description: 'Motorized high-pressure HTP power sprayer with 150m hose reel for orchards, cotton, groundnut, and sugarcane pest control.',
    descriptionTa: 'தோட்டக்கலை பயிர்கள் மற்றும் வயல்களுக்கு அதிவேக அழுத்தத்துடன் பூச்சிக்கொல்லி தெளிக்கும் பவர் ஸ்ப்ரேயர்.',
    supportedPurposes: ['Spraying'],
    supportedCrops: ['Coconut', 'Sugarcane', 'Groundnut', 'Banana', 'Cotton'],
    pricingUnit: '₹ / Acre',
    typicalRate: 600,
    providerType: 'Plant Protection Service',
  },
  {
    id: 'cat_drone_sprayer',
    name: 'Drone Sprayer',
    nameTa: 'அக்ரி ட்ரோன் ஸ்ப்ரேயர் (ட்ரோன் மருந்து தெளிப்பு)',
    category: 'Spraying',
    categoryCode: 'D',
    imageUrl: MACHINERY_ASSET_IMAGES.droneSprayer,
    description: 'Autonomous 40L agricultural spraying drone with RTK GPS navigation. Sprays 1 acre in 7 minutes with zero soil compaction.',
    descriptionTa: 'ட்ரோன் மூலம் பயிர்களின் மேல் பகுதியில் 7 நிமிடத்தில் 1 ஏக்கருக்கு சீராக மருந்து தெளிக்கும் தொழில்நுட்பம்.',
    supportedPurposes: ['Spraying'],
    supportedCrops: ['Paddy', 'Sugarcane', 'Maize', 'Groundnut', 'Sunflower', 'Cotton'],
    pricingUnit: '₹ / Acre',
    typicalRate: 500,
    providerType: 'Kongu Drone Spraying Hub (DGCA Certified)',
  },
  {
    id: 'cat_coconut_climbing_machine',
    name: 'Coconut Tree Climbing Machine',
    nameTa: 'தென்னை மரம் ஏறும் கருவி / இயந்திரம்',
    category: 'Coconut & Horticulture',
    categoryCode: 'E',
    imageUrl: MACHINERY_ASSET_IMAGES.coconutClimber,
    description: 'Safety-certified hydraulic/mechanical tree climbing device with auto-grippers and harness for safe coconut harvesting and crown cleaning.',
    descriptionTa: 'தென்னை மரங்களில் பாதுகாப்பாக ஏறி தேங்காய் பறிக்கவும் மரம் சுத்தம் செய்யவும் பயன்படும் நவீன கருவி.',
    supportedPurposes: ['Coconut Climbing', 'Harvesting'],
    supportedCrops: ['Coconut'],
    pricingUnit: '₹ / Tree',
    typicalRate: 45,
    providerType: 'Coconut Service Specialist',
  },
  {
    id: 'cat_maize_sheller',
    name: 'Maize Sheller',
    nameTa: 'மக்காச்சோளம் உரிக்கும் இயந்திரம்',
    category: 'Post Harvest',
    categoryCode: 'F',
    imageUrl: MACHINERY_ASSET_IMAGES.maizeSheller,
    description: 'PTO-driven and diesel engine maize husker-sheller machine for high capacity threshing, grain separation, and cob ejection.',
    descriptionTa: 'மக்காச்சோளக் கதிர்களில் இருந்து சோள மணிகளை சேதமின்றி பிரித்தெடுக்கும் சக்திவாய்ந்த இயந்திரம்.',
    supportedPurposes: ['Shelling', 'Post Harvest'],
    supportedCrops: ['Maize'],
    pricingUnit: '₹ / Ton',
    typicalRate: 750,
    providerType: 'Post-Harvest Service Provider',
  },
  {
    id: 'cat_tractor_trailer',
    name: 'Tractor Trailer / Tipper',
    nameTa: 'டிராக்டர் டிரெய்லர் / டிப்பர் (சரக்கு ஏற்றிச்செல்ல)',
    category: 'Tractor & Implements',
    categoryCode: 'A',
    imageUrl: MACHINERY_ASSET_IMAGES.tractorTrailer,
    description: '4-ton and 6-ton hydraulic tipping tractor trailers for farm produce haulage, manure transport, and mandi delivery.',
    descriptionTa: 'பண்ணை விளைபொருட்கள், எரு மற்றும் அறுவடைப் பொருட்களை மண்டைக்கு ஏற்றிச் செல்ல பயன்படும் டிரெய்லர்.',
    supportedPurposes: ['Farm Transport', 'Post Harvest'],
    supportedCrops: ['Coconut', 'Paddy', 'Sugarcane', 'Maize', 'All Crops'],
    pricingUnit: '₹ / Hour',
    typicalRate: 700,
    providerType: 'Rural Transport Service',
  },
];
