import React, { useState } from "react";
import { Button, Pressable, Text, View, Image } from "react-native";
import { router } from "expo-router";

// Keep the splash screen visible while we fetch resources
export default function LandingScreen() {
  return (
    <View className="flex-1 flex-col items-center justify-center bg-mainYellow">
      <Image
        source={require("../assets/landing-logo.png")}
        style={{ width: 250, height: 280, marginTop: 64 }}
      ></Image>

      <Pressable
        onPress={() => {
          router.replace("/login");
        }}
        className="py-6 px-32 rounded-xl mt-64 bg-buttonWhite"
        // style={({ pressed }) => [
        //   {
        //     backgroundColor: pressed ? "black" : "white",
        //   }
        // ]}
      >
        <Text className="text-lg text-textButton font-bold">Get Started</Text>
      </Pressable>
    </View>
  );
}
