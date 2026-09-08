import React, { useState } from 'react';
import { X, FileText, Download, BookOpen, Zap, Calculator, HelpCircle, CheckCircle2, Layers } from 'lucide-react';
import { Logo } from './Logo';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose, pdfUrl }) => {
  const [activeTab, setActiveTab] = useState<'guia' | 'visor'>('guia');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0a0a0c] text-white px-4 sm:px-6 py-3.5 border-b-2 border-red-600 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-lg shadow-sm">
              <Logo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-red-500 tracking-wider">ANSAMA</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded font-semibold border border-zinc-700">
                  Manual de Usuario
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Guía de Funcionamiento y Comparativa
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF button */}
            <a
              href={pdfUrl}
              download="manual-usuario-ansama.pdf"
              className="hidden sm:flex items-center gap-1.5 text-xs text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-xl font-bold transition active:scale-95 shadow-sm"
              title="Descargar archivo PDF en tu equipo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </a>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="bg-zinc-100 border-b border-zinc-200 px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('guia')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'guia'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guía Rápida en Pantalla</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('visor')}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'visor'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Visor del Documento PDF</span>
            </button>
          </div>

          <a
            href={pdfUrl}
            download="manual-usuario-ansama.pdf"
            className="sm:hidden flex items-center gap-1 text-[11px] text-red-600 font-bold hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar</span>
          </a>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50">
          {activeTab === 'visor' ? (
            <div className="w-full h-[68vh] rounded-xl overflow-hidden border border-zinc-300 bg-zinc-900 shadow-inner flex flex-col">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                title="Manual de Usuario ANSAMA PDF"
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 text-zinc-800">
              {/* Resumen */}
              <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-2 text-red-600 font-black text-sm mb-2 uppercase tracking-wide">
                  <Zap className="w-4 h-4" />
                  <span>Propósito del Comparador Eléctrico</span>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  El <strong>Comparador de Tarifas ANSAMA</strong> permite contrastar la factura actual de cualquier cliente (Endesa, Iberdrola, Naturgy, TotalEnergies, etc.) frente a las tarifas de <strong>ANSAMA</strong>. Calcula con exactitud matemática el término de potencia, consumo de energía, alquiler de contador, impuesto eléctrico (IEE) e IVA, mostrando el ahorro neto en euros (€) y su proyección anual.
                </p>
              </div>

              {/* Paso 1 y Paso 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paso 1 */}
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    <span>Datos de Factura Actual</span>
                  </div>
                  <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-5">
                    <li>
                      <strong>Días del periodo:</strong> Selecciona la fecha de inicio y fin, o escribe directamente el número de días facturados.
                    </li>
                    <li>
                      <strong>Potencias Contratadas (kW):</strong> Introduce los kW contratados en Punta (P1) y Valle (P2).
                    </li>
                    <li>
                      <strong>Consumos (kWh):</strong> Anota los kWh consumidos en Punta (P1), Llano (P2) y Valle (P3). La app calcula el total acumulado en tiempo real.
                    </li>
                  </ul>
                </div>

                {/* Paso 2 */}
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <span>Precios de la Factura Actual</span>
                  </div>
                  <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-5">
                    <li>
                      <strong>Precios de Potencia (€/kW/día):</strong> Introduce el precio de P1 y P2 que cobra la comercializadora actual (hasta 6 decimales).
                    </li>
                    <li>
                      <strong>Precios de Energía (€/kWh):</strong> Introduce el coste por kWh en P1, P2 y P3. Si tiene precio fijo 24h, pon el mismo valor en los 3 tramos.
                    </li>
                    <li>
                      <strong>Alquiler de Contador e Impuestos:</strong> Introduce el coste del contador (aprox. 0,81 €/mes) y el impuesto eléctrico oficial (5,11% o 3,8%).
                    </li>
                  </ul>
                </div>
              </div>

              {/* Paso 3 y 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paso 3 */}
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
                      3
                    </span>
                    <span>Tarifas ANSAMA y Comercializadoras</span>
                  </div>
                  <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-5">
                    <li>
                      <strong>ANSAMA Fija 24h:</strong> Un único precio de energía para todo el día, sin sorpresas ni horarios.
                    </li>
                    <li>
                      <strong>ANSAMA 3 Periodos:</strong> Precios diferenciados en Punta, Llano y Valle para clientes con hábitos eficientes.
                    </li>
                    <li>
                      <strong>ANSAMA Indexada / Solar:</strong> Tarifas indexadas al mercado mayorista OMIE y opciones con batería virtual para autoconsumo.
                    </li>
                  </ul>
                </div>

                {/* Paso 4 */}
                <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-2">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
                      4
                    </span>
                    <span>Resultados, Mejor Opción y Ahorro</span>
                  </div>
                  <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-5">
                    <li>
                      <strong>Tarjeta "Mejor Opción":</strong> La app resalta con un trofeo la tarifa más económica y calcula el ahorro neto exacto.
                    </li>
                    <li>
                      <strong>Ahorro Anual Estimado:</strong> Proyecta la diferencia multiplicando por el ratio anual (365 días / días de la factura).
                    </li>
                    <li>
                      <strong>Desglose Detallado:</strong> Pulsa en "Ver Desglose" para ver el detalle de potencia, energía, IEE, alquiler e IVA.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Fórmulas Oficiales */}
              <div className="bg-zinc-900 text-zinc-100 p-5 rounded-xl border border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-3">
                  <Calculator className="w-4 h-4" />
                  <span>Fórmulas Matemáticas Oficiales de Facturación</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700">
                    <span className="text-red-400 font-bold block mb-1">Término de Potencia (€):</span>
                    <code>(kW P1 × Días × Precio P1) + (kW P2 × Días × Precio P2)</code>
                  </div>
                  <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700">
                    <span className="text-red-400 font-bold block mb-1">Término de Energía (€):</span>
                    <code>(kWh P1 × P1) + (kWh P2 × P2) + (kWh P3 × P3)</code>
                  </div>
                  <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700">
                    <span className="text-red-400 font-bold block mb-1">Impuesto Eléctrico (IEE):</span>
                    <code>(Potencia + Energía) × % Impuesto Eléctrico</code>
                  </div>
                  <div className="bg-zinc-800/80 p-3 rounded-lg border border-zinc-700">
                    <span className="text-red-400 font-bold block mb-1">Total Factura (€):</span>
                    <code>(Base Imponible + IEE + Alquiler) × (1 + % IVA)</code>
                  </div>
                </div>
              </div>

              {/* Funcionalidades Clave */}
              <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-3">
                  <Layers className="w-4 h-4 text-red-600" />
                  <span>Funcionalidades Adicionales</span>
                </div>
                <div className="space-y-3 text-xs text-zinc-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Historial y Guardado:</strong> Guarda comparativas con el nombre del cliente. Quedan almacenadas de forma segura en tu navegador y puedes recuperarlas con un solo clic.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Nueva / Poner a Cero:</strong> Limpia todos los datos con un cuadro de confirmación para atender a un nuevo cliente sin mezclar facturas anteriores.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Simulador Móvil ("Ver Móvil"):</strong> Permite ver en pantalla cómo visualiza y maneja la aplicación un cliente desde su smartphone.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>App Móvil (PWA) Offline:</strong> Puedes instalar la aplicación en Android o iPhone y utilizarla incluso sin conexión a internet durante visitas comerciales.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-zinc-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span>Soporte técnico: ANSAMA Energía • ansama.es</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
