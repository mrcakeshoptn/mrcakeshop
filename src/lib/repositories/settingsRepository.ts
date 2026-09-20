import { ShopSettings, defaultSettings } from '@/types/settings';
import { readJSON, writeJSON } from '@/lib/storage';

const STORAGE_KEY = 'mr_cake_settings';

export interface SettingsRepository {
  get(): ShopSettings;
  save(settings: ShopSettings): ShopSettings;
  resetToDefaults(): ShopSettings;
}

class LocalStorageSettingsRepository implements SettingsRepository {
  get(): ShopSettings {
    // Merge over defaults so new settings fields introduced in later versions
    // don't come back as `undefined` for a browser that saved an older shape.
    return { ...defaultSettings(), ...readJSON<Partial<ShopSettings>>(STORAGE_KEY, {}) };
  }

  save(settings: ShopSettings): ShopSettings {
    writeJSON(STORAGE_KEY, settings);
    return settings;
  }

  resetToDefaults(): ShopSettings {
    const fresh = defaultSettings();
    writeJSON(STORAGE_KEY, fresh);
    return fresh;
  }
}

let instance: SettingsRepository | null = null;

export function useSettingsRepository(): SettingsRepository {
  if (!instance) instance = new LocalStorageSettingsRepository();
  return instance;
}
