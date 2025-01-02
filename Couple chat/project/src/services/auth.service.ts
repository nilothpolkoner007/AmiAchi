import { supabase } from './supabase';
import { generateTOTP, verifyTOTP } from '../utils/totp';
import { encryptData } from '../utils/encryption';

export class AuthService {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          two_factor_enabled: true
        }
      }
    });
    
    if (error) throw error;
    
    // Generate TOTP secret for 2FA
    const totpSecret = await generateTOTP();
    await this.storeTOTPSecret(data.user.id, totpSecret);
    
    return {
      user: data.user,
      totpSecret
    };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Check if 2FA is required
    if (data.user?.user_metadata?.two_factor_enabled) {
      return {
        user: data.user,
        requiresTwoFactor: true
      };
    }
    
    return { user: data.user };
  }

  async verifyTwoFactor(userId: string, code: string) {
    const secret = await this.getTOTPSecret(userId);
    const isValid = await verifyTOTP(secret, code);
    
    if (!isValid) {
      throw new Error('Invalid 2FA code');
    }
    
    return true;
  }

  async generateBackupCodes(userId: string) {
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
    
    const encryptedCodes = await encryptData(codes.join(','));
    await this.storeBackupCodes(userId, encryptedCodes);
    
    return codes;
  }

  private async storeTOTPSecret(userId: string, secret: string) {
    const { error } = await supabase
      .from('user_security')
      .insert({
        user_id: userId,
        totp_secret: await encryptData(secret)
      });
    
    if (error) throw error;
  }

  private async getTOTPSecret(userId: string) {
    const { data, error } = await supabase
      .from('user_security')
      .select('totp_secret')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data.totp_secret;
  }

  private async storeBackupCodes(userId: string, encryptedCodes: string) {
    const { error } = await supabase
      .from('user_security')
      .update({ backup_codes: encryptedCodes })
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}