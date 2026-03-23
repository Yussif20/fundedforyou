export type ServerError_T = {
  status?: number;
  data?: {
    signOut?: boolean;
    accessTokenExpired?: boolean;
    refreshTokenExpired?: boolean;
  };
};

import { toast } from "sonner";

type ToastOptions = {
  loading?: string;
  success?: string;
  error?: string;
};

type HandleRTKMutationOptions<TData, _TError> = {
  toast?: ToastOptions;
  onSuccess?: (data: TData) => void;
  onError?: (error: ServerError_T) => void;
};

export const handleRTKMutation = async <
  T extends { unwrap: () => Promise<any> },
  TData extends Awaited<ReturnType<T["unwrap"]>>,
  TError = any
>(
  mutationResult: T,
  options?: HandleRTKMutationOptions<TData, TError>
): Promise<TData | undefined> => {
  const messages = {
    loading: options?.toast?.loading || "Loading...",
    success: options?.toast?.success,
    error: options?.toast?.error,
  };

  const id = toast.loading(messages.loading);

  try {
    const data: TData = await mutationResult.unwrap();

    const successMessage =
      messages.success || (data as any)?.message || "Success";
    toast.success(successMessage, { id });

    if (options?.onSuccess) {
      options.onSuccess(data);
    }

    return data;
  } catch (error: any) {
    const errorMessage =
      messages?.error || error?.data?.message || "Something went wrong";

    if (options?.onError) {
      options.onError(error as ServerError_T);
    }

    toast.error(errorMessage, { id });
    return undefined;
  }
};
