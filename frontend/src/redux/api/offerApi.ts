import { TMeta, TQueryParam, TResponse } from "@/types";
import { baseApi } from "./baseApi";
import { SinglePropFirm } from "@/types/firm.types";
import { generateParams } from "@/hooks/usePagination";

// Single offer type
export type Offer = {
  offerPercentage: number;
  discountType?: "PERCENTAGE" | "TEXT";
  discountText?: string;
  discountTextArabic?: string;
  id: string;
  code: string;
  isExclusive?: boolean;
  createdAt?: string;
  text?: string;
  textArabic?: string;
  firmId?: string;
  showGift?: boolean;
  giftText?: string;
  giftTextArabic?: string;
  endDate?: string;
  timerCode?: string | null;
  timerOfferPercentage?: number | null;
  timerDiscountType?: "PERCENTAGE" | "TEXT" | null;
  timerDiscountText?: string | null;
  timerDiscountTextArabic?: string | null;
  timerText?: string | null;
  timerTextArabic?: string | null;
  showInBanner?: boolean;
  firm?: SinglePropFirm;
};

// Firm with offers type (as received from API)
export type FirmWithOffers = {
  id: string;
  title: string;
  slug: string;
  logoUrl: string;
  affiliateLink: string;
  index?: number;
  offers: Offer[];
};

export type CreateOfferInput = {
  offerPercentage: number;
  discountType?: "PERCENTAGE" | "TEXT";
  discountText?: string;
  discountTextArabic?: string;
  code: string;
  firmId: string;
  isExclusive?: boolean;
  showInBanner?: boolean;
  text?: string;
  textArabic?: string;
};

export type UpdateOfferInput = Partial<CreateOfferInput>;

export type GetAllOffersParams = {
  isExclusive?: boolean;
  isCurrentMonth?: boolean;
  firmType?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new offer
    createOffer: builder.mutation<TResponse<Offer>, CreateOfferInput>({
      query: (offerData) => ({
        url: "/offers",
        method: "POST",
        body: offerData,
      }),
      invalidatesTags: ["Offer", "Offers"],
    }),

    // Update an existing offer
    updateOffer: builder.mutation<
      TResponse<Offer>,
      { id: string; data: UpdateOfferInput }
    >({
      query: ({ id, data }) => ({
        url: `/offers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Offer", "Offers"],
    }),

    // Delete an offer
    deleteOffer: builder.mutation<TResponse<void>, string>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offer", "Offers"],
    }),

    // Get a single offer by ID
    getSingleOffer: builder.query<TResponse<Offer>, string>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Offer", id }],
    }),

    // Get all offers with optional filters
    getAllOffers: builder.query<
      { firms: FirmWithOffers[]; meta: TMeta },
      GetAllOffersParams | void
    >({
      query: (params) => ({
        url: "/offers",
        method: "GET",
        params,
      }),
      transformResponse: (response: TResponse<FirmWithOffers[]>) => ({
        firms: response.data as FirmWithOffers[],
        meta: response.meta as TMeta,
      }),
      providesTags: (_result, _error, params) => [
        { type: "Offers", id: JSON.stringify(params || {}) },
      ],
    }),

    // Get all offers by firm ID
    getOffersByFirm: builder.query<
      { offers: Offer[]; meta: TMeta },
      { firmId: string; params?: Omit<GetAllOffersParams, "firmId"> }
    >({
      query: ({ firmId, params }) => ({
        url: `/offers/firm/${firmId}`,
        method: "GET",
        params,
      }),
      transformResponse: (response: TResponse<Offer[]>) => ({
        offers: response.data as Offer[],
        meta: response.meta as TMeta,
      }),
      providesTags: (_result, _error, { firmId }) => [
        { type: "Offers", id: firmId },
      ],
    }),
    // Change index (order) of a firm on the offers page
    changeIndexOffer: builder.mutation<
      TResponse<void>,
      { id: string; index: number }
    >({
      query: ({ id, index }) => ({
        url: `/firms/change-index/${id}`,
        method: "PATCH",
        body: { index },
      }),
      invalidatesTags: ["Offer", "Offers"],
    }),

    getAllOfferdata: builder.query({
      query: (params: TQueryParam[]) => ({
        url: "/offers/all",
        method: "GET",
        params: generateParams(params),
      }),
    }),
  }),
});

export const {
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetSingleOfferQuery,
  useGetAllOffersQuery,
  useGetOffersByFirmQuery,
  useLazyGetSingleOfferQuery,
  useLazyGetAllOffersQuery,
  useLazyGetOffersByFirmQuery,
  useGetAllOfferdataQuery,
  useChangeIndexOfferMutation,
} = offerApi;
