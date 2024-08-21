import { apiSlice } from "../../app/api/apiSlice";

export const rolesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllRoles: builder.query({
            query: () => '/roles',
        }),

    }),
})

export const { useGetAllRolesQuery } = rolesApiSlice;