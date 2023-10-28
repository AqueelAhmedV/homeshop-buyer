import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import TextInput  from '../components/TextInput'
import { pinCodeValidator } from '../helpers/pinCodeValidator';

const StartScreen = ({ navigation }) => {
  const [pinCode, setPinCode] = useState({
    value: "123456",
    error: ""
  });


  const handleProceed = async () => {
    if (!pinCodeValidator(pinCode.value)) {
      setPinCode({
        ...pinCode,
        error: "Please enter a valid PIN code"
      })
      return;
    } else {
      setPinCode({...pinCode, error: ""})
      navigation.navigate("Dashboard", {
        pinCode: pinCode.value
      })
    }
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Enter your PIN code"
          value={pinCode.value}
          onChangeText={(text) => setPinCode({...pinCode, value: text})}
          error={!!pinCode.error}
          errorText={pinCode.error}
          keyboardType='numeric'
        />
      </View>
      <Button style={{
        marginTop: "20px"

      }} mode="contained" onPress={handleProceed}>
        {"Proceed"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 16,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16
  }
});

export default StartScreen;
