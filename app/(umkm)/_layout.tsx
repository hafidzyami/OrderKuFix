import { Tabs, router } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";

import "react-native-reanimated";

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);
  const startTime = Date.now();

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        router.replace("../landing");
      }
    });
    const elapsedTime = Date.now() - startTime;
    const delayTime = 2000; // Set the delay time in milliseconds
    const remainingTime = delayTime - elapsedTime;
    if (remainingTime > 0) {
      setTimeout(() => {
        setShowActivityIndicator(false);
      }, remainingTime);
    } else {
      setShowActivityIndicator(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading || showActivityIndicator)
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        className="bg-mainYellow"
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text
          style={{ marginTop: 20, fontSize: 20 }}
          className="font-bold text-white"
        >
          please wait...
        </Text>
      </View>
    );
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
            <FontAwesome name="list-ul" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="Chat" options={{ unmountOnBlur: true }} />
      <Tabs.Screen
        name="(Profile)/Profile"
        options={{ title: "Profile", unmountOnBlur: true }}
      />
      <Tabs.Screen
        name="(Menu)/AddMenu"
        options={{ href: null, unmountOnBlur: true }}
      />
      <Tabs.Screen
        name="(Menu)/EditMenu"
        options={{ href: null, unmountOnBlur: true }}
      />
      <Tabs.Screen name="TotalPendapatan" options={{ href: null }} />
      <Tabs.Screen name="(Profile)/EditProfile" options={{ href: null }} />
      <Tabs.Screen
        name="(Menu)/UpdateMenu"
        options={{ href: null, unmountOnBlur: true }}
      />
      <Tabs.Screen
        name="(Orders)/DetailOrder"
        options={{ href: null, unmountOnBlur: true }}
      />
      <Tabs.Screen
        name="ChatRoom"
        options={{ href: null, unmountOnBlur: true }}
      />
    </Tabs>
  );
};

export default RootLayout;
