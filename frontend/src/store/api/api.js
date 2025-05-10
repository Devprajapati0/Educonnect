import {createApi ,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { FRONTEND_URL } from '../../helpers/url';
// import { createGroupChat } from '../../../../backend/src/controllers/chat.controller';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: FRONTEND_URL,
        credentials: 'include',
    }),

    tagTypes: ['Institute','user'],
    endpoints: (builder) => ({
        getInstituteProfile: builder.query({
          query: () => ({
            url: 'institution/profile',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          providesTags: ['Institute'],
        }),
      
        updateInstituteProfile: builder.mutation({
          query: (data) => ({
            url: 'institution/update-profile',
            method: 'PUT',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
          invalidatesTags: ['Institute'],
        }),
      
        addRoleSignup: builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/admin/register`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
          invalidatesTags: ['user'],
        }),
      
        updateUserPassword: builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/forgot-password`,
            method: 'PUT',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
      
        getMyChats: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-my-chats`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          providesTags: ['user'],
        }),
      
        getAllUsersBasedOnRole: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-all-users`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          providesTags: ['user'],
        }),
      
        createGroupChat: builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/create-group-chat`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
          invalidatesTags: ['user'],
        }),
      
        getUserForGroups: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-user-for-group`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          providesTags: ['user'],
        }),
      
        getMessages: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-all-messages/${data.chatId}?page=${data.page}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
      
        getChatDetail: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/getchat/${data.chatId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
      
        sendAttachments: builder.mutation({
          query: ({formData,subdomain,role}) => ({
            url: `/${subdomain}/${role}/send-message`,
            method: 'POST',
            body: formData, 
          }),
        }),
      })
})

export const {useGetInstituteProfileQuery,useUpdateInstituteProfileMutation,useAddRoleSignupMutation,useUpdateUserPasswordMutation,useGetMyChatsQuery,useGetAllUsersBasedOnRoleQuery,
    useCreateGroupChatMutation,useGetUserForGroupsQuery,useGetMessagesQuery,useGetChatDetailQuery,useSendAttachmentsMutation
} = api
export default api;