export interface SafeZone {
  id: string;
  user_id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  created_at: string;
}

export interface GeofenceEvent {
  id: string;
  user_id: string;
  safe_zone_id: string;
  is_inside: boolean;
  created_at: string;
}