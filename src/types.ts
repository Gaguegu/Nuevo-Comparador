export interface PeriodValues {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  p6: number;
}

export interface TaxesConfig {
  impuestoElectricoRate: number; // percentage, e.g. 5.1127%
  bonoSocialRate: number;        // €/day, e.g. 0.02468800
  alquilerEquiposRate: number;   // €/day, e.g. 0.02660
  otros: number;                 // € fixed, e.g. 0.00
  ivaRate: number;               // percentage, e.g. 21%
}

export interface Tariff {
  id: string;
  name: string;
  badgeColor?: string;
  potenciaPrices: PeriodValues;  // in €/kW dia
  energiaPrices: PeriodValues;   // in €/kW h
  note?: string;
}

export interface BillInputs {
  days: number;
  consumo: PeriodValues;         // in kWh
  potencia: PeriodValues;        // in kW
}

export interface TariffCalculationResult {
  tariffId: string;
  tariffName: string;
  potenciaImports: PeriodValues; // in €
  totalPotencia: number;         // in €
  energiaImports: PeriodValues;  // in €
  totalEnergia: number;          // in €
  bonoSocial: number;            // in €
  alquilerEquipos: number;       // in €
  otros: number;                 // in €
  baseImpuestoElectrico: number; // Total Potencia + Total Energía + Bono Social (Excel Header number)
  impuestoElectrico: number;     // Base IEE * impuestoElectricoRate
  subtotal: number;              // Base IEE + Impuesto Eléctrico + Alquiler Equipos + Otros
  iva: number;                   // Subtotal * ivaRate
  totalFactura: number;          // Subtotal + IVA
}

export interface ComparisonSummary {
  results: TariffCalculationResult[];
  cheapestTariffId: string;
  mostExpensiveTariffId: string;
  maxSavingsVsWorst: number;
  annualMaxSavings: number;
}

export type ActiveTab = 'inicio' | 'consumo' | 'impuestos' | 'precio-energia' | 'resultados';

export interface SavedComparison {
  id: string;
  clientName: string;
  notes?: string;
  date: string;
  timestamp: number;
  inputs: BillInputs;
  taxes: TaxesConfig;
  tariffs: Tariff[];
  cheapestTariffName: string;
  cheapestTotal: number;
  savingsVsWorst: number;
  annualSavings: number;
  totalKwh: number;
  days: number;
}
