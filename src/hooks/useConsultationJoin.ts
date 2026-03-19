import { useCallback } from 'react';
import { apiClient } from 'mangarine/lib/api-client';

export const useConsultationJoin = () => {
  const markUserJoined = useCallback(async (appointmentId: string) => {
    try {
      const response = await apiClient.post('/appointment/join/user', {
        conversationId: appointmentId,
      });

      return response.data;
    } catch (error) {
      console.error('Error marking user as joined:', error);
      throw error;
    }
  }, []);

  return { markUserJoined };
};
