import React from 'react';
import { RotateCcw, Zap, History, FilePlus, Sparkles, Smartphone } from 'lucide-react';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { ComparisonSummary } from '../types';
import { formatCurrency } from '../utils/calculator';

interface HeaderProps {
  summary: ComparisonSummary;
  savedCount: number;
  onOpenHistory: () => void;
  onOpenResetModal: () => void;
  onOpenMobilePreview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  savedCount,
  onOpenHistory,
  onOpenResetModal,
  onOpenMobilePreview,
}) => {
  const cheapestResult = summary.results.find((r) => r.tariffId === summary.cheapestTariffId);

  return (
    <header className="w-full bg-[#0a0a0c] text-white shadow-xl border-b-2 border-red-600 sticky top-0 z-30">
      {/* Top Banner with ANSAMA Logo and Identity */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-xl shadow-md border border-red-500/30 flex items-center justify-center">
              <Logo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs tracking-widest font-black uppercase text-red-500">ANSAMA</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-semibold border border-zinc-700">
                  v2.0 PWA
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Comparador Eléctrico
              </h1>
            </div>
          </div>

          {/* Mobile Install button & Quick actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            {onOpenMobilePreview && (
              <button
                type="button"
                onClick={onOpenMobilePreview}
                className="flex items-center gap-1 text-xs text-zinc-200 bg-zinc-900 hover:bg-zinc-800 px-2 py-1.5 rounded-lg border border-zinc-700 font-bold active:scale-95"
                title="Ver pantallas y simulador móvil"
              >
                <Smartphone className="w-3.5 h-3.5 text-red-500" />
                <span>Móvil</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1 text-xs text-zinc-200 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-700 font-bold active:scale-95"
              title="Ver Historial de comparativas"
            >
              <History className="w-3.5 h-3.5 text-red-400" />
              <span>Historial</span>
              {savedCount > 0 && (
                <span className="ml-0.5 bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenResetModal}
              className="flex items-center gap-1 text-xs text-white bg-red-600 hover:bg-red-700 px-2.5 py-1.5 rounded-lg font-black active:scale-95 shadow-sm"
              title="Nueva comparativa o poner a cero"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>

        {/* Central Banner matching ANSAMA Red, Black and White */}
        <div className="w-full md:flex-1 md:max-w-xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 rounded-xl px-4 py-2 text-center shadow-lg border border-red-600/50">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white drop-shadow font-serif flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Calculadora Comparativa de Tarifas Eléctricas</span>
          </h2>
          <p className="text-[11px] font-bold uppercase text-red-400 tracking-widest mt-0.5">
            ANSAMA
          </p>
        </div>

        {/* Right side: Best tariff indicator & Reset buttons */}
        <div className="hidden md:flex items-center gap-2 w-full md:w-auto justify-end">
          {cheapestResult && cheapestResult.totalFactura > 0 && (
            <div className="hidden xl:flex items-center gap-2 bg-zinc-900 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs">
              <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <div>
                <span className="text-zinc-400 font-medium">Mejor opción: </span>
                <span className="font-bold text-white">{cheapestResult.tariffName}</span>
                <span className="ml-1.5 text-red-400 font-black">({formatCurrency(cheapestResult.totalFactura)})</span>
              </div>
            </div>
          )}

          {/* Mobile Screen Simulator / Preview Button */}
          {onOpenMobilePreview && (
            <button
              type="button"
              onClick={onOpenMobilePreview}
              className="flex items-center gap-1.5 text-xs text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-2 rounded-xl transition border border-zinc-700 cursor-pointer font-bold"
              title="Ver cómo queda la app en pantalla móvil"
            >
              <Smartphone className="w-4 h-4 text-red-500" />
              <span>Ver Móvil</span>
            </button>
          )}

          {/* Historial Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 text-xs text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-2 rounded-xl transition border border-zinc-700 cursor-pointer font-bold"
            title="Ver comparativas guardadas"
          >
            <History className="w-4 h-4 text-red-400" />
            <span>Historial</span>
            {savedCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {savedCount}
              </span>
            )}
          </button>

          {/* Nueva Comparativa / Poner a Cero Button */}
          <button
            type="button"
            onClick={onOpenResetModal}
            className="flex items-center gap-1.5 text-xs text-white bg-red-600 hover:bg-red-700 px-3.5 py-2 rounded-xl transition font-black cursor-pointer shadow-md active:scale-95"
            title="Nueva comparativa o poner a cero"
          >
            <FilePlus className="w-4 h-4" />
            <span>Nueva / Poner a cero</span>
          </button>

          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
