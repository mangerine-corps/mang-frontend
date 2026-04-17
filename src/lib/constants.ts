export const DEFAULT_AVATAR =
  "https://res.cloudinary.com/ddl2pf4qh/image/upload/v1629388876/fintrak/FinProfile_no9nb1.png";

export function safeProfilePic(url?: string | null): string {
  if (!url || url === "null" || url === "undefined") return DEFAULT_AVATAR;
  return url;
}

export function imgErrorFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
}
