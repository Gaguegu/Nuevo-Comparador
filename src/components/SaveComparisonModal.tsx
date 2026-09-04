import React, { useState } from 'react';
import { Bookmark, X, Check, FileText, User } from 'lucide-react';
import { BillInputs, Tariff, TaxesConfig, ComparisonSummary, SavedComparison } from '../types';
import { formatCurrency } from '../utils/calculator';

interface SaveComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: BillInputs;
  tariffs: Tariff[];
  taxes: TaxesConfig;
  summary: ComparisonSummary;
  onSave: (comparison: SavedComparison) => void;
}

export const SaveComparisonModal: React.FC<SaveComparisonModalProps> = ({
  isOpen,
  onClose,
  inputs,
  tariffs,
  taxes,
  summary,
  onSave,
}) => {
  const [clientName, setClientName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const totalKwh =
    inputs.consumo.p1 +
    inputs.consumo.p2 +
    inputs.consumo.p3 +
    inputs.consumo.p4 +
    inputs.consumo.p5 +
    inputs.consumo.p6;

  const cheapest = summary.results.find((r) => r.tariffId === summary.cheapestTariffId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalClientName = clientName.trim() || `Cliente (${new Date().toLocaleDateString('es-ES')})`;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })} ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

    const newEntry: SavedComparison = {
      id: `comp-${Date.now()}`,
      clientName: finalClientName,
      notes: notes.trim() || undefined,
      date: formattedDate,
      timestamp: Date.now(),
      inputs: JSON.parse(JSON.stringify(inputs)),
      taxes: JSON.parse(JSON.stringify(taxes)),
      tariffs: JSON.parse(JSON.stringify(tariffs)),
      cheapestTariffName: cheapest ? cheapest.tariffName : 'Sin definir',
      cheapestTotal: cheapest ? cheapest.totalFactura : 0,
      savingsVsWorst: summary.maxSavingsVsWorst || 0,
      annualSavings: summary.annualMaxSavings || 0,
      totalKwh,
      days: inputs.days,
    };

    onSave(newEntry);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-black text-white">
              Guardar en Historial
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4">
          {/* Quick Summary of active comparison */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 text-xs space-y-2">
            <div className="flex justify-between text-zinc-600">
              <span>Factura a archivar:</span>
              <strong className="text-zinc-950 font-bold">{inputs.days} días • {totalKwh} kWh</strong>
            </div>
            {cheapest && (
              <div className="flex justify-between text-red-600 font-black">
                <span>Mejor opción:</span>
                <span>{cheapest.tariffName} ({formatCurrency(cheapest.totalFactura)})</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-red-500" />
              <span>Nombre del Cliente o Referencia:</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ej: Juan Pérez / Panadería San José / Casa Campo"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full text-sm bg-zinc-50 border-2 border-zinc-300 rounded-2xl px-3.5 py-2.5 text-zinc-950 focus:outline-none focus:border-red-600 focus:bg-white font-bold transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Notas adicionales (opcional):</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Tarifa con discriminación horaria / Pendiente de revisar potencia..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-zinc-50 border border-zinc-300 rounded-2xl p-3 text-zinc-800 focus:outline-none focus:border-red-600 focus:bg-white transition"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className={`flex-1 py-2.5 text-xs font-black text-white rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isSaved ? 'bg-zinc-950' : 'bg-red-600 hover:bg-red-700 active:scale-95'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Guardado con éxito!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Guardar Comparativa</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
