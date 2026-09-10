import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ActiveTab, BillInputs, TaxesConfig, Tariff, SavedComparison } from './types';
import { DEFAULT_BILL_INPUTS, DEFAULT_TAXES, DEFAULT_TARIFFS } from './data/defaultData';
import { compareTariffs } from './utils/calculator';
import { Header } from './components/Header';
import { DesktopSidebar, MobileBottomNav } from './components/Navigation';
import { InicioView } from './components/views/InicioView';
import { ConsumoView } from './components/views/ConsumoView';
import { ImpuestosView } from './components/views/ImpuestosView';
import { PrecioEnergiaView } from './components/views/PrecioEnergiaView';
import { ResultadosView } from './components/views/ResultadosView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HistoryModal } from './components/HistoryModal';
import { SaveComparisonModal } from './components/SaveComparisonModal';
import { ResetOptionsModal } from './components/ResetOptionsModal';
import { MobilePreviewModal } from './components/MobilePreviewModal';
import { ManualModal } from './components/ManualModal';
import { UpdateNotification } from './components/UpdateNotification';
import { useAppUpdate } from './hooks/useAppUpdate';
import { setupEnterKeyNavigation } from './utils/keyboardNavigation';

const STORAGE_KEYS = {
  INPUTS: 'ansama_bill_inputs_v3',
  TAXES: 'ansama_taxes_v3',
  TARIFFS: 'ansama_tariffs_v3',
  ACTIVE_TAB: 'ansama_active_tab_v3',
  SAVED_COMPARISONS: 'ansama_saved_comparisons_v1',
};

const CLEAN_ZERO_TARIFFS: Tariff[] = [
  {
    id: 't-1',
    name: 'Comercializadora 1',
    badgeColor: '#1d4ed8',
    potenciaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
    energiaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
  },
  {
    id: 't-2',
    name: 'Comercializadora 2',
    badgeColor: '#eab308',
    potenciaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
    energiaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
  },
  {
    id: 't-3',
    name: 'Comercializadora 3',
    badgeColor: '#b91c1c',
    potenciaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
    energiaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
  },
];

export default function App() {
  // Inputs state
  const [inputs, setInputs] = useState<BillInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INPUTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BILL_INPUTS;
  });

  // Taxes state
  const [taxes, setTaxes] = useState<TaxesConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TAXES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_TAXES;
  });

  // Tariffs state
  const [tariffs, setTariffs] = useState<Tariff[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TARIFFS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_TARIFFS;
  });

  // Active Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as ActiveTab;
      if (['inicio', 'consumo', 'impuestos', 'precio-energia', 'resultados'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'inicio';
  });

  // Saved Comparisons History state
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_COMPARISONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  // App Update Hook
  const {
    hasUpdate,
    isChecking: isCheckingUpdate,
    statusMessage: updateStatusMessage,
    isDismissed: isUpdateDismissed,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
  } = useAppUpdate();

  const rawBase = import.meta.env.BASE_URL || './';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const pdfUrl = `${base}manual-usuario-ansama.pdf`;

  // Scroll to top of the screen whenever switching views/tabs
  const mainContentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const scrollToTop = () => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        mainContentRef.current.scrollTop = 0;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    // Ensure that if content changes size during render, it resets to the top
    const frameId = requestAnimationFrame(scrollToTop);
    return () => cancelAnimationFrame(frameId);
  }, [activeTab]);

  // Global Excel-style Enter key navigation between input fields
  useEffect(() => {
    return setupEnterKeyNavigation();
  }, []);

  // Persist state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INPUTS, JSON.stringify(inputs));
    } catch {}
  }, [inputs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TAXES, JSON.stringify(taxes));
    } catch {}
  }, [taxes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TARIFFS, JSON.stringify(tariffs));
    } catch {}
  }, [tariffs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_COMPARISONS, JSON.stringify(savedComparisons));
    } catch {}
  }, [savedComparisons]);

  // Reset Handlers
  const handleResetAllZero = () => {
    setInputs({
      days: 30,
      consumo: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
      potencia: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
    });
    setTariffs(CLEAN_ZERO_TARIFFS);
    setActiveTab('consumo');
  };

  const handleResetConsumoOnly = () => {
    setInputs({
      days: 30,
      consumo: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
      potencia: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
    });
    setActiveTab('consumo');
  };

  const handleResetPricesOnly = () => {
    const zeroTariffs = tariffs.map((t) => ({
      ...t,
      potenciaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
      energiaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
    }));
    setTariffs(zeroTariffs);
    setActiveTab('precio-energia');
  };

  const handleResetDefaults = () => {
    setInputs(DEFAULT_BILL_INPUTS);
    setTaxes(DEFAULT_TAXES);
    setTariffs(DEFAULT_TARIFFS);
    setActiveTab('resultados');
  };

  // History Handlers
  const handleSaveComparison = (newComparison: SavedComparison) => {
    setSavedComparisons((prev) => [newComparison, ...prev]);
  };

  const handleLoadComparison = (comparison: SavedComparison) => {
    setInputs(comparison.inputs);
    setTaxes(comparison.taxes);
    setTariffs(comparison.tariffs);
    setActiveTab('resultados');
  };

  const handleDeleteComparison = (id: string) => {
    setSavedComparisons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllHistory = () => {
    setSavedComparisons([]);
  };

  // Real-time calculations
  const summary = useMemo(() => {
    return compareTariffs(tariffs, inputs, taxes);
  }, [tariffs, inputs, taxes]);

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-[#f4f4f7] text-zinc-900 flex flex-col font-sans selection:bg-red-200 selection:text-red-950">
      {/* Top Header */}
      <Header
        summary={summary}
        savedCount={savedComparisons.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
        onOpenManual={() => setIsManualOpen(true)}
        hasUpdate={hasUpdate}
        isCheckingUpdate={isCheckingUpdate}
        onCheckOrApplyUpdate={() => {
          if (hasUpdate) {
            applyUpdate();
          } else {
            checkForUpdates(true);
          }
        }}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden w-full max-w-full">
        {/* Desktop Sidebar (Left) */}
        <div className="hidden md:flex">
          <DesktopSidebar
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            bestTariffSavings={summary.maxSavingsVsWorst}
            hasUpdate={hasUpdate}
            isCheckingUpdate={isCheckingUpdate}
            onCheckOrApplyUpdate={() => {
              if (hasUpdate) {
                applyUpdate();
              } else {
                checkForUpdates(true);
              }
            }}
          />
        </div>

        {/* View Content Area */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto p-2.5 sm:p-6 pb-28 md:pb-8 w-full max-w-full">
          {activeTab === 'inicio' && (
            <InicioView
              inputs={inputs}
              summary={summary}
              onChangeTab={setActiveTab}
            />
          )}

          {activeTab === 'consumo' && (
            <ConsumoView
              inputs={inputs}
              onChangeInputs={setInputs}
            />
          )}

          {activeTab === 'impuestos' && (
            <ImpuestosView
              taxes={taxes}
              onChangeTaxes={setTaxes}
              days={inputs.days}
              tariffsCount={tariffs.length}
            />
          )}

          {activeTab === 'precio-energia' && (
            <PrecioEnergiaView
              tariffs={tariffs}
              onChangeTariffs={setTariffs}
              inputs={inputs}
            />
          )}

          {activeTab === 'resultados' && (
            <ResultadosView
              summary={summary}
              tariffs={tariffs}
              inputs={inputs}
              taxes={taxes}
              savedCount={savedComparisons.length}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
              onOpenHistoryModal={() => setIsHistoryOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        bestTariffSavings={summary.maxSavingsVsWorst}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedComparisons={savedComparisons}
        onLoadComparison={handleLoadComparison}
        onDeleteComparison={handleDeleteComparison}
        onClearAllHistory={handleClearAllHistory}
      />

      {/* Save Comparison Modal */}
      <SaveComparisonModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        inputs={inputs}
        tariffs={tariffs}
        taxes={taxes}
        summary={summary}
        onSave={handleSaveComparison}
      />

      {/* Reset Options Modal */}
      <ResetOptionsModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onResetAllZero={handleResetAllZero}
        onResetConsumoOnly={handleResetConsumoOnly}
        onResetPricesOnly={handleResetPricesOnly}
        onResetOriginalExcel={handleResetDefaults}
      />

      {/* Mobile Screens Simulator & Gallery Modal */}
      <MobilePreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        inputs={inputs}
        onChangeInputs={setInputs}
        taxes={taxes}
        onChangeTaxes={setTaxes}
        tariffs={tariffs}
        onChangeTariffs={setTariffs}
        summary={summary}
        onOpenSaveModal={() => {
          setIsMobilePreviewOpen(false);
          setIsSaveModalOpen(true);
        }}
        onOpenHistoryModal={() => {
          setIsMobilePreviewOpen(false);
          setIsHistoryOpen(true);
        }}
      />

      {/* Manual de Usuario Modal */}
      <ManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        pdfUrl={pdfUrl}
      />

      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Floating Update Notification Toast/Banner */}
      <UpdateNotification
        hasUpdate={hasUpdate}
        isDismissed={isUpdateDismissed}
        statusMessage={updateStatusMessage}
        isChecking={isCheckingUpdate}
        onApplyUpdate={applyUpdate}
        onDismiss={dismissUpdate}
      />
    </div>
  );
}

