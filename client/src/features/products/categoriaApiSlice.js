import { apiSlice } from "../../app/api/apiSlice";

export const categoriasApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllCategorias: builder.query({
            query: () => '/categorias',
        }),

    }),
})

export const { useGetAllCategoriasQuery } = categoriasApiSlice;