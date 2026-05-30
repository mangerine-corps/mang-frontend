import { Box } from "@chakra-ui/react";
import { Providers } from "mangarine/components/ui/provider";
import { Toaster } from "mangarine/components/ui/toaster";
import AppLayout from "mangarine/layouts/AppLayout";

import "mangarine/styles/globals.css";
import type { AppProps } from "next/app";
import { Outfit } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { PagesTopLoader } from 'nextjs-toploader/pages';
import { GoogleOAuthProvider } from "@react-oauth/google";

const APP_NAME = "Mangerine";

const PAGE_TITLES: Record<string, string> = {
  "/": "Sign In",
  "/home": "Home",
  "/discover": "Discover",
  "/people": "People",
  "/search": "Search",
  "/profile": "My Profile",
  "/saved": "Saved",
  "/notification": "Notifications",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/communities": "Communities",
  "/consultant": "Find Consultants",
  "/consultant/[consultantId]": "Consultant Profile",
  "/consultation": "My Consultations",
  "/consultation/view": "Consultation Details",
  "/consultation/reschedule": "Reschedule Consultation",
  "/consultation/cancel": "Cancel Consultation",
  "/consultationvideos": "Consultation Videos",
  "/message": "Messages",
  "/message/videoconsultation": "Video Consultation",
  "/groups": "Groups",
  "/groups/create": "Create Group",
  "/groups/[groupId]": "Group",
  "/groups/manage/[groupId]": "Manage Group",
  "/jobs": "Jobs",
  "/jobs/create": "Post a Job",
  "/jobs/search": "Search Jobs",
  "/jobs/[jobId]": "Job Details",
  "/posts/[postId]": "Post",
  "/my-business": "My Business",
  "/my-business/dashboard": "Business Dashboard",
  "/payment-success": "Payment Successful",
  "/privacypolicy": "Privacy Policy",
  "/termsofservice": "Terms of Service",
  "/auth/login": "Sign In",
  "/auth/forgot-password": "Forgot Password",
  "/auth/reset-password": "Reset Password",
  "/auth/otp-verification": "Verify OTP",
  "/auth/success": "Account Created",
  "/auth/onboarding/register": "Create Account",
  "/auth/onboarding/account-verification": "Verify Account",
  "/auth/onboarding/onboarding-one": "Set Up Profile",
  "/auth/onboarding/onboarding-two": "Set Up Profile",
  "/auth/onboarding/onboarding-three": "Set Up Profile",
  "/auth/onboarding/onboarding-four": "Set Up Profile",
};

const getPageTitle = (pathname: string): string => {
  const label = PAGE_TITLES[pathname];
  return label ? `${label} — ${APP_NAME}` : APP_NAME;
};

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
    <>
      <Head>
        <title>{getPageTitle(router.pathname)}</title>
      </Head>
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
    </>
  );
}
