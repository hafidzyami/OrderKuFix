import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";

const RegisterScreen = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isChecked, setChecked] = useState(false);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password).catch(
        (err) => alert(err?.message)
      );
      await updateProfile(getAuth().currentUser!!, {
        displayName: name,
        photoURL: `https://ui-avatars.com/api/?name=${name}&background=F8E800&color=fff&length=1`,
      })
        .then(() => {
          alert("Berhasil daftar");
          router.replace("/login");
        })
        .catch((err) => alert(err?.message));
    } catch (err) {
      alert(err);
    }
  };

  const handleCheckBox = (newValue: boolean) => {
    setChecked(newValue);
    if (newValue) {
      setEmail("UMKM" + email);
    } else {
      setEmail(email.replace(/^UMKM/, ""));
    }
  };

  return (
    <View>
      <Text>Register Page</Text>
      <TextInput placeholder="Nama" onChangeText={(text) => setName(text)} />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title={"Register"} onPress={handleRegister} />
      <Text>Apakah UMKM?</Text>
      <Checkbox value={isChecked} onValueChange={handleCheckBox} />
    </View>
  );
};

export default RegisterScreen;
