import React, { useState } from 'react';
import {
  History,
  X,
  Trash2,
  Share2,
  Check,
  ArrowRight,
  User,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SavedComparison } from '../types';
import { formatCurrency } from '../utils/calculator';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedComparisons: SavedComparison[];
  onLoadComparison: (comparison: SavedComparison) => void;
  onDeleteComparison: (id: string) => void;
  onClearAllHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedComparisons,
  onLoadComparison,
  onDeleteComparison,
  onClearAllHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  if (!isOpen) return null;

  const filtered = savedComparisons.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.cheapestTariffName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShareComparison = (comp: SavedComparison) => {
    const text = `📊 *COMPARATIVA DE TARIFAS GUARDADA - ANSAMA*
👤 Cliente: *${comp.clientName}*
📅 Fecha: ${comp.date}
⚡ Periodo: ${comp.days} días | Consumo: ${comp.totalKwh} kWh

🏆 *MEJOR TARIFA:*
⭐ ${comp.cheapestTariffName}: *${formatCurrency(comp.cheapestTotal)}*
${comp.savingsVsWorst > 0 ? `💰 Ahorro estimado: ${formatCurrency(comp.savingsVsWorst)} por factura (${formatCurrency(comp.annualSavings)}/año)` : ''}
${comp.notes ? `📝 Notas: ${comp.notes}` : ''}
Calculado con ANSAMA Comparador Eléctrico`;

    navigator.clipboard.writeText(text);
    setCopiedId(comp.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-zinc-950 text-white flex items-center justify-between shrink-0 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Historial de Comparativas</span>
                <span className="text-xs font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                  {savedComparisons.length}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Comparativas guardadas de tus clientes en el dispositivo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        {savedComparisons.length > 0 && (
          <div className="p-3.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between gap-3 shrink-0">
            <input
              type="text"
              placeholder="Buscar por cliente, tarifa o notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />

            {!confirmClearAll ? (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition shrink-0 cursor-pointer"
                title="Vaciar todo el historial"
              >
                Vaciar historial
              </button>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onClearAllHistory();
                    setConfirmClearAll(false);
                  }}
                  className="px-3 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition"
                >
                  ¿Borrar todo?
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-2.5 py-2 text-xs font-bold text-zinc-700 bg-zinc-200 hover:bg-zinc-300 rounded-xl"
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Body - List of Saved Comparisons */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {savedComparisons.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-base font-black text-zinc-900">
                No hay comparativas guardadas todavía
              </h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                Cuando calcules una comparativa para un cliente, pulsa en el botón{' '}
                <strong className="text-zinc-900">"Guardar en Historial"</strong> dentro de la pestaña{' '}
                <strong className="text-zinc-900">Resultados</strong> para archivarla con su nombre y fecha.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No se encontraron comparativas con el término de búsqueda &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filtered.map((comp) => {
              const isCopied = copiedId === comp.id;

              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl border border-zinc-200 hover:border-red-500 hover:shadow-md transition p-4 space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-black text-zinc-950 text-base leading-tight">
                          {comp.clientName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {comp.date}
                          </span>
                          <span>•</span>
                          <span>{comp.days} días</span>
                          <span>•</span>
                          <span>{comp.totalKwh} kWh</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteComparison(comp.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0 cursor-pointer"
                      title="Eliminar esta comparativa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Winner Summary Pill */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black uppercase text-zinc-500 block">
                          Tarifa recomendada
                        </span>
                        <span className="text-xs sm:text-sm font-black text-zinc-950">
                          {comp.cheapestTariffName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-black text-red-600 block font-mono">
                        {formatCurrency(comp.cheapestTotal)}
                      </span>
                      {comp.savingsVsWorst > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700">
                          Ahorro: {formatCurrency(comp.savingsVsWorst)}
                        </span>
                      )}
                    </div>
                  </div>

                  {comp.notes && (
                    <p className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 italic">
                      &quot;{comp.notes}&quot;
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadComparison(comp);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition active:scale-95 cursor-pointer shadow-xs"
                    >
                      <span>Cargar en la calculadora</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareComparison(comp)}
                      className="px-3.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                      title="Copiar resumen para WhatsApp"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xl border border-zinc-300 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
