import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BamiPhase, BamiSettings, BamiShareholder } from '../types';
import { INITIAL_PHASES, INITIAL_SETTINGS, INITIAL_SHAREHOLDERS } from '../data/initialData';
import { DEFAULT_SUPABASE_CONFIG } from '../config/supabaseConfig';

const SETTINGS_KEY = 'bami_ai_settings_v3';
const PHASES_KEY = 'bami_ai_phases_v3';
const SHAREHOLDERS_KEY = 'bami_ai_shareholders_v3';
const SUPABASE_URL_KEY = 'bami_supabase_url_v3';
const SUPABASE_KEY_KEY = 'bami_supabase_anon_key_v3';

let cachedSupabaseClient: SupabaseClient | null = null;
let cachedClientUrl: string = '';
let cachedClientKey: string = '';

/**
 * Returns active Supabase credentials with robust multi-layer fallback:
 * 1. Dedicated persistent localStorage
 * 2. Settings localStorage
 * 3. Vite environment variables (.env / build-time)
 * 4. Default config file (src/config/supabaseConfig.ts)
 */
export function getActiveSupabaseCredentials(): { url: string; key: string } {
  // 1. Dedicated localStorage
  let fromStorageUrl = '';
  let fromStorageKey = '';
  try {
    fromStorageUrl = localStorage.getItem(SUPABASE_URL_KEY) || localStorage.getItem('bami_supabase_url') || '';
    fromStorageKey = localStorage.getItem(SUPABASE_KEY_KEY) || localStorage.getItem('bami_supabase_anon_key') || '';
  } catch {}

  // 2. Settings draft in localStorage
  let fromSettingsUrl = '';
  let fromSettingsKey = '';
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.supabaseUrl) fromSettingsUrl = parsed.supabaseUrl;
      if (parsed.supabaseAnonKey) fromSettingsKey = parsed.supabaseAnonKey;
    }
  } catch {}

  // 3. Vite Environment variables
  const envUrl = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL || '' : '';
  const envKey = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '' : '';

  // 4. Fallback in initial data and config file
  const configUrl = DEFAULT_SUPABASE_CONFIG.url || INITIAL_SETTINGS.supabaseUrl || '';
  const configKey = DEFAULT_SUPABASE_CONFIG.anonKey || INITIAL_SETTINGS.supabaseAnonKey || '';

  const finalUrl = (fromStorageUrl || fromSettingsUrl || envUrl || configUrl).trim();
  const finalKey = (fromStorageKey || fromSettingsKey || envKey || configKey).trim();

  return { url: finalUrl, key: finalKey };
}

/**
 * Permanently remembers Supabase credentials in browser storage
 */
export function saveActiveSupabaseCredentials(url: string, key: string): void {
  try {
    if (url) {
      localStorage.setItem(SUPABASE_URL_KEY, url.trim());
      localStorage.setItem('bami_supabase_url', url.trim());
    }
    if (key) {
      localStorage.setItem(SUPABASE_KEY_KEY, key.trim());
      localStorage.setItem('bami_supabase_anon_key', key.trim());
    }
  } catch (err) {
    console.error('Could not save Supabase credentials:', err);
  }
}

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const creds = getActiveSupabaseCredentials();
  const finalUrl = (url || creds.url).trim();
  const finalKey = (key || creds.key).trim();

  if (!finalUrl || !finalKey) {
    return null;
  }

  try {
    if (!cachedSupabaseClient || cachedClientUrl !== finalUrl || cachedClientKey !== finalKey) {
      cachedSupabaseClient = createClient(finalUrl, finalKey);
      cachedClientUrl = finalUrl;
      cachedClientKey = finalKey;
    }
    return cachedSupabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Ensures that if any phase is marked as completed,
 * the active valuation and share price automatically reflect the highest completed phase.
 */
export function syncValuationWithCompletedPhases(phases: BamiPhase[], settings: BamiSettings): BamiSettings {
  const completedPhases = phases.filter(p => p.status === 'completed');
  if (completedPhases.length === 0) {
    return settings;
  }

  // Highest completed phase by phase ID
  const highestPhase = completedPhases.reduce((prev, current) => (prev.id > current.id ? prev : current), completedPhases[0]);

  return {
    ...settings,
    totalValuation: highestPhase.valuation,
    currentSharePrice: highestPhase.sharePrice,
  };
}

export function loadLocalSettings(): BamiSettings {
  const creds = getActiveSupabaseCredentials();
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        ...INITIAL_SETTINGS,
        supabaseUrl: creds.url || INITIAL_SETTINGS.supabaseUrl,
        supabaseAnonKey: creds.key || INITIAL_SETTINGS.supabaseAnonKey,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_SETTINGS,
      ...parsed,
      supabaseUrl: parsed.supabaseUrl || creds.url || INITIAL_SETTINGS.supabaseUrl,
      supabaseAnonKey: parsed.supabaseAnonKey || creds.key || INITIAL_SETTINGS.supabaseAnonKey,
    };
  } catch {
    return {
      ...INITIAL_SETTINGS,
      supabaseUrl: creds.url || INITIAL_SETTINGS.supabaseUrl,
      supabaseAnonKey: creds.key || INITIAL_SETTINGS.supabaseAnonKey,
    };
  }
}

export function saveLocalSettings(settings: BamiSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (settings.supabaseUrl || settings.supabaseAnonKey) {
      saveActiveSupabaseCredentials(settings.supabaseUrl, settings.supabaseAnonKey);
    }
  } catch (err) {
    console.error('Could not save settings to localStorage:', err);
  }
}

export function loadLocalPhases(): BamiPhase[] {
  try {
    const raw = localStorage.getItem(PHASES_KEY);
    if (!raw) {
      return INITIAL_PHASES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((ph: BamiPhase) => {
        const init = INITIAL_PHASES.find(ip => ip.id === ph.id);
        return {
          ...ph,
          targetCompletionDate: ph.targetCompletionDate || init?.targetCompletionDate,
        };
      });
    }
    return INITIAL_PHASES;
  } catch {
    return INITIAL_PHASES;
  }
}

export function saveLocalPhases(phases: BamiPhase[]): void {
  try {
    localStorage.setItem(PHASES_KEY, JSON.stringify(phases));
  } catch (err) {
    console.error('Could not save phases to localStorage:', err);
  }
}

export function loadLocalShareholders(): BamiShareholder[] {
  try {
    const raw = localStorage.getItem(SHAREHOLDERS_KEY);
    if (!raw) {
      return INITIAL_SHAREHOLDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SHAREHOLDERS;
  } catch {
    return INITIAL_SHAREHOLDERS;
  }
}

export function saveLocalShareholders(shareholders: BamiShareholder[]): void {
  try {
    localStorage.setItem(SHAREHOLDERS_KEY, JSON.stringify(shareholders));
  } catch (err) {
    console.error('Could not save shareholders to localStorage:', err);
  }
}

export function resetAllToDefaults(): {
  settings: BamiSettings;
  phases: BamiPhase[];
  shareholders: BamiShareholder[];
} {
  const creds = getActiveSupabaseCredentials();

  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(PHASES_KEY);
  localStorage.removeItem(SHAREHOLDERS_KEY);

  const resetSettings: BamiSettings = {
    ...INITIAL_SETTINGS,
    supabaseUrl: creds.url,
    supabaseAnonKey: creds.key,
  };

  saveLocalSettings(resetSettings);
  saveLocalPhases(INITIAL_PHASES);
  saveLocalShareholders(INITIAL_SHAREHOLDERS);

  return {
    settings: resetSettings,
    phases: INITIAL_PHASES,
    shareholders: INITIAL_SHAREHOLDERS,
  };
}

/**
 * Asynchronously loads the latest data from Supabase
 */
export async function syncFromSupabase(
  url?: string,
  key?: string
): Promise<{ settings?: BamiSettings; phases?: BamiPhase[]; shareholders?: BamiShareholder[]; error?: string }> {
  const creds = getActiveSupabaseCredentials();
  const finalUrl = (url || creds.url).trim();
  const finalKey = (key || creds.key).trim();

  const client = getSupabaseClient(finalUrl, finalKey);
  if (!client) {
    return { error: 'آدرس و کلید اتصال به سوپابیس یافت نشد. لطفاً در تب سوپابیس پنل یا فایل پیکربندی وارد کنید.' };
  }

  try {
    // 1. Fetch settings from bami_settings
    const { data: settingsData, error: sError } = await client
      .from('bami_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    // 2. Fetch phases from bami_phases
    const { data: phasesData, error: pError } = await client
      .from('bami_phases')
      .select('*')
      .order('id', { ascending: true });

    // 3. Fetch shareholders from bami_shareholders
    let fetchedShareholders: BamiShareholder[] | undefined = undefined;
    try {
      const { data: shData, error: shError } = await client
        .from('bami_shareholders')
        .select('*');

      if (!shError && Array.isArray(shData) && shData.length > 0) {
        fetchedShareholders = shData.map((row: any) => {
          if (row.data && typeof row.data === 'object' && row.data.name) {
            return row.data as BamiShareholder;
          }
          return {
            id: String(row.id),
            name: row.name || row.full_name || '',
            roleOrType: row.role_or_type || row.role || 'سرمایه‌گذار فرشته',
            sharesCount: Number(row.shares_count || row.sharesCount || 0),
            purchaseSharePrice: Number(row.purchase_share_price || row.purchasePrice || 0.010),
            purchaseDate: row.purchase_date || row.purchaseDate || '۱۴۰۴/۰۱',
            entryPhase: row.entry_phase || 'فاز ۱ (پایه)',
            certificateId: row.certificate_id || row.certificateId || '',
            verified: row.verified !== false,
          } as BamiShareholder;
        });
      }
    } catch (shErr) {
      console.warn('Shareholders fetch notice:', shErr);
    }

    if (sError && pError) {
      return { error: `خطا در برقراری ارتباط با سوپابیس: ${sError.message || pError.message}` };
    }

    let parsedSettings: BamiSettings | undefined = undefined;
    if (settingsData) {
      parsedSettings = { ...INITIAL_SETTINGS };

      // Map relational columns if available
      if (settingsData.total_valuation !== undefined) parsedSettings.totalValuation = Number(settingsData.total_valuation);
      if (settingsData.total_shares !== undefined) parsedSettings.totalShares = Number(settingsData.total_shares);
      if (settingsData.sold_shares !== undefined) parsedSettings.soldShares = Number(settingsData.sold_shares);
      if (settingsData.current_share_price !== undefined) parsedSettings.currentSharePrice = Number(settingsData.current_share_price);
      if (settingsData.project_name) parsedSettings.projectName = settingsData.project_name;
      if (settingsData.hero_title) parsedSettings.heroTitle = settingsData.hero_title;
      if (settingsData.hero_subtitle) parsedSettings.heroSubtitle = settingsData.hero_subtitle;
      if (settingsData.hero_badge) parsedSettings.heroBadge = settingsData.hero_badge;
      if (settingsData.currency) parsedSettings.currency = settingsData.currency;
      if (settingsData.min_investment_shares) parsedSettings.minInvestmentShares = Number(settingsData.min_investment_shares);
      if (settingsData.target_domain) parsedSettings.targetDomain = settingsData.target_domain;
      if (settingsData.contact_telegram) parsedSettings.contactTelegram = settingsData.contact_telegram;
      if (settingsData.contact_whatsapp) parsedSettings.contactWhatsapp = settingsData.contact_whatsapp;
      if (settingsData.contact_email) parsedSettings.contactEmail = settingsData.contact_email;
      if (settingsData.contact_phone) parsedSettings.contactPhone = settingsData.contact_phone;
      if (settingsData.footer_text) parsedSettings.footerText = settingsData.footer_text;
      if (settingsData.company_vision) parsedSettings.companyVision = settingsData.company_vision;
      if (settingsData.about_bami_summary) parsedSettings.aboutBamiSummary = settingsData.about_bami_summary;

      // Merge rich JSONB payload (contains 100% of all section texts, FAQs, pillars, etc.)
      if (settingsData.data && typeof settingsData.data === 'object' && Object.keys(settingsData.data).length > 0) {
        parsedSettings = { ...parsedSettings, ...settingsData.data };
      }

      // Always guarantee credentials stay intact
      if (parsedSettings) {
        parsedSettings.supabaseUrl = finalUrl;
        parsedSettings.supabaseAnonKey = finalKey;
      }
    }

    let parsedPhases: BamiPhase[] | undefined = undefined;
    if (Array.isArray(phasesData) && phasesData.length > 0) {
      parsedPhases = phasesData.map((row: any) => {
        const initial = INITIAL_PHASES.find(ip => ip.id === row.id);
        let phaseObj: BamiPhase = {
          id: row.id,
          title: row.title || initial?.title || `فاز ${row.id}`,
          status: row.status || initial?.status || 'pending',
          valuation: Number(row.valuation ?? initial?.valuation ?? 100000),
          sharePrice: Number(row.share_price ?? row.sharePrice ?? initial?.sharePrice ?? 0.010),
          targetDate: row.target_date ?? row.targetDate ?? initial?.targetDate ?? '',
          targetCompletionDate: row.target_completion_date ?? row.targetCompletionDate ?? initial?.targetCompletionDate,
          description: row.description ?? initial?.description ?? '',
          keyMilestones: Array.isArray(row.key_milestones) ? row.key_milestones : (initial?.keyMilestones ?? []),
          sharesOffered: Number(row.shares_offered ?? row.sharesOffered ?? initial?.sharesOffered ?? 1000000),
        };

        if (row.data && typeof row.data === 'object' && row.data.title) {
          phaseObj = { ...phaseObj, ...row.data };
        }

        return phaseObj;
      });
    }

    return {
      settings: parsedSettings,
      phases: parsedPhases,
      shareholders: fetchedShareholders,
    };
  } catch (err: any) {
    return { error: err.message || 'عدم امکان اتصال به سوپابیس' };
  }
}

/**
 * Saves settings, phases, and shareholders directly to Supabase
 */
export async function syncToSupabase(
  settings: BamiSettings,
  phases: BamiPhase[],
  shareholders: BamiShareholder[],
  url?: string,
  key?: string
): Promise<{ success: boolean; error?: string }> {
  const creds = getActiveSupabaseCredentials();
  const finalUrl = (url || creds.url).trim();
  const finalKey = (key || creds.key).trim();

  const client = getSupabaseClient(finalUrl, finalKey);
  if (!client) {
    return { success: false, error: 'آدرس یا کلید اتصال به سوپابیس یافت نشد.' };
  }

  // Remember active credentials
  saveActiveSupabaseCredentials(finalUrl, finalKey);

  try {
    // 1. Upsert settings (with full relational columns AND full data JSONB payload)
    const settingsPayload = {
      id: 1,
      project_name: settings.projectName,
      brand_tagline: settings.brandTagline,
      hero_badge: settings.heroBadge,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      total_valuation: settings.totalValuation,
      total_shares: settings.totalShares,
      sold_shares: settings.soldShares,
      current_share_price: settings.currentSharePrice,
      currency: settings.currency || 'USD',
      min_investment_shares: settings.minInvestmentShares,
      target_domain: settings.targetDomain,
      contact_telegram: settings.contactTelegram,
      contact_whatsapp: settings.contactWhatsapp,
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      footer_text: settings.footerText,
      company_vision: settings.companyVision,
      about_bami_summary: settings.aboutBamiSummary,
      data: settings,
      updated_at: new Date().toISOString(),
    };

    let { error: sError } = await client
      .from('bami_settings')
      .upsert(settingsPayload, { onConflict: 'id' });

    if (sError) {
      console.warn('Initial settings upsert note, retrying with core payload:', sError.message);
      const minimalPayload = {
        id: 1,
        data: settings,
        total_valuation: settings.totalValuation,
        current_share_price: settings.currentSharePrice,
        sold_shares: settings.soldShares,
        currency: 'USD',
        updated_at: new Date().toISOString(),
      };
      const { error: sFallbackError } = await client
        .from('bami_settings')
        .upsert(minimalPayload, { onConflict: 'id' });
      if (sFallbackError) {
        throw new Error(`خطای ذخیره تنظیمات در جدول bami_settings: ${sFallbackError.message}`);
      }
    }

    // 2. Upsert all 10 roadmap phases
    for (const phase of phases) {
      const phasePayload = {
        id: phase.id,
        title: phase.title,
        status: phase.status,
        valuation: phase.valuation,
        share_price: phase.sharePrice,
        target_date: phase.targetDate,
        target_completion_date: phase.targetCompletionDate || null,
        description: phase.description,
        key_milestones: phase.keyMilestones,
        shares_offered: phase.sharesOffered,
        data: phase,
        updated_at: new Date().toISOString(),
      };

      const { error: pError } = await client
        .from('bami_phases')
        .upsert(phasePayload, { onConflict: 'id' });
      
      if (pError) {
        throw new Error(`خطای ذخیره فاز ${phase.id} در جدول bami_phases: ${pError.message}`);
      }
    }

    // 3. Upsert and clean up shareholders
    try {
      const activeIds = shareholders.map(s => s.id);
      if (activeIds.length > 0) {
        // Delete shareholders that were removed from the draft
        const idFilter = `(${activeIds.map(id => `"${id}"`).join(',')})`;
        await client
          .from('bami_shareholders')
          .delete()
          .not('id', 'in', idFilter);
      }

      // Upsert current shareholders
      for (const sh of shareholders) {
        const shPayload = {
          id: sh.id,
          name: sh.name,
          role_or_type: sh.roleOrType,
          shares_count: sh.sharesCount,
          purchase_share_price: sh.purchaseSharePrice,
          purchase_date: sh.purchaseDate,
          entry_phase: sh.entryPhase,
          certificate_id: sh.certificateId,
          verified: sh.verified !== false,
          data: sh,
          updated_at: new Date().toISOString(),
        };

        const { error: shErr } = await client
          .from('bami_shareholders')
          .upsert(shPayload, { onConflict: 'id' });
        
        if (shErr) {
          throw new Error(`خطای ذخیره سهامدار ${sh.name}: ${shErr.message}`);
        }
      }
    } catch (shSyncErr: any) {
      console.warn('Shareholders table sync note:', shSyncErr);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'خطا در همگام‌سازی با سوپابیس' };
  }
}
