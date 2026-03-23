"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { serverApi } from "@/lib/serverAxios";

export async function createFaqAction(formData: {
  question: string;
  questionArabic: string;
  answer: string;
  answerArabic: string;
  mobileFontSize?: number;
}) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await serverApi.post("/faqs", formData, {
      headers: {
        Authorization: `${accessToken}`,
        "x-client-type": "MOBILE",
      },
    });

    revalidatePath("/faqs"); // Adjust path as needed
    revalidatePath("/"); // Revalidate home if FAQs shown there

    return {
      success: true,
      message: response.data?.message || "FAQ created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create FAQ",
    };
  }
}

export async function updateFaqAction(
  id: string,
  formData: {
    question: string;
    questionArabic: string;
    answer: string;
    answerArabic: string;
    mobileFontSize?: number;
  }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const response = await serverApi.patch(`/faqs/${id}`, formData, {
      headers: {
        Authorization: `${accessToken}`,
        "x-client-type": "MOBILE",
      },
    });

    revalidatePath("/faqs");
    revalidatePath("/");

    return {
      success: true,
      message: response.data?.message || "FAQ updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update FAQ",
    };
  }
}

export async function deleteFaqAction(id: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const response = await serverApi.delete(`/faqs/${id}`, {
      headers: {
        authorization: `${accessToken}`,
        "x-client-type": "MOBILE",
      },
    });

    revalidatePath("/faqs");
    revalidatePath("/");

    return {
      success: true,
      message: response.data?.message || "FAQ deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete FAQ",
    };
  }
}

export async function updateFaqIndexAction(id: string, index: number) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const response = await serverApi.patch(`/faqs/change-index/${id}`, { index }, {
      headers: {
        Authorization: `${accessToken}`,
        "x-client-type": "MOBILE",
      },
    });

    revalidatePath("/faqs");
    revalidatePath("/");

    return {
      success: true,
      message: response.data?.message || "FAQ index updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update FAQ index",
    };
  }
}

