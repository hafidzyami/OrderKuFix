import { Stack } from "expo-router";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import "react-native-reanimated";

const firebaseConfig = {
  apiKey: "AIzaSyDviH_SSALli-w5Y9-DHNEh_tIm8Gk23HQ",
  authDomain: "orderku-c1849.firebaseapp.com",
  projectId: "orderku-c1849",
  storageBucket: "orderku-c1849.appspot.com",
  messagingSenderId: "578457764373",
  appId: "1:578457764373:web:aecf63f0dfcb10abd2441c",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(customer)" options={{ headerShown: false }} />
      <Stack.Screen name="(umkm)" options={{ headerShown: false }} />
      <Stack.Screen name="landing" options={{ headerShown: false }} />
      <Stack.Screen name="afterLanding" options={{ headerShown: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default RootLayout;
