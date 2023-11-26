import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard, 
} from 'react-native';
import { useCreateUserMutation, useUpdateUserMutation } from '../../store/api/usersApi';
import i18n from '../../../i18n';

const UserForm = ({ route, navigation }) => {
  const user = route.params?.user; // Ta emot användarparametern
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const [createUser, { isLoading: isCreating, isError: isCreateError }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating, isError: isUpdateError }] = useUpdateUserMutation();

  const lastNameInputRef = useRef(null);

  const handleCreate = async () => {
    // Logik för att skapa en ny användare
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Fel', 'Fyll i båda fältet.');
      return;
    }

    try {
      const result = await createUser({ user: { firstName, lastName } }).unwrap();
      Alert.alert('Succe', 'Du har skapat en användare');
      setFirstName('');
      setLastName('');
      navigation.navigate('UserList');
    } catch (error) {
      Alert.alert('Fel', error.data ? error.data : 'Ett fel har inträffat. Försök igen.');
    }
  };

  const handleUpdate = async () => {
    // Logik för att uppdatera en befintlig användare
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Fel', 'Fyll i båda fälten.');
      return;
    }

    try {
      await updateUser({ userId: user.id, user: { firstName, lastName } }).unwrap();
      Alert.alert('Succe', 'Användaren har uppdaterats');
      setFirstName('');
      setLastName('');
      navigation.navigate('UserList');
    } catch (error) {
      Alert.alert('Fel', error.data ? error.data : 'Fel, Ett fel har inträffat, försök igen.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{user ? 'Redigera din användare' : 'Skapa din användare'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Förnamn"
          value={firstName}
          onChangeText={setFirstName}
          returnKeyType="next"
          onSubmitEditing={() => lastNameInputRef.current.focus()}
          blurOnSubmit={false}
        />

        <TextInput
          ref={lastNameInputRef}
          style={styles.input}
          placeholder="Efternamn"
          value={lastName}
          onChangeText={setLastName}
          returnKeyType="done"
          onSubmitEditing={user ? handleUpdate : handleCreate}
        />

        {user ? (
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isUpdating}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isUpdating ? 'Loading...' : 'Uppdatera användare'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleCreate}
            disabled={isCreating}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isCreating ? 'Loading...' : 'Skapa användare'}
            </Text>
          </TouchableOpacity>
        )}

        {(isCreateError || isUpdateError) && (
          <Text style={styles.errorText}>
            Error occurred while {user ? 'updating' : 'creating'} user.
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  errorText: {
    color: 'red',
    marginTop: 15,
  },
});

export default UserForm;
