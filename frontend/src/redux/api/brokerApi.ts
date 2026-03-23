import { generateParams } from "@/hooks/usePagination";
import { TQueryParam } from "@/types";
import { baseApi } from "./baseApi";

const brokerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all brokers
    getBrokers: builder.query({
      query: (query: TQueryParam[]) => ({
        url: "/brokers",
        method: "GET",
        params: generateParams(query),
      }),
      providesTags: ["Broker"],
    }),

    // GET a single broker by ID
    getSingleBroker: builder.query<any, string>({
      query: (brokerId) => ({
        url: `/brokers/${brokerId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Broker", id }],
    }),

    // CREATE broker (with file upload)
    createBroker: builder.mutation({
      query: (payload: FormData) => ({
        url: "/brokers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Broker"],
    }),

    // UPDATE broker (with or without new logo)
    updateBroker: builder.mutation({
      query: ({ brokerId, data }: { brokerId: string; data: FormData }) => ({
        url: `/brokers/${brokerId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { brokerId }) => [
        { type: "Broker", id: brokerId },
      ],
    }),

    // DELETE broker
    deleteBroker: builder.mutation({
      query: (brokerId: string) => ({
        url: `/brokers/${brokerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Broker"],
    }),
  }),
});

export const {
  useGetBrokersQuery,
  useGetSingleBrokerQuery,
  useCreateBrokerMutation,
  useUpdateBrokerMutation,
  useDeleteBrokerMutation,
} = brokerApi;
