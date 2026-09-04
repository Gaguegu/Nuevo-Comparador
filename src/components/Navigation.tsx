import React from 'react';
import { Home, TrendingUp, Coins, Lightbulb, CheckSquare, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';
import { Logo } from './Logo';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  bestTariffSavings?: number;
}

const NAV_ITEMS: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'consumo', label: 'Consumo', icon: TrendingUp },
  { id: 'impuestos', label: 'Impuestos', icon: Coins },
  { id: 'precio-energia', label: 'Precio Energía', icon: Lightbulb },
  { id: 'resultados', label: 'Resultados', icon: CheckSquare },
];

export const DesktopSidebar: React.FC<NavigationProps> = ({ activeTab, onChangeTab, bestTariffSavings }) => {
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
                {item.id === 'resultados' && bestTariffSavings && bestTariffSavings > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                ) : null}
              </button>
            );
          })}
        </div>
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
    </aside>
  );
};

export const MobileBottomNav: React.FC<NavigationProps> = ({ activeTab, onChangeTab, bestTariffSavings }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0c] text-white border-t border-zinc-800 shadow-2xl backdrop-blur-lg pb-safe">
      <div className="grid grid-cols-5 h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-0.5 transition cursor-pointer ${
                isActive ? 'text-white font-black' : 'text-zinc-400 hover:text-zinc-200 font-medium'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 inset-x-3 h-1 bg-red-600 rounded-b-full shadow-sm shadow-red-500/50" />
              )}
              <Icon
                className={`w-5 h-5 mb-0.5 ${isActive ? 'text-red-500 scale-110' : 'text-zinc-400'} transition-transform`}
              />
              <span className={`text-[10px] truncate max-w-[62px] leading-tight ${isActive ? 'text-white font-bold' : 'text-zinc-400'}`}>
                {item.label}
              </span>
              {item.id === 'resultados' && bestTariffSavings && bestTariffSavings > 0 ? (
                <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-red-500" />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
