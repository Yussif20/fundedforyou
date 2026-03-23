import { generateParams } from "@/hooks/usePagination";
import { TQueryParam } from "@/types";
import { baseApi } from "./baseApi";

const spreadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFirms: builder.query<any, { limit?: number } | void>({
      query: (params) => ({
        url: "/firms",
        method: "GET",
        params: params?.limit != null ? { limit: params.limit } : undefined,
      }),

      providesTags: ["Firm"],
    }),
    getAllSymbol: builder.query<any, void>({
      query: () => ({ url: "/spreads/symbol/all", method: "GET" }),

      providesTags: ["Symbol"],
    }),
    getAllSpread: builder.query<any, TQueryParam[]>({
      query: (args) => {
        return {
          url: "/spreads",
          method: "GET",
          params: generateParams(args),
        };
      },

      providesTags: ["Spreads"],
    }),
    getPlatforms: builder.query({
      query: (query: TQueryParam[]) => ({
        url: "/platforms",
        method: "GET",
        params: generateParams(query),
      }),

      providesTags: ["Platform"],
    }),
    createPlatforms: builder.mutation({
      query: (formData) => ({
        url: "/platforms",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: ["Platform"],
    }),
    createSpread: builder.mutation({
      query: (payload: {
        firmId: string;
        platformId: string;
        type: string;
      }) => ({
        url: "/spreads",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Spreads"],
    }),

    updateSpread: builder.mutation({
      query: (payload: { id: string; data: any }) => ({
        url: `/spreads/${payload.id}`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["Spreads"],
    }),
    deleteSpread: builder.mutation({
      query: (id: string) => ({
        url: `/spreads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Spreads"],
    }),

    createSymbol: builder.mutation({
      query: (payload) => ({
        url: "/spreads/symbol",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Symbol"],
    }),
    createSymbolValue: builder.mutation({
      query: (payload) => ({
        url: "/spreads/symbol-value",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Spreads"],
    }),
    updateSymbol: builder.mutation({
      query: ({ data, id }) => ({
        url: `/spreads/symbol/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Symbol"],
    }),
    updateSymbolValue: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/spreads/symbol-value/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Spreads"],
    }),
    deleteSymbol: builder.mutation({
      query: (id) => ({
        url: `/spreads/symbol/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Symbol"],
    }),
  }),
});

export const {
  useGetFirmsQuery,
  useGetPlatformsQuery,
  useCreateSpreadMutation,
  useCreateSymbolValueMutation,
  useUpdateSymbolValueMutation,
  useUpdateSymbolMutation,
  useCreateSymbolMutation,
  useGetAllSymbolQuery,
  useGetAllSpreadQuery,
  useDeleteSymbolMutation,
  useCreatePlatformsMutation,
  useUpdateSpreadMutation,
  useDeleteSpreadMutation,
} = spreadApi;
