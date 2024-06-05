import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import MessageList from "../../components/MessageList";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getRoomId } from "@/utils/getRoomId";
import { Ionicons } from "@expo/vector-icons";

const chatRoom = () => {
  const params = useLocalSearchParams(); //second user
  const router = useRouter();
  const [messages, setMessages] = useState<any>([]);
  const textRef = useRef("");
  const inputRef = useRef<any>(null);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    createRoomIfNotExists();
    let roomId = getRoomId(getAuth().currentUser?.uid, params.id);
    const docRef = doc(getFirestore(), "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    let unsub = onSnapshot(q, (snapshot: any) => {
      let allMessages = snapshot.docs.map((doc: any) => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });

    const KeyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );

    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(getAuth().currentUser?.uid, params.id);
    await setDoc(doc(getFirestore(), "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(getAuth().currentUser?.uid, params.id);
      const docRef = doc(getFirestore(), "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();
      const newDoc = await addDoc(messagesRef, {
        userId: getAuth().currentUser?.uid,
        text: message,
        photoURL: getAuth().currentUser?.photoURL,
        senderName: getAuth().currentUser?.displayName,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (err: any) {
      Alert.alert("Message", err.message);
    }
  };
  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1 bg-mainYellow h-full">
        <ChatRoomHeader user={params} router={router} />

        {messages.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#F8E800" />
          </View>
        ) : null}
        <View className="flex-1 justify-between overflow-visible">
          <View className="flex-1 mx-2">
            <MessageList messages={messages} scrollViewRef={scrollViewRef} />
          </View>
          <View style={{ marginBottom: 20 }} className="pt-2">
            <View className="flex-row justify-between items-center mx-3">
              <View className="flex-row justify-between bg-white border p-2 border-neutral-300 rounded-xl pl-5">
                <TextInput
                  ref={inputRef}
                  onChangeText={(value) => (textRef.current = value)}
                  placeholder="Type message..."
                  className="flex-1 mr-2"
                />
                <TouchableOpacity
                  className="bg-neutral-200 p-2 mr-[1px] rounded-lg"
                  onPress={handleSendMessage}
                >
                  <Ionicons name="send" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
};

export default chatRoom;
