// affiliateApiSlice.js
import { formToJSON } from "axios";
import { apiSlice } from "../../app/api/apiSlice";

export const affiliateApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllAffiliates: builder.query({
      query: () => '/afiliados',
    }),
    getAffiliateById: builder.query({
      query: (afiliado_Id) => `/afiliados/${afiliado_Id}`,
    }),
    createAffiliate: builder.mutation({
      query: (affiliateData) => {
        const formData = new FormData();
        for (const key in affiliateData) {
          formData.append(key, affiliateData[key]);
        }
        return {
          url: '/afiliados',
          method: 'POST',
          body: formData,
        };
      }
    }),
    updateAffiliate: builder.mutation({
      query: (affiliateData) => {
        const formData = new FormData();
        for (const key in affiliateData) {
          formData.append(key, affiliateData[key]);
        }
        return {
          url: `/afiliados/${affiliateData.afiliado_Id}`,
          method: 'PUT',
          body: formData,
        };
      }
    }),
    deleteAffiliate: builder.mutation({
      query: (affiliateIds) => ({
        url: '/afiliados',
        method: 'DELETE',
        body: affiliateIds,
      }),
    }),
    
  }),
})

export const { useGetAllAffiliatesQuery, useGetAffiliateByIdQuery , useCreateAffiliateMutation, useUpdateAffiliateMutation, useDeleteAffiliateMutation } = affiliateApiSlice;