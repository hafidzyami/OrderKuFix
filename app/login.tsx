import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";


const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    signInWithEmailAndPassword(getAuth(), email, password)
        .then((user : any) => {
            if(user)
                if(getAuth().currentUser!!.displayName!!.substring(0,4) == "UMKM") router.replace("/(umkm)/")
                else router.replace("/(customer)/");
        })
        .catch((err) => {
            alert(err?.message);
        });
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <TextInput placeholder="Email" keyboardType="email-address" onChangeText={(text) => setEmail(text)}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={(text) => setPassword(text)}/>
      <Button title={"Login"} onPress={handleLogin}/>
      <Button title={"Register"} onPress={() => router.push("/register")}/>
    </View>
  );
};

export default LoginScreen;
