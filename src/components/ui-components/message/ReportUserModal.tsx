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
import { ReportUserRequest } from '../../../state/services/chat-management.service';
import { toaster } from '../../ui/toaster';

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (data: ReportUserRequest) => Promise<{ success: boolean }>;
  reportedUserId: string;
  conversationId: string;
  reportedUserName: string;
}

const REPORT_REASONS = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'fake_profile', label: 'Fake Profile' },
  { value: 'scam', label: 'Scam' },
  { value: 'violence', label: 'Violence' },
  { value: 'other', label: 'Other' },
];

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  isOpen,
  onClose,
  onReport,
  reportedUserId,
  conversationId,
  reportedUserName,
}) => {
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason || !description.trim()) {
      toaster.create({
        title: 'Missing Information',
        description: 'Please select a reason and provide a description.',
        type: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onReport({
        reportedUserId,
        conversationId,
        reason: reason as any,
        description: description.trim(),
      });

      if (result.success) {
        onClose();
        setReason('');
        setDescription('');
        toaster.create({
          title: 'Success',
          description: 'Report submitted successfully.',
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      setDescription('');
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
                Report {reportedUserName}
              </Text>
            </Dialog.Header>
            <Dialog.Body p="6">
              <VStack gap={4} align="stretch">
                <Text fontSize="sm" color="gray.600">
                  Please select a reason for reporting this user and provide additional details.
                </Text>
                
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Reason for Report *
                  </Text>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                    }}
                  >
                    <option value="">Select a reason</option>
                    {REPORT_REASONS.map((reasonOption) => (
                      <option key={reasonOption.value} value={reasonOption.value}>
                        {reasonOption.label}
                      </option>
                    ))}
                  </select>
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Description *
                  </Text>
                  <textarea
                    placeholder="Please provide specific details about the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      backgroundColor: 'white',
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
                  loadingText="Submitting Report"
                  disabled={!reason || !description.trim()}
                  size="md"
                >
                  Submit Report
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
