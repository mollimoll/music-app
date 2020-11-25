import React, { useEffect, useState } from "react"
import * as WebBrowser from "expo-web-browser"
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session"
import { StyleSheet, Text, Button, FlatList, SafeAreaView } from "react-native"

import { getNewReleases } from "../../index"

import { credentials } from "../../credentials"

const { clientId } = credentials

WebBrowser.maybeCompleteAuthSession()

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
}

export default function App() {
  const [results, setResults] = useState(undefined as any)
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

  const fetchNewReleases = async () => {
    if (response?.type === "success") {
      const { access_token } = response.params
      const newReleases = await getNewReleases({
        query: { country: "us" },
        auth_token: access_token,
      })
      setResults(newReleases)
    }
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params
      console.log("code", access_token)
    }
  }, [response])

  return (
    <SafeAreaView style={styles.container}>
      <Button
        disabled={!response}
        title='Fetch New Releases'
        onPress={async () => await fetchNewReleases()}
      />
      <Button
        disabled={!request}
        title='Login'
        onPress={() => {
          promptAsync()
        }}
      />
      {results && (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <>
              <Text
                style={styles.item}
              >{`${item.name} - ${item.artists[0].name}`}</Text>
            </>
          )}
        />
      )}
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
