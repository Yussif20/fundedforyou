import { generateParams } from "@/hooks/usePagination";
import { TMeta, TQueryParam, TResponse } from "@/types";
import { SinglePropFirm } from "@/types/firm.types";
import { baseApi } from "./baseApi";

const firmApiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFirms: builder.query({
      query: (params: TQueryParam[]) => ({
        url: "/firms",
        params: generateParams(params),
      }),
      transformResponse: (response: TResponse<SinglePropFirm[]>) => ({
        firms: response.data as SinglePropFirm[],
        meta: response.meta as TMeta,
      }),
      providesTags: ["Firms"],
    }),
    getAllOfferFirms: builder.query({
      query: () => ({
        url: "/firms?limit=3&firmType=FUTURES",
        method: "GET",
      }),
      providesTags: ["Firms"],
    }),
    getSingleFirm: builder.query({
      query: ({
        id,
        queryParams,
      }: {
        id: string;
        queryParams: TQueryParam[];
      }) => ({
        url: `/firms/${id}`,
        params: generateParams(queryParams),
      }),

      providesTags: ["Firms"],
    }),
    createFirm: builder.mutation({
      query: (data: FormData) => ({
        url: `/firms`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Firms"],
    }),
    updateFirm: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `/firms/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Firms"],
    }),
    deleteFirm: builder.mutation({
      query: (id: string) => ({
        url: `/firms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Firms"],
    }),
    changeIndex: builder.mutation({
      query: ({ id, index }: { id: string; index: number }) => ({
        url: `/firms/change-index/${id}`,
        method: "PATCH",
        body: {
          index,
        },
      }),
      invalidatesTags: ["Firms"],
    }),
  }),
});

export const {
  useGetAllFirmsQuery,
  useGetAllOfferFirmsQuery,
  useGetSingleFirmQuery,
  useCreateFirmMutation,
  useUpdateFirmMutation,
  useDeleteFirmMutation,
  useChangeIndexMutation,
} = firmApiApi;
