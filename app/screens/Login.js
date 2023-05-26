// LoginScreen.js

import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet, Text, KeyboardAvoidingView  } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../logic/firebase'; // replace './firebase' with the relative path to your firebase.js

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const auth = getAuth(app); // use the app instance here
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in
            const user = userCredential.user;
            // Navigate to CharacterMenu after successful login
            navigation.navigate('Chats');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage);
        }
    }

    return (
        <KeyboardAvoidingView
        style={{flex: 1}}
        behavior = "padding"
        enabled = {true}
        >
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
        </View>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingLeft: 8,
    },
});

export default LoginScreen;
