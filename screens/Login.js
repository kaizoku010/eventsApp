import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, browserSessionPersistence, setPersistence } from '../Operations/firebaseConfig';
import BG from "../assets/bg.jpg";
import ICLogo from "../assets/moxie_logo.png";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state variable

  useEffect(() => {
    const retrieveLoginDetails = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('storedEmail');
        const storedPassword = await AsyncStorage.getItem('storedPassword');

        if (storedEmail && storedPassword) {
          Alert.alert(
            'Stored Login Details',
            'Use stored login details?',
            [
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              { text: 'OK', onPress: () => { setEmail(storedEmail); setPassword(storedPassword); } }
            ]
          );
        }
      } catch (error) {
        console.error('Error retrieving stored login details:', error);
      }
    };

    retrieveLoginDetails();
  }, []);


  const handleSignup = async () => {
    if (isLoading) {
      return; // Return if button is already loading
    }

    setIsLoading(true); // Set loading state to true

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userData = {
        uid: userCredential.user.uid,
        imagePath: userCredential.user.photoURL,
        userName: userCredential.user.displayName,
        email: userCredential.user.email,
        selectedEvent: userCredential.user.selectedEvent
      };

      await AsyncStorage.setItem('storedEmail', email);
      await AsyncStorage.setItem('storedPassword', password);

      navigation.navigate('HomeTabs', { user: userData });
    } catch (error) {
      //console.error('Login Error:', error);
      alert("Please make sure you have an internet connection")
    } finally {
      setIsLoading(false); // Reset loading state after login attempt
    }
  };

  return (
    <ImageBackground source={BG} resizeMode='cover' style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={ICLogo} style={styles.icon} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignup}
          style={styles.dx_btn}
          disabled={isLoading} // Disable button when loading
        >
          <Text style={styles.buttonText}>{isLoading ? 'Lindako...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 160,
    height: 100,
    marginRight: 10,
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dx_btn: {
    backgroundColor: "#131314",
    borderRadius: 50,
    height: 50,
    textAlign: "center",
    width: "50%",
    justifyContent: "center"
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    textAlign: "center",
    fontSize: 12,
  },
});

export default Login;
