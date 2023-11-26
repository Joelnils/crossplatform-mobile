import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, } from 'react-native';
import { useGetPostsQuery, useToggleLikePostMutation, useDeletePostMutation } from '../../store/api/postsApi';
import { useGetUsersQuery } from '../../store/api/usersApi';
import { useSelector } from 'react-redux'; 

const PostList = () => {
  const  [deletePost] = useDeletePostMutation({});

  const { data: posts, isLoading, isError } = useGetPostsQuery({});
  const { data: users } = useGetUsersQuery({});
  const [toggleLikePost] = useToggleLikePostMutation();
	const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  const getUserNamesFromLikes = (likes) => {
    if (!users || !likes) return '';
  
    return likes.map(userId => {
      const user = users.find(u => u.id === userId);
      return user ? `${user.firstName} ${user.lastName}` : 'Okänd användare';
    }).join(', ');
  };
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      
    } catch (error) {
      console.error(error);
     
    }
  };
  const handleLike = async (postId) => {
    try {
      await toggleLikePost({ postId, userId: loggedInAs.id }).unwrap();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const renderItem = ({ item: post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postText}>{post.text}</Text>
      <Text style={styles.authorText}>Postad av: {post.createdByName || post.createdBy}</Text>
      <Text style={styles.dateText}>Datum: {post.createdDate}</Text>
      <Text style={styles.likeCount}>Gillanden: {post.likes?.length || 0}</Text>
      <Button 
                            title="Radera"
                            onPress={() => handleDeletePost({postId: post.id})}
                            color="red"
                        />

      <Text style={styles.likedByText}>Gillad av: {getUserNamesFromLikes(post.likes)}</Text>
      <Button 
        title="Gilla"
        onPress={() => handleLike(post.id)}
      />
        
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingTop: 50, 
        paddingHorizontal: 10, 
        backgroundColor: '#FFFFFF',
    },
    postContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    postText: {
        fontSize: 16,
    },
    authorText: {
        fontSize: 14,
        color: 'gray',
    },
    dateText: {
        fontSize: 12,
        color: 'gray',
    },
    likeCount: {
        fontSize: 14,
        color: 'blue',
        marginTop: 5,
    },
    likedByText: {
        fontSize: 12,
        color: 'green',
    },
});

export default PostList;
