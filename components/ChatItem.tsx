import { View, Text, Touchable, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { getRoomId } from "@/utils/getRoomId";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const ChatItem = (user: any) => {
  const [lastMessages, setLastMessage] = useState<any>(undefined);
  useEffect(() => {
    let roomId = getRoomId(getAuth().currentUser?.uid, user.user.id);
    const docRef = doc(getFirestore(), "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });

    return unsub;
  });

  const renderLastMessage = () => {
    if (typeof lastMessages == "undefined") return "Loading...";
    if (lastMessages) {
      if (getAuth().currentUser?.uid === lastMessages.userId)
        return "You: " + lastMessages.text;
      return lastMessages.text;
    } else {
      return "No messages yet!";
    }
  };

  const renderLastTime = () => {
    if (lastMessages) {
      const timestamp = lastMessages.createdAt;
      const milliseconds =
        timestamp.seconds * 1000 + Math.round(timestamp.nanoseconds / 1e6);
      const date = new Date(milliseconds);
      return `${("0" + date.getHours()).slice(-2)}:${(
        "0" + date.getMinutes()
      ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)} ${(
        "0" + date.getDate()
      ).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(
        -2
      )}/${date.getFullYear()}`;
    } else {
      return "Loading...";
    }
  };
  return (
    <TouchableOpacity
      className="flex flex-row justify-between item-centers py-4 px-2  border-t-[1px] border-gray-400"
      onPress={() => router.push({ pathname: "./ChatRoom", params: user.user })}
    >
      <Image
        source={{ uri: user.user.photoURL }}
        height={55}
        width={55}
        borderRadius={50}
      />
      <View className="flex flex-row">
        <View className="w-2/5 ml-4">
          <Text className="font-bold text-base mb-1">{user.user.nama}</Text>
          <Text>{renderLastMessage()}</Text>
        </View>
        <View className="flex w-3/5">
          <Text className="">{renderLastTime()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
