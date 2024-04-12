import React, { useCallback, useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { router } from 'expo-router';

// Keep the splash screen visible while we fetch resources
export default function LandingScreen() {
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>OrderKu👋</Text>
      <Button title='Get Started' onPress={() => router.replace("/login")}></Button>
    </View>
  );
}