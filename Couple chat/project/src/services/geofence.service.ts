import { supabase } from './supabase';
import { calculateDistance } from '../utils/location';
import { sendNotification } from '../utils/notifications';
import type { SafeZone, GeofenceEvent } from '../types/geofence';

export class GeofenceService {
  private readonly MONITORING_INTERVAL = 30000; // 30 seconds
  private monitoringInterval?: NodeJS.Timer;

  async addSafeZone(userId: string, safeZone: Omit<SafeZone, 'id'>) {
    const { data, error } = await supabase
      .from('safe_zones')
      .insert({
        user_id: userId,
        name: safeZone.name,
        latitude: safeZone.latitude,
        longitude: safeZone.longitude,
        radius: safeZone.radius
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async startMonitoring(userId: string) {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(
      () => this.checkGeofences(userId),
      this.MONITORING_INTERVAL
    );
  }

  async stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  private async checkGeofences(userId: string) {
    try {
      const { data: safeZones } = await supabase
        .from('safe_zones')
        .select('*')
        .eq('user_id', userId);

      if (!safeZones) return;

      const position = await navigator.geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      for (const zone of safeZones) {
        const distance = calculateDistance(
          latitude,
          longitude,
          zone.latitude,
          zone.longitude
        );

        const isInside = distance <= zone.radius;
        await this.handleGeofenceTransition(userId, zone, isInside);
      }
    } catch (error) {
      console.error('Geofence monitoring error:', error);
    }
  }

  private async handleGeofenceTransition(
    userId: string,
    zone: SafeZone,
    isInside: boolean
  ) {
    const { data: lastEvent } = await supabase
      .from('geofence_events')
      .select('*')
      .eq('safe_zone_id', zone.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Only create event if state changed
    if (!lastEvent || lastEvent.is_inside !== isInside) {
      const event: Omit<GeofenceEvent, 'id'> = {
        user_id: userId,
        safe_zone_id: zone.id,
        is_inside: isInside,
        created_at: new Date().toISOString()
      };

      await supabase.from('geofence_events').insert(event);

      // Send notification
      await sendNotification({
        title: `Safe Zone: ${zone.name}`,
        body: isInside ? 'Entered safe zone' : 'Left safe zone',
        priority: 'high'
      });
    }
  }
}