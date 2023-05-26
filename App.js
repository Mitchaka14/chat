// ./App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,  HeaderBackButton } from '@react-navigation/stack';
import { Text, StatusBar } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/Login';
import RegisterScreen from './app/screens/Register';
import CharacterMenu from './app/screens/characterMenu';
import CreateCharacter from './app/screens/createCharacter';
import ConverseCharacter from './app/screens/converseCharacter';
import AICallScreen from './app/screens/aiCallScreen'
import Header from './app/components/Header'; // Import your Header component

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <StatusBar backgroundColor="#0000FF" />
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#5ed5d2',
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{
                        headerTitle: () => <Text>Welcome</Text>,
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerTitle: () => <Text>Login</Text>,
                    }}
                />
                <Stack.Screen
                    name="Chats"
                    component={CharacterMenu}
                    options={{
                        headerTitle: () => <Text></Text>,
                    }}
                />
                <Stack.Screen
                    name="CreateCharacter"
                    component={CreateCharacter}
                    options={{
                        headerTitle: () => <Text>Create Character</Text>,
                    }}
                />
                  <Stack.Screen
                      name="ConverseCharacter"
                      component={ConverseCharacter}
                      options={({ route, navigation }) => ({
                          headerTitle: () => (
                        <Header 
                image={route.params.character.imageUrl} 
                name={route.params.character.name} 
                onCallPress={() => navigation.navigate('AICallScreen', { character: route.params.character })}
                onCharacterPress={() => navigation.navigate('CreateCharacter')}
            />
                          ),
                      })}
                  />
                  <Stack.Screen
                      name="AICallScreen"
                      component={AICallScreen}
                      options={{
                          headerTitle: () => <Text>AI Call Screen</Text>,
                      }}
                  />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{
                        headerTitle: () => <Text>Register</Text>,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
