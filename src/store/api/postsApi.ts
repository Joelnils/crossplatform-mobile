import { createApi } from "@reduxjs/toolkit/query/react";
import { db } from "../../../firebase-config";
import { 
  collection, 
  getDocs, 
  getDoc,
  query as firestoreQuery, 
  where, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc 
} from "firebase/firestore";

const firebaseBaseQuery = async ({ url, method, body = null }) => {
  switch (method) {
    case "GET":
      if (url.startsWith('posts/user/')) {
        const userId = url.split('/')[2];
        const postsQuery = firestoreQuery(collection(db, "posts"), where("createdBy", "==", userId));
        const snapshot = await getDocs(postsQuery);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { data };
      } else {
        const snapshot = await getDocs(collection(db, url));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { data };
      }

    case "POST":
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };
      
    case "DELETE":
      await deleteDoc(doc(db, url));
      return { data: 'Deleted successfully' };
      
    case "PUT":
      if (url.startsWith('posts/') && url.endsWith('/like')) {
        const postId = url.split('/')[1];
        const postDocRef = doc(db, 'posts', postId);
        const postSnapshot = await getDoc(postDocRef);

        if (!postSnapshot.exists()) {
          throw new Error('Post not found');
        }

        let updatedLikes = postSnapshot.data().likes || [];
        if (updatedLikes.includes(body.userId)) {
          updatedLikes = updatedLikes.filter(id => id !== body.userId);
        } else {
          updatedLikes.push(body.userId);
        }

        await updateDoc(postDocRef, { likes: updatedLikes });
        return { data: 'Like updated' };
      }

      await updateDoc(doc(db, url), body);
      return { data: body };

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({
        url: "posts",
        method: "GET",
      }),
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    getPostsByUser: builder.query({
      query: (userId) => ({
        url: `posts/user/${userId}`,
        method: "GET",
      }),
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: "posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: ({ postId, post }) => ({
        url: `posts/${postId}`,
        method: "PUT",
        body: post,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    deletePost: builder.mutation({
      query: ({postId}) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    toggleLikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `posts/${postId}/like`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetPostsQuery, 
  useCreatePostMutation, 
  useUpdatePostMutation, 
  useDeletePostMutation,
  useGetPostsByUserQuery,
  useToggleLikePostMutation
} = postsApi;
