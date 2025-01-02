import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Camera } from '@nativescript/camera';

export class QRCodeService {
  async generateQRCode(userId) {
    const data = {
      type: 'couple-connect',
      userId,
      timestamp: Date.now()
    };
    
    return await QRCode.toDataURL(JSON.stringify(data));
  }

  async scanQRCode() {
    const image = await Camera.requestPermissions();
    if (!image) {
      throw new Error('Camera permission denied');
    }

    const imageAsset = await Camera.takePicture();
    const imageData = imageAsset.toBase64String('png');
    
    const code = jsQR(imageData, imageAsset.width, imageAsset.height);
    if (code) {
      return JSON.parse(code.data);
    }
    
    throw new Error('No QR code found');
  }
}