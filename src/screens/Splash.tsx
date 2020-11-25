import React, { useEffect, useState } from "react"
import * as WebBrowser from "expo-web-browser"
import * as SecureStore from "expo-secure-store"
import { StyleSheet, Text, SafeAreaView } from "react-native"

import { MY_SECURE_AUTH_STATE_KEY } from "./Login"

export const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY).then((res) =>
      res ? navigation.navigate("Search") : navigation.navigate("Login")
    )
  })

  return (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: "black",
  },
})
