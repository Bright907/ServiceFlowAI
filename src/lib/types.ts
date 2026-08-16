export type Trade = 'plumbing' | 'hvac' | 'roofing';

export interface PricingConfig {
  base_fee: number;
  rate_per_unit: number;
  emergency_multiplier: number;
}

export interface Contractor {
  id: string;
  user_id: string;
  company_name: string;
  trade: Trade;
  pricing: PricingConfig;
  created_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'closed';

export interface Lead {
  id: string;
  contractor_id: string;
  homeowner_name: string;
  email: string;
  phone: string;
  address: string;
  service_type: string;
  quantity: number;
  is_emergency: boolean;
  estimated_cost: number;
  status: LeadStatus;
  created_at: string;
}
