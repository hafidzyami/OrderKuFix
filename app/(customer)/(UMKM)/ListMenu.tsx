import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Button,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import formatRupiah from "@/functions/formatRupiah";
import formatImageURL from "@/functions/formatImageURL";
import { Ionicons } from "@expo/vector-icons";

interface cartCheckout {
  idMenu: any;
  namaMenu: any;
  price: any;
  quantity: any;
  imageURL: any;
}

const UMKMenu = () => {
  const params = useLocalSearchParams();
  const [menu, setMenu] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Map<string, number>[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  let arrayCartCheckout: cartCheckout[] = [];

  const fetchData = async () => {
    console.log("ngefetch data");
    try {
      setMenu([]);
      setLoading(true);
      const docRef = doc(
        getFirestore(),
        "menu",
        typeof params.id === "string" ? params.id : ""
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMenu(docSnap.data().menus);
        console.log(docSnap.data().menus);
      } else {
        console.log("gaada");
        setMenu([]);
      }
      console.log(menu);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const handleFirstCart = (item: any) => {
    const existingCartItem = cart.find((menuItem) => menuItem.has(item.idMenu));

    if (existingCartItem) {
      // If the item is already in the cart, update its quantity
      existingCartItem.set(
        item.idMenu,
        existingCartItem.get(item.idMenu)!! + 1
      );
      setCart([...cart]); // Update the state to trigger re-render
    } else {
      // If the item is not in the cart, add it
      const newMenu = new Map<string, number>();
      newMenu.set(item.idMenu, 1);
      setCart([...cart, newMenu]); // Add the new item to the cart
    }
  };

  const sumOfQuantity = () => {
    let totalQuantity = 0;
    cart.forEach((menuItem) => {
      menuItem.forEach((quantity) => {
        totalQuantity += quantity;
      });
    });
    return totalQuantity;
  };

  const sumOfPrice = () => {
    let totalPrice = 0;
    menu.forEach((menuItem: any) => {
      const cartItem = cart.find((cartItem) => cartItem.has(menuItem.idMenu));
      if (cartItem) {
        const quantity = cartItem.get(menuItem.idMenu)!!;
        const itemPrice = menuItem.price * quantity;
        totalPrice += itemPrice;

        arrayCartCheckout.push({
          idMenu: menuItem.idMenu,
          namaMenu: menuItem.foodName,
          price: menuItem.price,
          quantity: quantity,
          imageURL: menuItem.imageURL,
        });
      }
    });
    return totalPrice;
  };

  const handleTambahMenu = (item: any) => {
    const existingCartItem = cart.find((menuItem) => menuItem.has(item.idMenu));
    if (existingCartItem) {
      existingCartItem.set(
        item.idMenu,
        existingCartItem.get(item.idMenu)!! + 1
      );
    }
    setCart([...cart]);
  };

  const handleKurangMenu = (item: any) => {
    const existingCartItem = cart.find((menuItem) => menuItem.has(item.idMenu));
    if (existingCartItem) {
      const currentQuantity = existingCartItem.get(item.idMenu)!!;
      if (currentQuantity > 0) {
        existingCartItem.set(
          item.idMenu,
          existingCartItem.get(item.idMenu)!! - 1
        );
        setCart([...cart]);
      }
      if (currentQuantity == 1) {
        const updatedCart = cart.filter(
          (menuItem) => !menuItem.has(item.idMenu)
        );
        setCart(updatedCart);
      }
    }
  };

  const renderMenuItem = ({ item }: any) => (
    <View className="bg-white shadow-sm shadow-black  mt-6 mb-1 p-3 rounded-lg ml-2">
      <Image
        source={{ uri: item.imageURL }}
        className="rounded-lg"
        height={140}
        width={140}
      />
      <Text className="font-bold text-base my-2">{item.foodName}</Text>
      <Text className="mb-1">Rp {formatRupiah(item.price)}</Text>
      {!item.isAvailable ? (
        <Text className="font-bold text-red-400">Out of Stock</Text>
      ) : cart.length === 0 ||
        !cart.find((menuItem) => menuItem.has(item.idMenu)) ? (
        <Pressable
          onPress={() => handleFirstCart(item)}
          className="bg-mainYellow py-2 px-4 flex items-center mt-1 rounded-lg shadow-sm shadow-black"
        >
          <Text className="font-bold">Add</Text>
        </Pressable>
      ) : (
        <View className="flex flex-row items-center justify-center mt-2">
          <Pressable
            className="py-1 px-4 bg-mainYellow rounded-lg shadow-sm shadow-black"
            onPress={() => handleKurangMenu(item)}
          >
            <Text className="text-black font-extrabold">-</Text>
          </Pressable>
          <Text className="mx-4">
            {cart
              .find((menuItem) => menuItem.has(item.idMenu))!!
              .get(item.idMenu)}
          </Text>
          <Pressable
            className="py-1 px-4 bg-mainYellow rounded-lg shadow-sm shadow-black"
            onPress={() => handleTambahMenu(item)}
          >
            <Text className="text-black font-bold">+</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  console.log(params.photoURL);

  const upperCaseNama =
    typeof params.nama === "string" ? params.nama.toUpperCase() : "";
  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="bg-white"
      >
        <View className="bg-white flex-1">
          <Image
            source={{
              uri:
                typeof params.photoURL === "string"
                  ? formatImageURL(params.photoURL)
                  : "",
            }}
            height={210}
            className="w-full shadow-xl shadow-black"
          ></Image>
          <TouchableOpacity
            onPress={() => router.back()}
            className="ml-4 top-12 left-1 absolute bg-white p-2 rounded-full shadow-lg shadow-black"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="mt-5 mx-6 ">
            <Text className="font-bold text-2xl ">
              {upperCaseNama?.slice(5, 100)}
            </Text>
            <View className="flex flex-row items-center mt-1">
              <Ionicons name="location-outline" size={18} color="black" />
              <Text className="text-sm ml-1 text-gray-500">Kota Bandung</Text>
            </View>
          </View>
          <View className="mt-4 flex flex-row font-bold bg-gray-100 mx-6 py-4 px-3 rounded-lg shadow-sm shadow-black">
            <View className="border-r-2 w-1/2 pl-3">
              <Text className="text-base font-bold">5k-150k</Text>
              <Text className=" text-base">Price Range</Text>
            </View>
            <View className="pl-6">
              <Text className="text-base font-bold">8AM-8PM</Text>
              <Text className=" text-base">Opening Hours</Text>
            </View>
          </View>
          {loading ? (
            <ActivityIndicator size={60} color="#F8E800" className="mt-10" />
          ) : (
            <SafeAreaView>
              <View className="mb-6">
                <FlatList
                  key={"#"}
                  numColumns={2}
                  data={menu}
                  renderItem={renderMenuItem}
                  keyExtractor={(item) => item.idMenu}
                  nestedScrollEnabled={true}
                  scrollEnabled={false}
                  className="mx-4"
                />
              </View>
              <View className="bg-mainYellow h-20 rounded-t-xl">
                
              </View>
            </SafeAreaView>
          )}
        </View>
      </ScrollView>
      {cart.length !== 0 && (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "(UMKM)/Checkout",
              params: {
                cart: JSON.stringify(arrayCartCheckout),
                idUMKM: typeof params.id === "string" ? params.id : "",
                namaUMKM: typeof params.nama === "string" ? params.nama : "",
                photoUMKM:
                  typeof params.photoURL === "string" ? params.photoURL : "",
              },
            });
          }}
          className="absolute bottom-0 left-0 right-0 mx-6 mb-6 bg-[#FFF676] py-3 px-4 flex mt-1 rounded-lg shadow-sm shadow-black"
        >
          <View className="flex flex-row justify-between">
            <View className="flex justify-center">
              <Text className="font-bold text-base">{sumOfQuantity()} Item</Text>
              <Text>
                at {typeof params.nama === "string" ? (params.nama).slice(5,100) : ""}
              </Text>
            </View>
            <Text className="font-bold mt-1 text-xl ">Rp {formatRupiah(sumOfPrice())}</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
});

export default UMKMenu;
