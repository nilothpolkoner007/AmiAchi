import { supabase } from './supabase';

export class CoupleService {
  async connectUsers(userId1, userId2) {
    const { data, error } = await supabase
      .from('couples')
      .insert({
        user1_id: userId1,
        user2_id: userId2,
        connected_at: new Date().toISOString(),
        status: 'active'
      });

    if (error) throw error;
    return data;
  }

  async getPartner(userId) {
    const { data, error } = await supabase
      .from('couples')
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single();

    if (error) throw error;
    return data.user1_id === userId ? data.user2_id : data.user1_id;
  }
}