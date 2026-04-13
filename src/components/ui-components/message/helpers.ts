import { format } from "date-fns";

const getConversationMessagePayload = (conversation: any) => {
  return (
    conversation?.lastMessage ||
    conversation?.latestMessage ||
    conversation?.recentMessage ||
    conversation?.message ||
    conversation?.lastAppointment?.message ||
    null
  );
};

export const resolveConversationProfile = (conversation: any, userId: string) => {
  if (!conversation) {
    return {};
  }

  return userId === conversation?.user?.id
    ? conversation?.consultant ?? {}
    : conversation?.user ?? {};
};

export const isProfileVerified = (profile: any) => {
  return Boolean(
    profile?.isVerified ||
      profile?.verified ||
      profile?.isAccountVerified ||
      profile?.isConsultant
  );
};

export const getConversationSubtitle = (profile: any) => {
  return (
    profile?.jobTitle ||
    profile?.profession ||
    profile?.specialization ||
    profile?.occupation ||
    profile?.headline ||
    profile?.designation ||
    (profile?.isConsultant ? "Consultant" : "Member")
  );
};

export const getConversationPreview = (conversation: any) => {
  const previewSource = getConversationMessagePayload(conversation);
  const preview =
    previewSource?.content || previewSource || "";

  if (typeof preview === "string") {
    return preview;
  }

  if (preview && typeof preview === "object") {
    return preview?.content || "";
  }

  return "";
};

export const hasConversationActivity = (conversation: any) => {
  const payload = getConversationMessagePayload(conversation);

  if (!payload) {
    return false;
  }

  if (typeof payload === "string") {
    return payload.trim().length > 0;
  }

  if (typeof payload === "object") {
    const content = typeof payload?.content === "string" ? payload.content.trim() : "";
    const hasAttachments =
      Array.isArray(payload?.attachments) && payload.attachments.length > 0;

    return Boolean(content || hasAttachments);
  }

  return false;
};

export const getConversationTimestamp = (conversation: any) => {
  return (
    conversation?.lastMessage?.createdAt ||
    conversation?.updatedAt ||
    conversation?.createdAt ||
    ""
  );
};

export const formatConversationTime = (value?: string | Date) => {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return format(parsedDate, "h:mma").toLowerCase();
};
