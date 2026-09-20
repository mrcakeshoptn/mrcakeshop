import { supabase } from '@/lib/supabaseClient';
import { ShopSettings, defaultSettings, defaultReadinessRules } from '@/types/settings';

export interface SettingsRepository {
  get(): Promise<ShopSettings>;
  save(settings: ShopSettings): Promise<ShopSettings>;
}

function rowToSettings(row: Record<string, unknown>): ShopSettings {
  const fallback = defaultSettings();
  return {
    businessName: (row.business_name as string) ?? fallback.businessName,
    phone: (row.phone as string) ?? fallback.phone,
    whatsappNumber: (row.whatsapp_number as string) ?? fallback.whatsappNumber,
    address: (row.address as string) ?? fallback.address,
    googleMapsUrl: (row.google_maps_url as string) ?? fallback.googleMapsUrl,
    instagramUrl: (row.instagram_url as string) ?? fallback.instagramUrl,
    currency: (row.currency as string) ?? fallback.currency,
    maximumOnlineWeight: Number(row.maximum_online_weight ?? fallback.maximumOnlineWeight),
    defaultWeight: Number(row.default_weight ?? fallback.defaultWeight),
    defaultShape: (row.default_shape as ShopSettings['defaultShape']) ?? fallback.defaultShape,
    whatsappOrderEnabled: Boolean(row.whatsapp_order_enabled),
    customCakeRequestEnabled: Boolean(row.custom_cake_request_enabled),
    deliveryEnabled: Boolean(row.delivery_enabled),
    heroImageDataUrl: (row.hero_image_data_url as string) ?? '',
    aboutContent: (row.about_content as string) ?? '',
    privacyContent: (row.privacy_content as string) ?? '',
    readinessRules: {
      ...defaultReadinessRules(),
      ...((row.readiness_rules as object) || {}),
    },
  };
}

function settingsToRow(settings: ShopSettings) {
  return {
    business_name: settings.businessName,
    phone: settings.phone,
    whatsapp_number: settings.whatsappNumber,
    address: settings.address,
    google_maps_url: settings.googleMapsUrl,
    instagram_url: settings.instagramUrl,
    currency: settings.currency,
    maximum_online_weight: settings.maximumOnlineWeight,
    default_weight: settings.defaultWeight,
    default_shape: settings.defaultShape,
    whatsapp_order_enabled: settings.whatsappOrderEnabled,
    custom_cake_request_enabled: settings.customCakeRequestEnabled,
    delivery_enabled: settings.deliveryEnabled,
    hero_image_data_url: settings.heroImageDataUrl,
    about_content: settings.aboutContent,
    privacy_content: settings.privacyContent,
    readiness_rules: settings.readinessRules,
  };
}

class SupabaseSettingsRepository implements SettingsRepository {
  async get(): Promise<ShopSettings> {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error || !data) {
      console.error('Failed to load settings', error);
      return defaultSettings();
    }
    return rowToSettings(data);
  }

  async save(settings: ShopSettings): Promise<ShopSettings> {
    const row = settingsToRow(settings);
    const { data, error } = await supabase
      .from('settings')
      .update(row)
      .eq('id', 1)
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to save settings');
    return rowToSettings(data);
  }
}

let instance: SettingsRepository | null = null;

export function useSettingsRepository(): SettingsRepository {
  if (!instance) instance = new SupabaseSettingsRepository();
  return instance;
}
