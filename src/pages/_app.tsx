import { Box } from "@chakra-ui/react";
import { Providers } from "mangarine/components/ui/provider";
import { Toaster } from "mangarine/components/ui/toaster";
import AppLayout from "mangarine/layouts/AppLayout";

import "mangarine/styles/globals.css";
import type { AppProps } from "next/app";
import { Outfit } from "next/font/google";
import { useRouter } from "next/router";
import { PagesTopLoader } from 'nextjs-toploader/pages';
import { GoogleOAuthProvider } from "@react-oauth/google";

export const outfit = Outfit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  subsets: ["latin"],
});

// Routes that render without the app shell (no header/sidebar).
// "/" is exact-matched only — all other app paths start with "/" so startsWith would match everything.
const AUTH_PREFIXES = ["/auth", "/privacypolicy", "/termsofservice"];
const isAuthRoute = (pathname: string) =>
  pathname === "/" || AUTH_PREFIXES.some((p) => pathname.startsWith(p));

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authRoute = isAuthRoute(router.pathname);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <Providers>
        <Box bg="bd_background" h="100vh" as="main" className={`${outfit.className}`}>
          <PagesTopLoader color="#111D4A" height={3} />

          {authRoute ? (
            <Component {...pageProps} />
          ) : (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          )}

          <Toaster />
        </Box>
      </Providers>
    </GoogleOAuthProvider>
  );
}
