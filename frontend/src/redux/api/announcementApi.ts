import { generateParams } from "@/hooks/usePagination";
import { TQueryParam, TResponseRedux } from "@/types";
import { Announcement_T } from "@/types/announcement.types";
import { baseApi } from "./baseApi";

const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAnnouncements: builder.query({
      query: ({
        firmId,
        params,
      }: {
        firmId: string;
        params: TQueryParam[];
      }) => ({
        url: `/announcements/${firmId}`,
        method: "GET",
        params: generateParams(params),
      }),
      transformResponse: (
        response: TResponseRedux<{
          announcements: Announcement_T[];
        }>
      ) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["Announcement"],
    }),

    getSingleAnnouncement: builder.query({
      query: (id) => ({
        url: `/announcements/single/${id}`,
        method: "GET",
      }),
      transformResponse: (
        response: TResponseRedux<{ announcement: Announcement_T }>
      ) => ({
        data: response.data,
      }),
      providesTags: (_result, _error, id) => [{ type: "Announcement", id }],
    }),

    createAnnouncement: builder.mutation({
      query: (data: FormData) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `/announcements/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Announcement",
        { type: "Announcement", id },
      ],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Announcement",
        { type: "Announcement", id },
      ],
    }),
  }),
});

export const {
  useGetAllAnnouncementsQuery,
  useGetSingleAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;
