import React, { useState } from 'react';
import { Calendar, Zap, TrendingUp, Copy, Check, Info, Eraser } from 'lucide-react';
import { BillInputs, PeriodValues } from '../../types';
import { formatNumber } from '../../utils/calculator';
import { DecimalPriceInput } from '../DecimalPriceInput';
import { Logo } from '../Logo';

interface ConsumoViewProps {
  inputs: BillInputs;
  onChangeInputs: (newInputs: BillInputs) => void;
}

export const ConsumoView: React.FC<ConsumoViewProps> = ({ inputs, onChangeInputs }) => {
  const [copiedPotencia, setCopiedPotencia] = useState(false);
  const [showP4P6, setShowP4P6] = useState(false);

  const handleResetToZero = () => {
    if (window.confirm('¿Quieres poner a cero todos los consumos (kWh) y potencias (kW) para introducir una nueva factura?')) {
      onChangeInputs({
        days: 30,
        consumo: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
        potencia: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
      });
    }
  };

  const handleDaysChange = (val: number) => {
    onChangeInputs({
      ...inputs,
      days: Math.max(1, isNaN(val) ? 0 : val),
    });
  };

  const handleConsumoChange = (period: keyof PeriodValues, val: number) => {
    onChangeInputs({
      ...inputs,
      consumo: {
        ...inputs.consumo,
        [period]: Math.max(0, isNaN(val) ? 0 : val),
      },
    });
  };

  const handlePotenciaChange = (period: keyof PeriodValues, val: number) => {
    onChangeInputs({
      ...inputs,
      potencia: {
        ...inputs.potencia,
        [period]: Math.max(0, isNaN(val) ? 0 : val),
      },
    });
  };

  const handleApplyP1ToAllPotencias = () => {
    const p1Val = inputs.potencia.p1;
    onChangeInputs({
      ...inputs,
      potencia: {
        p1: p1Val,
        p2: p1Val,
        p3: p1Val,
        p4: p1Val,
        p5: p1Val,
        p6: p1Val,
      },
    });
    setCopiedPotencia(true);
    setTimeout(() => setCopiedPotencia(false), 2000);
  };

  const totalKWh =
    inputs.consumo.p1 +
    inputs.consumo.p2 +
    inputs.consumo.p3 +
    inputs.consumo.p4 +
    inputs.consumo.p5 +
    inputs.consumo.p6;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ANSAMA Red & Black Banner with Logo */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-4 sm:p-5 rounded-3xl shadow-md border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-1.5 bg-white rounded-2xl shadow-sm shrink-0 border border-zinc-200">
            <Logo size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-red-500 tracking-wider">Paso 1</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">• Factura Eléctrica</span>
            </div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
              Datos de Consumo y Potencia
            </h2>
            <p className="text-xs text-zinc-300">
              Introduce los días facturados, kWh consumidos y potencia contratada en kW
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetToZero}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white hover:text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer shadow-sm active:scale-95 shrink-0"
          title="Borrar todos los consumos y potencias de la factura"
        >
          <Eraser className="w-4 h-4" />
          <span>Poner a cero (0 kWh y 0 kW)</span>
        </button>
      </div>

      {/* Days Input Box */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <label htmlFor="dias-input" className="text-base font-black uppercase text-zinc-950 tracking-wider block">
              DÍAS DE FACTURACIÓN
            </label>
            <p className="text-xs text-zinc-500">Normalmente 30 o 31 días (bimestral ~60 días)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <input
            id="dias-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.days === 0 ? '' : inputs.days}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              const v = cleaned === '' ? 0 : parseInt(cleaned, 10);
              handleDaysChange(v);
            }}
            className="w-24 text-center text-2xl font-black text-zinc-950 bg-zinc-50 border-2 border-zinc-300 focus:border-red-600 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-inner"
          />
          <div className="flex items-center gap-1">
            {[30, 31, 34, 60].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDaysChange(d)}
                className={`px-3 py-1.5 text-xs font-black rounded-xl border transition cursor-pointer ${
                  inputs.days === d
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Tables Side-by-Side: Consumo and Potencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table 1: CONSUMO */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200">
          <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  CONSUMO DE ENERGÍA
                </h3>
                <p className="text-[10px] text-zinc-400">Introduce los kWh consumidos</p>
              </div>
            </div>
            <span className="text-xs font-black bg-zinc-800 text-red-400 px-3 py-1 rounded-full border border-zinc-700">
              Total: {formatNumber(totalKWh, 1)} kWh
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-3 bg-zinc-50/50">
            {/* P1 Punta */}
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black text-xs">P1</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">P1 (Punta)</p>
                  <p className="text-[10px] text-zinc-500">Horario más caro</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DecimalPriceInput
                  value={inputs.consumo.p1}
                  placeholder="0,00"
                  onChange={(val) => handleConsumoChange('p1', val)}
                  className="w-28 sm:w-32 text-center font-mono font-bold"
                />
                <span className="text-xs font-bold text-zinc-500 w-8">kWh</span>
              </div>
            </div>

            {/* P2 Llano */}
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-black text-xs">P2</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">P2 (Llano)</p>
                  <p className="text-[10px] text-zinc-500">Horario intermedio</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DecimalPriceInput
                  value={inputs.consumo.p2}
                  placeholder="0,00"
                  onChange={(val) => handleConsumoChange('p2', val)}
                  className="w-28 sm:w-32 text-center font-mono font-bold"
                />
                <span className="text-xs font-bold text-zinc-500 w-8">kWh</span>
              </div>
            </div>

            {/* P3 Valle */}
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-black text-xs">P3</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">P3 (Valle)</p>
                  <p className="text-[10px] text-zinc-500">Noche y fines de semana</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DecimalPriceInput
                  value={inputs.consumo.p3}
                  placeholder="0,00"
                  onChange={(val) => handleConsumoChange('p3', val)}
                  className="w-28 sm:w-32 text-center font-mono font-bold"
                />
                <span className="text-xs font-bold text-zinc-500 w-8">kWh</span>
              </div>
            </div>

            {/* P4, P5, P6 */}
            {showP4P6 ? (
              <>
                {(['p4', 'p5', 'p6'] as const).map((pKey, idx) => (
                  <div key={pKey} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-zinc-200 shadow-2xs">
                    <span className="text-xs font-bold text-zinc-700 uppercase">P{idx + 4} (3.0TD)</span>
                    <div className="flex items-center gap-2">
                      <DecimalPriceInput
                        value={inputs.consumo[pKey]}
                        placeholder="0,00"
                        onChange={(val) => handleConsumoChange(pKey, val)}
                        className="w-28 sm:w-32 text-center font-mono font-bold"
                      />
                      <span className="text-xs font-bold text-zinc-500 w-8">kWh</span>
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            <button
              type="button"
              onClick={() => setShowP4P6(!showP4P6)}
              className="w-full text-center text-xs font-bold text-zinc-600 hover:text-red-600 py-1.5 transition cursor-pointer"
            >
              {showP4P6 ? '▲ Ocultar periodos P4-P6' : '▼ Mostrar P4, P5, P6 (Tarifas 3.0TD Pymes)'}
            </button>
          </div>
        </div>

        {/* Table 2: POTENCIA */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-200">
          <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                <Zap className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  POTENCIA CONTRATADA
                </h3>
                <p className="text-[10px] text-zinc-400">Valores en kW según contrato</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyP1ToAllPotencias}
              className="text-xs font-bold bg-white text-zinc-950 px-2.5 py-1 rounded-xl shadow-xs hover:bg-zinc-100 flex items-center gap-1 transition cursor-pointer active:scale-95"
              title="Copiar el valor de P1 a P2-P6"
            >
              {copiedPotencia ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-700" />}
              <span>{copiedPotencia ? '¡Copiado!' : 'Copiar P1 a todos'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-3 bg-zinc-50/50">
            {/* P1 Punta */}
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black text-xs">P1</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">P1 (Punta)</p>
                  <p className="text-[10px] text-zinc-500">Potencia contratada punta</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DecimalPriceInput
                  value={inputs.potencia.p1}
                  placeholder="4,6"
                  onChange={(val) => handlePotenciaChange('p1', val)}
                  className="w-28 sm:w-32 text-center font-mono font-bold"
                />
                <span className="text-xs font-bold text-zinc-500 w-8">kW</span>
              </div>
            </div>

            {/* P2 Llano / Valle */}
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-black text-xs">P2</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">P2 (Valle)</p>
                  <p className="text-[10px] text-zinc-500">Potencia contratada valle</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DecimalPriceInput
                  value={inputs.potencia.p2}
                  placeholder="4,6"
                  onChange={(val) => handlePotenciaChange('p2', val)}
                  className="w-28 sm:w-32 text-center font-mono font-bold"
                />
                <span className="text-xs font-bold text-zinc-500 w-8">kW</span>
              </div>
            </div>

            {/* P3 */}
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-black text-xs">P3</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">P3 (Valle)</p>
                  <p className="text-[10px] text-zinc-500">Según factura</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DecimalPriceInput
                  value={inputs.potencia.p3}
                  placeholder="4,6"
                  onChange={(val) => handlePotenciaChange('p3', val)}
                  className="w-28 sm:w-32 text-center font-mono font-bold"
                />
                <span className="text-xs font-bold text-zinc-500 w-8">kW</span>
              </div>
            </div>

            {/* P4, P5, P6 */}
            {showP4P6 ? (
              <>
                {(['p4', 'p5', 'p6'] as const).map((pKey, idx) => (
                  <div key={pKey} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-zinc-200 shadow-2xs">
                    <span className="text-xs font-bold text-zinc-700 uppercase">P{idx + 4} Potencia</span>
                    <div className="flex items-center gap-2">
                      <DecimalPriceInput
                        value={inputs.potencia[pKey]}
                        placeholder="4,6"
                        onChange={(val) => handlePotenciaChange(pKey, val)}
                        className="w-28 sm:w-32 text-center font-mono font-bold"
                      />
                      <span className="text-xs font-bold text-zinc-500 w-8">kW</span>
                    </div>
                  </div>
                ))}
              </>
            ) : null}

            <div className="pt-2 flex items-center justify-center">
              <span className="text-[11px] text-zinc-500 font-medium">
                En tarifas domésticas 2.0TD habitualmente P1 y P2 tienen el mismo valor (ej. 4,6 kW).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Info Tip */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-700 leading-relaxed">
          <strong>¿Dónde encuentro estos datos?</strong> En tu factura eléctrica en la sección
          <em>"Datos del contrato"</em> verás la potencia contratada (en kW) y los días del periodo, y en
          <em>"Desglose del importe"</em> o <em>"Información de consumo"</em> verás los kWh consumidos en P1 (Punta), P2 (Llano) y P3 (Valle).
        </div>
      </div>
    </div>
  );
};
