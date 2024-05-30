import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import formatProfileURL from "@/functions/formatProfileURL";
import { Ionicons } from "@expo/vector-icons";

const ChatRoomHeader = ({ user, router }: any) => {
  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex flex-row items-center">
            <TouchableOpacity onPress={() => router.replace("./Chat")} className="mx-3">
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            <Image
              source={{ uri: formatProfileURL(user.photoURL) }}
              height={45}
              width={45}
              borderRadius={50}
            />
            <Text className="ml-2 font-bold">{user.nama}</Text>
          </View>
        ),
      }}
    />
  );
};

export default ChatRoomHeader;
