import { View, Text, Button } from 'react-native'
import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { router } from 'expo-router'

const CustomerHome = () => {
  return (
    <View>
      <Text>HaloUMKM</Text>
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
        <Button title='Edit Menu' onPress={() => router.push("/(Menu)/EditMenu")} ></Button>
        <Button title='Total Pendapatan' onPress={() => router.push("/TotalPendapatan")} ></Button>
      </View>
      <Button title="Sign Out" onPress={() => signOut(getAuth())}></Button>
    </View>
  )
}

export default CustomerHome;