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
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import formatRupiah from "@/functions/formatRupiah";

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
    try {
      const docRef = doc(
        getFirestore(),
        "menu",
        typeof params.id === "string" ? params.id : ""
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMenu(docSnap.data().menus);
      } else {
        setMenu([]);
      }
    } catch (error) {}
    setLoading(false);
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
    <View>
      <Image source={{ uri: item.imageURL }} style={styles.image} />
      <Text>{item.foodName}</Text>
      <Text>Rp {formatRupiah(item.price)}</Text>
      {cart.length === 0 ||
      !cart.find((menuItem) => menuItem.has(item.idMenu)) ? (
        <Button title="Add" onPress={() => handleFirstCart(item)}></Button>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button title="-" onPress={() => handleKurangMenu(item)} />
          <Text>
            {cart
              .find((menuItem) => menuItem.has(item.idMenu))!!
              .get(item.idMenu)}
          </Text>
          <Button title="+" onPress={() => handleTambahMenu(item)} />
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
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
              numColumns={2}
              data={menu}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.idMenu}
              nestedScrollEnabled={true}
              scrollEnabled={false}
            />
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
                    photoUMKM : typeof params.photoURL === "string" ? params.photoURL : "",
                  },
                });
              }}
            >
              <View
                style={{ backgroundColor: "#F8E800", flexDirection: "row" }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text>{sumOfQuantity()} item</Text>
                  <Text>
                    at {typeof params.nama === "string" ? params.nama : ""}
                  </Text>
                </View>
                <Text>Rp {formatRupiah(sumOfPrice())}</Text>
              </View>
            </TouchableOpacity>
          )}
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
