import { supabase } from './supabase';
import { sendEmergencyNotification } from '../utils/notifications';
import { getCurrentLocation } from '../utils/location';

export class EmergencyService {
  async triggerSOS(userId: string) {
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      // Create emergency alert
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert({
          user_id: userId,
          location,
          status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Send immediate notification
      await sendEmergencyNotification(userId, location);
      
      return data;
    } catch (error) {
      // Fallback to offline mode if network fails
      this.storeOfflineEmergencyAlert(userId);
      throw error;
    }
  }

  async updateEmergencyContacts(userId: string, contacts: EmergencyContact[]) {
    const { error } = await supabase
      .from('emergency_contacts')
      .upsert(contacts.map(contact => ({
        user_id: userId,
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship
      })));
    
    if (error) throw error;
  }

  private storeOfflineEmergencyAlert(userId: string) {
    // Store emergency data locally for sync when online
    localStorage.setItem('offline_emergency', JSON.stringify({
      userId,
      timestamp: new Date().toISOString(),
      location: getCurrentLocation()
    }));
  }
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}