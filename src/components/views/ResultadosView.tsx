import React, { useState } from 'react';
import {
  Trophy,
  Share2,
  Check,
  Printer,
  Sparkles,
  Bookmark,
  History,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tariff, BillInputs, TaxesConfig, ComparisonSummary } from '../../types';
import { formatCurrency } from '../../utils/calculator';
import { Logo } from '../Logo';

interface ResultadosViewProps {
  summary: ComparisonSummary;
  tariffs: Tariff[];
  inputs: BillInputs;
  taxes: TaxesConfig;
  savedCount?: number;
  onOpenSaveModal?: () => void;
  onOpenHistoryModal?: () => void;
}

export const ResultadosView: React.FC<ResultadosViewProps> = ({
  summary,
  tariffs,
  inputs,
  taxes,
  savedCount = 0,
  onOpenSaveModal,
  onOpenHistoryModal,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [selectedMobileTariffId, setSelectedMobileTariffId] = useState<string>(
    summary.cheapestTariffId || (summary.results[0]?.tariffId ?? '')
  );

  const activeResults = summary.results.filter((r) => r.totalFactura > 0);
  const cheapestResult = summary.results.find((r) => r.tariffId === summary.cheapestTariffId);
  const mostExpensiveResult = summary.results.find((r) => r.tariffId === summary.mostExpensiveTariffId);

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleShareSummary = () => {
    if (!cheapestResult) return;
    const text = `📊 *COMPARATIVA DE TARIFAS ELÉCTRICAS - ANSAMA*
📅 Periodo: ${inputs.days} días | Consumo: ${inputs.consumo.p1 + inputs.consumo.p2 + inputs.consumo.p3} kWh

🏆 *MEJOR TARIFA:*
⭐ ${cheapestResult.tariffName}: *${formatCurrency(cheapestResult.totalFactura)}*

📋 *Comparativa:*
${activeResults
  .map(
    (r) =>
      `• ${r.tariffName}: ${formatCurrency(r.totalFactura)}${
        r.tariffId === summary.cheapestTariffId ? ' ✅ (Más económica)' : ''
      }`
  )
  .join('\n')}

💰 *Ahorro potencial:* ${formatCurrency(summary.maxSavingsVsWorst)} por factura (${formatCurrency(summary.annualMaxSavings)} al año)
⚡ Calculado con ANSAMA Comparador Eléctrico`;

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    handleCelebrate();
    setTimeout(() => setCopiedShare(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner with ANSAMA Logo */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-4 sm:p-5 rounded-3xl shadow-md border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-1.5 bg-white rounded-2xl shadow-sm shrink-0 border border-zinc-200">
            <Logo size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-red-500 tracking-wider">Paso 4</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">• Comparativa Final</span>
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
              Resultados y Ahorro Calculado
            </h2>
            <p className="text-xs text-zinc-300">
              Desglose detallado de costes, mejor tarifa e informe comparativo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {onOpenSaveModal && (
            <button
              type="button"
              onClick={onOpenSaveModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-sm cursor-pointer active:scale-95"
              title="Archivar esta comparativa con nombre del cliente y fecha"
            >
              <Bookmark className="w-4 h-4 text-white" />
              <span>Guardar Historial</span>
            </button>
          )}

          <button
            onClick={handleShareSummary}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm rounded-xl transition border border-zinc-700 cursor-pointer active:scale-95"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? '¡Copiado!' : 'Compartir'}</span>
          </button>

          {onOpenHistoryModal && (
            <button
              type="button"
              onClick={onOpenHistoryModal}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition border border-zinc-700 cursor-pointer"
              title="Abrir historial de comparativas guardadas"
            >
              <History className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">Historial</span>
              {savedCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition border border-zinc-700"
            title="Imprimir informe"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Winner & Savings Banner */}
      {cheapestResult && (
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-red-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/80 text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-red-400" />
                Opción Más Económica
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {cheapestResult.tariffName} — <span className="text-red-400">{formatCurrency(cheapestResult.totalFactura)}</span>
              </h2>
              {summary.maxSavingsVsWorst > 0 && mostExpensiveResult && (
                <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                  ¡Ahorras <span className="text-emerald-400 font-extrabold">{formatCurrency(summary.maxSavingsVsWorst)}</span> frente a {mostExpensiveResult.tariffName}!
                  <span className="ml-1 text-zinc-400 font-medium">({formatCurrency(summary.annualMaxSavings)} estimados al año)</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Selector for Results Breakdown */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {summary.results.map((r) => {
          const isCheapest = r.tariffId === summary.cheapestTariffId && r.totalFactura > 0;
          return (
            <button
              key={r.tariffId}
              type="button"
              onClick={() => setSelectedMobileTariffId(r.tariffId)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedMobileTariffId === r.tariffId
                  ? isCheapest
                    ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-md'
                    : 'bg-zinc-950 text-white shadow-md'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {isCheapest && <span className="text-xs">★</span>}
              <span className="truncate max-w-[120px]">{r.tariffName}</span>
              <span className="font-extrabold">{formatCurrency(r.totalFactura)}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN COMPARATIVE TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              {/* Row with Base Impuesto Eléctrico */}
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500">
                <th className="p-2.5 font-bold border-r border-zinc-200 bg-zinc-100 text-zinc-700">
                  Base I.E.
                </th>
                {summary.results.map((r) => (
                  <th
                    key={r.tariffId}
                    className="p-2 text-center border-r border-zinc-200 last:border-r-0 font-mono text-xs font-semibold text-zinc-600"
                  >
                    {r.totalFactura > 0 ? formatCurrency(r.baseImpuestoElectrico) : '€0,00'}
                  </th>
                ))}
              </tr>

              {/* Company / Tariff Names Header */}
              <tr className="border-b-2 border-zinc-900 text-white font-black text-xs sm:text-sm uppercase tracking-wide">
                <th className="p-3.5 bg-zinc-950 border-r border-zinc-800 text-red-500">
                  Concepto de Factura
                </th>
                {summary.results.map((r) => {
                  const isWinner = r.tariffId === summary.cheapestTariffId && r.totalFactura > 0;
                  return (
                    <th
                      key={r.tariffId}
                      className={`p-3.5 text-center border-r border-zinc-800 last:border-r-0 transition ${
                        isWinner
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-900 text-white'
                      }`}
                    >
                      <div className="truncate px-1" title={r.tariffName}>
                        {isWinner && '🏆 '}
                        {r.tariffName}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {/* 1. Impuesto Electrico */}
              <tr className="hover:bg-zinc-50 transition">
                <td className="p-2.5 font-bold text-zinc-800 bg-zinc-50/80 border-r border-zinc-200">
                  Impuesto Eléctrico ({taxes.impuestoElectricoRate}%)
                </td>
                {summary.results.map((r) => (
                  <td key={r.tariffId} className="p-2.5 text-right font-medium text-zinc-900 border-r border-zinc-200 last:border-r-0 font-mono">
                    {formatCurrency(r.impuestoElectrico)}
                  </td>
                ))}
              </tr>

              {/* 2. Bono Social */}
              <tr className="hover:bg-zinc-50 transition">
                <td className="p-2.5 font-bold text-zinc-800 bg-zinc-50/80 border-r border-zinc-200">
                  Bono Social
                </td>
                {summary.results.map((r) => (
                  <td key={r.tariffId} className="p-2.5 text-right font-medium text-zinc-900 border-r border-zinc-200 last:border-r-0 font-mono">
                    {r.totalFactura > 0 ? formatCurrency(r.bonoSocial) : '0,00 €'}
                  </td>
                ))}
              </tr>

              {/* 3. Alquiler Equipos */}
              <tr className="hover:bg-zinc-50 transition">
                <td className="p-2.5 font-bold text-zinc-800 bg-zinc-50/80 border-r border-zinc-200">
                  Alquiler Equipos
                </td>
                {summary.results.map((r) => (
                  <td key={r.tariffId} className="p-2.5 text-right font-medium text-zinc-900 border-r border-zinc-200 last:border-r-0 font-mono">
                    {r.totalFactura > 0 ? formatCurrency(r.alquilerEquipos) : '0,00 €'}
                  </td>
                ))}
              </tr>

              {/* 4. Otros */}
              <tr className="hover:bg-zinc-50 transition">
                <td className="p-2.5 font-bold text-zinc-800 bg-zinc-50/80 border-r border-zinc-200">
                  Otros
                </td>
                {summary.results.map((r) => (
                  <td key={r.tariffId} className="p-2.5 text-right font-medium text-zinc-900 border-r border-zinc-200 last:border-r-0 font-mono">
                    {formatCurrency(r.otros)}
                  </td>
                ))}
              </tr>

              {/* 5-10. Precio Potencia P1 - P6 */}
              {(
                [
                  { key: 'p1', label: 'Precio Potencia P1 (Punta)' },
                  { key: 'p2', label: 'Precio Potencia P2 (Llano)' },
                  { key: 'p3', label: 'Precio Potencia P3 (Valle)' },
                  { key: 'p4', label: 'Precio Potencia P4' },
                  { key: 'p5', label: 'Precio Potencia P5' },
                  { key: 'p6', label: 'Precio Potencia P6' },
                ] as const
              ).map((p) => (
                <tr key={p.key} className="hover:bg-zinc-50 transition">
                  <td className="p-2.5 font-medium text-zinc-900 border-r border-zinc-200 pl-5">
                    {p.label}
                  </td>
                  {summary.results.map((r) => (
                    <td key={r.tariffId} className="p-2.5 text-right font-medium text-zinc-900 border-r border-zinc-200 last:border-r-0 font-mono">
                      {formatCurrency(r.potenciaImports[p.key])}
                    </td>
                  ))}
                </tr>
              ))}

              {/* 11-16. Precio Energia P1 - P6 */}
              {(
                [
                  { key: 'p1', label: 'Precio Energía P1 (Punta)' },
                  { key: 'p2', label: 'Precio Energía P2 (Llano)' },
                  { key: 'p3', label: 'Precio Energía P3 (Valle)' },
                  { key: 'p4', label: 'Precio Energía P4' },
                  { key: 'p5', label: 'Precio Energía P5' },
                  { key: 'p6', label: 'Precio Energía P6' },
                ] as const
              ).map((p) => (
                <tr key={p.key} className="hover:bg-zinc-50 transition">
                  <td className="p-2.5 font-medium text-zinc-900 border-r border-zinc-200 pl-5">
                    {p.label}
                  </td>
                  {summary.results.map((r) => (
                    <td key={r.tariffId} className="p-2.5 text-right font-medium text-zinc-900 border-r border-zinc-200 last:border-r-0 font-mono">
                      {formatCurrency(r.energiaImports[p.key])}
                    </td>
                  ))}
                </tr>
              ))}

              {/* 17. SUBTOTAL */}
              <tr className="bg-zinc-100 font-extrabold text-zinc-900 border-t-2 border-zinc-300">
                <td className="p-3 uppercase tracking-wider border-r border-zinc-300 font-black">
                  SUBTOTAL
                </td>
                {summary.results.map((r) => (
                  <td key={r.tariffId} className="p-3 text-right font-black border-r border-zinc-300 last:border-r-0 text-zinc-900 font-mono">
                    {formatCurrency(r.subtotal)}
                  </td>
                ))}
              </tr>

              {/* 18. I. V. A. */}
              <tr className="bg-zinc-50 font-bold text-zinc-800">
                <td className="p-2.5 border-r border-zinc-200 font-extrabold">
                  I. V. A. ({taxes.ivaRate}%)
                </td>
                {summary.results.map((r) => (
                  <td key={r.tariffId} className="p-2.5 text-right font-extrabold text-zinc-800 border-r border-zinc-200 last:border-r-0 font-mono">
                    {formatCurrency(r.iva)}
                  </td>
                ))}
              </tr>

              {/* 19. IMPORTE TOTAL FACTURAS */}
              <tr className="text-base sm:text-lg font-black border-t-2 border-zinc-900 text-zinc-950">
                <td className="p-4 bg-zinc-950 text-white uppercase tracking-wider border-r border-zinc-800">
                  IMPORTE TOTAL FACTURAS
                </td>
                {summary.results.map((r) => {
                  const isCheapest = r.tariffId === summary.cheapestTariffId && r.totalFactura > 0;
                  return (
                    <td
                      key={r.tariffId}
                      className={`p-4 text-right font-black border-r border-zinc-800 last:border-r-0 transition font-mono ${
                        isCheapest
                          ? 'bg-red-600 text-white shadow-inner'
                          : r.totalFactura > 0
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {isCheapest && <span className="text-sm">★</span>}
                        <span>{formatCurrency(r.totalFactura)}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Cost Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {activeResults.map((r) => {
          const isWinner = r.tariffId === summary.cheapestTariffId;
          const potPct = Math.round((r.totalPotencia / (r.totalFactura || 1)) * 100);
          const enePct = Math.round((r.totalEnergia / (r.totalFactura || 1)) * 100);
          const taxPct = 100 - potPct - enePct;

          return (
            <div
              key={r.tariffId}
              className={`rounded-3xl p-5 border transition shadow-xs ${
                isWinner
                  ? 'bg-white border-2 border-red-600 ring-2 ring-red-500/20'
                  : 'bg-white border-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-black text-zinc-950 text-sm truncate">{r.tariffName}</h3>
                {isWinner && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    Mejor Precio
                  </span>
                )}
              </div>

              <div className="text-2xl font-black text-zinc-950 mb-3 font-mono">
                {formatCurrency(r.totalFactura)}
              </div>

              {/* Progress bar split */}
              <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden flex mb-3 border border-zinc-200">
                <div style={{ width: `${potPct}%` }} className="bg-zinc-800" title={`Potencia: ${potPct}%`} />
                <div style={{ width: `${enePct}%` }} className="bg-red-600" title={`Energía: ${enePct}%`} />
                <div style={{ width: `${taxPct}%` }} className="bg-zinc-400" title={`Impuestos: ${taxPct}%`} />
              </div>

              {/* Breakdown Legend */}
              <div className="grid grid-cols-3 gap-1 text-[11px] text-zinc-600 border-t border-zinc-100 pt-3">
                <div>
                  <span className="block text-[10px] text-zinc-900 font-bold">Potencia</span>
                  <span className="font-black text-zinc-900 font-mono">{formatCurrency(r.totalPotencia)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-red-600 font-bold">Energía</span>
                  <span className="font-black text-zinc-900 font-mono">{formatCurrency(r.totalEnergia)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold">Impuestos</span>
                  <span className="font-black text-zinc-900 font-mono">{formatCurrency(r.impuestoElectrico + r.iva + r.bonoSocial + r.alquilerEquipos)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
