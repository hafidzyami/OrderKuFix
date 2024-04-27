import { View, Text, StyleSheet, Image, Button } from "react-native";
import React from "react";
import { getAuth } from "firebase/auth";
import {ButtonCustom} from "../../../components/Button"
import { router } from "expo-router";
const ProfileScreen = () => {
    const name = getAuth().currentUser?.displayName

  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <Image
        style={styles.image}
        source={{ uri: getAuth().currentUser?.photoURL || ''}}
      />
      <ButtonCustom onPress={() => router.replace("../EditProfile")} title="Edit Profile" color="#F8E800" opacity={0.5}></ButtonCustom>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom : 50,
    backgroundColor: "#0553",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default ProfileScreen;
