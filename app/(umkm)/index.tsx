import { View, Text, Button } from 'react-native'
import React from 'react'
import { getAuth, signOut } from 'firebase/auth'

const CustomerHome = () => {
  return (
    <View>
      <Text>HaloUMKM</Text>
      <Button title="Sign Out" onPress={() => signOut(getAuth())}></Button>
    </View>
  )
}

export default CustomerHome;