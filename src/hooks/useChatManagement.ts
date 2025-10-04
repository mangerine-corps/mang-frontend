import { useState } from 'react';
import {
  useBlockUserMutation,
  useUnblockUserMutation,
  useMuteUserMutation,
  useUnmuteUserMutation,
  useReportUserMutation,
  useDeleteConversationMutation,
  useCheckIfBlockedQuery,
  useCheckIfMutedQuery,
  useCheckIfDeletedQuery,
  BlockUserRequest,
  MuteUserRequest,
  ReportUserRequest,
  DeleteConversationRequest,
} from '../state/services/chat-management.service';
import { toaster } from 'mangarine/components/ui/toaster';

export const useChatManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  // API mutations
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [muteUser] = useMuteUserMutation();
  const [unmuteUser] = useUnmuteUserMutation();
  const [reportUser] = useReportUserMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  // Helper function to show toast messages
  const showToast = (title: string, status: 'success' | 'error' | 'warning' | 'info') => {
    toaster.create({
      title,
      type: status,
      duration: 3000,
      closable: true,
    });
  };

  // Block a user
  const handleBlockUser = async (data: BlockUserRequest) => {
    try {
      setIsLoading(true);
      await blockUser(data).unwrap();
      showToast('User blocked successfully', 'success');
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to block user';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Unblock a user
  const handleUnblockUser = async (data: { blockedUserId: string; conversationId: string }) => {
    try {
      setIsLoading(true);
      await unblockUser(data).unwrap();
      showToast('User unblocked successfully', 'success');
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to unblock user';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Mute a user
  const handleMuteUser = async (data: MuteUserRequest) => {
    try {
      setIsLoading(true);
      await muteUser(data).unwrap();
      showToast('User muted successfully', 'success');
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to mute user';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Unmute a user
  const handleUnmuteUser = async (data: { mutedUserId: string; conversationId: string }) => {
    try {
      setIsLoading(true);
      await unmuteUser(data).unwrap();
      showToast('User unmuted successfully', 'success');
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to unmute user';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Report a user
  const handleReportUser = async (data: ReportUserRequest) => {
    try {
      setIsLoading(true);
      await reportUser(data).unwrap();
      showToast('User reported successfully', 'success');
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to report user';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (data: DeleteConversationRequest) => {
    try {
      setIsLoading(true);
      await deleteConversation(data).unwrap();
      showToast('Conversation deleted successfully', 'success');
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to delete conversation';
      showToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleBlockUser,
    handleUnblockUser,
    handleMuteUser,
    handleUnmuteUser,
    handleReportUser,
    handleDeleteConversation,
    // Query hooks for checking status
    useCheckIfBlockedQuery,
    useCheckIfMutedQuery,
    useCheckIfDeletedQuery,
  };
};
