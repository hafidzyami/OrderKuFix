import React, { useState, useRef } from "react";
import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import CustomModal from "../components/CustomModal";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const animated = useRef(new Animated.Value(1)).current;

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((user: any) => {
        if (user) {
          if (user._tokenResponse.displayName.substring(0, 4) === "UMKM") {
            router.replace("/(umkm)/");
          } else {
            router.replace("/(customer)/");
          }
        }
      })
      .catch((err) => {
        setModalMessage(err?.message);
        toggleModal();
      });
  };

  return (
    <View className="flex flex-col gap-y-44">
      <View className="flex flex-col gap-y-4 px-2">
        <View>
          <Text className="text-base">Email Address</Text>
          <TextInput
            placeholder="username@gmail.com"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            className="text-sm py-2 border-b-2 border-gray-400"
          />
        </View>

        <View>
          <Text className="text-base ">Password</Text>
          <TextInput
            placeholder="********"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            className="text-sm py-2 border-b-2 border-gray-400"
          />
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: animated }] }}>
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          onPress={handleLogin}
          className="bg-mainYellow py-4 flex items-center rounded-xl shadow-sm shadow-black mb-4"
        >
          <Text className="text-lg text-textButton font-bold">Sign In</Text>
        </Pressable>
      </Animated.View>

      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        onClose={toggleModal}
      />
    </View>
  );
};

export default LoginScreen;
