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
      <View style={{ marginBottom: 50 }}>
        <View style={{ flexDirection: "row" }}>
          {loadingImage && <ActivityIndicator size="large" color="#F8E800" />}
          <Image
            source={{ uri: formatImageURL(item.imageURL) }}
            style={{ height: 100, width: 100, marginRight: 20 }}
            onLoadStart={() => setLoadingImage(true)}
            onLoadEnd={() => setLoadingImage(false)}
          />
          <View style={{ flexDirection: "column" }}>
            <Text>{item.namaMenu}</Text>
            <Text>Rp {formatRupiah(item.price)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button title="-" onPress={() => handleKurangMenu(item)} />
            <Text>{item.quantity}</Text>
            <Button title="+" onPress={() => handleTambahMenu(item)} />
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
        <View className="ml-4">
          <Text className="font-bold text-lg">Pickup</Text>
          <Text>30-60 minutes</Text>
        </View>
      </View>
      <Text>Item</Text>
      <Text>Checkout</Text>
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
      <Text>Payment</Text>
      <Text>Rp {formatRupiah(calculatePrice())}</Text>
      {loadingOrder && <ActivityIndicator size="large" color="#F8E800" />}
      <Button
        title="Order and Pickup"
        onPress={() => handleOrder(cart)}
      ></Button>
    </ScrollView>
  );
};

export default Checkout;
