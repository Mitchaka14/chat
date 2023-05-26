// ./app/screens/characterMenu.js
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { collection, doc, onSnapshot, orderBy, limit, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../logic/firebase';

function CharacterMenu({ navigation }) {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "characters"), where("userId", "==", auth.currentUser.uid)), async (querySnapshot) => {
            let charactersData = [];
            for (let doc of querySnapshot.docs) {
                const messagesSnap = await getDocs(query(collection(doc.ref, 'messages'), orderBy('timestamp', 'desc'), limit(1)));
                const lastMessage = messagesSnap.docs[0] ? messagesSnap.docs[0].data() : null;
                charactersData.push({ ...doc.data(), id: doc.id, lastMessage });
            }
            setCharacters(charactersData);
        });
    
        return () => unsub();
    }, []);
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.characterContainer} 
            onPress={() => navigation.navigate('ConverseCharacter', { character: item })}
            onLongPress={() => navigation.navigate('CreateCharacter', { character: item })}>
            <Image
                style={styles.characterImage}
                source={{uri: item.imageUrl ? item.imageUrl : 'http://placehold.it/50'}}
            />
            <View style={styles.characterInfo}>
                <Text style={styles.characterName}>{item.name}</Text>
                <Text style={styles.characterMessage}  numberOfLines={1}>
                  Last message: {item.lastMessage ? item.lastMessage.content : 'No recent messages'}
                </Text>
                <Text style={styles.characterSummary}>{item.summary}</Text>
            </View>
        </TouchableOpacity>
    );
        
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <FlatList
                data={characters}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                
            />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateCharacter')}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECE5DD',
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
        color: '#075E54', // WhatsApp green
        marginLeft: 10,
        marginTop: 10,
    },
    addButton: {
        height: 50,
        width: 50,
        borderColor: '#075E54',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#075E54',
    },
    addButtonText: {
        fontSize: 30,
        color: '#fff',
    },
    characterContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    characterImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    characterInfo: {
        flex: 1,
    },
    characterName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#222',
    },
    characterMessage: {
        fontSize: 14,
        color: 'gray',
    },
    characterDate: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    },
});

export default CharacterMenu;
