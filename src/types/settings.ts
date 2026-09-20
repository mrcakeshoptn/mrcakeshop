export interface ReadinessRules {
  timezone: string;
  /** No new orders confirmed between these hours (0–23, e.g. 0–6 = midnight–6am). */
  closedStartHour: number;
  closedEndHour: number;
  /** Confirmed between closedEndHour and this hour → "morning" band. */
  morningEndHour: number;
  morningNormalHours: number;
  morningSpecialHours: number;
  /** Confirmed between morningEndHour and this hour → "afternoon" band. */
  afternoonEndHour: number;
  afternoonHours: number;
  /** Confirmed after afternoonEndHour → ready by this hour the next day. */
  eveningReadyHour: number;
  /** Cake categories treated as quick/standard turnaround. */
  normalCategories: string[];
  /** Cake categories that need more lead time (designer, custom, eggless). */
  specialCategories: string[];
}

export function defaultReadinessRules(): ReadinessRules {
  return {
    timezone: 'Asia/Kolkata',
    closedStartHour: 0,
    closedEndHour: 6,
    morningEndHour: 13,
    morningNormalHours: 2,
    morningSpecialHours: 6,
    afternoonEndHour: 18,
    afternoonHours: 3,
    eveningReadyHour: 6,
    normalCategories: ['fresh-cream', 'butter-cream'],
    specialCategories: ['designer', 'custom', 'eggless'],
  };
}

export interface ShopSettings {
  businessName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;

  currency: string;
  maximumOnlineWeight: number;
  defaultWeight: number;
  defaultShape: 'round' | 'square' | 'heart';

  whatsappOrderEnabled: boolean;
  customCakeRequestEnabled: boolean;
  deliveryEnabled: boolean;

  heroImageDataUrl: string;
  aboutContent: string;
  privacyContent: string;
  readinessRules: ReadinessRules;
}

export function defaultSettings(): ShopSettings {
  return {
    businessName: 'M.R Cake Shop',
    phone: 'PHONE_NUMBER_HERE',
    whatsappNumber: 'WHATSAPP_NUMBER_HERE',
    address: 'Tiruppur, Tamil Nadu, India',
    googleMapsUrl: '',
    instagramUrl: '',

    currency: '₹',
    maximumOnlineWeight: 5,
    defaultWeight: 1,
    defaultShape: 'round',

    whatsappOrderEnabled: true,
    customCakeRequestEnabled: true,
    deliveryEnabled: false,

    heroImageDataUrl: '',
    aboutContent: '',
    privacyContent: '',
    readinessRules: defaultReadinessRules(),
  };
}
