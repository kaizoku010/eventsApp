import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  Linking,
} from "react-native";
import React from "react";
import { loginStyle } from "./NewLoginStyles";
import Logo from "../assets/logo_white.png";
import { useNavigation } from "@react-navigation/native";
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import Video from "react-native-video";
import { Video } from "expo-av";

import {} from "react-native-svg";

const NewLogin = () => {
  const navigation = useNavigation();
  // GoogleSignin.configure({
  //   // webClientId: 'YOUR_WEB_CLIENT_ID', // Required for web projects
  //   androidClientId: '346104076821-6mkqccr54e389oa6ct3cnp1hjk8v2ofp.apps.googleusercontent.com', // Required for Android apps
  //   // iosClientId: 'YOUR_IOS_CLIENT_ID', // Required for iOS apps
  // });

  const handleLoginPress = () => {
    navigation.navigate("Login"); // Navigate to the "Login" screen
  };

  const handleSignUpPress = () => {
    // Open a web page when the "Sign Up" button is pressed
    Linking.openURL("https://selfcheckinapps.web.app/");
  };

  return (
    <View style={loginStyle.loginHolder}>
      <ImageBackground
        // source={require("../assets/lower.png")}
        style={loginStyle.imagebg}>
        <Video
          source={require("../assets/intro.mp4")} // Your video file
          style={loginStyle.videoBg}
          // muted={true}
          repeat={true}
          resizeMode={"cover"}
          rate={1.2}
          ignoreSilentSwitch={"obey"}
          volume={1.0}
        />
        <StatusBar translucent backgroundColor="transparent" />

        <Image source={Logo} style={loginStyle.avatar2} />
        {/* <Text style={loginStyle.overText}>Welcome </Text>
<Text style={loginStyle.overText2}>To Moxie 5 Events.</Text>
<Text style={loginStyle.overText3}>All events in one place.</Text> */}
      </ImageBackground>
      <View style={loginStyle.feildHolder}>
        <View style={loginStyle.buttons}>
          <TouchableOpacity
            style={loginStyle.loginBtn}
            onPress={handleLoginPress}
          > 

          <Text style={loginStyle.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={loginStyle.loginBtn2}
            onPress={handleSignUpPress} // Call handleSignUpPress function on button press
          >
            <Text style={loginStyle.loginBtnText2}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={loginStyle.orContainer}>
          <View style={loginStyle.line}></View>
          <Text style={loginStyle.orText}>Or</Text>
          <View style={loginStyle.line}></View>
        </View>
        <TouchableOpacity
          style={loginStyle.googleBtn}
          onPress={() => console.log("Google Button pressed!")}
        >
          <Text style={loginStyle.googleBtnText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={loginStyle.googleBtn2}
          onPress={() => console.log('Google Button pressed!')}
        >
          <Text style={loginStyle.googleBtnText}>Contact Us</Text>
        </TouchableOpacity> */}

        <View style={loginStyle.footer}>
          <Text style={loginStyle.footer_text}>@2024 (Beta)</Text>
          <Text style={loginStyle.footer_text2}>Moxie5 Marketing Agency</Text>
          {/* <Text style={loginStyle.footer_text3}>www.moxie5agency.com</Text> */}
        </View>
      </View>
    </View>
  );
};

export default NewLogin;
