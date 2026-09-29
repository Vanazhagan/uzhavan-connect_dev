import { ASSET_IMAGES } from '../assets/images';

export interface CropCatalogItem {
  id: string;
  cropName: string;
  cropNameTa: string;
  variety: string;
  imageUrl: string;
  description: string;
  allowedUnits: string[];
  defaultUnit: string;
  defaultPricePerKg: number;
}

export const APPROVED_CROPS: CropCatalogItem[] = [
  {
    id: 'crop_cat_paddy',
    cropName: 'Paddy',
    cropNameTa: 'நெல் (பொன்னி / BPT)',
    variety: 'BPT 5204 Deluxe Ponni',
    imageUrl: ASSET_IMAGES.cropPaddyField,
    description: 'High grade Ponni paddy grain harvested from fertile river delta fields, with optimal moisture content (13.5%) and high head rice recovery.',
    allowedUnits: ['KG', 'Quintal', 'Ton'],
    defaultUnit: 'KG',
    defaultPricePerKg: 25,
  },
  {
    id: 'crop_cat_coconut',
    cropName: 'Coconut',
    cropNameTa: 'தேங்காய்',
    variety: 'Pollachi Tall Hybrid Grade 1',
    imageUrl: ASSET_IMAGES.cropCoconutHarvest,
    description: 'Fresh mature Pollachi coconuts harvested directly from canal-fed groves, rich in copra yield, sweet water, and thick kernel.',
    allowedUnits: ['Coconuts', 'Nos'],
    defaultUnit: 'Coconuts',
    defaultPricePerKg: 32,
  },
  {
    id: 'crop_cat_groundnut',
    cropName: 'Groundnut',
    cropNameTa: 'நிலக்கடலை',
    variety: 'TMV-7 Bold Pods',
    imageUrl: 'https://images.unsplash.com/photo-1567892924277-2f3b7941a3d0?w=800&auto=format&fit=crop&q=80',
    description: 'High-oil content farm-cured groundnuts in shell. Well sun-dried, clean double-podded nuts ideal for oil extraction and direct roasting.',
    allowedUnits: ['KG', 'Quintal'],
    defaultUnit: 'KG',
    defaultPricePerKg: 75,
  },
  {
    id: 'crop_cat_blackgram',
    cropName: 'Black Gram',
    cropNameTa: 'உளுந்து',
    variety: 'VBN-8 Bold Seed',
    imageUrl: 'https://images.unsplash.com/photo-1585994191611-7206190be292?w=800&auto=format&fit=crop&q=80',
    description: 'Premium quality VBN-8 Black Gram harvested from rainfed delta belt. Bold grain size, high protein, double-polished and free of debris.',
    allowedUnits: ['KG', 'Quintal'],
    defaultUnit: 'KG',
    defaultPricePerKg: 95,
  },
  {
    id: 'crop_cat_greengram',
    cropName: 'Green Gram',
    cropNameTa: 'பாசிப்பயறு',
    variety: 'CO-8 Shiny Green',
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
    description: 'Freshly harvested shiny green gram (Moong). High germination and protein density, ideal for wholesale pulse processors.',
    allowedUnits: ['KG', 'Quintal'],
    defaultUnit: 'KG',
    defaultPricePerKg: 88,
  },
  {
    id: 'crop_cat_onion',
    cropName: 'Onion',
    cropNameTa: 'சின்ன வெங்காயம்',
    variety: 'Dindigul Rose Small Onion (Grade 1)',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh farm-cured Dindigul rose small onions with vibrant purple-red skin, pungent aroma, sun-dried for long shelf storage.',
    allowedUnits: ['KG', 'Quintal'],
    defaultUnit: 'KG',
    defaultPricePerKg: 42,
  },
  {
    id: 'crop_cat_sugarcane',
    cropName: 'Sugarcane',
    cropNameTa: 'கரும்பு',
    variety: 'CO-86032 High Sucrose',
    imageUrl: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&auto=format&fit=crop&q=80',
    description: 'Juicy CO-86032 high-sucrose sugarcane stalks cultivated in canal irrigated soil. Ideal for sugar mills and jaggery crushing units.',
    allowedUnits: ['Ton', 'KG'],
    defaultUnit: 'Ton',
    defaultPricePerKg: 3.2,
  },
  {
    id: 'crop_cat_banana',
    cropName: 'Banana',
    cropNameTa: 'வாழை (ஜி9 / நேந்திரன்)',
    variety: 'Grand Naine Cavendish Grade 1',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh farm-gate Grand Naine Cavendish / Nendran bananas from Bhavani river belt. Spotless green harvest stage, uniform bunch clusters, rich sweet pulp.',
    allowedUnits: ['KG', 'Bunch'],
    defaultUnit: 'KG',
    defaultPricePerKg: 32,
  },
  {
    id: 'crop_cat_sunflower',
    cropName: 'Sunflower',
    cropNameTa: 'சூரியகாந்தி',
    variety: 'KBSH-44 Hybrid Seeds',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80',
    description: 'High oil content sun-dried sunflower seeds. Tested moisture 8.5%, high seed weight, perfect for edible oil processing mills.',
    allowedUnits: ['KG', 'Quintal'],
    defaultUnit: 'KG',
    defaultPricePerKg: 65,
  },
  {
    id: 'crop_cat_maize',
    cropName: 'Corn / Maize',
    cropNameTa: 'மக்காச்சோளம்',
    variety: 'Coimbatore Yellow Hybrid',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    description: 'Clean golden yellow hybrid maize grain. Moisture tested at 12.8%, zero aflatoxin, high starch density, ideal for feed and starch mills.',
    allowedUnits: ['KG', 'Quintal'],
    defaultUnit: 'KG',
    defaultPricePerKg: 22,
  },
];

export function getCropMeta(cropName: string): CropCatalogItem {
  const norm = cropName.toLowerCase();
  const match = APPROVED_CROPS.find(
    c => c.cropName.toLowerCase() === norm || c.id.toLowerCase() === norm || norm.includes(c.cropName.toLowerCase())
  );
  if (match) return match;

  // Fallback default
  return APPROVED_CROPS[0];
}
