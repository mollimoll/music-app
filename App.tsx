import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { LoginScreen } from "./src/screens/Login"
import { SearchScreen } from "./src/screens/Search"
import { BpmSearchScreen } from "./src/screens/BpmSearch"
import { SplashScreen } from "./src/screens/Splash"
import { SliderScreen } from "./src/screens/Slider"

const Tabs = createBottomTabNavigator()

const App = () => (
  <NavigationContainer>
    <Tabs.Navigator
      initialRouteName='Slider'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === "Login" ? "ios-log-in" : "ios-search"
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tabs.Screen name='Splash' component={SplashScreen} />
      <Tabs.Screen name='Login' component={LoginScreen} />
      <Tabs.Screen name='Search' component={SearchScreen} />
      <Tabs.Screen name='BPM Search' component={BpmSearchScreen} />
      <Tabs.Screen name='Slider' component={SliderScreen} />
    </Tabs.Navigator>
  </NavigationContainer>
)

export default App
