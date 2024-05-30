import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

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
  const [price, setPrice] = useState<number | any>("");
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
        `menu/${getAuth().currentUser!!.uid}/${foodName.replace(/\s/g, "")}`
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
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.imagecontainer} onPress={pickImage}>
          <View
            style={styles.image}
            className="border-2 justify-center items-center"
          >
            <Text className="text-base">Add Image</Text>
            <View style={styles.iconWrapper}>
              <MaterialIcons name="add-a-photo" size={24} color="white" />
            </View>
          </View>
        </TouchableOpacity>
        {loadingUpload && <ActivityIndicator size="large" color="#F8E800" />}
      </View>
      <View style={{ marginTop: 250, paddingStart: 25, paddingEnd: 25 }}>
        <View className="flex flex-col gap-y-[174px]">
          <View className="flex flex-col gap-y-4 px-2">
            <View>
              <Text className="text-base">Food Name</Text>
              <TextInput
                placeholder="food name"
                keyboardType="default"
                onChangeText={(text) => setFoodName(text)}
                value={foodName}
                className="text-sm py-2 border-b-2 border-gray-400"
              />
            </View>

            <View>
              <Text className="text-base">Price</Text>
              <View className="flex flex-row items-center border-b-2 border-gray-400">
                <TextInput
                  placeholder="Rp xx.xxx"
                  keyboardType="numeric"
                  onChangeText={(text) => setPrice(text)}
                  className="text-sm py-2 flex-1"
                />
              </View>
            </View>
            <View>
              <Text className="text-base">Description</Text>
              <View className="flex flex-row items-center border-b-2 border-gray-400">
                <TextInput
                  placeholder="description"
                  keyboardType="default"
                  onChangeText={(text) => setDeskripsi(text)}
                  className="text-sm py-2 flex-1"
                  value={deskripsi}
                />
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={saveUpdates}
          className="bg-mainYellow py-4 flex items-center rounded-xl shadow-sm shadow-black mt-10 "
        >
          <Text className="text-textButton font-bold">Save Updates</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    marginBottom: 50,
    borderRadius: 10,
  },
  iconWrapper: {
    position: "absolute",
    bottom: 10, // Adjust the distance from the bottom as needed
    right: 10, // Adjust the distance from the right as needed
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    borderRadius: 12, // Optional: add border radius to the wrapper
    padding: 5, // Add padding to ensure the icon is not touching the edges
  },
  imagecontainer: {
    position: "relative",
    width: 200, // Set the width of the container as per your image size
    height: 200, // Set the height of the container as per your image size
    marginTop: 30,
    borderColor: "#0000",
    borderRadius: 50,
  },
});

export default AddMenu;
