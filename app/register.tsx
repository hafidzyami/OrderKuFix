import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";
import { arrayUnion, doc, getFirestore, setDoc } from "firebase/firestore";

const RegisterScreen = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isChecked, setChecked] = useState(false);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password)
      await updateProfile(getAuth().currentUser!!, {
        displayName: name,
        photoURL: `https://ui-avatars.com/api/?name=${name}&background=F8E800&color=fff&length=1`,
      })

      if(name.startsWith("UMKM")){
        await setDoc(doc(getFirestore(), "umkm", getAuth().currentUser!!.uid), {
          id : getAuth().currentUser!!.uid,
          nama : getAuth().currentUser!!.displayName,
          telepon : getAuth().currentUser!!.phoneNumber,
          alamat : "",
          deskripsi: "",
          photoURL : getAuth().currentUser!!.photoURL
        })
        await setDoc(doc(getFirestore(), "menu", getAuth().currentUser!!.uid), {
          deskripsi : "",
        })
        .then(() => {
          alert("Berhasil daftar");
          router.replace("/(umkm)/");
        })
      }
      else{
        await setDoc(doc(getFirestore(), "customer", getAuth().currentUser!!.uid), {
          id : getAuth().currentUser!!.uid,
          nama : getAuth().currentUser!!.displayName,
          telepon : getAuth().currentUser!!.phoneNumber,
          favUMKM : arrayUnion(null)
        })
        .then(() => {
          alert("Berhasil daftar");
          router.replace("/(customer)/");
        })
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleCheckBox = (newValue: boolean) => {
    setChecked(newValue);
    if (newValue) {
      setName("UMKM " + name);
    } else {
      setName("");
    }
  };

  return (
    <View>
      <Text>Register Page</Text>
      <TextInput placeholder="Nama" onChangeText={(text) => setName(text)} value={name}/>
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
