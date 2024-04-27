import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";

interface MenuItem {
  idMenu: string;
  foodName: string;
  price: number | "";
  isAvailable: boolean;
  deskripsi: string;
  imageURL: string;
}

const AddMenu = () => {
  const [image, setImage] = useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

  const saveUpdates = async () => {
    uploadImage(image)
      .then(() => {
        setImage("");
        setFoodName("");
        setPrice("");
        setDeskripsi("");
      })
      .then(() => router.replace("/EditMenu"))
      .then(() => alert("Berhasil Menambahkan Menu"));
  };

  const handlePrice = (text: string) => {
    const numericValue = parseFloat(text);
    setPrice(isNaN(numericValue) ? "" : numericValue);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setLoadingUpload(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `menu/${getAuth().currentUser!!.uid}/${foodName}`
      );
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      const menus: MenuItem = {
        idMenu: getAuth().currentUser!!.email!! + Date.now(),
        foodName: foodName,
        price: price,
        deskripsi: deskripsi,
        isAvailable: true,
        imageURL: url,
      };
      await updateDoc(
        doc(getFirestore(), "menu", getAuth().currentUser!!.uid),
        {
          menus: arrayUnion(menus),
        }
      );
    } catch (error) {
      alert("Upload Error");
    } finally {
      setLoadingUpload(false);
    }
  };
  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image !== "" ? (
        <Image
          style={styles.image}
          source={{
            uri: image,
          }}
        />
      ) : null}
      {loadingUpload && <ActivityIndicator size="large" color="#F8E800" />}
      <TextInput
        placeholder="Food Name"
        value={foodName}
        onChangeText={(text) => setFoodName(text)}
      />
      <TextInput
        placeholder="Price"
        keyboardType="numeric"
        value={price !== "" ? price.toString() : ""}
        onChangeText={(text) => handlePrice(text)}
      />
      <TextInput
        placeholder="Deskripsi"
        value={deskripsi}
        onChangeText={(text) => setDeskripsi(text)}
      />
      <Button title="Save Changes" onPress={saveUpdates} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
});

export default AddMenu;
