import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Button,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import formatRupiah from "@/functions/formatRupiah";
import formatImageURL from "@/functions/formatImageURL";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import getCurrentTimestamp from "@/functions/getCurrentTimestamp";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Checkout = () => {
  const params = useLocalSearchParams();
  const [cart, setCart] = useState<any>(
    JSON.parse(typeof params.cart === "string" ? params.cart : "")
  );
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
  const [now, setNow] = useState<any>(getCurrentTimestamp());

  const handleOrder = async (item: any) => {
    try {
      setLoadingOrder(true);
      const orderCustomerRef = doc(
        getFirestore(),
        "ordercustomer",
        getAuth().currentUser!!.uid
      );
      const orderCustomerSnapshot = await getDoc(orderCustomerRef);
      if (orderCustomerSnapshot.exists()) {
        await updateDoc(orderCustomerRef, {
          orders: arrayUnion({
            idUMKM: params.idUMKM,
            namaUMKM: params.namaUMKM,
            photoUMKM: params.photoUMKM,
            cart: item,
            totalPrice: calculatePrice(),
            timeStampOrder: now,
            timeStampFinish: "",
          }),
        });
      } else {
        await setDoc(orderCustomerRef, {
          orders: arrayUnion({
            idUMKM: params.idUMKM,
            namaUMKM: params.namaUMKM,
            photoUMKM: params.photoUMKM,
            cart: item,
            totalPrice: calculatePrice(),
            timeStampOrder: now,
            timeStampFinish: "",
          }),
        });
      }

      const orderUMKMRef = doc(
        getFirestore(),
        "orderumkm",
        typeof params.idUMKM === "string" ? params.idUMKM : ""
      );
      const orderUMKMSnapshot = await getDoc(orderUMKMRef);
      if (orderUMKMSnapshot.exists()) {
        await updateDoc(orderUMKMRef, {
          orders: arrayUnion({
            idCustomer: getAuth().currentUser!!.uid,
            namaCustomer: getAuth().currentUser!!.displayName,
            photoCustomer: getAuth().currentUser!!.photoURL,
            cart: item,
            totalPrice: calculatePrice(),
            timeStampOrder: now,
            timeStampFinish: "",
          }),
        });
      } else {
        await setDoc(orderUMKMRef, {
          orders: arrayUnion({
            idCustomer: getAuth().currentUser!!.uid,
            namaCustomer: getAuth().currentUser!!.displayName,
            photoCustomer: getAuth().currentUser!!.photoURL,
            cart: item,
            totalPrice: calculatePrice(),
            timeStampOrder: now,
            timeStampFinish: "",
          }),
        });
      }
      await updateDoc(
        doc(
          getFirestore(),
          "umkm",
          typeof params.idUMKM === "string" ? params.idUMKM : ""
        ),
        {
          daftarChat: arrayUnion(getAuth().currentUser!!.uid),
        }
      );
      await updateDoc(
        doc(getFirestore(), "customer", getAuth().currentUser!!.uid),
        {
          daftarChat: arrayUnion(
            typeof params.idUMKM === "string" ? params.idUMKM : ""
          ),
        }
      );
    } catch (error) {
      alert(error);
    } finally {
      setLoadingOrder(false);
      alert("Berhasil melakukan order!");
      router.push("../(Orders)/ListOrders");
    }
  };

  const calculatePrice = () => {
    let totalPrice = 0;
    cart.map((item: any) => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };

  const handleTambahMenu = (item: any) => {
    const existingCartItemIndex = cart.findIndex(
      (menuItem: any) => menuItem.idMenu === item.idMenu
    );
    if (existingCartItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingCartItemIndex].quantity += 1;
      setCart(updatedCart);
    }
  };

  const handleKurangMenu = (item: any) => {
    const existingCartItemIndex = cart.findIndex(
      (menuItem: any) => menuItem.idMenu === item.idMenu
    );
    if (existingCartItemIndex !== -1) {
      const updatedCart = [...cart];
      let currentQuantity = updatedCart[existingCartItemIndex].quantity;
      if (currentQuantity > 1) {
        updatedCart[existingCartItemIndex].quantity -= 1;
      } else {
        return Alert.alert(
          `Are you sure want to delete ${item.namaMenu} from cart?`,
          "",
          [
            { text: "Cancel" },
            {
              text: "Yes",
              onPress: () => {
                const newCart = cart.filter(
                  (_: any, index: any) => index !== existingCartItemIndex
                );
                setCart(newCart);
              },
            },
          ]
        );
      }
      setCart(updatedCart);
    }
  };

  const renderMenuItem = ({ item }: any) => {
    return (
      <View className="flex  ">
        <View className="flex py-3 px-4 flex-row bg-white">
          {loadingImage && (
            <ActivityIndicator size={60} color="#F8E800" className="mt-12" />
          )}
          <Image
            source={{ uri: formatImageURL(item.imageURL) }}
            onLoadStart={() => setLoadingImage(true)}
            onLoadEnd={() => setLoadingImage(false)}
            className="rounded-lg shadow-sm shadow-black"
            width={120}
            height={100}
          />
          <View className="ml-4 flex flex-row justify-between w-3/5 ">
            <View className="mr-4">
              <Text className="font-bold text-lg">{item.namaMenu}</Text>
              <Text>Rp {formatRupiah(item.price)}</Text>
            </View>

            <View className="flex flex-row items-center mt-10">
              <Pressable onPress={() => handleKurangMenu(item)}>
                <Text className="text-xl font-bold bg-mainYellow px-3 rounded-full">
                  -
                </Text>
              </Pressable>
              <Text className="mx-3">{item.quantity}</Text>
              <Pressable onPress={() => handleTambahMenu(item)}>
                <Text className="text-lg bg-mainYellow px-3 rounded-full">
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView className="pt-6 bg-white h-full">
      <View className="border-[1px] mx-4 p-4 rounded-xl flex flex-row">
        <Image
          source={require("./pickupBag.png")}
          className="w-16 h-16"
        ></Image>
        <View className="ml-4 flex justify-between mb-4">
          <Text className="font-bold text-lg">Pickup</Text>
          <Text className="font-semibold text-gray-500">30-60 minutes</Text>
        </View>
      </View>
      <Text className="font-bold text-lg mx-4 mt-4 mb-2">Item</Text>
      <SafeAreaView>
        <ScrollView>
          <FlatList
            key={"#"}
            data={cart}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.idMenu}
            nestedScrollEnabled={true}
            scrollEnabled={false}
          />
        </ScrollView>
      </SafeAreaView>
      <View className="mx-4 mb-5">
        <Text className="font-bold text-lg my-2">Payment</Text>
        <View className="border-[1px] p-4 rounded-lg flex flex-row justify-between items-end border-gray-300">
          <Text className="text-base">Total Payment</Text>
          <Text className="font-bold text-lg">
            Rp {formatRupiah(calculatePrice())}
          </Text>
        </View>
      </View>

      <View className="mx-4 mb-8">
        <Text className="font-bold text-lg my-2">Payment Method</Text>
        <View className="border-[1px] p-4 rounded-lg flex flex-row justify-between items-end border-gray-300">
          <MaterialCommunityIcons name="cash" size={28} color="black" />
          <Text className="font-bold text-lg">Cash</Text>
        </View>
      </View>

      {loadingOrder && <ActivityIndicator size={32} color="#F8E800" />}
      <View className="mb-12 mx-4">
        <Pressable onPress={() => handleOrder(cart)} className="bg-mainYellow  p-4 flex items-center mt-1 rounded-lg shadow-sm shadow-black">
          <Text className="text-lg font-bold">Order and Pickup</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Checkout;
