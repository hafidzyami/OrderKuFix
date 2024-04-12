import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { router } from 'expo-router';
import Checkbox from 'expo-checkbox';

const RegisterScreen = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isChecked, setChecked] = useState(false);
  
    const handleRegister = () => {
      createUserWithEmailAndPassword(getAuth(), email, password)
          .then((user) => {
              if (user) router.replace("/login");
          })
          .catch((err) => {
              alert(err?.message);
          });
    };

    const handleCheckBox = (newValue : boolean) =>{
        setChecked(newValue);
        if(newValue){
            setEmail("UMKM" + email);
        }
        else{
            setEmail(email.replace(/^UMKM/, ''));
        }
    }
  
    return (
      <View>
        <Text></Text>
        <TextInput placeholder="Email" keyboardType="email-address" onChangeText={(text) => setEmail(text)} value={email}/>
        <TextInput placeholder="Password" secureTextEntry onChangeText={(text) => setPassword(text)}/>
        <Button title={"Register"} onPress={handleRegister}/>
        <Text>Apakah UMKM?</Text>
        <Checkbox value={isChecked} onValueChange={handleCheckBox} />
      </View>
    );
}

export default RegisterScreen