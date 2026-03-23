import { FAQ, TMeta, TQueryParam, TResponse } from "@/types";
import { baseApi } from "./baseApi";
import { generateParams } from "@/hooks/usePagination";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaqs: builder.query({
      query: (params?: TQueryParam[]) => ({
        url: "/faqs",
        method: "GET",
        params: generateParams(params),
      }),
      transformResponse: (response: TResponse<FAQ[]>) => ({
        data: response.data as FAQ[],
        meta: response.meta as TMeta,
      }),
      providesTags: ["Faq"],
    }),

    getSingleFaq: builder.query({
      query: (id: string) => ({
        url: `/faqs/${id}`,
        method: "GET",
      }),
    }),

    createFaq: builder.mutation({
      query: (payload) => ({
        url: "/faqs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Faq"],
    }),

    updateFaq: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/faqs/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Faq"],
    }),

    deleteFaq: builder.mutation({
      query: (id: string) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faq"],
    }),
    changeFAQIndex: builder.mutation({
      query: ({ id, index }: { id: string; index: number }) => ({
        url: `/faqs/change-index/${id}`,
        method: "PATCH",
        body: {
          index,
        },
      }),
      invalidatesTags: ["Faq"],
    }),
  }),
});

export const {
  useGetAllFaqsQuery,
  useGetSingleFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useChangeFAQIndexMutation
} = faqApi;
