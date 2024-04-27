import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const UMKMenu = () => {
  const params = useLocalSearchParams();
  console.log(params)
  return (
    <View>
      <Text>UMKMenu</Text>
      <Text></Text>
    </View>
  )
}

export default UMKMenu