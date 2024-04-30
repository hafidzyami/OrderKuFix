import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import formatRupiah from "@/functions/formatRupiah";
import formatImageURL from "@/functions/formatImageURL";
import { router } from "expo-router";

const MyOrderScreen = () => {
  const [orders, setOrders] = useState<any>();
  const [menuOrders, setMenuOrders] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const docRef = doc(
        getFirestore(),
        "ordercustomer",
        getAuth().currentUser!!.uid
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrders(docSnap.data().orders);
        setMenuOrders(
          docSnap
            .data()
            .orders.map((order: any) => order.cart)
            .flat()
        );
      } else {
        setOrders([]);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateQuantity = (cart: any) => {
    let totalQuantity = 0;
    cart.map((item: any) => {
      totalQuantity += item.quantity;
    });
    return totalQuantity;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const renderOrderItem = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/DetailOrder",
            params: { order: JSON.stringify(item) },
          })
        }
      >
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>{item.item.timeStampOrder}</Text>
            <Text
              style={{
                color: item.item.timeStampFinish === "" ? "orange" : "green",
              }}
            >
              {item.item.timeStampFinish === "" ? "Ongoing" : "Complete"}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Image
              style={{ height: 50, width: 50 }}
              source={{
                uri: formatImageURL(item.item.photoUMKM),
              }}
            ></Image>
            <View>
              <Text>{item.item.namaUMKM}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Total</Text>
                <Text>Quantity</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ marginRight: 200 }}>
                  Rp {formatRupiah(item.item.totalPrice)}
                </Text>
                <Text>{calculateQuantity(item.item.cart)}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#F8E800" />
      ) : (
        <SafeAreaView>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <FlatList
              key={"#"}
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.idOrder}
              nestedScrollEnabled={true}
              scrollEnabled={false}
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

export default MyOrderScreen;
