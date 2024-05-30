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
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import formatRupiah from "@/functions/formatRupiah";
import formatImageURL from "@/functions/formatImageURL";
import { router } from "expo-router";
import formatProfileURL from "@/functions/formatProfileURL";

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
        "orderumkm",
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
            pathname: "../(Orders)/DetailOrder",
            params: { order: JSON.stringify(item) },
          })
        }
        style={styles.container}
      >
        <View style={styles.orderContainer}>
          <View style={styles.header}>
            <Text style={styles.timestamp}>{item.item.timeStampOrder}</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      item.item.timeStampFinish === "" ? "orange" : "green",
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.item.timeStampFinish === "" ? "orange" : "green",
                  },
                ]}
              >
                {item.item.timeStampFinish === "" ? "Ongoing" : "Complete"}
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            <Image
              style={styles.image}
              source={{
                uri: formatProfileURL(item.item.photoCustomer),
              }}
            />
            <View style={styles.details}>
              <Text style={styles.customerName}>{item.item.namaCustomer}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Total</Text>
                <Text style={styles.infoText}>Quantity</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.totalPrice}>
                  Rp {formatRupiah(item.item.totalPrice)}
                </Text>
                <Text style={styles.quantity}>
                  {calculateQuantity(item.item.cart)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View className="bg-white h-full">
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
              keyExtractor={(item) => item.timeStampOrder + item.totalPrice}
              nestedScrollEnabled={true}
              scrollEnabled={false}
            />
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#888',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default MyOrderScreen;

