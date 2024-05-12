import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import formatProfileURL from "@/functions/formatProfileURL";

const ChatRoomHeader = ({ user, router }: any) => {
  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text>Back</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: formatProfileURL(user.photoURL) }}
              height={50}
              width={50}
              borderRadius={50}
            />
            <Text>{user.nama}</Text>
          </View>
        ),
      }}
    />
  );
};

export default ChatRoomHeader;
