import React, { useEffect, useState } from "react"
import * as WebBrowser from "expo-web-browser"
import * as SecureStore from "expo-secure-store"
import {
  StyleSheet,
  Text,
  Button,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { SliderScreen } from "./Slider"

import { MY_SECURE_AUTH_STATE_KEY } from "./Login"
import { getSongsByBpm } from "../../index"

WebBrowser.maybeCompleteAuthSession()

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export const BpmSearchScreen = () => {
  const [results, setResults] = useState(undefined as any)
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [authToken, setAuthToken] = useState("")
  SecureStore.getItemAsync(MY_SECURE_AUTH_STATE_KEY).then(
    (res) => res && setAuthToken(res)
  )

  const fetchByBpm = async () => {
    if (authToken) {
      const songs = await getSongsByBpm({
        auth_token: authToken,
        query: { country: "us", min, max },
      })
      console.log(songs[0].images[0].url)
      setResults(songs)
    }
  }

  return (
    <DismissKeyboard>
      {results ? (
        <SliderScreen data={results} />
      ) : (
        <SafeAreaView style={styles.container}>
          <>
            <Text>Max</Text>
            <TextInput
              style={{
                height: 40,
                width: "50%",
                borderColor: "gray",
                borderWidth: 1,
              }}
              clearTextOnFocus
              keyboardType='number-pad'
              placeholder={"0"}
              onChangeText={(num: string) => setMax(num)}
              value={max}
              key='Max'
            />
            <Text>Min</Text>
            <TextInput
              style={{
                height: 40,
                width: "50%",
                borderColor: "gray",
                borderWidth: 1,
              }}
              clearTextOnFocus
              keyboardType='number-pad'
              placeholder={"0"}
              onChangeText={(num: string) => setMin(num)}
              value={min}
              key='Min'
            />
            <Button
              disabled={!authToken}
              title='Fetch New Releases'
              onPress={async () => await fetchByBpm()}
            />
            {results && (
              <FlatList
                data={results}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <Text
                    key={item.name}
                    style={styles.item}
                  >{`${item.name} - ${item.artists[0].name} - ${item.tempo}`}</Text>
                )}
              />
            )}
          </>
        </SafeAreaView>
      )}
    </DismissKeyboard>
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
