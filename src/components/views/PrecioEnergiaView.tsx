import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Zap,
  Lightbulb,
  Edit3,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Layers,
  Eraser,
} from 'lucide-react';
import { Tariff, BillInputs, PeriodValues } from '../../types';
import { PRESET_MARKET_TARIFFS, MAX_TARIFFS } from '../../data/defaultData';
import { round2, formatCurrency } from '../../utils/calculator';
import { DecimalPriceInput } from '../DecimalPriceInput';
import { Logo } from '../Logo';

interface PrecioEnergiaViewProps {
  tariffs: Tariff[];
  onChangeTariffs: (newTariffs: Tariff[]) => void;
  inputs: BillInputs;
}

const BADGE_COLORS = [
  '#1d4ed8', // blue
  '#eab308', // gold/yellow
  '#b91c1c', // red
  '#059669', // emerald
  '#7c3aed', // purple
  '#ea580c', // orange
  '#0284c7', // sky
  '#db2777', // pink
  '#475569', // slate
  '#14b8a6', // teal
];

export const PrecioEnergiaView: React.FC<PrecioEnergiaViewProps> = ({
  tariffs,
  onChangeTariffs,
  inputs,
}) => {
  const [selectedMobileIndex, setSelectedMobileIndex] = useState(0);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [copiedP1Potencia, setCopiedP1Potencia] = useState(false);
  const [copiedP1Energia, setCopiedP1Energia] = useState(false);

  // Helper to safely select current tariff on mobile
  const currentMobileTariff = tariffs[selectedMobileIndex] || tariffs[0];

  const handleUpdatePrice = (
    tariffId: string,
    type: 'potencia' | 'energia',
    period: keyof PeriodValues,
    val: number
  ) => {
    const updated = tariffs.map((t) => {
      if (t.id !== tariffId) return t;
      const targetObj = type === 'potencia' ? t.potenciaPrices : t.energiaPrices;
      return {
        ...t,
        [type === 'potencia' ? 'potenciaPrices' : 'energiaPrices']: {
          ...targetObj,
          [period]: isNaN(val) ? 0 : val,
        },
      };
    });
    onChangeTariffs(updated);
  };

  const handleUpdateTariffName = (tariffId: string, newName: string) => {
    onChangeTariffs(
      tariffs.map((t) => (t.id === tariffId ? { ...t, name: newName } : t))
    );
  };

  const handleAddTariff = () => {
    if (tariffs.length >= MAX_TARIFFS) {
      alert(`Has alcanzado el límite máximo de ${MAX_TARIFFS} comercializadoras.`);
      return;
    }

    const nextIndex = tariffs.length + 1;
    const newId = `comercializadora-${Date.now()}`;
    const newTariff: Tariff = {
      id: newId,
      name: `Comercializadora ${nextIndex}`,
      badgeColor: BADGE_COLORS[(nextIndex - 1) % BADGE_COLORS.length],
      note: 'Introducir precios manualmente',
      potenciaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
      energiaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
    };

    onChangeTariffs([...tariffs, newTariff]);
    setSelectedMobileIndex(tariffs.length);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleDeleteTariff = (tariffId: string) => {
    if (tariffs.length <= 1) {
      alert('Debe haber al menos 1 comercializadora para poder comparar.');
      return;
    }
    const filtered = tariffs.filter((t) => t.id !== tariffId);
    onChangeTariffs(filtered);
    if (selectedMobileIndex >= filtered.length) {
      setSelectedMobileIndex(Math.max(0, filtered.length - 1));
    }
  };

  const handleDuplicateTariff = (tariff: Tariff) => {
    if (tariffs.length >= MAX_TARIFFS) {
      alert(`Has alcanzado el límite máximo de ${MAX_TARIFFS} comercializadoras.`);
      return;
    }
    const clone: Tariff = {
      ...tariff,
      id: `copy-${Date.now()}`,
      name: `${tariff.name} (Copia)`,
      badgeColor: BADGE_COLORS[tariffs.length % BADGE_COLORS.length],
    };
    onChangeTariffs([...tariffs, clone]);
    setSelectedMobileIndex(tariffs.length);
  };

  const handleCopyPotenciaP1 = (tariffId: string) => {
    const t = tariffs.find((item) => item.id === tariffId);
    if (!t) return;
    const p1Val = t.potenciaPrices.p1;
    const updated = tariffs.map((item) => {
      if (item.id !== tariffId) return item;
      return {
        ...item,
        potenciaPrices: {
          ...item.potenciaPrices,
          p2: p1Val,
          p3: p1Val,
        },
      };
    });
    onChangeTariffs(updated);
    setCopiedP1Potencia(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
    setTimeout(() => setCopiedP1Potencia(false), 2000);
  };

  const handleCopyEnergiaP1 = (tariffId: string) => {
    const t = tariffs.find((item) => item.id === tariffId);
    if (!t) return;
    const p1Val = t.energiaPrices.p1;
    const updated = tariffs.map((item) => {
      if (item.id !== tariffId) return item;
      return {
        ...item,
        energiaPrices: {
          ...item.energiaPrices,
          p2: p1Val,
          p3: p1Val,
        },
      };
    });
    onChangeTariffs(updated);
    setCopiedP1Energia(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
    setTimeout(() => setCopiedP1Energia(false), 2000);
  };

  const handleApplyPreset = (preset: typeof PRESET_MARKET_TARIFFS[0]) => {
    if (tariffs.length >= MAX_TARIFFS) {
      alert(`Límite máximo de ${MAX_TARIFFS} comercializadoras alcanzado.`);
      return;
    }
    const newTariff: Tariff = {
      ...preset,
      id: `preset-${Date.now()}`,
    };
    onChangeTariffs([...tariffs, newTariff]);
    setShowPresetsModal(false);
    setSelectedMobileIndex(tariffs.length);
  };

  const handleClearAllPrices = () => {
    if (window.confirm('¿Deseas poner a cero (0,000000) todos los precios de potencia y energía de las comercializadoras?')) {
      const zeroPrices = tariffs.map((t) => ({
        ...t,
        potenciaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
        energiaPrices: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
      }));
      onChangeTariffs(zeroPrices);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ANSAMA Brand Top Banner with Logo */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-4 sm:p-5 rounded-3xl shadow-md border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-1.5 bg-white rounded-2xl shadow-sm shrink-0 border border-zinc-200">
            <Logo size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-red-500 tracking-wider">Paso 3</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">• Tarifas de Compañías</span>
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
              Precios de Potencia y Energía
            </h2>
            <p className="text-xs text-zinc-300">
              Personaliza Comercializadora 1, 2, 3... o añade hasta 10 compañías para comparar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            type="button"
            onClick={handleClearAllPrices}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-black text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-700 transition cursor-pointer"
            title="Poner todos los precios a 0,000000"
          >
            <Eraser className="w-3.5 h-3.5 text-red-400" />
            <span>Precios a 0</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPresetsModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-black text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Tarifas Mercado</span>
          </button>

          <button
            type="button"
            onClick={handleAddTariff}
            disabled={tariffs.length >= MAX_TARIFFS}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl shadow-md transition cursor-pointer ${
              tariffs.length >= MAX_TARIFFS
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir ({tariffs.length}/{MAX_TARIFFS})</span>
          </button>
        </div>
      </div>

      {/* Notice about taxes */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-3 flex items-center justify-between text-xs text-zinc-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            <strong>Impuestos comunes:</strong> Los impuestos se configuran aparte en la pestaña &quot;Impuestos&quot; y se aplican equitativamente a todas las comercializadoras.
          </span>
        </div>
      </div>

      {/* Mobile Tariff Selector Tabs (Horizontal Scroll) */}
      <div className="lg:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tariffs.map((t, idx) => {
            const isSelected = selectedMobileIndex === idx;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedMobileIndex(idx)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-950 text-white shadow-md ring-2 ring-red-600'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: t.badgeColor || '#dc2626' }}
                />
                <span className="truncate max-w-[130px]">
                  {t.name || `Comercializadora ${idx + 1}`}
                </span>
              </button>
            );
          })}

          {tariffs.length < MAX_TARIFFS && (
            <button
              type="button"
              onClick={handleAddTariff}
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE CARD VIEW (Optimized for Android & Manual 7-Digit Input) */}
      <div className="lg:hidden space-y-5">
        {currentMobileTariff && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Mobile Company Name Editor (Prominent & Direct) */}
            <div className="p-4 bg-amber-400 border-b border-amber-500 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-amber-900" />
                  Nombre de la Compañía / Comercializadora
                </span>
                <span className="text-[11px] font-bold bg-amber-500/80 text-slate-900 px-2 py-0.5 rounded-full">
                  #{selectedMobileIndex + 1} de {tariffs.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentMobileTariff.name}
                  onChange={(e) => handleUpdateTariffName(currentMobileTariff.id, e.target.value)}
                  placeholder={`Comercializadora ${selectedMobileIndex + 1}`}
                  className="flex-1 bg-white text-slate-950 font-black text-base px-3.5 py-2.5 rounded-xl border-2 border-amber-600 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => handleDuplicateTariff(currentMobileTariff)}
                  className="p-2.5 bg-amber-300 hover:bg-amber-200 text-slate-900 rounded-xl transition"
                  title="Duplicar comercializadora"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {tariffs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTariff(currentMobileTariff.id)}
                    className="p-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition"
                    title="Eliminar comercializadora"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick company name presets for 1-tap naming */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
                <span className="text-[10px] font-extrabold text-amber-950 uppercase shrink-0">
                  Compañías:
                </span>
                {['Iberdrola', 'Endesa', 'Naturgy', 'TotalEnergies', 'Repsol', 'Octopus', 'Visalia', 'Niba'].map(
                  (comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => handleUpdateTariffName(currentMobileTariff.id, comp)}
                      className="shrink-0 px-2.5 py-1 text-[11px] font-bold bg-white/90 hover:bg-white text-slate-900 rounded-lg border border-amber-600/30 transition active:scale-95"
                    >
                      {comp}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Mobile Potencia Section */}
            <div className="p-4 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-blue-900 text-xs uppercase flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>PRECIO DE LA POTENCIA (€/kW día)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Base: {inputs.days} días
                </span>
              </div>

              {/* Quick copy P1 to P2 and P3 for flat rates */}
              <div className="flex items-center justify-between bg-blue-50/70 p-2 rounded-xl border border-blue-200">
                <span className="text-[11px] font-semibold text-blue-900">
                  ¿Tarifa fija 24h?
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyPotenciaP1(currentMobileTariff.id)}
                  className="px-2.5 py-1 text-xs font-bold text-blue-800 bg-white hover:bg-blue-100 rounded-lg border border-blue-300 transition flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                >
                  {copiedP1Potencia ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedP1Potencia ? '¡Copiado a P2 y P3!' : 'Copiar P1 a P2 y P3'}</span>
                </button>
              </div>

              {/* Potencia Periods: Designed with ample space for 7-digit numbers */}
              <div className="space-y-2.5">
                {(
                  [
                    { key: 'p1', label: 'P1 (Punta)' },
                    { key: 'p2', label: 'P2 (Llano)' },
                    { key: 'p3', label: 'P3 (Valle)' },
                  ] as const
                ).map((p) => {
                  const kw = inputs.potencia[p.key] || 0;
                  const price = currentMobileTariff.potenciaPrices[p.key] || 0;
                  const imp = round2(inputs.days * kw * price);

                  return (
                    <div
                      key={p.key}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-black text-xs">
                            {p.key.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{p.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {kw} kW
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-700 shrink-0">
                            €/kW día:
                          </label>
                          <DecimalPriceInput
                            value={price}
                            placeholder="0,000000"
                            onChange={(val) =>
                              handleUpdatePrice(currentMobileTariff.id, 'potencia', p.key, val)
                            }
                            className="w-36 sm:w-40"
                          />
                        </div>

                        <div className="text-right shrink-0 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200/80">
                          <div className="text-[9px] font-bold uppercase text-blue-700">Importe</div>
                          <div className="text-xs sm:text-sm font-black text-blue-950">
                            {formatCurrency(imp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Energía Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-amber-900 text-xs uppercase flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>PRECIO DE LA ENERGÍA (€/kWh)</span>
                </h3>
              </div>

              {/* Quick copy P1 to P2 and P3 for flat rates */}
              <div className="flex items-center justify-between bg-amber-50/70 p-2 rounded-xl border border-amber-200">
                <span className="text-[11px] font-semibold text-amber-900">
                  ¿Mismo precio las 24 horas?
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyEnergiaP1(currentMobileTariff.id)}
                  className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 transition flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                >
                  {copiedP1Energia ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedP1Energia ? '¡Copiado a P2 y P3!' : 'Copiar P1 a P2 y P3'}</span>
                </button>
              </div>

              {/* Energía Periods: Designed with ample space for 7-digit numbers */}
              <div className="space-y-2.5">
                {(
                  [
                    { key: 'p1', label: 'P1 (Punta)' },
                    { key: 'p2', label: 'P2 (Llano)' },
                    { key: 'p3', label: 'P3 (Valle)' },
                  ] as const
                ).map((p) => {
                  const kwh = inputs.consumo[p.key] || 0;
                  const price = currentMobileTariff.energiaPrices[p.key] || 0;
                  const imp = round2(kwh * price);

                  return (
                    <div
                      key={p.key}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-xs">
                            {p.key.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{p.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {kwh} kWh
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-700 shrink-0">
                            €/kWh:
                          </label>
                          <DecimalPriceInput
                            value={price}
                            placeholder="0,000000"
                            onChange={(val) =>
                              handleUpdatePrice(currentMobileTariff.id, 'energia', p.key, val)
                            }
                            className="w-36 sm:w-40"
                          />
                        </div>

                        <div className="text-right shrink-0 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200/80">
                          <div className="text-[9px] font-bold uppercase text-amber-800">Importe</div>
                          <div className="text-xs sm:text-sm font-black text-amber-950">
                            {formatCurrency(imp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (With direct in-header company renaming and 7-digit inputs) */}
      <div className="hidden lg:block space-y-8">
        {/* UPPER TABLE: PRECIO DE LA POTENCIA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
          {/* Section Header */}
          <div className="bg-amber-400 p-2.5 text-center border-b border-amber-500">
            <span className="font-serif font-black uppercase text-slate-950 text-sm tracking-wider">
              PRECIO DE LA POTENCIA (€/kW día)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 w-44 text-center font-black uppercase italic bg-[#93c5fd] text-blue-950 border-r border-slate-300">
                    POTENCIA
                  </th>
                  {tariffs.map((t, idx) => (
                    <th
                      key={t.id}
                      colSpan={2}
                      className="p-2.5 text-center font-bold border-r border-slate-300 last:border-r-0 bg-amber-200 text-slate-900"
                    >
                      <div className="flex items-center justify-between gap-1 px-1">
                        <div className="flex-1 flex items-center gap-1">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => handleUpdateTariffName(t.id, e.target.value)}
                            placeholder={`Comercializadora ${idx + 1}`}
                            className="w-full bg-white/95 px-2 py-1 rounded-lg border border-amber-600/50 text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
                            title="Haz clic para modificar el nombre de la compañía"
                          />
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0 ml-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateTariff(t)}
                            className="p-1 hover:bg-amber-300 rounded text-slate-700"
                            title="Duplicar"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {tariffs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTariff(t.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>

                {/* Sub-headers: €/KW dia | IMPORTE */}
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 border-b border-slate-300">
                  <th className="p-2 bg-[#bfdbfe] border-r border-slate-300 text-center font-extrabold text-blue-900">
                    Periodo (kW)
                  </th>
                  {tariffs.map((t) => (
                    <React.Fragment key={t.id}>
                      <th className="p-2 text-center border-r border-slate-200 text-slate-700 min-w-[145px]">
                        €/KW dia
                      </th>
                      <th className="p-2 text-center border-r border-slate-300 last:border-r-0 text-slate-700 min-w-[105px]">
                        IMPORTE
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(
                  [
                    { key: 'p1', label: 'P1 (Punta)' },
                    { key: 'p2', label: 'P2 (Llano)' },
                    { key: 'p3', label: 'P3 (Valle)' },
                    { key: 'p4', label: 'P4' },
                    { key: 'p5', label: 'P5' },
                    { key: 'p6', label: 'P6' },
                  ] as const
                ).map((p) => {
                  const kwVal = inputs.potencia[p.key] || 0;
                  return (
                    <tr key={p.key} className="hover:bg-slate-50 transition">
                      <td className="p-2.5 font-bold text-slate-800 bg-[#eff6ff] border-r border-slate-300 flex items-center justify-between">
                        <span>{p.label}</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          {kwVal > 0 ? `${kwVal} kW` : '-'}
                        </span>
                      </td>
                      {tariffs.map((t) => {
                        const price = t.potenciaPrices[p.key] || 0;
                        const importe = round2(inputs.days * kwVal * price);
                        return (
                          <React.Fragment key={t.id}>
                            <td className="p-1.5 text-center border-r border-slate-200 min-w-[145px]">
                              <DecimalPriceInput
                                value={price}
                                placeholder="0,000000"
                                onChange={(val) =>
                                  handleUpdatePrice(t.id, 'potencia', p.key, val)
                                }
                                className="w-32 sm:w-34 text-center font-mono text-xs font-bold"
                              />
                            </td>
                            <td className="p-2 text-right font-extrabold border-r border-slate-300 last:border-r-0 text-slate-800 min-w-[105px]">
                              {formatCurrency(importe)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOWER TABLE: PRECIO DE LA ENERGIA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
          {/* Section Header */}
          <div className="bg-amber-400 p-2.5 text-center border-b border-amber-500">
            <span className="font-serif font-black uppercase text-slate-950 text-sm tracking-wider">
              PRECIO DE LA ENERGIA (€/kWh)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 w-44 text-center font-black uppercase italic bg-[#93c5fd] text-blue-950 border-r border-slate-300">
                    ENERGIA
                  </th>
                  {tariffs.map((t, idx) => (
                    <th
                      key={t.id}
                      colSpan={2}
                      className="p-2.5 text-center font-bold border-r border-slate-300 last:border-r-0 bg-amber-200 text-slate-900"
                    >
                      <div className="flex items-center justify-between gap-1 px-1">
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => handleUpdateTariffName(t.id, e.target.value)}
                          placeholder={`Comercializadora ${idx + 1}`}
                          className="w-full bg-white/95 px-2 py-1 rounded-lg border border-amber-600/50 text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-2xs"
                          title="Haz clic para modificar el nombre de la compañía"
                        />
                      </div>
                    </th>
                  ))}
                </tr>
                {/* Sub-headers: €/KW h | IMPORTE */}
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 border-b border-slate-300">
                  <th className="p-2 bg-[#bfdbfe] border-r border-slate-300 text-center font-extrabold text-blue-900">
                    Periodo (kWh)
                  </th>
                  {tariffs.map((t) => (
                    <React.Fragment key={t.id}>
                      <th className="p-2 text-center border-r border-slate-200 text-slate-700 min-w-[145px]">
                        €/KW h
                      </th>
                      <th className="p-2 text-center border-r border-slate-300 last:border-r-0 text-slate-700 min-w-[105px]">
                        IMPORTE
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(
                  [
                    { key: 'p1', label: 'P1 (Punta)' },
                    { key: 'p2', label: 'P2 (Llano)' },
                    { key: 'p3', label: 'P3 (Valle)' },
                    { key: 'p4', label: 'P4' },
                    { key: 'p5', label: 'P5' },
                    { key: 'p6', label: 'P6' },
                  ] as const
                ).map((p) => {
                  const kwhVal = inputs.consumo[p.key] || 0;
                  return (
                    <tr key={p.key} className="hover:bg-slate-50 transition">
                      <td className="p-2.5 font-bold text-slate-800 bg-[#eff6ff] border-r border-slate-300 flex items-center justify-between">
                        <span>{p.label}</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          {kwhVal > 0 ? `${kwhVal} kWh` : '-'}
                        </span>
                      </td>
                      {tariffs.map((t) => {
                        const price = t.energiaPrices[p.key] || 0;
                        const importe = round2(kwhVal * price);
                        return (
                          <React.Fragment key={t.id}>
                            <td className="p-1.5 text-center border-r border-slate-200 min-w-[145px]">
                              <DecimalPriceInput
                                value={price}
                                placeholder="0,000000"
                                onChange={(val) =>
                                  handleUpdatePrice(t.id, 'energia', p.key, val)
                                }
                                className="w-32 sm:w-34 text-center font-mono text-xs font-bold"
                              />
                            </td>
                            <td className="p-2 text-right font-extrabold border-r border-slate-300 last:border-r-0 text-slate-800 min-w-[105px]">
                              {formatCurrency(importe)}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preset Modal */}
      {showPresetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-black text-zinc-950">
                  Tarifas Populares del Mercado Español
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetsModal(false)}
                className="text-zinc-400 hover:text-zinc-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 mt-2">
              Selecciona una tarifa para añadirla a la comparativa. Podrás editar libremente sus precios y nombre.
            </p>

            <div className="mt-4 space-y-3">
              {PRESET_MARKET_TARIFFS.map((preset, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-zinc-200 hover:border-red-500 hover:bg-zinc-50 transition flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{preset.name}</h4>
                    <p className="text-xs text-zinc-500">{preset.note}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-600 font-mono">
                      <span>P1 Pot: {preset.potenciaPrices.p1} €/kW d</span>
                      <span>•</span>
                      <span>P1 Ene: {preset.energiaPrices.p1} €/kWh</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition shrink-0 cursor-pointer shadow-xs"
                  >
                    Añadir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
