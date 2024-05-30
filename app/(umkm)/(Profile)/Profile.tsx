import { View, Text, StyleSheet, Image, Button, Pressable } from "react-native";
import React, { useRef } from "react";
import { getAuth } from "firebase/auth";
import { ButtonCustom } from "../../../components/Button";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Entypo } from "@expo/vector-icons";

const ProfileScreen = () => {
  const scaleChangeProfile = useSharedValue(1);
  const scaleNotification = useSharedValue(1);
  const scaleFaq = useSharedValue(1);
  const scaleHelp = useSharedValue(1);
  const name = getAuth().currentUser?.displayName;

  const onPressIn = (scale: any) => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const onPressOut = (scale: any) => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = (scale: any) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

  return (
    <View className="flex flex-1 justify-start bg-white">
      
      <View className="flex justify-center items-center">
        <Image
          width={150}
          height={150}
          className="rounded-full mb-12 flex mt-10"
          source={{ uri: getAuth().currentUser?.photoURL || "" }}
        />
      </View>

      <View className="flex justify-center gap-3 ml-2 mr-3">
        <AnimatedPressable
          style={[styles.pressable, animatedStyle(scaleChangeProfile)]}
          onPressIn={() => onPressIn(scaleChangeProfile)}
          onPressOut={() => onPressOut(scaleChangeProfile)}
          onPress={() => router.replace("../EditProfile")}
        >
          <Text className="text-base font-semibold">Change Profile</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </AnimatedPressable>

        <AnimatedPressable
          style={[styles.pressable, animatedStyle(scaleNotification)]}
          onPressIn={() => onPressIn(scaleNotification)}
          onPressOut={() => onPressOut(scaleNotification)}
        >
          <Text className="text-base font-semibold">Notification</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </AnimatedPressable>

        <AnimatedPressable
          style={[styles.pressable, animatedStyle(scaleFaq)]}
          onPressIn={() => onPressIn(scaleFaq)}
          onPressOut={() => onPressOut(scaleFaq)}
        >
          <Text className="text-base font-semibold">Faq</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </AnimatedPressable>

        <AnimatedPressable
          style={[styles.pressable, animatedStyle(scaleHelp)]}
          onPressIn={() => onPressIn(scaleHelp)}
          onPressOut={() => onPressOut(scaleHelp)}
        >
          <Text className="text-base font-semibold">Help</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </AnimatedPressable>
      </View>

      {/* <Button title="Sign Out" onPress={() => signOut(getAuth())} /> */}
    </View>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "#fff899",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
