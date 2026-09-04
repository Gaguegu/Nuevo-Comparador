import React from 'react';
import { X, Sparkles, Trash2, RotateCcw, Zap, Lightbulb, FilePlus } from 'lucide-react';

interface ResetOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAllZero: () => void;
  onResetConsumoOnly: () => void;
  onResetPricesOnly: () => void;
  onResetOriginalExcel: () => void;
}

export const ResetOptionsModal: React.FC<ResetOptionsModalProps> = ({
  isOpen,
  onClose,
  onResetAllZero,
  onResetConsumoOnly,
  onResetPricesOnly,
  onResetOriginalExcel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FilePlus className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-black text-white">
              Nueva Comparativa / Poner a Cero
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

        <div className="p-4 sm:p-5 space-y-3">
          <p className="text-xs text-zinc-500 mb-2">
            Elige qué datos deseas poner a cero para comenzar tu siguiente cálculo:
          </p>

          {/* Option 1: Poner TODO a CERO */}
          <button
            type="button"
            onClick={() => {
              onResetAllZero();
              onClose();
            }}
            className="w-full text-left p-4 rounded-2xl border-2 border-red-600 bg-red-50/40 hover:bg-red-50 transition flex items-start gap-3 cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <FilePlus className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-zinc-950">
                  Nueva Comparativa en Blanco (Todo a cero)
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                  Recomendado
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 leading-snug">
                Pone a 0 consumo, potencia y precios de comercializadoras. Mantiene tus impuestos configurados.
              </p>
            </div>
          </button>

          {/* Option 2: Poner a cero solo consumo y potencia */}
          <button
            type="button"
            onClick={() => {
              onResetConsumoOnly();
              onClose();
            }}
            className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                Poner a cero solo Consumo y Potencia
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                Limpia los kWh y kW del cliente anterior, pero <strong>conserva las comercializadoras y sus precios</strong>.
              </p>
            </div>
          </button>

          {/* Option 3: Poner a cero precios de comercializadoras */}
          <button
            type="button"
            onClick={() => {
              onResetPricesOnly();
              onClose();
            }}
            className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                Poner a cero solo Precios de Compañías
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                Pone todos los precios de energía y potencia a 0,000000 para rellenarlos desde cero.
              </p>
            </div>
          </button>

          {/* Option 4: Restablecer valores de ejemplo del Excel de ANSAMA */}
          <button
            type="button"
            onClick={() => {
              onResetOriginalExcel();
              onClose();
            }}
            className="w-full text-left p-3.5 rounded-2xl border border-dashed border-zinc-300 hover:bg-zinc-50 transition flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 mt-0.5">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-800">
                Restablecer datos originales de ANSAMA
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                Restaura las 3 comercializadoras con los precios y consumo del modelo Excel de ANSAMA.
              </p>
            </div>
          </button>
        </div>

        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-200 rounded-xl transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
