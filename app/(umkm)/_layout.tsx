import { Tabs, router, usePathname } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import "react-native-reanimated";

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showActivityIndicator, setShowActivityIndicator] = useState(true);
  const startTime = Date.now();
  const pathname = usePathname();

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        router.replace("../landing");
      }
    });
    const elapsedTime = Date.now() - startTime;
    const delayTime = 1000; // Set the delay time in milliseconds
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
        className="bg-white"
      >
        <Image
          source={require("../loading.gif")}
          style={{ width: 250, height: 250 }}
        />
      </View>
    );
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          height:
            pathname === "/ChatRoom" ||
            pathname === "/underMaintenance" ||
            pathname === "/DetailOrder" ||
            pathname === "/UpdateMenu" ||
            pathname === "/EditProfile" ||
            pathname === "/TotalPendapatan" ||
            pathname === "/AddMenu" ||
            pathname === "/EditMenu"
              ? 0
              : 75,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
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
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list-ul" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat"
        options={{
          unmountOnBlur: true,
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
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
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,

          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(Menu)/AddMenu"
        options={{
          href: null,
          unmountOnBlur: true,
          title: "Add Menu",
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <View className="ml-3">
              <TouchableOpacity onPress={() => router.replace("./EditMenu")}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(Menu)/EditMenu"
        options={{
          href: null,
          unmountOnBlur: true,
          title: "Edit Menu",
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <View className="ml-3">
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="TotalPendapatan"
        options={{
          href: null,
          title: "Total Pendapatan",
          unmountOnBlur: true,
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <View className="ml-3">
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(Profile)/EditProfile"
        options={{
          href: null,
          title: "Edit Profile",
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <View className="ml-3">
              <TouchableOpacity onPress={() => router.replace("./Profile")}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(Menu)/UpdateMenu"
        options={{
          href: null,
          unmountOnBlur: true,
          title: "Update Menu",
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <View className="ml-3">
              <TouchableOpacity onPress={() => router.replace("./EditMenu")}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(Orders)/DetailOrder"
        options={{
          href: null,
          unmountOnBlur: true,
          title: "Detail Order",
          headerTitleAlign: "center",
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <View className="ml-3">
              <TouchableOpacity onPress={() => router.replace("./ListOrders")}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ChatRoom"
        options={{ href: null, unmountOnBlur: true }}
      />
      <Tabs.Screen
        name="underMaintenance"
        options={{
          href: null,
          title: "Under Maintenance",
          unmountOnBlur: true,
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <View className="ml-3">
              <TouchableOpacity>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Tabs>
  );
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
