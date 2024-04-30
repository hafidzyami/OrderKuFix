import { View, Text, TextInput, Button, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import LoginScreen from "./login";
import RegisterScreen from "./register";

const AfterLandingScreen = () => {
  const [signInPressed, setIsSignInPressed] = useState<boolean>(true);
  const [signUpPressed, setIsSignUpPressed] = useState<boolean>(false);
  return (
    <View className="flex items-center">
      <Image
        source={require("../assets/circle-logo.png")}
        style={{ width: 150, height: 150, marginTop: 96 }}
      ></Image>

      {/* <Text className="mt-8 font-bold text-xl">After Landing Screen</Text> */}
      <View className="flex flex-row mt-16 gap-x-4">
        <Pressable
          onPress={() => {
            setIsSignInPressed(true);
            setIsSignUpPressed(false);
          }}
          style={{
            borderBottomWidth: signInPressed ? 4 : 0,
            borderBottomColor: signInPressed ? "#F8E800" : "transparent",
          }}
          className="py-3 px-12"
        >
          <Text className="text-lg text-textButton font-bold flex items-center">
            Sign-In
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsSignInPressed(false);
            setIsSignUpPressed(true);
          }}
          className="py-3 px-12"
          style={{
            borderBottomWidth: signUpPressed ? 4 : 0,
            borderBottomColor: signUpPressed ? "#F8E800" : "transparent",
          }}
        >
          <Text className="text-lg text-textButton font-bold">Sign-Up</Text>
        </Pressable>
      </View>

      <View className="self-stretch mt-4 mx-10 h-1/2">
        {signInPressed ? <LoginScreen/>:<RegisterScreen/>}
      </View>


    </View>
  );
};

export default AfterLandingScreen;
