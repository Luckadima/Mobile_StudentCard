import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';


export default function NFCcont() {
  const [hasNFC, setHasNFC] = useState(false);
  const [lastTagRead, setLastTagRead] = useState(null);

  useEffect(() => {
    async function initNfc() {
      try {
        await NfcManager.start();
        checkNFCSupport();
      } catch (error) {
        console.error('Failed to start NFC manager:', error);
      }
    }
    initNfc();
  }, []);
  
  
  
  const checkNFCSupport = async () => {
    const supported = await NfcManager.isSupported();
    setHasNFC(supported);
  };
  
  const startNFCScanning = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('NFC tag scanned:', tag);
      setLastTagRead(JSON.stringify(tag, null, 2));
    } catch (error) {
      console.error('Error scanning NFC:', error);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>NFC Supported: {hasNFC ? 'Yes' : 'No'}</Text>
      {hasNFC && (
        <Button title="Scan NFC Tag" onPress={startNFCScanning} />
      )}
      {lastTagRead && (
        <View style={{ marginTop: 20 }}>
          <Text>Last Tag Read:</Text>
          <Text>{lastTagRead}</Text>
        </View>
      )}
    </View>
);
}