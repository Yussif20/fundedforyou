import { generateParams } from "@/hooks/usePagination";
import { TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "./baseApi";
import { BestSeller } from "@/types/best-seller.type";

const bestSellersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBestSellers: builder.query({
      query: (params: TQueryParam[]) => {
        return {
          url: "/best-sellers",
          method: "GET",
          params: generateParams(params),
        };
      },
      transformResponse: (response: TResponseRedux<BestSeller[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["BestSeller"],
    }),

    getSingleBestSeller: builder.query({
      query: (id) => ({
        url: `/best-sellers/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: TResponseRedux<{ bestSeller: BestSeller }>
      ) => ({
        data: response.data,
      }),
      providesTags: (_result, _error, id) => [{ type: "BestSeller", id }],
    }),

    createBestSeller: builder.mutation({
      query: (data) => ({
        url: "/best-sellers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BestSeller"],
    }),

    updateBestSeller: builder.mutation({
      query: ({ id, data }) => ({
        url: `/best-sellers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "BestSeller",
        { type: "BestSeller", id },
      ],
    }),

    deleteBestSeller: builder.mutation({
      query: (id) => ({
        url: `/best-sellers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "BestSeller",
        { type: "BestSeller", id },
      ],
    }),
    changeWeeklyIndex: builder.mutation({
      query: ({ id, index }) => ({
        url: `/best-sellers/weekly/${id}`,
        method: "PATCH",
        body: { index },
      }),
      invalidatesTags: (_result, _error, id) => [
        "BestSeller",
        { type: "BestSeller", id },
      ],
    }),
    changeMonthlyIndex: builder.mutation({
      query: ({ id, index }) => ({
        url: `/best-sellers/monthly/${id}`,
        method: "PATCH",
        body: { index },
      }),
      invalidatesTags: (_result, _error, id) => [
        "BestSeller",
        { type: "BestSeller", id },
      ],
    }),
    changeRank: builder.mutation({
      query: ({ id, index }) => ({
        url: `/best-sellers/rank/${id}`,
        method: "PATCH",
        body: { index },
      }),
      invalidatesTags: (_result, _error, id) => [
        "BestSeller",
        { type: "BestSeller", id },
      ],
    }),
  }),
});

export const {
  useGetAllBestSellersQuery,
  useGetSingleBestSellerQuery,
  useCreateBestSellerMutation,
  useUpdateBestSellerMutation,
  useDeleteBestSellerMutation,
  useChangeWeeklyIndexMutation,
  useChangeMonthlyIndexMutation,
  useChangeRankMutation,
} = bestSellersApi;
