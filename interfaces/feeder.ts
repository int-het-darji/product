import { ReferenceValue } from "./reference-value";

export interface FeederRow {
  id: string;
  name: string;
  number_of_consumers: number;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  created_by: ReferenceValue;
  updated_by?: ReferenceValue;
  created_at: Date;
  updated_at?: Date;
}

export interface CreateFeederInput extends Omit<FeederRow, "id" | "created_at" | "updated_at"> {
  id?: string;
} 