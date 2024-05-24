import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function LandingScreen() {
  const [isPressed, setIsPressed] = useState(false);
  const animated = useRef(new Animated.Value(1)).current;

  // const handlePressIn = () => {
  //   setIsPressed(true);
  //   fadeIn();
  // };

  // const handlePressOut = () => {
  //   setIsPressed(false);
  //   fadeOut();
  // };

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1 flex-col items-center justify-between bg-mainYellow">
      <Image
        source={require("../assets/landing-logo.png")}
        style={{ width: 250, height: 280 }}
        className="mt-44"
      />

      <Animated.View
        style={{ transform: [{ scale: animated }] }}
        className="w-[88%]"
      >
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          onPress={() => {
            fadeOut();
            router.push("/afterLanding");
          }}
          className="py-4 mb-6 rounded-xl bg-buttonWhite shadow-sm shadow-black"
        >
          <Text className="text-lg text-textButton font-extrabold text-center">
            Get Started
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
