import React from 'react';
import { Home, TrendingUp, Coins, Lightbulb, CheckSquare, Sparkles, RefreshCw } from 'lucide-react';
import { ActiveTab } from '../types';
import { Logo } from './Logo';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  bestTariffSavings?: number;
  hasUpdate?: boolean;
  isCheckingUpdate?: boolean;
  onCheckOrApplyUpdate?: () => void;
}

interface NavItemDef {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'inicio', label: 'Inicio', shortLabel: 'Inicio', icon: Home },
  { id: 'consumo', label: 'Consumo', shortLabel: 'Consumo', icon: TrendingUp },
  { id: 'impuestos', label: 'Impuestos', shortLabel: 'Impuestos', icon: Coins },
  { id: 'precio-energia', label: 'Precio Energía', shortLabel: 'P. Energía', icon: Lightbulb },
  { id: 'resultados', label: 'Resultados', shortLabel: 'Resultados', icon: CheckSquare },
];

export const DesktopSidebar: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  bestTariffSavings,
  hasUpdate = false,
  isCheckingUpdate = false,
  onCheckOrApplyUpdate,
}) => {
  return (
    <aside className="w-60 shrink-0 bg-[#0c0c0e] text-white flex flex-col justify-between p-4 shadow-2xl border-r border-zinc-800">
      <div className="space-y-3">
        {/* Brand card in sidebar */}
        <div className="p-3 bg-zinc-900/80 rounded-2xl border border-red-600/30 flex items-center gap-3 shadow-inner">
          <div className="p-1 bg-white rounded-xl shadow-xs">
            <Logo size="xs" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-red-500 tracking-wider block">
              ANSAMA
            </span>
            <span className="text-xs font-bold text-white block leading-tight">
              Comparador Tarifas
            </span>
          </div>
        </div>

        <div className="px-2 pt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-2">
          Secciones
        </div>

        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-xs transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-lg ring-2 ring-red-600'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-zinc-400'}`} />
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {/* App Version & Update Status */}
        <div className="bg-zinc-900/90 rounded-2xl p-3 border border-zinc-800 text-xs text-zinc-300 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400">Versión App</span>
            <span className="text-[10px] font-mono bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              v2.2 PWA
            </span>
          </div>
          <button
            type="button"
            onClick={onCheckOrApplyUpdate || (() => window.location.reload())}
            disabled={isCheckingUpdate}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
              hasUpdate
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/40 animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
            title="Buscar actualizaciones de la app o recargar"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${hasUpdate ? 'text-white' : 'text-emerald-400'} ${
                isCheckingUpdate ? 'animate-spin' : ''
              }`}
            />
            <span>{hasUpdate ? 'Actualizar ahora' : 'Buscar actualizaciones'}</span>
          </button>
        </div>

        {/* Helpful shortcut / tip card in sidebar */}
        <div className="bg-zinc-900/90 rounded-2xl p-3 border border-red-600/20 text-xs text-zinc-300 shadow-md">
          <div className="flex items-center gap-2 font-bold text-white mb-1">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Diseño ANSAMA</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Colores corporativos en Rojo, Blanco y Negro. Optimizado para móvil y visitas a clientes.
          </p>
        </div>
      </div>
    </aside>
  );
};

export const MobileBottomNav: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 w-full z-50 bg-[#09090b]/98 backdrop-blur-xl border-t-2 border-red-600/70 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] select-none"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)' }}
    >
      <div className="grid grid-cols-5 h-14 w-full max-w-full">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-0.5 transition cursor-pointer active:scale-95 ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 inset-x-2 h-1 bg-red-600 rounded-b-full shadow-sm shadow-red-500/80" />
              )}
              <Icon
                className={`w-5 h-5 mb-0.5 ${isActive ? 'text-red-500 scale-105' : 'text-zinc-400'} transition-transform`}
              />
              <span
                className={`text-[9.5px] sm:text-[10px] truncate max-w-full leading-tight text-center px-0.5 ${
                  isActive ? 'text-white font-black' : 'text-zinc-400 font-medium'
                }`}
              >
                {item.shortLabel || item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
