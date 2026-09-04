import React, { useState } from 'react';
import {
  Smartphone,
  X,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Coins,
  Lightbulb,
  CheckSquare,
  Home,
  Sparkles,
  Layers,
  Eye,
} from 'lucide-react';
import { ActiveTab, BillInputs, TaxesConfig, Tariff, ComparisonSummary } from '../types';
import { InicioView } from './views/InicioView';
import { ConsumoView } from './views/ConsumoView';
import { ImpuestosView } from './views/ImpuestosView';
import { PrecioEnergiaView } from './views/PrecioEnergiaView';
import { ResultadosView } from './views/ResultadosView';
import { MobileBottomNav } from './Navigation';
import mobileScreenPreviewImg from '../assets/images/mobile_screen_preview_1788523157542.jpg';
import mobileResultsPreviewImg from '../assets/images/mobile_results_preview_1788523173721.jpg';

interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  inputs: BillInputs;
  onChangeInputs: (inputs: BillInputs) => void;
  taxes: TaxesConfig;
  onChangeTaxes: (taxes: TaxesConfig) => void;
  tariffs: Tariff[];
  onChangeTariffs: (tariffs: Tariff[]) => void;
  summary: ComparisonSummary;
  onOpenSaveModal: () => void;
  onOpenHistoryModal: () => void;
}

export const MobilePreviewModal: React.FC<MobilePreviewModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  inputs,
  onChangeInputs,
  taxes,
  onChangeTaxes,
  tariffs,
  onChangeTariffs,
  summary,
  onOpenSaveModal,
  onOpenHistoryModal,
}) => {
  const [modalMode, setModalMode] = useState<'interactive' | 'renders' | 'qrcode'>('interactive');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const SCREENS_INFO = [
    { id: 'inicio' as ActiveTab, label: '1. Inicio', icon: Home, desc: 'Panel resumen con logo ANSAMA y acceso directo a cálculo' },
    { id: 'consumo' as ActiveTab, label: '2. Consumo', icon: TrendingUp, desc: 'Días facturados, selector rápido y potencias P1-P6' },
    { id: 'impuestos' as ActiveTab, label: '3. Impuestos', icon: Coins, desc: 'IEE 5,1127%, Bono Social, Contador e IVA regulados' },
    { id: 'precio-energia' as ActiveTab, label: '4. Precios', icon: Lightbulb, desc: 'Pestañas móviles para cada comercializadora y precios' },
    { id: 'resultados' as ActiveTab, label: '5. Resultados', icon: CheckSquare, desc: 'Tarifa ganadora, desglose de costes y envío a WhatsApp' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-black text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Vista y Simulador de Pantallas Móviles
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                  ANSAMA
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Así se adapta la aplicación a smartphones y tablets en formato vertical
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Selector Bar */}
        <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalMode('interactive')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                modalMode === 'interactive'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Simulador Móvil Interactivo</span>
            </button>

            <button
              type="button"
              onClick={() => setModalMode('renders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                modalMode === 'renders'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Galería de Capturas</span>
            </button>

            <button
              type="button"
              onClick={() => setModalMode('qrcode')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                modalMode === 'qrcode'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Abrir en tu teléfono</span>
            </button>
          </div>

          <div className="text-xs text-zinc-400 font-mono hidden sm:block">
            Resolución: 390 × 760 px (Escala 1:1)
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-950 flex items-center justify-center">
          {modalMode === 'interactive' && (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full">
              {/* Left Selector: Screen Navigator for quick testing */}
              <div className="w-full lg:w-64 space-y-2 shrink-0">
                <div className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2 px-1">
                  Cambiar Pantalla Activa
                </div>
                {SCREENS_INFO.map((scr) => {
                  const Icon = scr.icon;
                  const isCur = activeTab === scr.id;
                  return (
                    <button
                      key={scr.id}
                      type="button"
                      onClick={() => onChangeTab(scr.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isCur
                          ? 'bg-zinc-900 border-red-500 shadow-md ring-1 ring-red-500'
                          : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isCur ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs font-black ${isCur ? 'text-white' : 'text-zinc-300'}`}>
                            {scr.label}
                          </div>
                          <div className="text-[10px] text-zinc-500 leading-tight">
                            {scr.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isCur ? 'text-red-500' : 'text-zinc-600'}`} />
                    </button>
                  );
                })}

                <div className="mt-4 p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-[11px] text-zinc-400">
                  💡 <strong className="text-white">Totalmente funcional:</strong> Puedes escribir números, cambiar días o comercializadoras dentro de la pantalla móvil y ver cómo se recalculan al instante.
                </div>
              </div>

              {/* Center: Smartphone Frame Device */}
              <div className="relative mx-auto w-[360px] sm:w-[390px] h-[720px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-zinc-800 ring-1 ring-zinc-700 flex flex-col shrink-0">
                {/* Smartphone Dynamic Island / Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
                </div>

                {/* Smartphone Status Bar */}
                <div className="h-6 w-full pt-1 px-6 flex items-center justify-between text-[11px] font-bold text-white z-20 shrink-0 select-none">
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span>5G</span>
                    <span className="w-5 h-2.5 rounded-sm border border-zinc-400 relative inline-block p-0.5">
                      <span className="block h-full bg-white rounded-2xs w-3/4" />
                    </span>
                  </div>
                </div>

                {/* Inner Screen Area */}
                <div className="flex-1 bg-zinc-100 rounded-[38px] overflow-hidden flex flex-col relative">
                  {/* Top Mobile Bar */}
                  <div className="bg-zinc-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-zinc-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-red-500 uppercase tracking-wider">
                        ANSAMA
                      </span>
                      <span className="text-[10px] text-zinc-400 border-l border-zinc-800 pl-2">
                        Comparador
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 capitalize">
                      {activeTab}
                    </span>
                  </div>

                  {/* Scrollable View Content */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20">
                    {activeTab === 'inicio' && (
                      <InicioView inputs={inputs} summary={summary} onChangeTab={onChangeTab} />
                    )}
                    {activeTab === 'consumo' && (
                      <ConsumoView
                        inputs={inputs}
                        onChangeInputs={onChangeInputs}
                        tariffsCount={tariffs.length}
                      />
                    )}
                    {activeTab === 'impuestos' && (
                      <ImpuestosView
                        taxes={taxes}
                        onChangeTaxes={onChangeTaxes}
                        days={inputs.days}
                        tariffsCount={tariffs.length}
                      />
                    )}
                    {activeTab === 'precio-energia' && (
                      <PrecioEnergiaView
                        tariffs={tariffs}
                        onChangeTariffs={onChangeTariffs}
                        inputs={inputs}
                      />
                    )}
                    {activeTab === 'resultados' && (
                      <ResultadosView
                        summary={summary}
                        tariffs={tariffs}
                        inputs={inputs}
                        taxes={taxes}
                        savedCount={0}
                        onOpenSaveModal={onOpenSaveModal}
                        onOpenHistoryModal={onOpenHistoryModal}
                      />
                    )}
                  </div>

                  {/* Smartphone Bottom Bar Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <MobileBottomNav
                      activeTab={activeTab}
                      onChangeTab={onChangeTab}
                      bestTariffSavings={summary.maxSavingsVsWorst}
                    />
                  </div>
                </div>

                {/* Smartphone Home Indicator Bar */}
                <div className="h-4 w-full flex items-center justify-center pt-1 shrink-0">
                  <div className="w-28 h-1 bg-zinc-700 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {modalMode === 'renders' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-black text-white">
                  Diseño Visual de las Pantallas en Smartphone
                </h4>
                <p className="text-xs text-zinc-400">
                  Capturas de alta fidelidad con la identidad corporativa de ANSAMA (Rojo, Blanco y Negro).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Render 1: Main Dashboard Screen */}
                <div className="bg-zinc-900 rounded-3xl p-4 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-red-500" />
                      <span>Pantalla 1: Inicio y Panel Principal</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">390×844</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-zinc-700/60 shadow-lg bg-black flex justify-center">
                    <img
                      src={mobileScreenPreviewImg}
                      alt="Pantalla de Inicio ANSAMA en Móvil"
                      className="w-full max-h-[500px] object-contain rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Encabezado con logotipo de ANSAMA, métricas de consumo rápido, tarjeta ganadora en relieve y barra de navegación táctil inferior con 5 iconos.
                  </p>
                </div>

                {/* Render 2: Results & Comparison Table Screen */}
                <div className="bg-zinc-900 rounded-3xl p-4 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-red-500" />
                      <span>Pantalla 2: Desglose y Comparativa</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">390×844</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-zinc-700/60 shadow-lg bg-black flex justify-center">
                    <img
                      src={mobileResultsPreviewImg}
                      alt="Pantalla de Resultados ANSAMA en Móvil"
                      className="w-full max-h-[500px] object-contain rounded-2xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Resumen del ahorro conseguido, desglose con scroll horizontal táctil para comparar hasta 10 comercializadoras y botones de acción para WhatsApp y PDF.
                  </p>
                </div>
              </div>
            </div>
          )}

          {modalMode === 'qrcode' && (
            <div className="max-w-md mx-auto bg-zinc-900 rounded-3xl p-6 border border-zinc-800 text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  Prueba la app en tu propio teléfono
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  La aplicación es una PWA (Progressive Web App). Puedes abrirla directamente en Safari o Chrome en tu móvil e instalarla como icono en la pantalla de inicio.
                </p>
              </div>

              {/* URL Box with Copy */}
              <div className="bg-black p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-300 font-mono truncate text-left select-all">
                  {currentUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-left bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2 text-xs text-zinc-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <span>Pasos para tenerla en tu móvil:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px]">
                  <li>Copia el enlace de arriba o compártetelo a tu WhatsApp.</li>
                  <li>Ábrelo en el navegador de tu móvil.</li>
                  <li>Pulsa en <strong>&quot;Compartir / Añadir a pantalla de inicio&quot;</strong>.</li>
                  <li>¡Listo! Funcionará como una aplicación nativa, incluso sin conexión.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-black border-t border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Optimizada para pantalla táctil y visitas de clientes</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar Vista Móvil
          </button>
        </div>
      </div>
    </div>
  );
};
