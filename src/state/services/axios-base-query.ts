import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { apiClient } from "mangarine/lib/api-client";

type AxiosBaseQueryArgs =
  | string
  | (AxiosRequestConfig & {
      url: string;
      body?: AxiosRequestConfig["data"];
      formData?: boolean;
    });

type AxiosBaseQueryOptions = {
  baseUrl?: string;
  headers?: AxiosRequestConfig["headers"];
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const combineUrls = (baseUrl: string, url: string) => {
  if (!baseUrl) {
    return url;
  }

  if (!url) {
    return baseUrl;
  }

  if (isAbsoluteUrl(url)) {
    return url;
  }

  if (url.startsWith("?")) {
    return `${baseUrl.replace(/\/+$/, "")}${url}`;
  }

  return `${baseUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
};

export const axiosBaseQuery =
  ({
    baseUrl = "",
    headers: defaultHeaders,
  }: AxiosBaseQueryOptions = {}): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    { status: number | string; data: unknown }
  > =>
  async (args, api) => {
    const request = typeof args === "string" ? { url: args } : args;
    const data = request.data ?? request.body;

    try {
      const result = await apiClient.request({
        url: combineUrls(baseUrl, request.url),
        method: request.method || "GET",
        data,
        params: request.params,
        headers: {
          ...defaultHeaders,
          ...request.headers,
        },
        responseType: request.responseType,
        signal: api.signal,
      });

      return { data: result.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: {
            status: error.response?.status ?? "FETCH_ERROR",
            data: error.response?.data ?? error.message,
          },
        };
      }

      return {
        error: {
          status: "FETCH_ERROR",
          data: error instanceof Error ? error.message : error,
        },
      };
    }
  };
