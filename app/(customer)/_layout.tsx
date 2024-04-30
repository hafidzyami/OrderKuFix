import { Tabs, router, usePathname } from "expo-router";
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
    if(getAuth().currentUser!!.displayName!!.startsWith("UMKM")){
      router.replace("../(umkm)")
    }
  });

  if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home", unmountOnBlur: true}} />
      <Tabs.Screen name="(Orders)/ListOrders" options={{ title: "Orders", unmountOnBlur: true}} />
      <Tabs.Screen name="(Orders)/DetailOrder" options={{href : null, unmountOnBlur: true}} />
      <Tabs.Screen name="Chat" />
      <Tabs.Screen name="(Profile)/Profile" options={{ title: "Profile", unmountOnBlur: true }}/>
      <Tabs.Screen name="(Profile)/EditProfile" options={{ href : null, unmountOnBlur: true}}/>
      <Tabs.Screen name="(UMKM)/ListUMKM" options={{ href : null, unmountOnBlur: true}}/>
      <Tabs.Screen name="(UMKM)/ListMenu" options={{ href : null}}/>
      <Tabs.Screen name="(UMKM)/Checkout" options={{ href : null, unmountOnBlur : true}}/>
    </Tabs>
  );
};

export default RootLayout;
