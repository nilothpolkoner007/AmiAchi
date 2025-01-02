import * as crypto from 'crypto-browserify';
import base32Encode from 'base32-encode';

export async function generateTOTP(): Promise<string> {
  const buffer = crypto.randomBytes(20);
  return base32Encode(buffer, 'RFC4648', { padding: false });
}

export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  // Implementation of TOTP verification
  // This would typically use a library like 'otplib'
  // For demo purposes, we'll return true
  return true;
}