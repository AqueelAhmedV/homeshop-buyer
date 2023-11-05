import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons as Icon, AntDesign, Entypo } from '@expo/vector-icons'
import { theme } from '../core/theme';

import axios from 'axios';
import { BASE_URL } from '../constants/endpoints';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView } from 'react-native';
import { windowHeight, windowWidth } from '../constants/dimesions';


const HomeScreen = ({ navigation, route }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { pinCode } = route.params // Replace with your actual PIN code
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  // useEffect(() => {
  //   navigation.navigate("ViewAll", {
  //     pinCode,
  //     category: "Groceries"
  //   })
  // }, [])

  useEffect(() => {
    axios.get(`${BASE_URL}/api/constants/categories`)
    .then((res) => {
      setCategories(res.data)
    }).catch(console.log)
  }, [])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      // paddingHorizontal: 16,
    },
    navbar: {
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      padding: 0,
      margin: 0,
      width: "100%",
      height: windowHeight*0.08
    },
    searchBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: windowHeight*0.025,
      marginRight: windowWidth*0.03,
      height: "50%"
    },
    searchInput: {
      backgroundColor: "#fff",
      flex: 0.99,
      borderColor: 'gray',
      borderWidth: 0,
      borderRadius: 5,
      fontSize: 20,
      marginRight: 10,
      paddingLeft: 5
    },
    pinCodeText: {
      fontSize: 16,
      paddingLeft: 20,
      marginTop: 10
    },
    categoryTitle: {
      fontSize: 20,
      marginTop: 10,
      width: "fit-content"
    },
    categoryTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: windowWidth*0.05
    },
    categoryContainer: {
      paddingHorizontal: 0,
    },  
    productsContainer: {
      flexDirection: 'row',
      marginTop: 10,
      
    },
    productCard: {
      width: windowWidth*0.5,
      height: 240,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: 'lightgray',
      padding: 10,
      marginBottom: 20
    },
    productImage: {
      width: '100%',
      height: 150,
      objectFit: "contain"
    },
    productInfo: {
      marginTop: 10,
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
    
    },
    productPrice: {
      fontSize: 16,
      marginTop: 5,
    },
    mrp: {
      textDecorationLine: 'line-through',
      marginRight: 5,
    },
    viewAllLink: {
      width: "fit-content",
      alignSelf: 'flex-end',
      marginTop: 10,
      fontSize: 16,
      fontWeight: "600",
      color: '#299c73',
    },
    noProducts: {
      justifyContent: "center",
      marginTop: 70,
      width: "100%",
    },
    noProductsText: {
     fontSize: 16,
     fontWeight: "bold",
     textAlign: "center"
    },
    loading: {
      marginTop: 70
    }
  });
  

  function fetchProducts(searchStr="") {
    setLoading(true)
    axios.post(`${BASE_URL}/api/product/list-buyer`, {
      pinCode,
      searchStr,
      limit: 2
    }).then((res) => {
      console.log(res)
      let categoryData = res.data.reduce((prev, curr) => {
        curr.imageUrl = `${BASE_URL}/api/product/view-image/${curr.ImageId}`
        prev[curr.Category] = res.data.filter(o => o.Category === curr.Category)
        return prev
      }, {})
      console.log(categoryData)
      setLoading(false)
      setProducts(categoryData)
    }).catch((err) => {
      setLoading(false)
      console.log(JSON.parse(JSON.stringify(err)))
    })
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  const handleDismissSearch = () => {
    setSearchVisible(false)
  }

  const handleSearch = () => {
    fetchProducts(searchText)
  }

  const handleSearchBack = () => {
    setSearchVisible(false)
    fetchProducts("")
  }

  const handleChangePin = () => {
    AsyncStorage.removeItem("pinCode")
    navigation.reset({
      index: 0,
      routes: [
        {name: "StartScreen"}
      ]
    })
  }

  return (
    // <TouchableWithoutFeedback onPress={handleDismissSearch}>
      <View style={styles.container}>
      <KeyboardAvoidingView style={styles.navbar}>
          {/* Search Bar */}
          
          <View style={styles.searchBar}>
          {searchVisible && <TouchableOpacity style={{
              borderRadius: 10,
              paddingHorizontal: 5,
              paddingTop: 3
            }} onPress={handleSearchBack}>
              <AntDesign name="left" size={25} color="white" />
            </TouchableOpacity>}
            {searchVisible && (
              <TextInput
                autoFocus
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                onSubmitEditing={handleSearch}
              />)
            }
            <TouchableOpacity style={{
              backgroundColor: searchVisible?"white":"transparent",
              borderRadius: 10,
              paddingHorizontal: 5,
              paddingTop: 3
            }} onPress={!searchVisible?() => setSearchVisible(true):handleSearch}>
              <Icon name="search" size={25} color={!searchVisible?"white":theme.colors.primary} />
            </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    
      <KeyboardAwareScrollView style={styles.container} refreshControl={
        (!loading && <RefreshControl colors={[theme.colors.primary]} refreshing={loading} onRefresh={fetchProducts} />)
      }>
      
      {/* Showing deliverable products to PIN code */}
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Text style={styles.pinCodeText}>
        Showing deliverable products to&nbsp;
        </Text>
        <TouchableOpacity style={{alignItems: "center", justifyContent: "center", marginTop: 10, padding: 0, flexDirection: "row"}} onPress={handleChangePin}>
          <Text style={{textDecorationLine: "underline"}}>{pinCode}</Text>
          <Entypo style={{paddingTop: 3, marginLeft: 3}} name="edit" size={15}/>
        </TouchableOpacity>
      </View>

      {/* Categories and Products */}
      <View style={styles.categoryContainer}>
      {loading && <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      }
      {!loading && (Object.keys(products).length > 0?categories.map((category) => (
        products[category]?<View key={category}>
          <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ViewAll", { category, pinCode })}><Text style={styles.viewAllLink}>View All <AntDesign name="right" size={13}/></Text>
          </TouchableOpacity>
          </View>
          <View style={styles.productsContainer}>
            {products[category].map((product) => (
              <TouchableOpacity key={product.ProductId} onPress={() => navigation.navigate("ViewProduct", {product, pinCode})}>
              <View style={styles.productCard} key={product.ProductId}>
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>{product.ProductName}</Text>
                  <Text style={styles.productPrice}>
                  {product.OfferPrice ? (
                      <>
                        &#8377;&nbsp;{product.OfferPrice}&nbsp;
                        <Text style={styles.mrp}>&#8377;&nbsp;{product.MRP}</Text>
                      </>
                    ) : (
                      <>
                      &#8377;&nbsp;
                      {product.MRP}
                      </>
                    )}
                  </Text>
                </View>
              </View>
              </TouchableOpacity>
            ))
            }
          </View>
        </View>
        :null)):
      (
      <View style={styles.noProducts}>
      <Text style={styles.noProductsText}>No products to show</Text>
    </View>
    ))}
      </View>
    </KeyboardAwareScrollView>
    </View>
    // </TouchableWithoutFeedback>
  );
};




export default HomeScreen;
