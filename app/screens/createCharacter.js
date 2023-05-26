import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Text, TextInput, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage, auth } from '../logic/firebase';
import * as ImagePicker from 'expo-image-picker';

function CreateCharacter({ navigation, route }) {
    const [characterName, setCharacterName] = useState('');
    const [characterSummary, setCharacterSummary] = useState('');
    const [characterBackground, setCharacterBackground] = useState('');
    const [characterTraits, setCharacterTraits] = useState('');
    const [characterImage, setCharacterImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route.params && route.params.character) {
            const character = route.params.character;
            setCharacterName(character.name);
            setCharacterImage(character.imageUrl);
            setCharacterSummary(character.summary);
            setCharacterBackground(character.background);
            setCharacterTraits(character.traits);
        }
    }, [route.params]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setCharacterImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        setLoading(true);
        try {
            const response = await fetch(characterImage);
            const blob = await response.blob();
            const fileName = characterImage.substring(characterImage.lastIndexOf('/') + 1);
            const fileRef = ref(storage, `character_images/${auth.currentUser.uid}/${fileName}`);
            await uploadBytes(fileRef, blob);
            const downloadURL = await getDownloadURL(fileRef);
            setCharacterImage(downloadURL);
            return downloadURL;
        } catch (error) {
            console.error("Image upload error: ", error);
            setLoading(false);
            Alert.alert("Error", "Failed to upload image");
            return null;
        }
    }

    const handleSave = async () => {
        if (loading) {
            Alert.alert("Please wait", "Image upload in progress");
            return;
        }

        if (characterImage && !characterImage.startsWith("http")) {
            await uploadImage();
        }

        try {
            const characterData = {
                name: characterName,
                imageUrl: characterImage,
                summary: characterSummary,
                background: characterBackground,
                traits: characterTraits,
                userId: auth.currentUser.uid
            };

            if (route.params && route.params.character) {
                const character = route.params.character;
                await updateDoc(doc(db, 'characters', character.id), characterData);
                Alert.alert("Success", "Character updated successfully");
            } else {
                await addDoc(collection(db, 'characters'), characterData);
                Alert.alert("Success", "Character created successfully");
            }
            navigation.navigate('Chats');
        } catch (error) {
            console.error("Character save error: ", error);
            Alert.alert("Error", "Failed to save character");
        }
    }

    const handleDelete = async () => {
        try {
            if (route.params && route.params.character) {
                const character = route.params.character;
                await deleteDoc(doc(db, 'characters', character.id));
                Alert.alert("Success", "Character deleted successfully");
                navigation.navigate('Chats');
            } else {
                Alert.alert("Error", "No character to delete");
            }
        } catch (error) {
            console.error("Character delete error: ", error);
            Alert.alert("Error", "Failed to delete character");
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Create Character</Text>
            <Image
                style={styles.image}
                source={{uri: characterImage ? characterImage : 'http://placehold.it/100'}}
            />
            <TouchableOpacity onPress={pickImage}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Character Name" onChangeText={setCharacterName} value={characterName} />
            <TextInput style={styles.input} placeholder="Character Summary" onChangeText={setCharacterSummary} value={characterSummary} />
            <TextInput style={styles.input} placeholder="Character Background" onChangeText={setCharacterBackground} value={characterBackground} />
            <TextInput style={styles.input} placeholder="Character Traits" onChangeText={setCharacterTraits} value={characterTraits} />
            <View style={styles.buttonContainer}>
                <Button title="Delete Character" onPress={handleDelete} color="red" />
                <Button title="Save Character" onPress={handleSave} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      fontSize: 24,
      marginBottom: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
    },
    editText: {
        textAlign: 'center',
        color: 'blue',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default CreateCharacter;
