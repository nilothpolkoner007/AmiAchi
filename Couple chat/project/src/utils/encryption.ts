import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-fallback-key';
const ALGORITHM = 'aes-256-gcm';

export async function encryptData(data: string): Promise<string> {
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(64);
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  const result = Buffer.concat([salt, iv, authTag, encrypted]);
  return result.toString('base64');
}

export async function decryptData(encryptedData: string): Promise<string> {
  const data = Buffer.from(encryptedData, 'base64');
  
  const salt = data.slice(0, 64);
  const iv = data.slice(64, 80);
  const authTag = data.slice(80, 96);
  const encrypted = data.slice(96);
  
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
  
  return decrypted.toString('utf8');
}