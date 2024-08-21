import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllEmployees: builder.query({
            query: () => '/empleados',
        }),
        
        deleteEmployee: builder.mutation({
            query: (userIds) => ({
                url: '/empleados',
                method: 'DELETE',
                body: userIds
            })
        }),

        createEmployee: builder.mutation({
            query: (userData) => {
                const formData = new FormData();
                for (const key in userData) {
                    formData.append(key, userData[key]);
                }
                return {
                    url: '/empleados',
                    method: 'POST',
                    body: formData,
                };
            }
        }),
    }),
})

export const { useGetAllEmployeesQuery, useDeleteEmployeeMutation, useCreateEmployeeMutation  } = usersApiSlice;