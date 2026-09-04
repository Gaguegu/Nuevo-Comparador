import React from 'react';
import { ShieldCheck, RotateCcw, Info, Calculator } from 'lucide-react';
import { TaxesConfig } from '../../types';
import { DEFAULT_TAXES } from '../../data/defaultData';
import { formatCurrency } from '../../utils/calculator';
import { DecimalPriceInput } from '../DecimalPriceInput';
import { Logo } from '../Logo';

interface ImpuestosViewProps {
  taxes: TaxesConfig;
  onChangeTaxes: (newTaxes: TaxesConfig) => void;
  days: number;
  tariffsCount?: number;
}

export const ImpuestosView: React.FC<ImpuestosViewProps> = ({
  taxes,
  onChangeTaxes,
  days,
  tariffsCount = 3,
}) => {
  const handleRateChange = (field: keyof TaxesConfig, val: number) => {
    onChangeTaxes({
      ...taxes,
      [field]: isNaN(val) ? 0 : val,
    });
  };

  const handleResetTaxes = () => {
    onChangeTaxes(DEFAULT_TAXES);
  };

  const bonoSocialTotal = days * taxes.bonoSocialRate;
  const alquilerEquiposTotal = days * taxes.alquilerEquiposRate;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header Banner with ANSAMA Logo */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-4 sm:p-5 rounded-3xl shadow-md border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-1.5 bg-white rounded-2xl shadow-sm shrink-0 border border-zinc-200">
            <Logo size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-red-500 tracking-wider">Paso 2</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">• Normativa Fiscal</span>
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
              Impuestos y Conceptos Regulados
            </h2>
            <p className="text-xs text-zinc-300">
              Parámetros oficiales aplicados por ley a todas las ofertas
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetTaxes}
          className="px-4 py-2 text-xs font-black text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 border border-zinc-700"
          title="Restablecer a valores legales por defecto del Excel"
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-400" />
          <span>Restablecer oficiales</span>
        </button>
      </div>

      {/* Unified Application Status Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-950 text-sm flex items-center gap-2">
              <span>Aplicado a todas las comercializadoras ({tariffsCount})</span>
              <span className="bg-red-50 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-red-200">
                Activo
              </span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Cualquier cambio se sincroniza en tiempo real en la comparativa de todas las compañías.
            </p>
          </div>
        </div>
      </div>

      {/* Main Taxes Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200">
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex items-center justify-between text-white">
          <h3 className="font-black uppercase tracking-wide text-white text-sm sm:text-base flex items-center gap-2">
            <Calculator className="w-4 h-4 text-red-500" />
            <span>Tasas Reguladas del Sistema Eléctrico</span>
          </h3>
          <span className="text-xs font-black bg-zinc-800 text-red-400 px-3 py-1 rounded-full border border-zinc-700">
            Base: {days} días
          </span>
        </div>

        <div className="divide-y divide-zinc-100">
          {/* 1. IMPUESTO ELECTRICO */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 transition">
            <div>
              <div className="font-extrabold uppercase text-xs sm:text-sm text-zinc-900">
                IMPUESTO ELÉCTRICO (IEE)
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Porcentaje regulado sobre la suma de potencia, energía y bono social.
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <DecimalPriceInput
                value={taxes.impuestoElectricoRate}
                placeholder="5,1127"
                onChange={(val) => handleRateChange('impuestoElectricoRate', val)}
                className="w-36 text-center font-mono font-bold"
              />
              <span className="text-xs font-black text-zinc-700 w-12 text-center">%</span>
            </div>
          </div>

          {/* 2. BONO SOCIAL */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 transition">
            <div>
              <div className="font-extrabold uppercase text-xs sm:text-sm text-zinc-900 flex items-center gap-2">
                <span>FINANCIACIÓN BONO SOCIAL</span>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  {formatCurrency(bonoSocialTotal)} ({days} días)
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Precio regulado por día (8 decimales: 0,02468800 €/día).
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <DecimalPriceInput
                value={taxes.bonoSocialRate}
                placeholder="0,02468800"
                onChange={(val) => handleRateChange('bonoSocialRate', val)}
                className="w-40 text-center font-mono font-bold"
              />
              <span className="text-xs font-black text-zinc-700 w-12 text-center">€/día</span>
            </div>
          </div>

          {/* 3. ALQUILER EQUIPOS */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 transition">
            <div>
              <div className="font-extrabold uppercase text-xs sm:text-sm text-zinc-900 flex items-center gap-2">
                <span>ALQUILER EQUIPOS DE MEDIDA</span>
                <span className="text-[11px] font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                  {formatCurrency(alquilerEquiposTotal)} ({days} días)
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Alquiler del contador a la distribuidora (ej: 0,02660 €/día).
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <DecimalPriceInput
                value={taxes.alquilerEquiposRate}
                placeholder="0,02660"
                onChange={(val) => handleRateChange('alquilerEquiposRate', val)}
                className="w-36 text-center font-mono font-bold"
              />
              <span className="text-xs font-black text-zinc-700 w-12 text-center">€/día</span>
            </div>
          </div>

          {/* 4. OTROS */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 transition">
            <div>
              <div className="font-extrabold uppercase text-xs sm:text-sm text-zinc-900">
                OTROS CONCEPTOS FIJOS
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Servicios opcionales adicionales (mantenimiento, seguros, etc.).
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <DecimalPriceInput
                value={taxes.otros}
                placeholder="0,00"
                onChange={(val) => handleRateChange('otros', val)}
                className="w-36 text-center font-mono font-bold"
              />
              <span className="text-xs font-black text-zinc-700 w-12 text-center">€</span>
            </div>
          </div>

          {/* 5. IVA */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 transition">
            <div>
              <div className="font-extrabold uppercase text-xs sm:text-sm text-zinc-900">
                I. V. A. (IMPUESTO SOBRE EL VALOR AÑADIDO)
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Tipo general aplicable al total de la factura eléctrica (21,0%).
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <DecimalPriceInput
                value={taxes.ivaRate}
                placeholder="21,0"
                onChange={(val) => handleRateChange('ivaRate', val)}
                className="w-36 text-center font-mono font-bold"
              />
              <span className="text-xs font-black text-zinc-700 w-12 text-center">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-zinc-600 shadow-2xs">
        <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <p>
          Estos importes y porcentajes son idénticos para todas las comercializadoras del mercado español, ya que corresponden a peajes, cargos y obligaciones fiscales reguladas por el Gobierno de España y la CNMC.
        </p>
      </div>
    </div>
  );
};
