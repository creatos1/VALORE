import { apiSlice } from "../../app/api/apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllProducts: builder.query({
            query: () => '/productos',
        }),
        
        deleteProducts: builder.mutation({
            query: (productIds) => ({
                url: '/productos',
                method: 'DELETE',
                body: productIds
            })
        }),

        createProducts: builder.mutation({
            query: (productData) => {
                console.log(productData)
                const formData = new FormData();
                for (const key in productData) {
                    formData.append(key, productData[key]);
                }
                console.log(formData)
                return {
                    url: '/productos',
                    method: 'POST',
                    body: formData,
                };
            }
        }),

        updateProduct: builder.mutation({
            query: (productData) => {
                console.log(productData)
                const formData = new FormData();
                for (const key in productData) {
                    formData.append(key, productData[key]);
                }
                return {
                    url: `/productos/${productData.producto_Id}`,
                    method: 'PUT',
                    body: formData,
                };
            }
        }),

    }),
})

export const { useGetAllProductsQuery, useDeleteProductsMutation, useCreateProductsMutation, useUpdateProductMutation  } = productsApiSlice;