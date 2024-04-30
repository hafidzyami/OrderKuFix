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
      <Tabs.Screen name="index" options={{ title: "Home", unmountOnBlur: true}}/>
      <Tabs.Screen name="Chat" options={{unmountOnBlur: true}}/>
      <Tabs.Screen name="(Profile)/Profile" options={{ title: "Profile", unmountOnBlur: true}}/>
      <Tabs.Screen name="(Menu)/AddMenu" options={{ href : null, unmountOnBlur: true}}/>
      <Tabs.Screen name="(Menu)/EditMenu" options={{ href : null, unmountOnBlur: true}}/>
      <Tabs.Screen name="TotalPendapatan" options={{ href : null}}/>
      <Tabs.Screen name="(Profile)/EditProfile" options={{ href : null}}/>
      <Tabs.Screen name="(Menu)/UpdateMenu" options={{ href : null, unmountOnBlur: true}}/>
    </Tabs>
  ); 
};

export default RootLayout;
