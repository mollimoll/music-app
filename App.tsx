import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import { LoginScreen } from "./src/screens/Login"
import { SearchScreen } from "./src/screens/Search"

const Stack = createStackNavigator()

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Search' component={SearchScreen} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default App
