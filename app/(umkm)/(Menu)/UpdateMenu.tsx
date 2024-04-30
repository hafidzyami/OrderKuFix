import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import formatImageURL from "@/functions/formatImageURL";
import convertToNumber from "@/functions/convertToNumber";

interface MenuItem {
  idMenu: any;
  foodName: any;
  price: any;
  isAvailable: any;
  deskripsi: any;
  imageURL: any;
}

const EditAMenu = () => {
  const params = useLocalSearchParams();
  const oldMenu: MenuItem = {
    idMenu: params.idMenu,
    foodName: params.foodName,
    price: convertToNumber(params.price!!),
    deskripsi: params.deskripsi,
    isAvailable: params.isAvailable === "true" ? true : false,
    imageURL: formatImageURL(params.imageURL),
  };
  const [image, setImage] = useState<any>(
    typeof params.imageURL!! === "string" ? formatImageURL(params.imageURL) : ""
  );
  const [foodName, setFoodName] = useState<string | any>(params.foodName);
  const [price, setPrice] = useState<number | "" | any>(params.price);
  const [deskripsi, setDeskripsi] = useState<string | any>(params.deskripsi);
  const [idMenu, setIdMenu] = useState<string | any>(params.idMenu);
  const [isEnabled, setIsEnabled] = useState(
    params.isAvailable === "true" ? true : false
  );
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const saveUpdates = async () => {
    uploadImage(image)
      .then(() => {
        setImage("");
        setFoodName("");
        setPrice("");
        setDeskripsi("");
      })
      .then(() => router.push("/EditMenu"))
      .then(() => alert("Berhasil Mengubah Menu"));
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
        idMenu: idMenu,
        foodName: foodName,
        price: parseInt(price),
        deskripsi: deskripsi,
        isAvailable: isEnabled,
        imageURL: url,
      };
      await updateDoc(
        doc(getFirestore(), "menu", getAuth().currentUser!!.uid),
        {
          menus: arrayRemove(oldMenu),
        }
      );
      await updateDoc(
        doc(getFirestore(), "menu", getAuth().currentUser!!.uid),
        {
          menus: arrayUnion(menus)
        }
      );
    } catch (error) {
      alert(error);
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {loadingImage && <ActivityIndicator size="large" color="#F8E800" />}
      {image !== "" ? <Image
        style={styles.image}
        source={{
          uri: image,
        }}
        onLoadStart={() => setLoadingImage(true)}
        onLoadEnd={() => setLoadingImage(false)}
      /> : null}
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
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
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

export default EditAMenu;
