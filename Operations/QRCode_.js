import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";

const QRCode_ = ({ email, userName, selectedEvent, image }) => {
  const qrCodeRef = useRef();

  const handleDownloadQRCode = async () => {
    try {
      // Capture the QR code view
      const uri = await qrCodeRef.current.capture();
      console.log("URI: ", uri)

      // Save captured image to device
      // const path = RNFS.DocumentDirectoryPath + '/qr_code.png';
      // await RNFS.copyFile(uri, path);

      Alert.alert('QR code downloaded successfully');
    } catch (error) {
      // console.error('Failed to download QR code: ', error);
      Alert.alert('Failed to download QR code');
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the QR code */}
      <View style={styles.qr}>
        <ViewShot ref={qrCodeRef} options={{ format: 'png', quality: 1.0 }}>
          <QRCode
          color="black"
          backgroundColor="transparent"
            value={`${email},${userName},${selectedEvent},${image}`}
            size={200}
          />
        </ViewShot>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleDownloadQRCode}>
        <Text>Download QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  },
  qr: {
    marginTop: "50%",

  },
});

export default QRCode_;
