import React, { useState } from 'react';
import { View, Alert, Text } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../constants/endpoints';
import TextInput from '../components/TextInput';
import Btn from '../components/Button';
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet } from 'react-native';
import { phoneValidator } from '../helpers/phoneValidator';
import { theme } from '../core/theme';
import { TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { windowHeight, windowWidth } from '../constants/dimesions';

const UploadImageView = ({ navigation, route }) => {
  const [name, setName] = useState({value: "", error: ""})
  const [mobileNumber, setMobileNumber] = useState({value: "", error: ""})
  const { pinCode, productId, productName, imageId } = route.params
  const [address, setAddress] = useState({value: "", error: ""})
  const [quantity, setQuantity] = useState({ value: "1", error: "" })
  const [status, setStatus] = useState("not added")

  const styles = StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: "white"
    },
    navbar: {
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      height: windowHeight*0.08, // You can adjust the height as needed
      padding: 0,
      margin: 0,
      width: "100%",
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: windowWidth*0.16
    },
    navHeader: {
      fontWeight: "bold",
      fontSize: 20,
      color: "#fff",
      margin: 0,
      alignItems: "center",
    },
    inputContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
      alignItems: "center"
    },
    innerContainer: {
      width: "84%"
    },
    productName: {
      fontSize: 16,
      fontWeight: "bold"
    },  
    btnContainer: {
      alignItems: "center",
      justifyContent: "center",
    }
  })


  function handleSubmit() {
    setStatus("adding")
    const newOrder = {
      BuyerName: name.value,
      BuyerAddress: address.value,
      Quantity: quantity.value,
      BuyerMobileNumber: mobileNumber.value,
     }
    let emptyWarn = "This field cannot be empty"
    console.log(newOrder)
    let isError = false
    Object.entries(newOrder).map((e, i) => {
        ({
          BuyerName() {
            let msg;
            if (!e[1] || e[1] === "")
              msg = emptyWarn
            isError = isError || !!msg;
            setName({...name, error: msg})
          },
          BuyerAddress() {
            let msg;
            if (!e[1] || e[1] === "") {
              msg = emptyWarn
              isError = isError || !!msg;
              setAddress({...address, error: msg})
            }
          },
          Quantity() {
            let msg;
            console.log(e[1], parseInt(e[1]))
            if (parseInt(e[1]) < 1 ||  !/^-?\d+$/.test(e[1]))
              msg = "Please enter a valid quantity"
              isError = isError || !!msg;
              setQuantity({...quantity, error: msg})
          },
          BuyerMobileNumber() {
            let msg;
            if (!e[1] || e[1] === "")
              msg = emptyWarn
            else if (!phoneValidator(e[1])) {
              msg = "Invalid mobile number"
            } 
            isError = isError || !!msg;
            setMobileNumber({...mobileNumber, error: msg})
          },
          
        })[e[0]]()
    })
    if (isError) {
      setStatus("not added")
      return;
    }
    axios.post(`${BASE_URL}/api/order/place-order`, {
      ...newOrder,
      BuyerPinCode: pinCode,
      ProductId: productId
    })
    .then((res) => {
      setStatus("added")
      console.log(res.data)
      Alert.alert(
        "Yay! Order Successful",
        `Your order details have been shared with the seller. The delivery team will do their best to bring the product to your doorstep. Feel free to explore our products and place more orders.`, [
        {
          text: "OK",
          style: "cancel",
          onPress: () => {
            navigation.navigate("Dashboard", {pinCode})
          }
        }
      ], {
        cancelable: true,
        onDismiss: () => {
          navigation.navigate("Dashboard", {pinCode})
        }
      })
    }).catch((err) => {
      setStatus("not added")
      console.log(err)
    })

  }

  return (

    <View style={styles.page}>
      <View style={styles.navbar}>
        <TouchableOpacity style={{
            borderRadius: 10,
            paddingHorizontal: 5,
            paddingLeft: windowWidth*0.033
        }} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.navHeader}>{"Enter Delivery Details"}</Text>
    </View>
    
    <KeyboardAwareScrollView contentContainerStyle={styles.inputContainer}>
      
      <View style={styles.innerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.productName}>{productName}</Text>
      </View>
      <TextInput
        label="Quantity"
        returnKeyType="next"
        value={quantity.value}
        onChangeText={(text) => setQuantity({ value: text, error: '' })}
        error={!!quantity.error}
        errorText={quantity.error}
        keyboardType="numeric"
      />
      <TextInput
        label="Your Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Mobile Number"
        returnKeyType="next"
        value={mobileNumber.value}
        onChangeText={(text) => setMobileNumber({ value: text, error: '' })}
        error={!!mobileNumber.error}
        errorText={mobileNumber.error}
      />
      <TextInput
        label="Address"
        returnKeyType="next"
        value={address.value}
        onChangeText={(text) => setAddress({ value: text, error: '' })}
        error={!!address.error}
        errorText={address.error}
      />
      <TextInput
        label="PIN Code"
        returnKeyType="next"
        value={pinCode}
        disabled={true}
      />
      <View style={styles.btnContainer}>
      <Btn
        disabled={status !== "not added"}
        mode="contained"
        onPress={handleSubmit}
        style={{ marginTop: 24, width: "60%", marginBottom: 30 }}
      >
        {/* <Ionicons name='checkmark' size={5} /> */}
        {status === "added"?"Order Placed":"Place Order"}
      </Btn>
      </View>
      </View>
      </KeyboardAwareScrollView>
      </View>

  );
};

export default UploadImageView;

