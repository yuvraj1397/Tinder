import React, { Fragment, useCallback } from "react";
import { View, Image, StyleSheet, Dimensions, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Choice from "./Choice";

const { width , height } = Dimensions.get("screen");

const Card = ({ image, isFirst, swipe, titlSign, ...rest }) => {
    // Calculate the rotation of the card based on swipe gesture
    const rotate = Animated.multiply(swipe.x, titlSign).interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ['8deg', '0deg', '-8deg']
    });

    // Animated style for the card with rotation and translation
    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(), { rotate }]
    }

    // Opacity animation for the "like" button
    const likeOpacity = swipe.x.interpolate({
        inputRange: [25, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    // Opacity animation for the "nope" button
    const nopeOpacity = swipe.x.interpolate({
        inputRange: [-100, -25],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    // Function to render the "like" and "nope" buttons conditionally
    const renderChoice = useCallback(() => {
        return (
            <Fragment>
                <Animated.View
                    style={[
                        styles.choiceContainer,
                        styles.likeContainer,
                        { opacity: likeOpacity }
                    ]}>
                    <Choice type="like" />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.choiceContainer,
                        styles.nopeContainer,
                        { opacity: nopeOpacity }
                    ]}>
                    <Choice type="nope" />
                </Animated.View>
            </Fragment>
        )
    }, [likeOpacity, nopeOpacity])

    return (
        <Animated.View style={[
            styles.container,
            isFirst && animatedCardStyle
        ]} {...rest}>
            <Image source={image} style={styles.image} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,.9)']}
                style={styles.gradient}/>
            {isFirst && renderChoice()}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 25
    },
    image: {
        width: width * 0.9,
        height: height * 0.78,
        borderRadius: 20
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        borderRadius: 20
    },
    choiceContainer: {
        position: 'absolute',
        top: 100
    },
    likeContainer: {
        left: 45,
        transform: [{ rotate: '-30deg' }]
    },
    nopeContainer: {
        right: 45,
        transform: [{ rotate: '30deg' }]
    },
})

export default Card;
