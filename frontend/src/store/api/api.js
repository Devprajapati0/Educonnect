import {createApi ,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { FRONTEND_URL } from '../../helpers/url';
// import { createGroupChat } from '../../../../backend/src/controllers/chat.controller';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: FRONTEND_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json',"multipart/form-data");
            return headers;
        },
        credentials: 'include',
    }),
    tagTypes: ['Institute','user'],
    endpoints: (builder) => ({
       getInstituteProfile: builder.query({
        query: () => ({
            url: 'institution/profile',
            method: 'GET',
        }),
        providesTags: ['Institute'],
       }),
         updateInstituteProfile: builder.mutation({
          query: (data) => ({
                url: 'institution/update-profile',
                method: 'PUT',
                body: data,
          }),
          invalidatesTags: ['Institute'],
         }),
         addRoleSignup: builder.mutation({
            query: (data) => ({
                url: `/${data.subdomain}/admin/register`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['user'],
        }),
        updateUserPassword: builder.mutation({
            query: (data) => ({
                url: `/${data.subdomain}/${data.role}/forgot-password`,
                method: 'PUT',
                body: data,
            }),
        }),
        getMyChats : builder.query({
            query: (data) => ({
                url: `/${data.subdomain}/${data.role}/get-my-chats`,
                method: 'GET',
            }),
            providesTags: ['user'],
        }),
        getAllUsersBasedOnRole : builder.query({
            query: (data) => ({
                url: `/${data.subdomain}/${data.role}/get-all-users`,
                method: 'GET',
            }),
            providesTags: ['user'],
        }),

        createGroupChat: builder.mutation({
            query: (data) => ({
                url: `/${data.subdomain}/${data.role}/create-group-chat`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['user'],
        }),
        getUserForGroups: builder.query({
            query: (data) => ({
                url: `/${data.subdomain}/${data.role}/get-user-for-group`,
                method: 'GET',
            }),
            providesTags: ['user'],
        }),
        
    }),
})

export const {useGetInstituteProfileQuery,useUpdateInstituteProfileMutation,useAddRoleSignupMutation,useUpdateUserPasswordMutation,useGetMyChatsQuery,useGetAllUsersBasedOnRoleQuery,
    useCreateGroupChatMutation,useGetUserForGroupsQuery
} = api
export default api;