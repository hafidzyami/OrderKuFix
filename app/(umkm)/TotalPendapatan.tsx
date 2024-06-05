import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import formatRupiah from "@/functions/formatRupiah";
import { v5 as uuidv5 } from "uuid";

const TotalPendapatan = () => {
  const [pendapatan, setPendapatan] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const calculateTotal = () => {
    let total = 0
    {pendapatan ? pendapatan.map((id : any) => {total += id.totalPrice}) : (total = 0)}
    return total
  }

  const fetchPendapatan = async () => {
    try {
      const docRef = doc(
        getFirestore(),
        "totalpendapatan",
        getAuth().currentUser!!.uid
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data) {
          setPendapatan(data.pendapatan || []);
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateShortUniqueId = (timeStampFinish: any): string => {
    return uuidv5(`https://${timeStampFinish}/`, uuidv5.URL)
      .slice(0, 8)
      .toUpperCase(); // Remove hyphens and take the first 8 characters
  };

  useEffect(() => {
    fetchPendapatan();
  });

  const renderMenuCard = ({ item }: { item: any }) => (
    <View>
      <View className="flex border-gray-400 border-t-[1px]">
        <View className="flex flex-row rounded-lg my-5 mx-5">
          <View className="flex flex-row ml-4 justify-between w-[95%]">
            <View className="">
              <Text className="text-lg font-bold">
                ORDER #{generateShortUniqueId(item.timeStampFinish)}
              </Text>
              <Text className="text-sm">{item.timeStampFinish}</Text>
            </View>
            <Text className="text-base font-bold mt-1">
              Rp {formatRupiah(item.totalPrice)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendapatan();
    setRefreshing(false);
  };
  return (
    <View style={styles.container} className="bg-white h-full">
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
              data={pendapatan}
              renderItem={renderMenuCard}
              keyExtractor={(item) => item.timeStampFinish}
              nestedScrollEnabled={true}
              scrollEnabled={false}
            />
          </ScrollView>
          <View className="flex border-gray-400 border-t-[1px]">
            <View className="flex flex-row rounded-lg my-5">
              <View className="flex flex-row justify-between w-full px-6">
                <View className="">
                  <Text className="text-lg font-bold">
                    Total
                  </Text>
                </View>
                <Text className="text-base font-bold mt-1">
                  Rp {formatRupiah(calculateTotal())}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  card: {
    margin: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    marginTop: 5,
    fontSize: 16,
  },
  loveButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  loveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TotalPendapatan;
