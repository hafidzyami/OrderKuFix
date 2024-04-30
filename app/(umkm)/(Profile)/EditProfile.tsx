import { useEffect, useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { router } from "expo-router";
import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";

export default function EditProfileUMKM() {
  const [image, setImage] = useState<string>("");
  const [newImageURL, setNewImageURL] = useState<string>("");

  const saveUpdates = async () => {
    uploadImage(image)
      .then(() => router.replace("/Profile"))
      .then(() => alert("Update Changes!"));
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
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profile/${getAuth().currentUser!!.uid}/${Date.now()}`
      );
      await uploadBytes(storageRef, blob);
      await getDownloadURL(storageRef)
        .then((url) =>
          updateProfile(getAuth().currentUser!!, { photoURL: url })
        )
        .then((url) =>
          updateDoc(doc(getFirestore(), "umkm", getAuth().currentUser!!.uid), {
            photoURL: getAuth().currentUser!!.photoURL,
          })
        );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Image
        style={styles.image}
        source={{
          uri: image !== "" ? image : getAuth().currentUser?.photoURL || "",
        }}
      />
      <Button title="Save Changes" onPress={saveUpdates} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 50,
    borderRadius: 75,
  },
});
