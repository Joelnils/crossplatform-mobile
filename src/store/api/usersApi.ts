import { createApi } from "@reduxjs/toolkit/query/react";
import { db } from "../../../firebase-config";
import { addDoc, collection, getDocs, deleteDoc, setDoc, updateDoc, doc } from "firebase/firestore";

const firebaseBaseQuery = async ({ baseUrl, url, method, body = null }) => {
  switch (method) {
    case "GET":
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { data };

    case "POST":
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };
      
      case "DELETE":
        await deleteDoc(doc(db, url));
        return { data: 'Deleted successfully' };
      
      case "PUT":
        await updateDoc(doc(db, url), body);
        return { data: body };
      

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: firebaseBaseQuery,
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: "users",
        method: "POST",
        body: user,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        baseUrl: "",
        url: "users",
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        baseUrl: "",
        url: `users/${userId}`,
        method: "DELETE",
      }),
      
    }),
    updateUser: builder.mutation({
      query: ({ userId, user }) => ({
        baseUrl: "",
        url: `users/${userId}`,
        method: "PUT",
        body: user,
      }),
    }),
  }),
});

export const { useCreateUserMutation, useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } = usersApi;
