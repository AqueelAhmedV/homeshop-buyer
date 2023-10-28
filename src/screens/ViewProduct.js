import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BASE_URL } from '../constants/endpoints';
import Background from '../components/Background';
import { theme } from '../core/theme';
import { AntDesign } from '@expo/vector-icons'

const ProductDetails = ({ navigation, route }) => {
    const { product } = route.params

  return (
    <View style={styles.page}>
    <View style={styles.navbar}>
        <TouchableOpacity style={{
            borderRadius: 10,
            paddingHorizontal: 5,
            paddingTop: 3
        }} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={25} color="white" />
        </TouchableOpacity>    
    </View>
    <View style={styles.container}>
        <View style={styles.imageContainer}>
      <Image
        source={{ uri: `${BASE_URL}/api/product/view-image/${product.ImageId}` }} // Replace 'product_image_url' with the actual image URL
        style={styles.productImage}
      />
      </View>
      <Text style={styles.productName}>{product.ProductName}</Text>
      <View style={styles.priceBox}>
        <Text style={styles.offerPrice}>&#8377;&nbsp;{product.OfferPrice ?? product.MRP}</Text>
        {product.OfferPrice && <Text style={styles.mrpPrice}>&#8377;&nbsp;{product.MRP}</Text>}
        <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>Product description goes here.</Text>
    </View>
    </View>
  );
};

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
        height: 50, // You can adjust the height as needed
        padding: 0,
        margin: 0,
        paddingTop: 10,
        width: "100%",
      },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    width: 300,
    height: 300,
    backgroundColor: 'white', // Background color for the parent container
    elevation: 5, // Simulate shadow on Android
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.5, 
    shadowRadius: 4, 
    borderRadius: 30,
    marginTop: 20,
    // padding: 20
  },

  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    objectFit: "contain"
  },
  productName: {
    fontWeight: '600',
    fontSize: 30,
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  priceBox: {
    borderWidth: 2,
    borderColor: '#aaa',
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    width: "80%"
  },
  offerPrice: {
    fontWeight: 'bold',
    fontSize: 30,
    color: "#486856"
  },
  mrpPrice: {
    textDecorationLine: 'line-through',
    fontSize: 16,
  },
  orderButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 20,
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ProductDetails;
