import {createApi ,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { FRONTEND_URL } from '../../helpers/url';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: FRONTEND_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
        credentials: 'include',
    }),
    tagTypes: ['Institute'],
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
    }),
})

export const {useGetInstituteProfileQuery,useUpdateInstituteProfileMutation} = api
export default api;