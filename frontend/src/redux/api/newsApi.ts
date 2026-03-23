import { News } from "@/types/newsType";
import { baseApi } from "./baseApi";
import { TQueryParam, TResponseRedux } from "@/types";

const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNews: builder.mutation({
      query: (newsData) => ({
        url: "/news",
        method: "POST",
        body: newsData,
      }),
      invalidatesTags: ["News"],
    }),

    // Get All News
    getAllNews: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item: any) =>
            params.append(item.name, item.value as string),
          );
        return {
          url: "/news",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (
        response: TResponseRedux<{ date: string; news: News[] }[]>,
      ) => ({
        data: response.data,
      }),
      providesTags: ["News"],
    }),

    updateNews: builder.mutation({
      query: ({ newsId, data }) => ({
        url: `/news/${newsId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["News"],
    }),

    // Delete News (Super Admin only)
    deleteNews: builder.mutation({
      query: (newsId: string) => ({
        url: `/news/${newsId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),

    // Reorder News
    reorderNews: builder.mutation({
      query: (newsItems: { id: string; order: number }[]) => ({
        url: `/news/reorder`,
        method: "PATCH",
        body: { news: newsItems },
      }),
      invalidatesTags: ["News"],
    }),
    
    // Swap two news items' positions
    changeIndexNews: builder.mutation({
      query: ({ id, targetId }: { id: string; targetId: string }) => ({
        url: `/news/change-index/${id}`,
        method: "PATCH",
        body: { targetId },
      }),
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useCreateNewsMutation,
  useGetAllNewsQuery,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useReorderNewsMutation,
  useChangeIndexNewsMutation,
} = newsApi;
