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

type Props = {
  route: {
    params: {
      authToken: string
    }
  }
}

export const SearchScreen = ({ route }: Props) => {
  const { authToken } = route.params
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
