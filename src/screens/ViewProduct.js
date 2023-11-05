import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BASE_URL } from '../constants/endpoints';
import { theme } from '../core/theme';
import { AntDesign } from '@expo/vector-icons'
import LinearGradient from 'react-native-linear-gradient'
import { windowHeight, windowWidth } from '../constants/dimesions';

const ProductDetails = ({ navigation, route }) => {
    const { product, pinCode } = route.params

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
            justifyContent: "center"
          },
      container: {
        flex: 1,
        alignItems: 'center',
      },
      imageContainer: {
        width: "100%",
        height: windowHeight*0.42,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        backgroundColor: 'white', // Background color for the parent container
        // elevation: 5, // Simulate shadow on Android
        // shadowColor: 'black', 
        // shadowOffset: { width: 0, height: 2 }, 
        // shadowOpacity: 0.5, 
        // shadowRadius: 4, 
        // borderRadius: 30,
        // marginTop: 20,
        // paddingBottom: 20,
        // padding: 20
      },
    
      productImage: {
        flex: 1,
      },
      productName: {
        fontWeight: '600',
        fontSize: 21,
        marginTop: 10,
        alignSelf: "flex-start",
        marginLeft: 20,
        paddingRight: 10
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
        color: "#354f52"
      },
      mrpPrice: {
        textDecorationLine: 'line-through',
        fontSize: 16,
      },
      orderButton: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        marginTop: 20,
        borderRadius: 10
      },
      orderButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
      },
      descriptionHeader: {
        fontWeight: '500',
        fontSize: 18,
        marginTop: 10,
        alignSelf: "flex-start",
        marginLeft: 20,
      },
      description: {
        padding: 0,
        alignSelf: "flex-start",
        marginLeft: 40,
      },
      overlay: {
        ...StyleSheet.absoluteFillObject, // This makes the overlay cover the entire container
      },
    });

  return (
    <View style={styles.page}>
    <View style={styles.navbar}>
        <TouchableOpacity style={{
            borderRadius: 10,
            paddingHorizontal: 5,
            paddingLeft: windowWidth*0.033,
        }} onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={25} color="white" />
        </TouchableOpacity>    
    </View>
    <ScrollView >
        <View style={styles.container}>
        <View style={styles.imageContainer}>
      <Image
        source={{ uri: `${BASE_URL}/api/product/view-image/${product.ImageId}` }} // Replace 'product_image_url' with the actual image URL
        style={styles.productImage}
        resizeMode='contain'
      />
      <LinearGradient
       start={{ x: 0, y: 1 }} // Adjust the start point (0, 0) for the desired direction
       end={{ x: 0, y: 0 }}
      colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)']} 
      style={styles.overlay} />
      </View>
      <Text style={styles.productName}>{product.ProductName}</Text>
      <View style={styles.priceBox}>
        <Text style={styles.offerPrice}>&#8377;&nbsp;{product.OfferPrice ?? product.MRP}</Text>
        {product.OfferPrice && <Text style={styles.mrpPrice}>&#8377;&nbsp;{product.MRP}</Text>}
        <TouchableOpacity onPress={() => navigation.navigate("PlaceOrder", {
            productName: product.ProductName,
            productId: product.ProductId,
            pinCode,
            imageId: product.ImageId
        })} style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
      </View>
      {/* <View style={styles.descriptionContainer}> */}
        {/*TO REMOVE */}
      { (!!product.Description) && <>
      <Text style={styles.descriptionHeader}>Description:</Text>
      <Text style={styles.description}>{product.Description}</Text>
      </>}
      <Text style={styles.descriptionHeader}>Production Unit:&nbsp;
      <Text style={{fontWeight: "normal", fontSize: 16}}>{product.ProductionUnit}</Text></Text>
      </View>
    </ScrollView>
    </View>
  );
};



export default ProductDetails;
