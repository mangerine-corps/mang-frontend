import { Box } from "@chakra-ui/react";
import { Providers } from "mangarine/components/ui/provider";
import { Toaster } from "mangarine/components/ui/toaster";

import "mangarine/styles/globals.css";
import type { AppProps } from "next/app";
import { Outfit } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PagesTopLoader } from 'nextjs-toploader/pages';
import { GoogleOAuthProvider } from "@react-oauth/google";

export const outfit = Outfit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  subsets: ["latin"],
});
export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    const handleRouteChangeError = () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    // Clean up event listeners on component unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events]); // Re-run effect if router.events object changes

  useEffect(() => {
    console.log(loading, "loading");
  }, [loading])
   
  return (
  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
    <Providers>
      <Box
        bg="bd_background"
        h="100vh"
        as="main"
        className={`${outfit.className}`}
      >
        {loading && <PagesTopLoader />}
        <Component {...pageProps} />
        <Toaster />
      </Box>
    </Providers>
      </GoogleOAuthProvider>
  );
}
