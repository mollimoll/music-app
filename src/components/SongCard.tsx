import React from "react"
import { Dimensions, Image, StyleSheet, Text, View } from "react-native"

const SCREEN_WIDTH = Dimensions.get("window").width
const FONT_SIZE = 20

export const SongCard = ({ song }: any) => {
  console.log(song)

  const artists = song.artists.map((artist) => artist.name).join(", ")

  return (
    <View style={styles.view}>
      <Image style={styles.image} source={{ uri: song.images[0].url }} />
      <Text style={styles.song}>{song.name}</Text>
      <Text style={styles.text}>{artists}</Text>
      <Text style={styles.text}>{song.album_name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: "white",
    height: "100%",
    width: SCREEN_WIDTH - 20,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  image: {
    height: SCREEN_WIDTH - 20,
    width: "100%",
  },
  text: {
    fontSize: FONT_SIZE,
    lineHeight: FONT_SIZE * 1.5,
    textAlign: "center",
  },
  song: {
    fontSize: FONT_SIZE * 1.5,
    lineHeight: FONT_SIZE * 1.5 * 1.5,
    textAlign: "center",
  },
})
