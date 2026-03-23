import { Response } from "express";

/** Pagination/meta info */
export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

/** Standardized API response structure */
export type TResponse<T> = {
  statusCode: number;
  success?: boolean; // auto-inferred if not provided
  message?: string;
  meta?: TMeta;
  data?: T | null;
};

/**
 * sendResponse
 * Sends a standardized JSON response, allowing `data.message` and `data.meta` to overwrite top-level values
 */
const sendResponse = <T extends Record<string, any>>(
  res: Response,
  response: TResponse<T> | any
) => {
  const { statusCode, data } = response;

  // Determine success automatically if not explicitly provided
  const success = response.success ?? (statusCode >= 200 && statusCode < 400);

  // If data has message/meta, overwrite top-level ones
  const message = data?.message ?? response.message;

  const jsonResponse: Record<string, any> = {
    statusCode,
    success,
    message,
    data,
  };

  if (response.data?.meta) {
    jsonResponse.meta = response.data.meta;
    delete response.data.meta;
  }

  if (response?.meta) {
    jsonResponse.meta = response.meta;
  }

  if (response.meta) {
    delete response.meta;
  }

  if (message) jsonResponse.message = message;

  return res.status(statusCode).json(jsonResponse);
};

export default sendResponse;
