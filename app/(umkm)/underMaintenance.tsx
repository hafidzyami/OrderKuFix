import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import {router} from "expo-router"

export default function underMaintenance() {
  return (
    <View className="flex justify-center items-center h-full bg-[#F0EEF3]">
      <Image source={require("./assets-umkm/maintenance-page_01.gif")} className="w-1/2 h-1/3"></Image>
      <Pressable className="bg-mainYellow py-4 px-8 flex items-center mt-1 rounded-lg shadow-sm shadow-black" onPress={() => {router.back()}}>
        <Text className="font-semibold text-lg">Go To Home</Text>
      </Pressable>
    </View>
  );
}
