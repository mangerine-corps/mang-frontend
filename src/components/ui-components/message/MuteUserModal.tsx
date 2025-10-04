import React, { useState } from 'react';
import {
    Dialog,
    Portal,
    Button,
    VStack,
    Text,
    CloseButton,
    HStack,
    Select,
    Input,
} from '@chakra-ui/react';
import CustomSelect from 'mangarine/components/customcomponents/select';
import { SelectOptions } from 'mangarine/types';
import CustomButton from 'mangarine/components/customcomponents/button';
const durationOptions: SelectOptions[] = [
    { id: '8h', value: '8h', label: '8 hours' },
    { id: '24h', value: '24h', label: '24 hours' },
    { id: '7d', value: '7d', label: '7 days' },
    { id: 'forever', value: 'forever', label: 'Forever' },
    { id: 'custom', value: 'custom', label: 'Custom (hours)' },
];

export interface MuteUserPayload {
    mutedUserId: string;
    conversationId: string;
    muteUntil?: string; // ISO string optional
    reason?: string;
}

interface MuteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: MuteUserPayload) => Promise<{ success: boolean }>;
    mutedUserId: string;
    conversationId: string;
    displayName: string;
}

export const MuteUserModal: React.FC<MuteUserModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    mutedUserId,
    conversationId,
    displayName,
}) => {
    const [duration, setDuration] = useState<string>('24h');
    const [customHours, setCustomHours] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const computeMuteUntil = (): string | undefined => {
        let hours = 0;
        switch (duration) {
            case '8h':
                hours = 8; break;
            case '24h':
                hours = 24; break;
            case '7d':
                hours = 7 * 24; break;
            case 'forever':
                return undefined; // interpreted by backend as indefinite mute
            case 'custom': {
                const n = parseInt(customHours || '0', 10);
                if (!isNaN(n) && n > 0) hours = n;
                break;
            }
        }
        if (hours <= 0) return undefined;
        const until = new Date(Date.now() + hours * 60 * 60 * 1000);
        return until.toISOString();
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await onConfirm({
                mutedUserId,
                conversationId,
                muteUntil: computeMuteUntil(),
                reason: reason.trim() || undefined,
            });
            if (result.success) {
                onClose();
                setReason('');
                setCustomHours('');
                setDuration('24h');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        setReason('');
        setCustomHours('');
        setDuration('24h');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog.Root lazyMount open={isOpen} onOpenChange={handleClose} placement="center" size="md">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content rounded={'lg'} pt={4}>
                        <Dialog.Header p={4}>
                            <Text fontSize="xl" fontWeight="bold">Mute {displayName}</Text>
                        </Dialog.Header>
                        <Dialog.Body p="6">
                            <VStack gap={4} align="stretch">
                                <Text fontSize="sm" color="gray.700">
                                    Are you sure you want to mute <strong>{displayName}</strong>? You won't receive notifications from this conversation for the selected duration.
                                </Text>

                                <VStack align="stretch" gap={2}>
                                    <Text fontSize="sm" fontWeight="medium">Duration</Text>
                                    <CustomSelect
                                        id="duration"
                                        placeholder="Select duration"
                                        name="duration"
                                        size="md"
                                        options={durationOptions}
                                        label="Duration"
                                        value={[duration]}
                                        required={true}
                                        onChange={(val: string) => setDuration(val)}
                                    />
                                    {duration === 'custom' && (
                                        <Input
                                            type="number"
                                            min={1}
                                            placeholder="Enter hours"
                                            value={customHours}
                                            onChange={(e) => setCustomHours(e.target.value)}
                                        />
                                    )}
                                </VStack>

                                <VStack align="stretch" gap={2}>
                                    <Text fontSize="sm" fontWeight="medium">Reason (optional)</Text>
                                    <textarea
                                        placeholder="Why are you muting? (optional)"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={3}
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

                            <HStack
                                w="full"
                                display={"flex"}
                                alignItems={"flex-end"}
                                justifyContent={"flex-end"}
                                flexDir={"row"}
                            // mx="auto"
                            >
                                <CustomButton
                                    customStyle={{
                                        w: "35%",
                                        bg: "main_background",
                                        borderWidth: "2px",
                                    }}
                                    onClick={handleClose}
                                // loading={isLoading}
                                // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                                >
                                    <Text
                                        color={"text_primary"}
                                        fontWeight={"600"}
                                        fontSize={"1rem"}
                                        lineHeight={"100%"}
                                    >
                                        Cancel
                                    </Text>
                                </CustomButton>
                                <CustomButton
                                    customStyle={{
                                        w: "35%",
                                    }}
                                    // onClick={openModal}
                                    // loading={isLoading}
                                    onClick={handleSubmit}
                                >
                                    <Text
                                        color={"button_text"}
                                        fontWeight={"600"}
                                        fontSize={"1rem"}
                                        lineHeight={"100%"}
                                    >
                                        Mute
                                    </Text>
                                </CustomButton>
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
