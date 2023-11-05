import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'



import {
  StartScreen,
  Dashboard,
  ViewAll,
  ViewProduct,
  PlaceOrder,
} from './src/screens'
import 'react-native-gesture-handler'
import { StatusBar } from 'react-native'

const Stack = createStackNavigator()

export default function App() {
  
  StatusBar.setBackgroundColor(theme.colors.primary)
  StatusBar.setHidden(false)
  return (
    <Provider theme={theme}>
      <StatusBar hidden={false} backgroundColor={theme.colors.primary}/>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
            cardStyle: {
                backgroundColor: theme.colors.primary,
            }
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ViewAll" component={ViewAll} />
          <Stack.Screen name="ViewProduct" component={ViewProduct}/>
          <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
