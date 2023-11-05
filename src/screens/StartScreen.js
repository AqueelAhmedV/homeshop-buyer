import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import TextInput  from '../components/TextInput'
import { pinCodeValidator } from '../helpers/pinCodeValidator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';

const StartScreen = ({ navigation }) => {
  const [pinCode, setPinCode] = useState({
    value: "",
    error: ""
  });
  const [showInput, setShowInput] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    AsyncStorage.getItem("pinCode")
    .then((val) => {
      if (!!!val) {
        setShowInput(true)
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: "Dashboard", params: {
            pinCode: val
          }}],
        })
      }
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }).catch((err) => {
      console.log(err)
      setLoading(false)
    })
  }, [navigation])


  const handleProceed = async () => {
    if (!pinCodeValidator(pinCode.value)) {
      setPinCode({
        ...pinCode,
        error: "Please enter a valid PIN code"
      })
      return;
    } else {
      AsyncStorage.setItem('pinCode', pinCode.value)
      setPinCode({...pinCode, error: ""})
      navigation.reset({
        index: 0,
        routes: [{name: "Dashboard", params: {
          pinCode: pinCode.value
        }}],
      })
    }
  };

  

  return (
    !loading ? <View style={{
      ...styles.container,
      justifyContent: showInput?"flex-start":'center'
    }}>
      <View style={{ alignItems: "center", marginTop: 90 }}>
        <Image source={require("../../assets/buyer_login.png")} style={{
          width: 150,
          height: 150,
          // objectFit: "contain",
          marginBottom: 40
        }}/>
      </View>
      {showInput && <View style={styles.inputContainer}>
        <TextInput
          label="Enter your PIN code"
          value={pinCode.value}
          onChangeText={(text) => setPinCode({...pinCode, value: text})}
          error={!!pinCode.error}
          errorText={pinCode.error}
          keyboardType='numeric'
        />
      
      <Button style={{
        marginTop: "20px"

      }} mode="contained" onPress={handleProceed}>
        {"Proceed"}
      </Button>
      </View>}
    </View>:(<View style={styles.loadingScreen}>

    </View>)
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 16,
    backgroundColor: "white"
  },
  inputContainer: {
    marginBottom: 16,
    paddingHorizontal: 50
  },
  loadingScreen: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.primary
  }
});

export default StartScreen;
