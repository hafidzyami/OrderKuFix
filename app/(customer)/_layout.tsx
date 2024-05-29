import { Tabs, router, usePathname } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import "react-native-reanimated";

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // Get current path
  useEffect(() => {
    const auth = getAuth();
    const startTime = Date.now();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(2000 - elapsed, 0);

      setTimeout(() => {
        if (!user) {
          router.replace("../landing");
        } else {
          if (user?.displayName?.startsWith("UMKM")) {
            router.replace("../(umkm)/");
          }
        }
        setIsLoading(false);
      }, remainingTime);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading)
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        className="bg-white"
      >
        {/* <ActivityIndicator size="large" color="#ffffff" /> */}
        <Image
          source={require("./assets-customer/loading.gif")}
          style={{ width: 250, height: 250 }}
        />
      </View>
    );
  else {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarStyle: {
            height: pathname === "/ChatRoom" ? 0 : 75,
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
          options={{
            title: "Near Me",
            headerTitleAlign: "center",
            headerStyle: styles.headerStyle,
            href: null,
            unmountOnBlur: true,
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} className="ml-5">
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="(UMKM)/ListMenu"
          options={{ href: null, unmountOnBlur: true, headerShown: true }}
        />
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

const styles = StyleSheet.create({
  headerStyle: {
    height: 100,
    shadowColor: "grey",
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // }
  },
});

export default RootLayout;
