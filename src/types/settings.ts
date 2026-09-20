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

  heroImageDataUrl: string;
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

    heroImageDataUrl: '',
  };
}
