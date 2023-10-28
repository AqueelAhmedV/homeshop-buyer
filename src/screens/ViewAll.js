import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons as Icon, AntDesign } from '@expo/vector-icons'
import { TouchableWithoutFeedback } from 'react-native';
import { theme } from '../core/theme';
import { StatusBar } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../constants/endpoints';
import { categories } from '../constants/categories';
import { ActivityIndicator } from 'react-native';
import Header from '../components/Header';

const HomeScreen = ({ navigation, route }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { pinCode, category } = route.params // Replace with your actual PIN code
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  function fetchProducts(searchStr="") {
    setLoading(true)
    axios.post(`${BASE_URL}/api/product/list-buyer-category`, {
      pinCode,
      searchStr,
      category
    }).then((res) => {
      console.log(res)
      setLoading(false)
      setProducts(res.data)
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

  StatusBar.setBackgroundColor(theme.colors.primary)
  return (
    // <TouchableWithoutFeedback onPress={handleDismissSearch}>
      <View style={styles.container}>
      <View style={styles.navbar}>
          {/* Search Bar */}
          
          <View style={styles.searchBar}>
           <TouchableOpacity style={{
              borderRadius: 10,
              paddingHorizontal: 5,
              paddingTop: 3
            }} onPress={searchVisible?handleSearchBack:() => navigation.goBack()}>
              <AntDesign name="left" size={25} color="white" />
            </TouchableOpacity>
            {searchVisible && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />)
            }
            {!searchVisible && 
            <View style={{
                
                width: "80%"
            }}>
                <Text style={{
                    fontWeight: "semibold",
                    fontSize: 24,
                    color: "#fff",
                    paddingLeft: 10
                }}>Groceries</Text>
            </View>}
            <TouchableOpacity style={{
              backgroundColor: searchVisible?"white":"transparent",
              borderRadius: 10,
              paddingHorizontal: 5,
              paddingTop: 3
            }} onPress={!searchVisible?() => setSearchVisible(true):handleSearch}>
              <Icon name="search" size={25} color={!searchVisible?"white":theme.colors.primary} />
            </TouchableOpacity>
          </View>
      </View>
    
      <ScrollView style={styles.container}>

      {/* Categories and Products */}
      <View style={styles.categoryContainer}>
      {loading && <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      }
      
      <View key={category}>
          <View style={styles.productsContainer}>
            {products.map((product) => (
              <TouchableOpacity key={product.ProductId} onPress={() => {
                navigation.navigate("ViewProduct", { product })
              }}>
              <View style={styles.productCard} key={product.ProductId}>
                <Image source={{ uri: `${BASE_URL}/api/product/view-image/${product.ImageId}` }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.ProductName}</Text>
                  <Text style={styles.productPrice}>
                    {product.OfferPrice ? (
                      <>
                        {product.OfferPrice}
                        <Text style={styles.mrp}>{product.MRP}</Text>
                      </>
                    ) : (
                      product.MRP
                    )}
                  </Text>
                </View>
              </View>
              </TouchableOpacity>
            ))
            }
          </View>
        </View>
      </View>
    </ScrollView>
    </View>
    // </TouchableWithoutFeedback>
  );
};

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
    height: 60, // You can adjust the height as needed
    padding: 0,
    margin: 0,
    width: "100%",
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
    paddingRight: 20,
    paddingLeft:0,
    height: 32
  },
  searchInput: {
    backgroundColor: "#fff",
    flex: 1,
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 5,
    fontSize: 20,
    marginRight: 10,
    paddingLeft: 5
  },
  pinCodeText: {
    fontSize: 16,
    paddingHorizontal: 20,
    marginTop: 10
  },
  categoryTitle: {
    fontSize: 20,
    marginTop: 10,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  categoryContainer: {
    paddingHorizontal: 10,
  },  
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  productCard: {
    width: 185,
    height: 240,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
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
    fontSize: 14,
    marginTop: 5,
  },
  mrp: {
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  viewAllLink: {
    alignSelf: 'flex-end',
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
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

export default HomeScreen;
