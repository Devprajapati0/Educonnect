import {createApi ,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { FRONTEND_URL } from '../../helpers/url';
// import { updateUserProfile } from '../../../../backend/src/controllers/user.controller';
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
        forgotPassword: builder.mutation({
          query: (data) => ({
            url: `/institution/forgot-password`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
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
          invalidatesTags: ['chat'],
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
          providesTags: ['chat'],
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

        getUserProfile: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-user-profile`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        updateUserProfile: builder.mutation({
          query: (
           { data,
            subdomain,
            role,}
          ) => ({
            url: `/${subdomain}/${role}/update-user-profile`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),

        }),
        upDateChatDetail: builder.mutation({
          query: ({data,subdomain,role}) => ({
            url: `/${subdomain}/${role}/update-chat`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
          invalidatesTags: ['user','chat'],
        }),
        getChatMedia: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-chat-media`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        exitGroup: builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/exit-group`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        getPublicKey: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-public-key`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        deleteChat : builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/delete-any-chat`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),

        getAllUsersforAdmin : builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-all-users-for-admin`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        deleteanyChatForAdmin : builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/delete-any-chat`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        deleteUser : builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/delete-user`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        getDashboardStats : builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-dashboard-stats`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        getAllChatsofAlluser: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-all-chats-of-all-users`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),

        removeMemberFromChat : builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/remove-member`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),

        getAdminsAndStudents: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-admins-and-students`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        getComplaintsAssignedToMe: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-complaints-assigned-to-me`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        resolveComplaint: builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/resolve-complaint`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        getMyComplaints: builder.query({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/get-my-complaints`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
        complainToAdmin: builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/submit-complaint`,
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' },
          }),
        }),

        logoutUSer: builder.mutation({
          query: (data) => ({
            url: `/${data.subdomain}/${data.role}/logout`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        }),
      })
})

export const {useGetInstituteProfileQuery,useUpdateInstituteProfileMutation,useAddRoleSignupMutation,useUpdateUserPasswordMutation,useGetMyChatsQuery,useGetAllUsersBasedOnRoleQuery,
    useCreateGroupChatMutation,useGetUserForGroupsQuery,useGetMessagesQuery,useGetChatDetailQuery,useSendAttachmentsMutation,useGetUserProfileQuery,useUpdateUserProfileMutation,useUpDateChatDetailMutation
,useGetChatMediaQuery,useExitGroupMutation,useGetPublicKeyQuery,useDeleteChatMutation,useForgotPasswordMutation,
useGetAllUsersforAdminQuery,useDeleteanyChatForAdminMutation,useDeleteUserMutation,useGetDashboardStatsQuery,
useGetAllChatsofAlluserQuery,useRemoveMemberFromChatMutation,useComplainToAdminMutation,
useGetAdminsAndStudentsQuery,useGetComplaintsAssignedToMeQuery,useResolveComplaintMutation,useGetMyComplaintsQuery,useLogoutUSerMutation
} = api
export default api;