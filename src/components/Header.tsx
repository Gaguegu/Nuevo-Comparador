import React from 'react';
import { RotateCcw, Zap, History, FilePlus, Sparkles, Smartphone, FileText, RefreshCw } from 'lucide-react';
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
  onOpenManual?: () => void;
  hasUpdate?: boolean;
  isCheckingUpdate?: boolean;
  onCheckOrApplyUpdate?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  savedCount,
  onOpenHistory,
  onOpenResetModal,
  onOpenMobilePreview,
  onOpenManual,
  hasUpdate = false,
  isCheckingUpdate = false,
  onCheckOrApplyUpdate,
}) => {
  const cheapestResult = summary.results.find((r) => r.tariffId === summary.cheapestTariffId);

  return (
    <header className="w-full bg-[#0a0a0c] text-white shadow-xl border-b-2 border-red-600 sticky top-0 z-30">
      {/* Top Banner with ANSAMA Logo and Identity */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Logo and App Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-white rounded-xl shadow-md border border-red-500/30 flex items-center justify-center shrink-0">
              <Logo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs tracking-widest font-black uppercase text-red-500">ANSAMA</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-emerald-400 font-bold border border-emerald-500/40">
                  v2.2 PWA
                </span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white leading-tight">
                Comparador Eléctrico
              </h1>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-1 shrink-0">
            <PWAInstallButton />
          </div>
        </div>

        {/* Mobile Action Buttons Bar (2 Líneas ordenadas adaptadas 100% al ancho del móvil) */}
        <div className="w-full md:hidden pt-1.5 border-t border-zinc-800/80 space-y-1.5">
          {/* Línea 1 de botones móviles: Ver Móvil, Actualizar, Manual PDF */}
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {onOpenMobilePreview && (
              <button
                type="button"
                onClick={onOpenMobilePreview}
                className="flex items-center justify-center gap-1 text-[11px] text-zinc-200 bg-zinc-900 hover:bg-zinc-800 py-2 px-1 rounded-xl border border-zinc-700 font-bold active:scale-95 shadow-sm cursor-pointer"
                title="Simulador de móvil y código QR"
              >
                <Smartphone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">Ver Móvil</span>
              </button>
            )}

            <button
              type="button"
              onClick={onCheckOrApplyUpdate || (() => window.location.reload())}
              disabled={isCheckingUpdate}
              className={`relative flex items-center justify-center gap-1 text-[11px] py-2 px-1 rounded-xl border font-bold active:scale-95 cursor-pointer transition shadow-sm ${
                hasUpdate
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/50 animate-pulse'
                  : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border-emerald-500/60'
              }`}
              title="Buscar actualizaciones o recargar versión"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 shrink-0 ${hasUpdate ? 'text-white' : 'text-emerald-400'} ${
                  isCheckingUpdate ? 'animate-spin' : ''
                }`}
              />
              <span className="truncate">{hasUpdate ? '¡Actualizar!' : 'Actualizar'}</span>
              {hasUpdate && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
              )}
            </button>

            {onOpenManual && (
              <button
                type="button"
                onClick={onOpenManual}
                className="flex items-center justify-center gap-1 text-[11px] text-zinc-200 bg-zinc-900 hover:bg-zinc-800 py-2 px-1 rounded-xl border border-zinc-700 font-bold active:scale-95 shadow-sm cursor-pointer"
                title="Consultar Manual de Usuario"
              >
                <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">Manual</span>
              </button>
            )}
          </div>

          {/* Línea 2 de botones móviles: Historial y Nueva / Poner a cero */}
          <div className="grid grid-cols-2 gap-1.5 w-full">
            <button
              type="button"
              onClick={onOpenHistory}
              className="flex items-center justify-center gap-1.5 text-xs text-zinc-200 bg-zinc-900 hover:bg-zinc-800 py-2 px-2 rounded-xl border border-zinc-700 font-bold active:scale-95 shadow-sm cursor-pointer"
              title="Ver Historial de comparativas guardadas"
            >
              <History className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="truncate">Historial</span>
              {savedCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenResetModal}
              className="flex items-center justify-center gap-1.5 text-xs text-white bg-red-600 hover:bg-red-700 py-2 px-2 rounded-xl font-black active:scale-95 shadow-sm shadow-red-600/30 cursor-pointer"
              title="Nueva comparativa o poner a cero"
            >
              <FilePlus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Nueva / Poner a cero</span>
            </button>
          </div>
        </div>

        {/* Central Banner matching ANSAMA Red, Black and White (Visible en tablet y desktop) */}
        <div className="hidden sm:block w-full md:flex-1 md:max-w-xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 rounded-xl px-4 py-2 text-center shadow-lg border border-red-600/50">
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

          {/* Botón de Actualizar / Comprobar Actualizaciones */}
          <button
            type="button"
            onClick={onCheckOrApplyUpdate || (() => window.location.reload())}
            disabled={isCheckingUpdate}
            className={`relative flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition border cursor-pointer font-bold active:scale-95 ${
              hasUpdate
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-500 shadow-lg shadow-red-600/50 animate-pulse'
                : 'bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 hover:text-white border-emerald-500/60 shadow-sm'
            }`}
            title={
              hasUpdate
                ? '¡Hay una nueva versión disponible! Haz clic para actualizar ahora'
                : 'Comprobar actualizaciones o recargar versión'
            }
          >
            <RefreshCw
              className={`w-4 h-4 ${hasUpdate ? 'text-white' : 'text-emerald-400'} ${
                isCheckingUpdate ? 'animate-spin' : ''
              }`}
            />
            <span>{hasUpdate ? '¡Actualizar app!' : 'Actualizar'}</span>
            {hasUpdate && (
              <>
                <span className="bg-yellow-400 text-black text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5">
                  Nuevo
                </span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              </>
            )}
          </button>

          {/* Manual de Usuario PDF */}
          {onOpenManual && (
            <button
              type="button"
              onClick={onOpenManual}
              className="flex items-center gap-1.5 text-xs text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-2 rounded-xl transition border border-zinc-700 cursor-pointer font-bold active:scale-95"
              title="Consultar el Manual de Usuario en pantalla"
            >
              <FileText className="w-4 h-4 text-red-500" />
              <span>Manual PDF</span>
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
