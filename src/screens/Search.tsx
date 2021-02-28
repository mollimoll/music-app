import * as SecureStore from "expo-secure-store"
import * as WebBrowser from "expo-web-browser"
import React, { useState } from "react"
import { Button, FlatList, SafeAreaView, StyleSheet, Text } from "react-native"
import { getNewReleases } from "../../index"
import { MY_SECURE_AUTH_STATE_KEY } from "./Login"

WebBrowser.maybeCompleteAuthSession()

export const SearchScreen = () => {
  const [authToken, setAuthToken] = useState("")
  SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY).then(
    (res) => res && setAuthToken(res)
  )
  const [results, setResults] = useState(undefined as any)

  const fetchNewReleases = async () => {
    if (authToken) {
      const newReleases = await getNewReleases({
        query: { country: "us" },
        auth_token: authToken,
      })
      setResults(newReleases)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button
        disabled={!authToken}
        title='Fetch New Releases'
        onPress={async () => await fetchNewReleases()}
      />
      {results ? (
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
      ) : null}
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
