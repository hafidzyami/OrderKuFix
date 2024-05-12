import { Tabs, router, usePathname } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import "react-native-reanimated";

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        router.replace("../landing");
      }
      else{
        if(user?.displayName?.startsWith("UMKM")){
          router.replace("../(umkm)/")
        }
      }
    });
    setIsLoading(false);
  }, []);

  if (isLoading) return <Text className="pt-32">Loading...</Text>;
  else {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarStyle: {
            height: 75,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            unmountOnBlur: true,
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={32} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(Orders)/ListOrders"
          options={{
            title: "Orders",
            unmountOnBlur: true,
            tabBarIcon: ({ color }) => (
              <Ionicons name="newspaper" size={32} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(Orders)/DetailOrder"
          options={{ href: null, unmountOnBlur: true }}
        />
        <Tabs.Screen
          name="Chat"
          options={{
            tabBarIcon: ({ color }) => (
              <Entypo name="chat" size={32} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(Profile)/Profile"
          options={{
            title: "Profile",
            unmountOnBlur: true,
            tabBarIcon: ({ color }) => (
              <Ionicons name="people" size={32} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(Profile)/EditProfile"
          options={{ href: null, unmountOnBlur: true }}
        />
        <Tabs.Screen
          name="(UMKM)/ListUMKM"
          options={{ href: null, unmountOnBlur: true }}
        />
        <Tabs.Screen name="(UMKM)/ListMenu" options={{ href: null }} />
        <Tabs.Screen
          name="(UMKM)/Checkout"
          options={{ href: null, unmountOnBlur: true }}
        />
        <Tabs.Screen
          name="ChatRoom"
          options={{ href: null, unmountOnBlur: true }}
        />
      </Tabs>
    );
  }
};

export default RootLayout;
