export type CakeCategory = 'fresh-cream' | 'butter-cream' | 'designer' | 'custom';

export type CreamType = 'fresh-cream' | 'butter-cream';

export type CakeShape = 'round' | 'square' | 'heart';

export type StepOption = 1 | 2 | 3;

export interface WeightPrice {
  weightKg: number;
  price: number;
  active: boolean;
}

export interface ShapeCharge {
  weightKg: number;
  round: number;
  square: number;
  heart: number;
}

export interface WeightCharge {
  weightKg: number;
  charge: number;
}

export interface CakeProduct {
  id: string;
  name: string;
  category: CakeCategory;
  creamType: CreamType;
  flavour: string;
  description: string;
  images: string[];
  mainImage: string;
  featured: boolean;
  active: boolean;
  designer: boolean;
  customAvailable: boolean;
  weights: WeightPrice[];
  shapeCharges: ShapeCharge[];
  egglessAvailable: boolean;
  egglessCharges: WeightCharge[];
  stepOptions: StepOption[];
  minimumWeightFor2Step: number;
  minimumWeightFor3Step: number;
  maximumStandardWeight: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceSelection {
  weightKg: number;
  shape: CakeShape;
  eggType: 'egg' | 'eggless';
  steps: StepOption;
}

export interface PriceBreakdown {
  basePrice: number;
  shapeCharge: number;
  egglessCharge: number;
  stepCharge: number;
  total: number;
}

export interface CustomCakeRequest {
  customerName: string;
  mobile: string;
  requiredDate: string;
  approxWeight: string;
  cakeType: string;
  creamType: string;
  shape: string;
  eggType: string;
  steps: string;
  cakeMessage: string;
  specialInstructions: string;
  hasReferenceImage: boolean;
}

// New, empty product used as the starting point for the admin "Add Cake" form.
export function blankCakeProduct(): CakeProduct {
  const now = new Date().toISOString();
  return {
    id: '',
    name: '',
    category: 'fresh-cream',
    creamType: 'fresh-cream',
    flavour: '',
    description: '',
    images: [],
    mainImage: '',
    featured: false,
    active: true,
    designer: false,
    customAvailable: false,
    weights: [
      { weightKg: 1, price: 0, active: true },
      { weightKg: 1.5, price: 0, active: true },
      { weightKg: 2, price: 0, active: true },
    ],
    shapeCharges: [
      { weightKg: 1, round: 0, square: 0, heart: 0 },
      { weightKg: 1.5, round: 0, square: 0, heart: 0 },
      { weightKg: 2, round: 0, square: 0, heart: 0 },
    ],
    egglessAvailable: true,
    egglessCharges: [
      { weightKg: 1, charge: 0 },
      { weightKg: 1.5, charge: 0 },
      { weightKg: 2, charge: 0 },
    ],
    stepOptions: [1, 2, 3],
    minimumWeightFor2Step: 1.5,
    minimumWeightFor3Step: 3,
    maximumStandardWeight: 5,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  };
}
