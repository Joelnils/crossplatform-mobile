import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, StyleSheet, Alert, ScrollView } from "react-native";
import { useGetUsersQuery, useDeleteUserMutation } from "../../store/api/usersApi";
import { useDeletePostMutation} from "../../store/api/postsApi"
import { ListItem } from "@rneui/themed";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';

const UserList = ({navigation}) => {
    const { data, refetch } = useGetUsersQuery({});
    const [deleteUser] = useDeleteUserMutation();
    const [deletePosts] = useDeletePostMutation();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const sortedUsers = useMemo(() => {
        if (!data) return [];

        return [...data].sort((a, b) => a.firstName.localeCompare(b.firstName));
    }, [data]);

    const handleDelete = async (userId) => {
        try {
            await deleteUser({ userId }).unwrap();
            deletePosts ({userId}).unwrap()
            Alert.alert("Användaren är nu raderad.");
            refetch(); // Uppdatera listan efter radering
        } catch (error) {
            // Hantera fel här
        }
    };

    console.log('sorted data: ', sortedUsers);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.container}>
                {sortedUsers.map((user) => (
                    <ListItem key={user.id} bottomDivider onPress={() => navigation.navigate('UserInfo', {user})}>
                        <ListItem.Content>
                            <ListItem.Title>
                                <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
                            </ListItem.Title>
                        </ListItem.Content>
                        <Button 
                            title="Edit" 
                            onPress={() => navigation.navigate('UserForm', { user })} 
                        />
                        <Button
                            title="Radera"
                            onPress={() => handleDelete(user.id)}
                            color="red"
                        />
                    </ListItem>
                ))}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    userName: {
        fontSize: 16,
        color: '#4A4A4A',
    },
});

export default UserList;
