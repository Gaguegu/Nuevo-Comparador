import { BillInputs, TaxesConfig, Tariff, TariffCalculationResult, ComparisonSummary } from '../types';

/**
 * Standard financial round to 2 decimal places matching Excel ROUND(x, 2)
 */
export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates the complete bill breakdown for a single tariff,
 * following the exact mathematical formulas of ANSAMA's Excel model.
 */
export function calculateTariffBill(
  tariff: Tariff,
  inputs: BillInputs,
  taxes: TaxesConfig
): TariffCalculationResult {
  const days = Math.max(0, inputs.days);

  // Potencia per period: dias * kW * precio (€/kW/dia)
  const p1Pot = round2(days * (inputs.potencia.p1 || 0) * (tariff.potenciaPrices.p1 || 0));
  const p2Pot = round2(days * (inputs.potencia.p2 || 0) * (tariff.potenciaPrices.p2 || 0));
  const p3Pot = round2(days * (inputs.potencia.p3 || 0) * (tariff.potenciaPrices.p3 || 0));
  const p4Pot = round2(days * (inputs.potencia.p4 || 0) * (tariff.potenciaPrices.p4 || 0));
  const p5Pot = round2(days * (inputs.potencia.p5 || 0) * (tariff.potenciaPrices.p5 || 0));
  const p6Pot = round2(days * (inputs.potencia.p6 || 0) * (tariff.potenciaPrices.p6 || 0));

  const totalPotencia = round2(p1Pot + p2Pot + p3Pot + p4Pot + p5Pot + p6Pot);

  // Energia per period: kWh * precio (€/kWh)
  const p1Ene = round2((inputs.consumo.p1 || 0) * (tariff.energiaPrices.p1 || 0));
  const p2Ene = round2((inputs.consumo.p2 || 0) * (tariff.energiaPrices.p2 || 0));
  const p3Ene = round2((inputs.consumo.p3 || 0) * (tariff.energiaPrices.p3 || 0));
  const p4Ene = round2((inputs.consumo.p4 || 0) * (tariff.energiaPrices.p4 || 0));
  const p5Ene = round2((inputs.consumo.p5 || 0) * (tariff.energiaPrices.p5 || 0));
  const p6Ene = round2((inputs.consumo.p6 || 0) * (tariff.energiaPrices.p6 || 0));

  const totalEnergia = round2(p1Ene + p2Ene + p3Ene + p4Ene + p5Ene + p6Ene);

  // Fixed taxes per day
  const bonoSocial = round2(days * (taxes.bonoSocialRate || 0));
  const alquilerEquipos = round2(days * (taxes.alquilerEquiposRate || 0));
  const otros = round2(taxes.otros || 0);

  // Base for Impuesto Eléctrico as defined in Excel (Potencia + Energía + Bono Social)
  const baseImpuestoElectrico = round2(totalPotencia + totalEnergia + bonoSocial);

  // Impuesto Eléctrico (Base * rate%)
  const impuestoElectrico = round2(baseImpuestoElectrico * ((taxes.impuestoElectricoRate || 0) / 100));

  // Subtotal (Base + IEE + Alquiler + Otros)
  const subtotal = round2(baseImpuestoElectrico + impuestoElectrico + alquilerEquipos + otros);

  // IVA (Subtotal * ivaRate%)
  const iva = round2(subtotal * ((taxes.ivaRate || 0) / 100));

  // Total Factura
  const totalFactura = round2(subtotal + iva);

  return {
    tariffId: tariff.id,
    tariffName: tariff.name,
    potenciaImports: {
      p1: p1Pot,
      p2: p2Pot,
      p3: p3Pot,
      p4: p4Pot,
      p5: p5Pot,
      p6: p6Pot,
    },
    totalPotencia,
    energiaImports: {
      p1: p1Ene,
      p2: p2Ene,
      p3: p3Ene,
      p4: p4Ene,
      p5: p5Ene,
      p6: p6Ene,
    },
    totalEnergia,
    bonoSocial,
    alquilerEquipos,
    otros,
    baseImpuestoElectrico,
    impuestoElectrico,
    subtotal,
    iva,
    totalFactura,
  };
}

/**
 * Compares all active tariffs and determines rankings, savings, and best options.
 */
export function compareTariffs(
  tariffs: Tariff[],
  inputs: BillInputs,
  taxes: TaxesConfig
): ComparisonSummary {
  const results = tariffs.map((t) => calculateTariffBill(t, inputs, taxes));

  // Filter tariffs that have non-zero or active pricing
  const activeResults = results.filter((r) => r.totalFactura > 0);

  if (activeResults.length === 0) {
    return {
      results,
      cheapestTariffId: '',
      mostExpensiveTariffId: '',
      maxSavingsVsWorst: 0,
      annualMaxSavings: 0,
    };
  }

  // Find lowest total
  const sorted = [...activeResults].sort((a, b) => a.totalFactura - b.totalFactura);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  const maxSavingsVsWorst = round2(mostExpensive.totalFactura - cheapest.totalFactura);
  const days = Math.max(1, inputs.days);
  const annualMaxSavings = round2((maxSavingsVsWorst / days) * 365);

  return {
    results,
    cheapestTariffId: cheapest.tariffId,
    mostExpensiveTariffId: mostExpensive.tariffId,
    maxSavingsVsWorst,
    annualMaxSavings,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(amount: number, maxDecimals: number = 6): string {
  // Protección total: si por error llega un número menor a 2, lo fijamos en 2
  const finalMax = maxDecimals < 2 ? 2 : maxDecimals;

  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: finalMax,
  }).format(amount);
}

   


