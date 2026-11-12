/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroEquity } from './components/HeroEquity';
import { StockCalculator } from './components/StockCalculator';
import { RoadmapPhases } from './components/RoadmapPhases';
import { ShareholdersSection } from './components/ShareholdersSection';
import { BamiProductIntro } from './components/BamiProductIntro';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { BamiSettings, BamiPhase, BamiShareholder } from './types';
import {
  loadLocalSettings,
  saveLocalSettings,
  loadLocalPhases,
  saveLocalPhases,
  loadLocalShareholders,
  saveLocalShareholders,
  resetAllToDefaults,
  syncValuationWithCompletedPhases,
  syncFromSupabase,
  syncToSupabase,
  getActiveSupabaseCredentials,
} from './lib/storage';

export default function App() {
  const [settings, setSettings] = useState<BamiSettings>(() => loadLocalSettings());
  const [phases, setPhases] = useState<BamiPhase[]>(() => loadLocalPhases());
  const [shareholders, setShareholders] = useState<BamiShareholder[]>(() => loadLocalShareholders());

  // Modals & Navigation state
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bami_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Always fetch latest authoritative data from Supabase on startup
  useEffect(() => {
    const creds = getActiveSupabaseCredentials();

    if (creds.url && creds.key) {
      syncFromSupabase(creds.url, creds.key).then((res) => {
        if (res.error) {
          console.warn('Startup Supabase fetch notice:', res.error);
          return;
        }
        if (res.settings) {
          setSettings(res.settings);
          saveLocalSettings(res.settings);
        }
        if (res.phases && res.phases.length > 0) {
          setPhases(res.phases);
          saveLocalPhases(res.phases);
        }
        if (res.shareholders && res.shareholders.length > 0) {
          setShareholders(res.shareholders);
          saveLocalShareholders(res.shareholders);
        }
      });
    }
  }, []);

  // Handle successful login with bamianai777 & Bai$$$nx
  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    try {
      sessionStorage.setItem('bami_admin_auth', 'true');
    } catch {}
    setShowLoginModal(false);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('bami_admin_auth');
    } catch {}
    setShowAdminPanel(false);
  };

  const handleSaveSettingsPhasesShareholders = (
    newSettings: BamiSettings,
    newPhases: BamiPhase[],
    newShareholders: BamiShareholder[]
  ) => {
    // Sync valuation rule: "و هر فاز که تکمیل شده ارزش برنامه و قیمت هر سهم برنامه باید طبق قیمت تعیین شده در اون فاز تغییر کنه"
    const syncedSettings = syncValuationWithCompletedPhases(newPhases, newSettings);

    setSettings(syncedSettings);
    setPhases(newPhases);
    setShareholders(newShareholders);

    saveLocalSettings(syncedSettings);
    saveLocalPhases(newPhases);
    saveLocalShareholders(newShareholders);

    // Save to Supabase as well
    const targetUrl = syncedSettings.supabaseUrl || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL : '');
    const targetKey = syncedSettings.supabaseAnonKey || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_ANON_KEY : '');
    if (targetUrl && targetKey) {
      syncToSupabase(syncedSettings, newPhases, newShareholders, targetUrl, targetKey).catch((err: any) => {
        console.error('App save syncToSupabase error:', err);
      });
    }
  };

  const handleReset = () => {
    const defaults = resetAllToDefaults();
    setSettings(defaults.settings);
    setPhases(defaults.phases);
    setShareholders(defaults.shareholders);
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 w-full max-w-full overflow-x-hidden">
      
      {/* Top Header */}
      <Header
        settings={settings}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => setShowAdminPanel(true)}
      />

      <main className="flex-1">
        {/* Section 1: Hero & Real-time Stock Metrics (Purely USD) */}
        <HeroEquity
          settings={settings}
          phases={phases}
          onScrollToCalculator={scrollToCalculator}
        />

        {/* Section 2: Interactive Stock & Price Calculator (Purely USD) */}
        <StockCalculator
          settings={settings}
          phases={phases}
        />

        {/* Section 3: Roadmap 10 Phases with Dynamic Completion Countdown */}
        <RoadmapPhases
          phases={phases}
          settings={settings}
        />

        {/* Section 4: Public Transparency Shareholders Registry */}
        <ShareholdersSection
          shareholders={shareholders}
          settings={settings}
        />

        {/* Section 5: Comprehensive Bami AI Introduction & Product Pitch */}
        <BamiProductIntro
          settings={settings}
        />
      </main>

      {/* Footer with required secret 4-clicks trigger on the word "Bami" */}
      <Footer
        settings={settings}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenAdmin={() => setShowAdminPanel(true)}
      />

      {/* Admin Login Modal (Triggered by 4 consecutive clicks on "Bami" in footer) */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Full Admin Control Panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        settings={settings}
        phases={phases}
        shareholders={shareholders}
        onSave={handleSaveSettingsPhasesShareholders}
        onReset={handleReset}
        onLogout={handleLogout}
      />

    </div>
  );
}
