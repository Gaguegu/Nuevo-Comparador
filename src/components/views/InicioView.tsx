import React from 'react';
import { TrendingUp, Coins, Lightbulb, CheckSquare, Zap, ArrowRight, ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import { BillInputs, ComparisonSummary, ActiveTab } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculator';
import { PWAInstallButton } from '../PWAInstallButton';
import { Logo } from '../Logo';

interface InicioViewProps {
  inputs: BillInputs;
  summary: ComparisonSummary;
  onChangeTab: (tab: ActiveTab) => void;
}

export const InicioView: React.FC<InicioViewProps> = ({ inputs, summary, onChangeTab }) => {
  const totalKWh = inputs.consumo.p1 + inputs.consumo.p2 + inputs.consumo.p3 + inputs.consumo.p4 + inputs.consumo.p5 + inputs.consumo.p6;
  const bestTariff = summary.results.find((r) => r.tariffId === summary.cheapestTariffId);
  const worstTariff = summary.results.find((r) => r.tariffId === summary.mostExpensiveTariffId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* PWA mobile install alert banner */}
      <PWAInstallButton variant="banner" />

      {/* Main Hero Card with ANSAMA Brand Identity */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-200 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="p-2 bg-white rounded-2xl shadow-md border border-zinc-200 shrink-0">
              <Logo size="lg" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black uppercase tracking-wider mb-1.5 border border-red-200">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>ANSAMA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Comparador de Tarifas Eléctricas
              </h2>
              <p className="text-zinc-600 text-sm sm:text-base mt-1">
                Herramienta profesional para calcular y comparar ofertas de luz en segundos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChangeTab('resultados')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <span>Ver Comparativa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Días Factura</span>
            </div>
            <div className="text-2xl font-black text-zinc-900">
              {inputs.days} <span className="text-xs font-normal text-zinc-500">días</span>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-900" />
              <span>Consumo Total</span>
            </div>
            <div className="text-2xl font-black text-zinc-900">
              {formatNumber(totalKWh, 1)} <span className="text-xs font-normal text-zinc-500">kWh</span>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold mb-1">
              <Zap className="w-3.5 h-3.5 text-red-500" />
              <span>Potencia P1</span>
            </div>
            <div className="text-2xl font-black text-zinc-900">
              {inputs.potencia.p1} <span className="text-xs font-normal text-zinc-500">kW</span>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-sm text-white">
            <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Tarifas Analizadas</span>
            </div>
            <div className="text-2xl font-black text-white">
              {summary.results.filter((r) => r.totalFactura > 0).length}{' '}
              <span className="text-xs font-normal text-zinc-400">activas</span>
            </div>
          </div>
        </div>

        {/* Best Tariff Highlight Box */}
        {bestTariff && (
          <div className="mt-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-2xl p-5 border-2 border-red-600 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                ★
              </div>
              <div>
                <div className="text-xs uppercase font-extrabold text-red-400 tracking-wider">
                  Tarifa Más Económica detectada
                </div>
                <div className="text-xl font-black text-white">
                  {bestTariff.tariffName} — <span className="text-red-400">{formatCurrency(bestTariff.totalFactura)}</span>
                </div>
                {worstTariff && worstTariff.tariffId !== bestTariff.tariffId && (
                  <p className="text-xs text-zinc-300 mt-0.5 font-medium">
                    Ahorras <strong className="text-white">{formatCurrency(summary.maxSavingsVsWorst)}</strong> en esta factura ({formatCurrency(summary.annualMaxSavings)} al año) frente a {worstTariff.tariffName}.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangeTab('resultados')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
            >
              Ver Desglose Completo
            </button>
          </div>
        )}
      </div>

      {/* 4 Feature navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onChangeTab('consumo')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md hover:border-red-500 transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 text-base group-hover:text-red-600 transition">
            1. Consumo y Potencia
          </h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Introduce los días, los kWh por periodo (P1-P6) y la potencia contratada de tu factura.
          </p>
        </div>

        <div
          onClick={() => onChangeTab('impuestos')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md hover:border-red-500 transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 text-base group-hover:text-red-600 transition">
            2. Impuestos Fijos
          </h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Impuesto Eléctrico (5,1127%), Bono Social, Alquiler de contador e IVA (21%) regulados.
          </p>
        </div>

        <div
          onClick={() => onChangeTab('precio-energia')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md hover:border-red-500 transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 text-base group-hover:text-red-600 transition">
            3. Comercializadoras
          </h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Comercializadora 1, 2, 3... con nombres editables a tu gusto y hasta 10 compañías.
          </p>
        </div>

        <div
          onClick={() => onChangeTab('resultados')}
          className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs hover:shadow-md hover:border-red-500 transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 text-base group-hover:text-red-600 transition">
            4. Tabla de Resultados
          </h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            Tabla detallada con desglose línea a línea, IVA, total factura, guardado y WhatsApp.
          </p>
        </div>
      </div>

      {/* Guaranteed fidelity note */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-2xs flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700">
          <span className="font-bold text-zinc-950">Precisión matemática idéntica: </span>
          Las fórmulas replican exactamente el modelo de cálculo oficial de ANSAMA
          (Base del Impuesto Eléctrico, cálculo del Bono Social por días, Alquiler de contador, Subtotal e IVA al 21%).
        </div>
      </div>
    </div>
  );
};
