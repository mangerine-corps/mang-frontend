import { useEffect } from "react";
import { useRouter } from "next/router";

// Consultant profiles now live at /profile/:uuid — redirect there.
export default function ConsultantProfileRedirect() {
  const router = useRouter();
  const { consultantId } = router.query as { consultantId?: string };

  useEffect(() => {
    if (consultantId) {
      router.replace(`/profile/${consultantId}`);
    }
  }, [consultantId, router]);

  return null;
}
