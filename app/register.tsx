import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Animated, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { router } from "expo-router";
import Checkbox from "expo-checkbox";
import { arrayUnion, doc, getFirestore, setDoc } from "firebase/firestore";
import CustomModal from "../components/CustomModal";
import Icon from "react-native-vector-icons/MaterialIcons"; // Pastikan untuk menginstal library ini

const RegisterScreen = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isChecked, setChecked] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const animated = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      await updateProfile(getAuth().currentUser!!, {
        displayName: name,
        photoURL: `https://ui-avatars.com/api/?name=${name}&background=F8E800&color=fff&length=1`,
      });

      if (name.startsWith("UMKM")) {
        await setDoc(doc(getFirestore(), "umkm", getAuth().currentUser!!.uid), {
          id: getAuth().currentUser!!.uid,
          nama: getAuth().currentUser!!.displayName,
          telepon: getAuth().currentUser!!.phoneNumber,
          alamat: "",
          deskripsi: "",
          photoURL: getAuth().currentUser!!.photoURL,
          daftarChat : arrayUnion(null),
        });
        await setDoc(doc(getFirestore(), "menu", getAuth().currentUser!!.uid), {
          deskripsi: "",
        }).then(() => {
          alert("Berhasil daftar");
          router.replace("/(umkm)/");
        });
      } else {
        await setDoc(
          doc(getFirestore(), "customer", getAuth().currentUser!!.uid),
          {
            id: getAuth().currentUser!!.uid,
            nama: getAuth().currentUser!!.displayName,
            telepon: getAuth().currentUser!!.phoneNumber,
            favUMKM: arrayUnion(null),
            photoURL: getAuth().currentUser!!.photoURL,
            daftarChat : arrayUnion(null)
          }
        ).then(() => {
          alert("Berhasil daftar");
          router.replace("/(customer)/");
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setModalMessage(err.message);
        toggleModal();
      }
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className="flex flex-col gap-y-12 ">
      <View className="flex flex-col gap-y-4 px-2">
        <View>
          <Text className="text-base">Fullname</Text>
          <TextInput
            placeholder="name"
            onChangeText={(text) => setName(text)}
            value={name}
            className="text-base py-2 border-b-2 border-gray-400"
          />
        </View>
        <View>
          <Text className="text-base">Email Address</Text>
          <TextInput
            placeholder="username@gmail.com"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            value={email}
            className="text-base py-2 border-b-2 border-gray-400"
          />
        </View>
        <View>
          <Text className="text-base">Password</Text>
          <View className="flex flex-row items-center border-b-2 border-gray-400">
            <TextInput
              placeholder="********"
              secureTextEntry={!isPasswordVisible}
              onChangeText={(text) => setPassword(text)}
              className="text-base py-2 flex-1"
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Icon name={isPasswordVisible ? "visibility" : "visibility-off"} size={24} color={"grey"} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row gap-x-4 items-center">
          <Text className="text-base font-bold">UMKM?</Text>
          <Checkbox value={isChecked} onValueChange={handleCheckBox} />
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: animated }] }}>
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          onPress={handleRegister}
          className="bg-mainYellow py-4 flex items-center rounded-xl shadow-sm shadow-black mb-4"
        >
          <Text className="text-lg text-textButton font-bold ">Sign Up</Text>
        </Pressable>
      </Animated.View>

      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        onClose={toggleModal}
      />
    </View>
  );
};

export default RegisterScreen;
