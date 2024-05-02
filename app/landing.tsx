import React, { useState } from "react";
import { Button, Pressable, Text, View, Image } from "react-native";
import { router } from "expo-router";

// Keep the splash screen visible while we fetch resources
export default function LandingScreen() {
  return (
    <View className="flex-1 flex-col items-center justify-between bg-mainYellow">
      <Image
        source={require("../assets/landing-logo.png")}
        style={{ width: 250, height: 280}}
        className="mt-44"
      ></Image>

      <Pressable
        onPress={() => {
          router.push("/afterLanding");
        }}
        className="py-4 px-32 mb-20 rounded-xl  bg-buttonWhite"
      >
        <Text className="text-lg text-textButton font-bold">Get Started</Text>
      </Pressable>
    </View>
  );
}
