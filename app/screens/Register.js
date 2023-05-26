// RegisterScreen.js

import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet, Text } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../logic/firebase'; // replace './firebase' with the relative path to your firebase.js

function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    
    const handleRegister = async () => {
        if(password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }
        
        const auth = getAuth(app); // use the app instance here
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Signed in 
            const user = userCredential.user;
            // ...
            console.log("User registered: ", user);
            navigation.navigate('Login'); // Go to Login screen after registration
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.input} placeholder="Name" onChangeText={setDisplayName} />
            <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={setConfirmPassword} secureTextEntry />
            <Button title="Register" onPress={handleRegister} />
        </View>
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

export default RegisterScreen;