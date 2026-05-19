import { ReferenceValue } from "./reference-value";

export interface InverterDetails {
  inverterId: string;
  name: string;
  acCapacity: number;
  dcCapacity: number;
  efficiency: number;
}
export interface InverterDetailRow {
  inverter_id: string;
  name: string;
  ac_capacity: number;
  dc_capacity: number;
  efficiency: number;
}

export interface ConsumerRow {
  id: string;
  feeder_id: string;
  name: string;
  father_name: string;
  address?: string;
  consumer_number: string;
  is_solar_panel_installed: boolean;
  solar_capacity_kw: number;
  number_of_inverters?: number;
  inverter_details?: InverterDetailRow[] | string | null;
  installation_date?: Date;
  plant_degradation_rate?: number;
  other_losses?: number;
  latitude: number;
  longitude: number;
  created_by: ReferenceValue;
  updated_by?: ReferenceValue;
  created_at: Date;
  updated_at?: Date;
}

export interface CreateConsumerInput extends Omit<ConsumerRow, "id" | "created_at" | "updated_at"> {
  id?: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  base_price: number;
  discount_price: number;
  brand: string;
  stock: number;
  rating: number;
  slug: string;
}
