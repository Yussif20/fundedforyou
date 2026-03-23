import { TQueryParam, TResponseRedux, User } from "@/types";
import { setUser } from "../authSlice";
import { baseApi } from "./baseApi";
import { generateParams } from "@/hooks/usePagination";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/signup",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, ...rest } = data.data as User & {
            accessToken: string;
          };
          if (accessToken)
            dispatch(setUser({ user: { ...rest }, token: accessToken }));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    googleLogin: builder.mutation({
      query: (credential: string) => ({
        url: "/auth/google",
        method: "POST",
        body: { credential },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, ...rest } = data.data as User & { accessToken: string };
          if (accessToken) dispatch(setUser({ user: { ...rest }, token: accessToken }));
        } catch (error) {
          console.error("Google login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    resendVerificationEmail: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmail: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: userInfo,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, ...rest } = data.data as User & {
            accessToken: string;
          };
          if (accessToken)
            dispatch(setUser({ user: { ...rest }, token: accessToken }));
        } catch (error) {
          console.error("Email verification failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    forgetPassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/change-password",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    refreshAccessToken: builder.mutation({
      query: (token) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken: token },
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: (args: TQueryParam[]) => {
        const params = new URLSearchParams();
        if (args)
          args.forEach((item: any) =>
            params.append(item.name, item.value as string)
          );
        return { url: "/users", method: "GET", params };
      },
      transformResponse: (response: TResponseRedux<User[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id: string) => ({ url: `/users/${id}`, method: "GET" }),
      transformResponse: (response: TResponseRedux<User>) => ({
        data: response.data,
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    getMe: builder.query({
      query: () => ({ url: `/users/me`, method: "GET" }),
      transformResponse: (response: TResponseRedux<{ user: User }>) => ({
        data: response.data,
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/users/me`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "User",
        { type: "User", id },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    updateProfileImg: builder.mutation({
      query: (formData: FormData) => ({
        url: `/users/update-profile-image`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: () => ["User", { type: "User" }],
    }),
    getAllUserAdmin: builder.query({
      query: (args) => {
        return {
          url: `/users`,
          method: "GET",
          params: generateParams(args),
        };
      },
      providesTags: ["User"],
    }),
    UpdateUserAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    UpdateUserRole: builder.mutation({
      query: ({ id, data }: { id: string; data: { role: string } }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    completeSurvey: builder.mutation({
      query: ({ data }) => ({
        url: `/users/survey`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getSurveyUser: builder.query({
      query: () => ({ url: `/users/survey/data`, method: "GET" }),
      transformResponse: (response: TResponseRedux<User>) => ({
        data: response.data,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useUpdateProfileImgMutation,
  useRefreshAccessTokenMutation,
  useGetAllUserAdminQuery,
  useUpdateUserAdminMutation,
  useCompleteSurveyMutation,
  useGetSurveyUserQuery,
  useUpdateUserRoleMutation,
  useLazyGetAllUserAdminQuery,
} = userApi;
