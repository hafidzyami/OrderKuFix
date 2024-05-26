import {
  View,
  Text,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import LoginScreen from "./login";
import RegisterScreen from "./register";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AfterLandingScreen = () => {
  const [signInPressed, setIsSignInPressed] = useState<boolean>(true);
  const [signUpPressed, setIsSignUpPressed] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const logoSize = useSharedValue(150);
  const logoMarginTop = useSharedValue(96);
  const logoMarginBottom = useSharedValue(80);
  const ornamentHeight = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isKeyboardVisible) {
      logoSize.value = withTiming(70, { duration: 300 });
      logoMarginTop.value = withTiming(229, { duration: 300 });
      logoMarginBottom.value = withTiming(26, { duration: 300 });
      ornamentHeight.value = withTiming(68, { duration: 0 });
    } else {
      logoSize.value = withTiming(150, { duration: 300 });
      logoMarginTop.value = withTiming(96, { duration: 300 });
      logoMarginBottom.value = withTiming(80, { duration: 300 });
      ornamentHeight.value = withTiming(60, { duration: 0 });
    }
  }, [isKeyboardVisible]);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      width: logoSize.value,
      height: logoSize.value,
      marginTop: logoMarginTop.value,
      marginBottom: logoMarginBottom.value,
    };
  });

  const animatedOrnamentStyle = useAnimatedStyle(() => {
    return {
      height: `${ornamentHeight.value}%`,
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-[#fffab3]"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 items-center justify-center">
          <Image
            source={require("../assets/doodle-image.png")}
            className="absolute top-0 w-[120%] h-[55%] opacity-[.40]"
          ></Image>
          <Animated.View
            style={[styles.circle2Ornament, animatedOrnamentStyle]}
          />
          <Animated.Image
            source={require("../assets/circle-logo.png")}
            style={animatedLogoStyle}

          />

          <View className="flex flex-row gap-x-4">
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
              <Text
                style={{ color: signInPressed ? "#000" : "darkgrey", fontSize: 18 }}
                className="font-bold"
              >
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
              <Text
                style={{ color: signUpPressed ? "#000" : "darkgrey", fontSize: 18 }}
                className="font-bold"
              >
                Sign-Up
              </Text>
            </Pressable>
          </View>

          <View className="self-stretch mx-6">
            {signInPressed ? <LoginScreen /> : <RegisterScreen />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  circle2Ornament: {
    position: "absolute",
    width: "100%",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    backgroundColor: "white",
    bottom: 0,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
});

export default AfterLandingScreen;
