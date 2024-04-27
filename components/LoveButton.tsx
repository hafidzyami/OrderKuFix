import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Assuming you're using Expo

interface LoveButtonProps {
    isLoved : boolean,
    onPress : () => void
  }
const LoveButton = ({isLoved, onPress} : LoveButtonProps) => {
  const [liked, setLiked] = useState<boolean>(isLoved);

  const handlePress = () => {
    setLiked((isLiked) => !isLiked);
    onPress()
  };

  return (
    <Pressable onPress={handlePress}>
      <MaterialCommunityIcons
        name={liked ? 'heart' : 'heart-outline'}
        size={32}
        color={liked ? 'red' : 'black'}
      />
    </Pressable>
  );
};

export default LoveButton;
