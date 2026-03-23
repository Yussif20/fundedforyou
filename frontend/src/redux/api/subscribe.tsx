import { baseApi } from "./baseApi";

const subscribeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscribe: builder.mutation({
      query: (data) => ({
        url: "/news-letter/subscribe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscribe"],
    }),
  }),
});

export const { useCreateSubscribeMutation } = subscribeApi;
