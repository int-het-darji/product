export interface ConsumerGenerationRow {
  consumer_id: string;
  inverter_id: string;
  inverter_dc_capacity?: number;
  generation: number;
  timestamp: Date;
  ghi?: number;
  dhi?: number;
  dni?: number;
  elevation_angle?: number;
  clouds?: number;
  temperature?: number;
  wind_speed?: number;
  relative_humidity?: number;
  precipitation?: number;
  season?: string;
  created_at: Date;
}

export interface CreateConsumerGenerationInput extends Omit<ConsumerGenerationRow, "created_at"> {
  id?: string;
}