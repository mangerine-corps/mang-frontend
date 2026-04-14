import { useCallback } from 'react';
import { apiClient } from 'mangarine/lib/api-client';

export const useConsultationJoin = () => {
  const markUserJoined = useCallback(async (appointmentId: string) => {
    try {
      const response = await apiClient.post('/appointment/join/user', {
        conversationId: appointmentId,
      });

      return response.data;
    } catch (error: any) {
      // Non-retriable errors — surface them so the caller can decide
      const status = error?.response?.status ?? error?.status;
      if (status === 404 || status === 400) {
        console.warn('[ConsultationJoin] Non-retriable error:', status, error?.response?.data?.message ?? error?.message);
        return null; // treat as no-op — the call itself can still proceed
      }
      throw error;
    }
  }, []);

  return { markUserJoined };
};
