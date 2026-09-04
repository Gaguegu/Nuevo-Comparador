import { BillInputs, TaxesConfig, Tariff } from '../types';

export const DEFAULT_BILL_INPUTS: BillInputs = {
  days: 34,
  consumo: {
    p1: 87.00,
    p2: 153.00,
    p3: 142.00,
    p4: 0,
    p5: 0,
    p6: 0,
  },
  potencia: {
    p1: 4.6,
    p2: 4.6,
    p3: 4.6,
    p4: 4.6,
    p5: 4.6,
    p6: 4.6,
  },
};

export const DEFAULT_TAXES: TaxesConfig = {
  impuestoElectricoRate: 5.1127,
  bonoSocialRate: 0.02468800,
  alquilerEquiposRate: 0.02660,
  otros: 0.00,
  ivaRate: 21,
};

export const MAX_TARIFFS = 10;

export const DEFAULT_TARIFFS: Tariff[] = [
  {
    id: 'comercializadora-1',
    name: 'Comercializadora 1',
    badgeColor: '#1d4ed8', // blue
    note: 'Tarifa Fija 24H (Ref: Visalia Fijo)',
    potenciaPrices: {
      p1: 0.098630,
      p2: 0.098630,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
    },
    energiaPrices: {
      p1: 0.095000,
      p2: 0.095000,
      p3: 0.095000,
      p4: 0,
      p5: 0,
      p6: 0,
    },
  },
  {
    id: 'comercializadora-2',
    name: 'Comercializadora 2',
    badgeColor: '#eab308', // gold/yellow
    note: 'Discriminación horaria (Ref: Niba)',
    potenciaPrices: {
      p1: 0.076000,
      p2: 0.007000,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
    },
    energiaPrices: {
      p1: 0.195000,
      p2: 0.116000,
      p3: 0.079000,
      p4: 0,
      p5: 0,
      p6: 0,
    },
  },
  {
    id: 'comercializadora-3',
    name: 'Comercializadora 3',
    badgeColor: '#b91c1c', // red
    note: '3 Periodos clásica (Ref: Visalia 3P)',
    potenciaPrices: {
      p1: 0.075903,
      p2: 0.001987,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
    },
    energiaPrices: {
      p1: 0.225589,
      p2: 0.141011,
      p3: 0.113815,
      p4: 0,
      p5: 0,
      p6: 0,
    },
  },
];

export const PRESET_MARKET_TARIFFS: Omit<Tariff, 'id'>[] = [
  {
    name: 'Endesa One Luz (24h)',
    badgeColor: '#2563eb',
    note: 'Precio fijo 24h sin tramos',
    potenciaPrices: {
      p1: 0.099178,
      p2: 0.024658,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
    },
    energiaPrices: {
      p1: 0.112000,
      p2: 0.112000,
      p3: 0.112000,
      p4: 0,
      p5: 0,
      p6: 0,
    },
  },
  {
    name: 'Iberdrola Plan Online',
    badgeColor: '#059669',
    note: 'Potencia económica y energía fija',
    potenciaPrices: {
      p1: 0.084932,
      p2: 0.010959,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
    },
    energiaPrices: {
      p1: 0.125000,
      p2: 0.125000,
      p3: 0.125000,
      p4: 0,
      p5: 0,
      p6: 0,
    },
  },
  {
    name: 'TotalEnergies A Tu Aire',
    badgeColor: '#dc2626',
    note: 'Discriminación 3 tramos',
    potenciaPrices: {
      p1: 0.082192,
      p2: 0.013699,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
    },
    energiaPrices: {
      p1: 0.185000,
      p2: 0.128000,
      p3: 0.089000,
      p4: 0,
      p5: 0,
      p6: 0,
    },
  },
  {
    name: 'Octopus Energy Relax',
    badgeColor: '#9333ea',
    note: 'Tarifa fija verde',
    potenciaPrices: {
      p1: 0.074000,
      p2: 0.011000,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
    },
    energiaPrices: {
      p1: 0.119000,
      p2: 0.119000,
      p3: 0.119000,
      p4: 0,
      p5: 0,
      p6: 0,
    },
  },
];
