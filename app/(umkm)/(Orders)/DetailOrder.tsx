import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import formatImageURL from "@/functions/formatImageURL";
import formatRupiah from "@/functions/formatRupiah";
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import getCurrentTimestamp from "@/functions/getCurrentTimestamp";
import reverseFormatProfileURL from "@/functions/reverseFormatProfileURL";

interface OrderCustomer {
    cart: any;
    idUMKM : any;
    namaUMKM : any;
    photoUMKM : any;
    timeStampFinish : any;
    timeStampOrder : any;
    totalPrice : any;
  }

const DetailOrder = () => {
  const params = useLocalSearchParams();
  const orderItem = JSON.parse(
    typeof params.order === "string" ? params.order : ""
  ).item;
  const [orders, setOrders] = useState<any>(orderItem.cart);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const timeStampFinish = orderItem.timeStampFinish;
  const sumOfPrice = orderItem.totalPrice;
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const customerOrder : OrderCustomer = {
        cart : orderItem.cart,
        idUMKM : getAuth().currentUser?.uid,
        namaUMKM : getAuth().currentUser?.displayName,
        photoUMKM : reverseFormatProfileURL(getAuth().currentUser?.photoURL),
        timeStampFinish : orderItem.timeStampFinish,
        timeStampOrder : orderItem.timeStampOrder,
        totalPrice : orderItem.totalPrice,
  }

  const markAsComplete = async () => {
    setLoadingUpdate(true);
    try {
      await updateDoc(
        doc(getFirestore(), "orderumkm", getAuth().currentUser!!.uid),
        {
          orders: arrayRemove(orderItem),
        }
      );
      await updateDoc(
        doc(getFirestore(), "ordercustomer", orderItem.idCustomer),
        {
          orders: arrayRemove(customerOrder),
        }
      );
      orderItem.timeStampFinish = getCurrentTimestamp()
      customerOrder.timeStampFinish = getCurrentTimestamp()
      await updateDoc(
        doc(getFirestore(), "orderumkm", getAuth().currentUser!!.uid),
        {
          orders: arrayUnion(orderItem),
        }
      );
      await updateDoc(
        doc(getFirestore(), "ordercustomer", orderItem.idCustomer),
        {
          orders: arrayUnion(customerOrder),
        }
      );
    } catch (error) {
      alert(error);
    }finally{
        setLoadingUpdate(false);
        alert("Berhasil menyelesaikan pesanan!")
        router.replace("..(Orders)/ListOrders")
    }
  };

  const renderOrderItem = (item: any) => {
    return (
      <View style={{ marginBottom: 50 }}>
        <View style={{ flexDirection: "row" }}>
          {loadingImage && <ActivityIndicator size="large" color="#F8E800" />}
          <Image
            source={{ uri: formatImageURL(item.item.imageURL) }}
            style={{ height: 100, width: 100, marginRight: 20 }}
            onLoadStart={() => setLoadingImage(true)}
            onLoadEnd={() => setLoadingImage(false)}
          />
          <View style={{ flexDirection: "column" }}>
            <Text>{item.item.namaMenu}</Text>
            <Text>Rp {formatRupiah(item.item.price)} / pcs</Text>
            <Text>Kuntitas : {item.item.quantity}</Text>
            <Text>
              Total : {formatRupiah(item.item.quantity * item.item.price)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <Text style={{ color: timeStampFinish === "" ? "orange" : "green" }}>
        {timeStampFinish === "" ? "Ongoing" : "Complete"}
      </Text>
      <SafeAreaView>
        <ScrollView>
          <FlatList
            key={"#"}
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.idMenu}
            nestedScrollEnabled={true}
            scrollEnabled={false}
          />
        </ScrollView>
        <Text>Payment</Text>
        <Text>Rp {formatRupiah(sumOfPrice)}</Text>
        {loadingUpdate && <ActivityIndicator size="large"/>}
        {timeStampFinish === "" ? (
          <Button title="Mark as Complete" onPress={markAsComplete}></Button>
        ) : (
          ""
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default DetailOrder;