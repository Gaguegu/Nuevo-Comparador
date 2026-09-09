import React from 'react';
import { RefreshCw, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface UpdateNotificationProps {
  hasUpdate: boolean;
  isDismissed: boolean;
  statusMessage: string | null;
  isChecking: boolean;
  onApplyUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  hasUpdate,
  isDismissed,
  statusMessage,
  isChecking,
  onApplyUpdate,
  onDismiss,
}) => {
  // Scenario 1: There is an update and it has not been dismissed
  if (hasUpdate && !isDismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] bg-[#0f0f13] text-white p-4 rounded-2xl shadow-2xl border-2 border-red-500/80 backdrop-blur-md animate-bounce-subtle">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-black text-white tracking-tight">
                ¡Nueva actualización disponible!
              </h4>
              <button
                type="button"
                onClick={onDismiss}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition hover:bg-zinc-800"
                title="Cerrar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Hay nuevas mejoras y cambios en el Comparador de Tarifas ANSAMA.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onApplyUpdate}
                disabled={isChecking}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black py-2 px-3 rounded-xl transition shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Actualizando...' : 'Actualizar ahora'}</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-2 font-medium transition cursor-pointer"
              >
                Más tarde
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scenario 2: User manually checked and we have a status toast (e.g. "Tu aplicación está al día")
  if (statusMessage && !hasUpdate) {
    const isUpToDate = statusMessage.toLowerCase().includes('al día');
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#121217] text-white px-4 py-2.5 rounded-xl shadow-xl border border-zinc-700 flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-fade-in">
        {isUpToDate ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <RefreshCw className="w-4 h-4 text-red-400 animate-spin shrink-0" />
        )}
        <span className="text-zinc-200">{statusMessage}</span>
      </div>
    );
  }

  return null;
};
