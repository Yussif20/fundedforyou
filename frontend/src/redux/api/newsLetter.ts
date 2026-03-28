import { baseApi } from "./baseApi";
import { generateParams } from "@/hooks/usePagination";
import { TQueryParam } from "@/types";

const newsLetterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewsLetterSubscribers: builder.query({
      query: (args: TQueryParam[]) => ({
        url: "/news-letter/subscribers",
        method: "GET",
        params: generateParams(args),
      }),
      providesTags: ["NewsLetter"],
    }),
    deleteNewsLetterSubscriber: builder.mutation({
      query: (id: string) => ({
        url: `/news-letter/subscribers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NewsLetter"],
    }),
    sendBulkNewsLetterEmail: builder.mutation({
      query: (data: { subject: string; body: string }) => ({
        url: "/news-letter/send-bulk",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetNewsLetterSubscribersQuery,
  useLazyGetNewsLetterSubscribersQuery,
  useDeleteNewsLetterSubscriberMutation,
  useSendBulkNewsLetterEmailMutation,
} = newsLetterApi;
