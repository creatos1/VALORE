import { apiSlice } from "../../app/api/apiSlice";

export const detalleVentaApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllDetalles: builder.query({
            query: () => '/detalles-venta',
        }),
    
        deleteDetalleVenta: builder.mutation({
            query: (dVentasIds) => ({
                url: '/detalles-venta',
                method: 'DELETE',
                body: dVentasIds
            }),
        }),
    }),
})

export const { useGetAllDetallesQuery, useDeleteDetalleVentaMutation } = detalleVentaApiSlice;