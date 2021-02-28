import React, { useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SongCard } from "../components/SongCard"

const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width

export const SliderScreen = ({ route }: any) => {
  const pan = useRef(new Animated.ValueXY()).current
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data } = route.params
  const item = data[currentIndex]
  const secondItem = data[currentIndex + 1]

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (evt, gestureState) => {
          // swipe right
          if (gestureState.dx > 120) {
            Animated.spring(pan, {
              toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
              useNativeDriver: false,
            }).start(() => {
              setCurrentIndex(currentIndex + 1)
              pan.setValue({ x: 0, y: 0 })
            })
            // swipe left
          } else if (gestureState.dx < -120) {
            Animated.spring(pan, {
              toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
              useNativeDriver: false,
            }).start(() => {
              setCurrentIndex(currentIndex + 1)
              pan.setValue({ x: 0, y: 0 })
            })
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start()
          }
        },
      }),
    [currentIndex]
  )

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  })

  const rotateAndTransform = {
    transform: [{ rotate }, ...pan.getTranslateTransform()],
  }

  const likeOpacity = {
    opacity: pan.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    }),
  }

  const dislikeOpacity = {
    opacity: pan.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: "clamp",
    }),
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {secondItem ? (
          <Animated.View key={secondItem.id} style={styles.animated}>
            <SongCard song={secondItem} />
          </Animated.View>
        ) : null}
        {item ? (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[rotateAndTransform, styles.animated]}
          >
            <Animated.View style={[likeOpacity, styles.likeAnimation]}>
              <Text style={styles.like}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[dislikeOpacity, styles.dislikeAnimation]}>
              <Text style={styles.dislike}>NOPE</Text>
            </Animated.View>
            <SongCard song={item} />
          </Animated.View>
        ) : null}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  content: {
    flex: 1,
  },
  animated: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: SCREEN_HEIGHT - 200,
    width: SCREEN_WIDTH,
  },
  like: {
    borderWidth: 1,
    borderColor: "green",
    color: "green",
    fontSize: 32,
    fontWeight: "800",
    padding: 10,
  },
  likeAnimation: {
    transform: [{ rotate: "-30deg" }],
    position: "absolute",
    top: 50,
    left: 40,
    zIndex: 1000,
  },
  dislike: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
    fontSize: 32,
    fontWeight: "800",
    padding: 10,
  },
  dislikeAnimation: {
    transform: [{ rotate: "30deg" }],
    position: "absolute",
    top: 50,
    right: 40,
    zIndex: 1000,
  },
})
