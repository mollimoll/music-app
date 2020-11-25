import React, { useEffect } from "react"
import * as WebBrowser from "expo-web-browser"
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session"
import { StyleSheet, Button, SafeAreaView } from "react-native"

import { getNewReleases } from "../../index"

import { credentials } from "../../credentials"

const { clientId } = credentials

WebBrowser.maybeCompleteAuthSession()

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
        native: "exp://192.168.2.8:19000",
      }),
    },
    discovery
  )

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params
      console.log("code", access_token)
    }
  }, [response])

  return (
    <SafeAreaView style={styles.container}>
      <Button
        disabled={!request}
        title='Login'
        onPress={() => {
          promptAsync().then(navigation.navigate("Search"))
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
