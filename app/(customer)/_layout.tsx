import { Tabs, router } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Text } from "react-native";

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  getAuth().onAuthStateChanged((user) => {
    setIsLoading(false);
    if (!user) {
      router.replace("../landing");
    }
  });

  if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="Favorite" />
      <Tabs.Screen name="Chat" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
};

export default RootLayout;
