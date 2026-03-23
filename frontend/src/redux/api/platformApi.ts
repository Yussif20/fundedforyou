import { generateParams } from "@/hooks/usePagination";
import { Platform, TQueryParam } from "@/types";
import { baseApi } from "./baseApi";

type GetSinglePlatformResponse = Platform;

const platformApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /
    getAllPlatform: builder.query({
      query: (params: TQueryParam[]) => {
        return {
          url: "/platforms",
          method: "GET",
          params: generateParams(params),
        };
      },

      providesTags: ["Platform"],
    }),

    getSinglePlatform: builder.query<GetSinglePlatformResponse, string>({
      query: (platformId) => ({
        url: `/platforms/${platformId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, platformId) => [
        { type: "Platform", id: platformId },
      ],
    }),

    createPlatform: builder.mutation<Omit<Platform, "id">, FormData>({
      query: (formData) => ({
        url: "/platforms",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Platform"],
    }),

    // 4. PATCH /:platformId (Mutation for updating a Platform)
    updatePlatform: builder.mutation<
      Platform,
      { platformId: string; formData: FormData }
    >({
      query: ({ platformId, formData }) => ({
        url: `/platforms/${platformId}`,
        method: "PATCH",
        body: formData, // Use FormData for potential file update
      }),
      invalidatesTags: (_result, _error, { platformId }) => [
        "Platform",
        { type: "Platform", id: platformId },
      ],
    }),

    deletePlatform: builder.mutation<void, string>({
      query: (platformId) => ({
        url: `/platforms/${platformId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, platformId) => [
        "Platform",
        { type: "Platform", id: platformId },
      ],
    }),
  }),
});

export const {
  useGetAllPlatformQuery,
  useGetSinglePlatformQuery,
  useCreatePlatformMutation,
  useUpdatePlatformMutation,
  useDeletePlatformMutation,
} = platformApi;
