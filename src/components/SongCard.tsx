import React from "react"
import { Dimensions, Image, StyleSheet } from "react-native"

const SCREEN_WIDTH = Dimensions.get("window").width

export const SongCard = ({ song }: any) => (
  <Image style={styles.image} source={{ uri: song.images[0].url }} />
)

const styles = StyleSheet.create({
  image: {
    height: SCREEN_WIDTH - 20,
    width: SCREEN_WIDTH - 20,
  },
})
