import { Droplets, Wind, Home, type LucideIcon } from 'lucide-react';
import type { Trade, PricingConfig } from '@/lib/types';

export interface TradeConfig {
  label: string;
  tagline: string;
  icon: LucideIcon;
  services: string[];
  quantityLabel: string;
  quantityUnit: string;
  quantityDefault: number;
  quantityMin: number;
  quantityMax: number;
  rateLabel: string;
}

export const TRADES: Record<Trade, TradeConfig> = {
  plumbing: {
    label: 'Plumbing',
    tagline: 'Leaks, drains, water heaters & more',
    icon: Droplets,
    services: [
      'Leak Repair',
      'Drain Cleaning',
      'Water Heater Installation',
      'Fixture Replacement',
      'Pipe Repair',
    ],
    quantityLabel: 'Number of Fixtures',
    quantityUnit: 'fixture',
    quantityDefault: 1,
    quantityMin: 1,
    quantityMax: 20,
    rateLabel: 'Rate per Fixture',
  },
  hvac: {
    label: 'HVAC',
    tagline: 'Heating, cooling & air quality systems',
    icon: Wind,
    services: [
      'AC Repair',
      'Furnace Installation',
      'Duct Cleaning',
      'System Replacement',
      'Thermostat Install',
    ],
    quantityLabel: 'System Size (Tons)',
    quantityUnit: 'ton',
    quantityDefault: 2,
    quantityMin: 1,
    quantityMax: 10,
    rateLabel: 'Rate per Ton',
  },
  roofing: {
    label: 'Roofing',
    tagline: 'Repairs, replacements & inspections',
    icon: Home,
    services: [
      'Roof Repair',
      'Full Replacement',
      'Roof Inspection',
      'Gutter Installation',
      'Storm Damage Repair',
    ],
    quantityLabel: 'Roof Size (Squares)',
    quantityUnit: 'square',
    quantityDefault: 20,
    quantityMin: 5,
    quantityMax: 100,
    rateLabel: 'Rate per Square',
  },
};

export const DEFAULT_PRICING: PricingConfig = {
  base_fee: 89,
  rate_per_unit: 45,
  emergency_multiplier: 1.5,
};

export function calculateEstimate(
  pricing: PricingConfig,
  quantity: number,
  isEmergency: boolean
): number {
  const subtotal = pricing.base_fee + pricing.rate_per_unit * quantity;
  const total = isEmergency ? subtotal * pricing.emergency_multiplier : subtotal;
  return Math.round(total);
}
