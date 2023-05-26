// ./app/components/Header.js

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const Header = ({ image, name, onCallPress, onCharacterPress }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <TouchableOpacity onPress={onCharacterPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
        <Text>{name}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={onCallPress}>
      <Ionicons 
        name="call" 
        size={24} 
        color="white"
      />
    </TouchableOpacity>
  </View>
);

export default Header;
