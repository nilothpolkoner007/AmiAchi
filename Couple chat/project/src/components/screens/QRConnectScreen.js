import * as React from 'react';
import { Image } from '@nativescript/core';
import { QRCodeService } from '../../services/qrcode.service';
import { CoupleService } from '../../services/couple.service';
import { supabase } from '../../services/supabase';

const qrService = new QRCodeService();
const coupleService = new CoupleService();

export function QRConnectScreen({ navigation }) {
  const [qrCode, setQRCode] = React.useState('');
  const [scanning, setScanning] = React.useState(false);

  React.useEffect(() => {
    generateQR();
  }, []);

  async function generateQR() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const qrData = await qrService.generateQRCode(user.id);
      setQRCode(qrData);
    }
  }

  async function scanPartnerQR() {
    try {
      setScanning(true);
      const scannedData = await qrService.scanQRCode();
      
      if (scannedData.type === 'couple-connect') {
        const { data: { user } } = await supabase.auth.getUser();
        await coupleService.connectUsers(user.id, scannedData.userId);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('QR Scan error:', error);
      // Show error to user
    } finally {
      setScanning(false);
    }
  }

  return (
    <flexboxLayout className="p-4 flex-1 justify-center items-center">
      <label className="text-2xl mb-4">Connect with Your Partner</label>
      
      {qrCode && (
        <Image
          src={qrCode}
          className="w-64 h-64 mb-4"
        />
      )}

      <button
        className="btn p-4 bg-blue-500 text-white rounded-lg"
        onTap={scanPartnerQR}
        isEnabled={!scanning}
      >
        {scanning ? 'Scanning...' : 'Scan Partner\'s QR Code'}
      </button>
      
      <label className="text-sm mt-4 text-center">
        Share your QR code with your partner or scan theirs to connect
      </label>
    </flexboxLayout>
  );
}