import { generateParams } from "@/hooks/usePagination";
import { TQueryParam } from "@/types";
import { PaymentMethod } from "@/types/payment-method";
import { baseApi } from "./baseApi";

type GetSinglePaymentMethodResponse = PaymentMethod;

const paymentMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /
    getAllPaymentMethod: builder.query({
      query: (params: TQueryParam[]) => {
        return {
          url: "/payment-methods",
          method: "GET",
          params: generateParams(params),
        };
      },

      providesTags: ["PaymentMethod"],
    }),

    getSinglePaymentMethod: builder.query<
      GetSinglePaymentMethodResponse,
      string
    >({
      query: (paymentMethodId) => ({
        url: `/payment-methods/${paymentMethodId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, paymentMethodId) => [
        { type: "PaymentMethod", id: paymentMethodId },
      ],
    }),

    createPaymentMethod: builder.mutation<Omit<PaymentMethod, "id">, FormData>({
      query: (formData) => ({
        url: "/payment-methods",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["PaymentMethod"],
    }),

    // 4. PATCH /:paymentMethodId (Mutation for updating a Payment Method)
    updatePaymentMethod: builder.mutation<
      PaymentMethod,
      { paymentMethodId: string; formData: FormData }
    >({
      query: ({ paymentMethodId, formData }) => ({
        url: `/payment-methods/${paymentMethodId}`,
        method: "PATCH",
        body: formData, // Use FormData for potential file update
      }),
      invalidatesTags: (_result, _error, { paymentMethodId }) => [
        "PaymentMethod",
        { type: "PaymentMethod", id: paymentMethodId },
      ],
    }),

    deletePaymentMethod: builder.mutation<void, string>({
      query: (paymentMethodId) => ({
        url: `/payment-methods/${paymentMethodId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, paymentMethodId) => [
        "PaymentMethod",
        { type: "PaymentMethod", id: paymentMethodId },
      ],
    }),
  }),
});

export const {
  useGetAllPaymentMethodQuery,
  useGetSinglePaymentMethodQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodApi;
