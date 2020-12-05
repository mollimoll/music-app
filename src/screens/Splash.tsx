import React, { useEffect } from "react"
import * as WebBrowser from "expo-web-browser"
import {
  loadAsync,
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session"
import * as SecureStore from "expo-secure-store"
import { StyleSheet, Text, SafeAreaView } from "react-native"

import { MY_SECURE_AUTH_STATE_KEY } from "./Login"
import { credentials } from "../../credentials"

const { clientId } = credentials

WebBrowser.maybeCompleteAuthSession()

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
}

export const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    loadAsync(
      {
        responseType: ResponseType.Token,
        clientId,
        scopes: ["user-read-email", "playlist-modify-public"],
        // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
        // this must be set to false
        usePKCE: false,
        // For usage in managed apps using the proxy
        redirectUri: makeRedirectUri({
          // For usage in bare and standalone
          native: "exp://192.168.2.8:19000",
        }),
      },
      discovery
    ).then((res) => console.log("RESULT", res.extraParams))
    // SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY).then((res) =>
    //   res ? navigation.navigate("Search") : navigation.navigate("Login")
    // )
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
