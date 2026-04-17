export const BANNER_GRADIENTS = [
  "linear-gradient(135deg, #111D4A 0%, #1a3a6e 50%, #2563eb 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #4a1942 0%, #c84b31 50%, #ecb33d 100%)",
  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  "linear-gradient(135deg, #373b44 0%, #4286f4 100%)",
  "linear-gradient(135deg, #200122 0%, #6f0000 100%)",
  "linear-gradient(135deg, #005c97 0%, #363795 100%)",
];

export function getBannerGradient(seed?: string): string {
  if (!seed) return BANNER_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return BANNER_GRADIENTS[Math.abs(hash) % BANNER_GRADIENTS.length];
}

export const DEFAULT_AVATAR =
  "https://res.cloudinary.com/ddl2pf4qh/image/upload/v1629388876/fintrak/FinProfile_no9nb1.png";

export function safeProfilePic(url?: string | null): string {
  if (!url || url === "null" || url === "undefined") return DEFAULT_AVATAR;
  return url;
}

export function imgErrorFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
}
