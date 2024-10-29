import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = () => {
  const qrValue = "VirtualCard://Activity"; // URL or unique identifier

  return (
    <View style={styles.container}>
      <QRCode
        value={qrValue}
        size={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRCodeGenerator;
