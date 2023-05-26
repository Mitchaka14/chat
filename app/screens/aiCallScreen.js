// ./app/screens/AICallScreen.js

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const AICallScreen = ({ route }) => {
    const { character } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: character.imageUrl }} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    }
});

export default AICallScreen;
