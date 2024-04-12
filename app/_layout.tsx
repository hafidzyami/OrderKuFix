import { Stack } from "expo-router"
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjckpaU_h2CjN-RZf5MBIECM66StrmjDY",
  authDomain: "orderku-7b2aa.firebaseapp.com",
  projectId: "orderku-7b2aa",
  storageBucket: "orderku-7b2aa.appspot.com",
  messagingSenderId: "271926233401",
  appId: "1:271926233401:web:2ddf5dddd4f528dbef80e8",
  measurementId: "G-249C26HTW9"
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
            <Stack.Screen name="(customer)"/>
            <Stack.Screen name="(umkm)"/>
            <Stack.Screen name="landing"/>
            <Stack.Screen name="login"/>
            <Stack.Screen name="register"/>
        </Stack>
    )
}

export default RootLayout;