import React, { useCallback } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";
import { useGetUsersQuery } from "../../store/api/usersApi";
import { ListItem } from "@rneui/themed";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';



const UserList = ({navigation}) => {
    const { data, refetch } = useGetUsersQuery({});

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    console.log('data: ', data);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {
    data && data.map((user) => (
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
    </ListItem>
    
    ))
}

            </View>
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
