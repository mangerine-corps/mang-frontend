import { useCallback } from 'react';
import { useAuth } from 'mangarine/state/hooks/user.hook';

export const useConsultationJoin = () => {
  const { token } = useAuth();

  const markUserJoined = useCallback(async (appointmentId: string) => {
    try {
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Appointment ID:', appointmentId);
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:4000'}/appointment/join/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId: appointmentId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark user as joined: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Successfully marked user as joined:', result);
      return result;
    } catch (error) {
      console.error('Error marking user as joined:', error);
      throw error;
    }
  }, [token]);

  return { markUserJoined };
};
