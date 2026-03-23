import { baseApi } from "./baseApi";
import { generateParams } from "@/hooks/usePagination";

export type ContactUsItem = {
  id: string;
  fullName: string;
  email: string;
  contactType: string;
  inquiry: string;
  message: string;
  status: string;
  createdAt: string;
  userId?: string | null;
  user?: unknown;
};

const contactUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContactUs: builder.mutation({
      query: (data) => ({
        url: "/contact-us",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ContactUs"],
    }),
    getContactUsList: builder.query({
      query: (args: { name: string; value: string | number }[]) => ({
        url: "/contact-us",
        method: "GET",
        params: generateParams(args),
      }),
      providesTags: ["ContactUs"],
    }),
    updateContactUsStatus: builder.mutation({
      query: ({ contactUsId, status }: { contactUsId: string; status: string }) => ({
        url: `/contact-us/${contactUsId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ContactUs"],
    }),
  }),
});

export const {
  useCreateContactUsMutation,
  useGetContactUsListQuery,
  useUpdateContactUsStatusMutation,
} = contactUsApi;
