import React from 'react';
import { Image, ImageBackground, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

function WelcomeScreen({ navigation }) {
    return (
        <ImageBackground 
        style={styles.background}
        source={require("../assets/background2.jpg")}
        >
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../assets/logo.png")} />
                <Text style={styles.textStyle}>Hello</Text>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background : {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
    },
    loginButton: {
        width: '100%',
        height: 70,
        backgroundColor: '#fc5c65',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButton: {
        width: '100%',
        height: 70,
        backgroundColor: '#4ecdc4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoContainer: {
        position: 'absolute',
        top: 70,
        alignItems: "center",
    },
    textStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)', // Change this color to your desired color.
        padding: 10,
        borderRadius: 5,
        color: 'white' // Change this color to your desired text color.
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    }
})

export default WelcomeScreen;
