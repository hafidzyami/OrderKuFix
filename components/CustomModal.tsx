import React, { useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import Modal from "react-native-modal";

interface CustomModalProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

function CustomModal({ isVisible, message, onClose }: CustomModalProps) {
  const animated = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Ooops!</Text>
        <Text style={styles.message}>{message}</Text>
        <Animated.View style={{ transform: [{ scale: animated }] }}>
          <Pressable
            onPress={onClose}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#F8E800",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    shadowColor: "black",

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CustomModal;
