import { Stack } from "expo-router"
import { initializeApp } from "firebase/app";
import {initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const AUTH_DOMAIN = process.env.EXPO_PUBLIC_AUTH_DOMAIN;
const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;
const STORAGE_BUCKET =  process.env.EXPO_PUBLIC_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID;
const APP_ID = process.env.EXPO_PUBLIC_APP_ID;
const MEASUREMENT_ID =  process.env.EXPO_PUBLIC_MEASUREMENT_ID;
const DATABASE_URL = process.env.EXPO_PUBLIC_DATABASE_URL;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL : DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
initializeAuth(FIREBASE_APP,{
  persistence : getReactNativePersistence(ReactNativeAsyncStorage)
})
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);


const RootLayout = () =>{
    return(
        <Stack>
            <Stack.Screen name="(customer)" options={{headerShown: false}}/>
            <Stack.Screen name="(umkm)" />
            <Stack.Screen name="landing" options={{headerShown: false}}/>
            <Stack.Screen name="afterLanding" options={{headerShown: false}}/>
            <Stack.Screen name="login"/>
            <Stack.Screen name="register"/>
        </Stack>
    )
}

export default RootLayout;