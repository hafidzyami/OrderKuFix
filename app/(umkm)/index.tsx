import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";

const CustomerHome = () => {
  return (
    <View className="bg-white h-full">
      <LinearGradient
        colors={["#fffab3", "#FFF676", "#F8E800"]}
        className="bg-yellow-200 rounded-b-xl relative h-64 shadow-sm shadow-black"
      >
        <Text
          // style={{ fontFamily: "Montserrat_700Bold" }}
          className="z-10 mt-36 mx-6 absolute font-extrabold text-4xl"
        >
          Welcome,{"\n"}
          {getAuth().currentUser?.displayName?.substring(5)}
        </Text>
        <Image
          source={require("./assets-umkm/food-background.png")}
          className="w-full h-64 rounded-b-xl z-0"
        />
        <View className="absolute top-12 right-4">
          <Entypo
            name="log-out"
            size={26}
            color="black"
            onPress={() => signOut(getAuth())}
          />
        </View>
      </LinearGradient>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9F8F8",
          marginTop: 50,
          padding : 10,
          shadowColor : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5, // For Android shadow
          borderRadius : 10,
          width : 360
        }}
        onPress={() => router.push("./(Menu)/EditMenu")}
      >
        <View className="d-flex flex-row items-center">
          <Image
            source={require("./assets-umkm/editmenu.png")}
            style={{ height: 150, width: 200 }}
          />
          <View className="d-flex flex-column ml-5">
            <Text className="font-extrabold text-xl mb-2">Edit Menu</Text>
            <Text>Menambahkan dan {"\n"}mengurangi stok</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9F8F8",
          marginTop: 50,
          padding : 10,
          shadowColor : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5, // For Android shadow
          borderRadius : 10,
          width : 360,
          marginLeft : 30
        }}
        onPress={() => router.replace("./TotalPendapatan")}
      >
        <View className="d-flex flex-row items-center">
          <Image
            source={require("./assets-umkm/totalpendapatan.png")}
            style={{ height: 150, width: 200 }}
          />
          <View className="d-flex flex-column ml-5">
            <Text className="font-extrabold text-xl mb-2">Total{"\n"}Pendapatan</Text>
            <Text>Melihat total{"\n"}pendapatan</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerHome;
