import React, { useMemo, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native"

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
          if (gestureState.dx > 120) {
            Animated.spring(pan, {
              toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
              useNativeDriver: false,
            }).start(() => {
              setCurrentIndex(currentIndex + 1)
              pan.setValue({ x: 0, y: 0 })
            })
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.content}>
        {secondItem && (
          <Animated.View key={secondItem.id} style={styles.animated}>
            <Image
              style={styles.image}
              source={{ uri: secondItem.images[0].url }}
            />
          </Animated.View>
        )}
        {item && (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[rotateAndTransform, styles.animated]}
          >
            <Image style={styles.image} source={{ uri: item.images[0].url }} />
          </Animated.View>
        )}
      </View>
      <View style={styles.footer}></View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    height: 60,
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
  image: {
    height: SCREEN_WIDTH - 20,
    width: SCREEN_WIDTH - 20,
  },
  footer: {
    height: 60,
  },
})
