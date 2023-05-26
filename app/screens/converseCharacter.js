// ./app/screens/conversCharacter.js
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet,
         ScrollView, KeyboardAvoidingView, TouchableOpacity,
         } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../logic/firebase';
import { format } from 'date-fns'; // to format dates
import { addDoc, collection, onSnapshot, serverTimestamp, orderBy, query } from "firebase/firestore";




async function generateResponse({ input, character, apiKey, conversationHistory, replyContext }) {
    let historyString = conversationHistory.map(msg => `${msg.role === "user" ? "Me" : "You"}: ${msg.content}`).join("\n");
    if (replyContext) {
        const repliedMessage = replyContext.content;
        const previousMessages = conversationHistory.slice(0, conversationHistory.indexOf(replyContext)).map(msg => msg.content).join(", ");
        historyString += `\nThis "${repliedMessage}" was replied to. These messages came before it: "${previousMessages}"`;
    }
    const prompt = `(uses swears and curse)(${historyString})..reply like As ${character.name} who is ${character.background} and personality: ${character.traits}, I am having a conversation with someone. They just asked me: "${input}"\nMy response: `;

    console.log('Messages:', prompt);

    const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt,
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 1,
        }),
    });

    const data = await response.json();
    console.log('Data:', data);
    const output = data.choices[0].text.trim();

    console.log('Output:', output);

    return output;
};

function ConverseCharacter({ navigation, route }) {
    const [messages, setMessages] = useState([]);
    const [apiKey, setApiKey] = useState('');
    const [character, setCharacter] = useState(route.params.character || { name: '', background: '' });
    const [currentMessage, setCurrentMessage] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const [replyContext, setReplyContext] = useState(null); // new state for keeping track of reply context
    const truncatedReplyContent = replyContext?.content.length > 20 ? `${replyContext.content.substring(0, 20)}...` : replyContext?.content;


    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const docRef = doc(db, 'OpenAI', 'ApiKey');
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    console.log("API key fetched successfully!");
                    const data = docSnapshot.data();
                    if (data && 'key' in data) {
                        setApiKey(data.key);
                    } else {
                        console.log("No 'key' in the document!");
                    }
                } else {
                    console.log("No API key found!");
                }
            } catch (error) {
                console.log("Error fetching API key: ", error);
            }
        };

        fetchApiKey();
    }, []);
    useEffect(() => {
        const messagesRef = collection(db, 'characters', character.id, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'));
        const unsub = onSnapshot(q, snapshot => {
            let loadedMessages = [];
            snapshot.docs.forEach(doc => {
                loadedMessages.push({ id: doc.id, ...doc.data() });
            });
            setMessages(loadedMessages.reverse());
            // Also set the conversation history here using the last five messages
            setConversationHistory(loadedMessages.slice(-5));
        });
    
        return () => unsub();
    }, []);
    const scrollViewRef = useRef();
    const handleSend = async () => {
        if (currentMessage.trim().length > 0 && character && apiKey) {
            // Prepare the new user message
            const newMessage = { role: "user", content: currentMessage, timestamp: serverTimestamp(), repliedTo: replyContext ? replyContext.id : null };
            // Add the new message to local state
            setMessages(prevMessages => [...prevMessages, newMessage]);
            // Add the new message to Firestore
            await addDoc(collection(db, 'characters', character.id, 'messages'), newMessage);
            // Add the new message to the conversation history
            setConversationHistory(prevHistory => [...prevHistory, { role: "user", content: currentMessage.trim() }]);
    
            // Generate the AI's response using the last five messages as context
            const lastFiveMessages = messages.slice(-5);
            const output = await generateResponse({ input: currentMessage.trim(), character, apiKey, conversationHistory: lastFiveMessages, replyContext: replyContext });
   
            // Prepare the new AI message
            const aiMessage = { role: "assistant", content: output, timestamp: serverTimestamp(), repliedTo: replyContext ? replyContext.id : null };
            // Add the new AI message to local state
            setMessages(prevMessages => [...prevMessages, aiMessage]);
            // Add the new AI message to Firestore
            await addDoc(collection(db, 'characters', character.id, 'messages'), aiMessage);
            // Add the new AI message to the conversation history
            setConversationHistory(prevHistory => [...prevHistory, { role: "assistant", content: output }]);
    
            // Clear the input field
            setCurrentMessage('');
            // Also reset the reply context
            setReplyContext(null);
            // Scroll to the bottom of the conversation
            scrollViewRef.current.scrollToEnd({ animated: true });
        } else {
            console.log('Missing necessary properties!');
            console.log('currentMessage:', currentMessage);
            console.log('character:', character);
            console.log('apiKey:', apiKey);
        }
    };

    return (
        <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 70}
        enabled= {true}
    >
        <ScrollView 
            style={styles.chatContainer}
            ref={scrollViewRef}
        >
{messages.map((message, index) => {
    const isUserMessage = message.role === "user";
    const previousMessageTimestamp = index > 0 ? messages[index - 1].timestamp : null;
    const showTimestamp = previousMessageTimestamp && (message.timestamp - previousMessageTimestamp >= 10 * 60 * 1000);

    return (
        <TouchableOpacity 
            key={index} 
            onPress={() => !isUserMessage && setReplyContext(message)}
            onLongPress={() => { // Added long press event here
                // Functionality to show an option to copy and the timestamp
                alert('Long press detected'); // Replace this with your modal/alert implementation
            }}
        >
            <View style={isUserMessage ? styles.userMessageBox : styles.aiMessageBox}>
                <Text style={isUserMessage ? styles.userMessage : styles.aiMessage}>{message.content}</Text>
                {showTimestamp && <Text style={styles.messageDate}>{format(new Date(), 'PPpp')}</Text>} 
            </View>
        </TouchableOpacity>
    )
})}
        </ScrollView>

        {replyContext && (
            <View style={styles.replyPreview}>
                <Text>Replying to: "{truncatedReplyContent}"</Text>
                <Button title="Cancel" onPress={() => setReplyContext(null)} />
            </View>
        )}

        <View style={styles.inputContainer}>
            <TextInput 
                style={styles.inputField}
                value={currentMessage} 
                onChangeText={setCurrentMessage}
                placeholder="Type your message here"
            />
            <Button title="Send" onPress={handleSend} />
        </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        behavior:'padding',
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    userMessageBox: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        padding: 10,
        borderRadius: 5,
        margin: 5,
    },
    aiMessageBox: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        margin: 5,
    },
    userMessage: {
        color: '#000',
    },
    aiMessage: {
        color: '#000',
    },
    messageDate: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        margin: 10,
    },
    inputField: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#dedede',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    replyPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
    },
});

export default ConverseCharacter;
