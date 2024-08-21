// apiSilice
import { apiSlice } from "../../app/api/apiSlice";

export const promotionsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({ 
        getAllPromotions: builder.query({
            query: () => '/promociones',
        }),
        getPromotionById: builder.query({
            query: (promocion_Id) => `/promociones/${promocion_Id}`,
        }),
        createPromotion: builder.mutation({
            query: (promotionData) => {
                const formData = new FormData();
                for (const key in promotionData) {
                    formData.append(key, promotionData[key]);
                }
                return {
                    url: '/promociones',
                    method: 'POST',
                    body: formData,
                };
            }
        }),
        updatePromotion: builder.mutation({
            query: (promotionData) => {
                const formData = new FormData();
                for (const key in promotionData) {
                    formData.append(key, promotionData[key]);
                }
                return {
                    url: `/promociones/${promotionData.promocion_Id}`,
                    method: 'PUT',
                    body: formData,
                };
            }
        }),
        deletePromotion: builder.mutation({
            query: (promotionIds) => ({
                url: '/promociones',
                method: 'DELETE',
                body: promotionIds,
            }),
        }),
        
    }),
});

export const { useGetAllPromotionsQuery, useGetPromotionByIdQuery, useCreatePromotionMutation, useUpdatePromotionMutation, useDeletePromotionMutation} = promotionsApiSlice;