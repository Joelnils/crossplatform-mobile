import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux'; //  useSelector
import { useCreatePostMutation } from '../../store/api/postsApi';

const PostForm = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [createPost] = useCreatePostMutation();

  // Hämta den inloggade användarens data från Redux 
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  const handleCreatePost = async () => {
    try {
    await createPost({
      text: postText,
      createdByName: `${loggedInAs.firstName} ${loggedInAs.lastName}`, 
      createdDate: new Date().toLocaleDateString()
    }).unwrap();


      setPostText('');
      Alert.alert('Lyckades', 'Ditt inlägg har skapats');
    } catch (error) {
      Alert.alert('Error', 'Du misslyckades att skapa ett inlägg');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Inlägg"
        value={postText}
        onChangeText={setPostText}
      />
         <TouchableOpacity
        onPress={handleCreatePost}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Skapa Inlägg</Text>
      </TouchableOpacity>
    </View>
  );
};

// ... styles ...



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default PostForm;
