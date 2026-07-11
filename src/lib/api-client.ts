import axios, { AxiosHeaders } from "axios";

type TokenCarrier = {
  token?: unknown;
  accessToken?: unknown;
  access_token?: unknown;
  preAuth?: unknown;
};

type RootLikeState = {
  userAuth?: unknown;
};

type AuthTokenResolver = () => string | undefined;

let authTokenResolver: AuthTokenResolver | null = null;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:4000";

const resolveTokenValue = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue ? trimmedValue : undefined;
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const tokenCarrier = value as TokenCarrier;

  return (
    resolveTokenValue(tokenCarrier.token) ||
    resolveTokenValue(tokenCarrier.accessToken) ||
    resolveTokenValue(tokenCarrier.access_token)
  );
};

export const extractAuthTokenFromUserAuth = (userAuth: unknown): string | undefined => {
  if (!userAuth || typeof userAuth !== "object") {
    return undefined;
  }

  const authState = userAuth as TokenCarrier;

  return resolveTokenValue(authState.token) || resolveTokenValue(authState.preAuth);
};

export const extractAuthToken = (state: RootLikeState | undefined): string | undefined =>
  extractAuthTokenFromUserAuth(state?.userAuth);

const getPersistedAuthToken = (): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const persistedRoot = window.localStorage.getItem("persist:root");

    if (!persistedRoot) {
      return undefined;
    }

    const parsedRoot = JSON.parse(persistedRoot) as Record<string, unknown>;
    const persistedUserAuth =
      typeof parsedRoot.userAuth === "string"
        ? JSON.parse(parsedRoot.userAuth)
        : parsedRoot.userAuth;

    return extractAuthTokenFromUserAuth(persistedUserAuth);
  } catch {
    return undefined;
  }
};

export const getAuthToken = (): string | undefined =>
  authTokenResolver?.() || getPersistedAuthToken();

export const registerAuthTokenResolver = (resolver: AuthTokenResolver) => {
  authTokenResolver = resolver;
};

export const createAuthorizationHeader = (tokenLike: unknown): string | undefined => {
  const token = resolveTokenValue(tokenLike);
  return token ? `Bearer ${token}` : undefined;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
});

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);

  if (!headers.has("Authorization")) {
    const token = getAuthToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    headers.delete("Content-Type");
  }

  config.headers = headers;

  return config;
});

let isHandling401 = false;

const hadActiveSession = (): boolean => !!getPersistedAuthToken();

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthEndpoint = url.includes("/auth/");

    if (status === 401 && !isAuthEndpoint && !isHandling401 && hadActiveSession()) {
      isHandling401 = true;
      import("mangarine/state/store").then(({ store }) => {
        import("mangarine/state/reducers/auth.reducer").then(({ signOut }) => {
          store.dispatch(signOut());
          try { localStorage.removeItem("persist:root"); } catch {}
          window.location.href = "/auth/login";
        });
      });
    }

    return Promise.reject(error);
  }
);

