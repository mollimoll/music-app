import React, { useEffect } from "react"
import * as WebBrowser from "expo-web-browser"
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session"
import * as SecureStore from "expo-secure-store"
import { StyleSheet, Button, SafeAreaView } from "react-native"

import { credentials } from "../../credentials"

const { clientId } = credentials

WebBrowser.maybeCompleteAuthSession()

export const MY_SECURE_AUTH_STATE_KEY = "MySecureAuthStateKey"

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
}

export const LoginScreen = ({ navigation }) => {
  const [request, response, promptAsync] = useAuthRequest(
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
        native: "exp://192.168.1.105:19000",
      }),
    },
    discovery
  )

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params

      if (SecureStore.isAvailableAsync()) {
        // Securely store the auth on your device
        SecureStore.setItemAsync(
          MY_SECURE_AUTH_STATE_KEY,
          access_token
        ).then(() => navigation.navigate("BPM Search"))
      }
    }
  }, [response])

  return (
    <SafeAreaView style={styles.container}>
      <Button
        disabled={!request}
        title='Login'
        onPress={() => {
          promptAsync()
        }}
      />
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
