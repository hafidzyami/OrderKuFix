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
      <View>
        <View className="flex border-gray-400 border-t-[1px] p-4">
          <View className="flex flex-row rounded-lg">
            <Image
              width={90}
              height={90}
              borderRadius={8}
              source={{ uri: formatImageURL(item.item.imageURL) }}
              onLoadStart={() => setLoadingImage(true)}
              onLoadEnd={() => setLoadingImage(false)}
            />
            <View className="flex flex-row ml-4 justify-between w-[55%]">
              <View className="">
                <Text>Name : {item.item.namaMenu}</Text>
                <Text>Price : Rp {formatRupiah(item.item.price)} / pcs</Text>
                <Text>Kuntitas : {item.item.quantity}</Text>
                <Text>
                  Total : {formatRupiah(item.item.quantity * item.item.price)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="bg-white h-full">
      <Text className="p-4 font-semibold text-base text-center" style={{ color : timeStampFinish === "" ? "orange" : "green" }}>{timeStampFinish === "" ? "Ongoing" : "Complete"}</Text>
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
