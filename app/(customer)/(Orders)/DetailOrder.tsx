import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import formatImageURL from "@/functions/formatImageURL";
import formatRupiah from "@/functions/formatRupiah";

const DetailOrder = () => {
  const params = useLocalSearchParams();
  const orderItem = JSON.parse(typeof params.order === "string" ? params.order : "").item
  const [orders, setOrders] = useState<any>(
    orderItem.cart
  );
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const timeStampFinish = orderItem.timeStampFinish
  const sumOfPrice = orderItem.totalPrice


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
    <View className="bg-white h-full">
      <Text style={{ color : timeStampFinish === "" ? "orange" : "green" }}>{timeStampFinish === "" ? "Ongoing" : "Complete"}</Text>
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
      </SafeAreaView>
    </View>
  );
};

export default DetailOrder;
