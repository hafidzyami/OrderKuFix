import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  StyleSheet,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
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
import { Entypo } from "@expo/vector-icons";

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
        `menu/${getAuth().currentUser!!.uid}/${foodName.replace(/\s/g, "")}`
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
          menus: arrayUnion(menus),
        }
      );
    } catch (error) {
      alert(error);
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
      <ScrollView>
        <KeyboardAvoidingView>
        <View style={styles.container}>
        {loadingImage && <ActivityIndicator size="large" color="#F8E800" />}
        {image !== "" ? (
          <TouchableOpacity style={styles.imagecontainer} onPress={pickImage}>
            <Image
              style={styles.image}
              source={{
                uri: image,
              }}
              onLoadStart={() => setLoadingImage(true)}
              onLoadEnd={() => setLoadingImage(false)}
            />
            <View style={styles.iconWrapper}>
              <Entypo name="camera" size={24} color="white" />
            </View>
          </TouchableOpacity>
        ) : null}
        {loadingUpload && <ActivityIndicator size="large" color="#F8E800" />}
      </View>
          <View style={{paddingStart: 25, paddingEnd: 25 }}>
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
                      value={price}
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
            <View className="d-flex flex-row mt-5 ml-3 justify-between">
              <Text className="mt-1 text-base">Is Available? </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#50C878" }}
                thumbColor={isEnabled ? "#FFFF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            <TouchableOpacity
              onPress={saveUpdates}
              className="bg-mainYellow py-4 flex items-center rounded-xl shadow-sm shadow-black mt-10 "
            >
              <Text className="text-textButton font-bold">Save Updates</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
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
  },
});

export default EditAMenu;
