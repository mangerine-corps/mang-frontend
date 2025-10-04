import React, { useState } from 'react';
import {
  Dialog,
  Portal,
  Button,
  VStack,
  Text,
  CloseButton,
  HStack,
} from '@chakra-ui/react';
import { DeleteConversationRequest } from '../../../state/services/chat-management.service';
import { toaster } from '../../ui/toaster';

interface DeleteConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (data: DeleteConversationRequest) => Promise<{ success: boolean }>;
  conversationId: string;
  conversationName: string;
}

export const DeleteConversationModal: React.FC<DeleteConversationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  conversationId,
  conversationName,
}) => {
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await onDelete({
        conversationId,
        reason: reason.trim() || undefined,
      });

      if (result.success) {
        onClose();
        setReason('');
        toaster.create({
          title: 'Success',
          description: 'Conversation deleted successfully!',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to delete conversation.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={handleClose}
      placement="center"
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Text fontSize="xl" fontWeight="bold">
                Delete Conversation
              </Text>
            </Dialog.Header>
            <Dialog.Body p="6">
              <VStack gap={4} align="stretch">
                <Text fontSize="sm" color="orange.600" fontWeight="medium">
                  ⚠️ Are you sure you want to delete the conversation with <strong>{conversationName}</strong>?
                  This action cannot be undone.
                </Text>
                
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Reason (Optional)
                  </Text>
                  <textarea
                    placeholder="Why are you deleting this conversation? (optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </VStack>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="90%" pt="4" pb={6}>
              <HStack w="full" justify="center" gap={3}>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  loadingText="Deleting..."
                  size="md"
                >
                  Delete Conversation
                </Button>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
