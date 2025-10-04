import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs
import { sanitizeMessageContent, sanitizeFilename } from './sanitize';

// Define the interface for the full Message object
interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    conversationId: string;
    parentId: string | null;
    content: string;
    isSeen: boolean;
    seenAt: string | null;
    editedAt: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBySender: boolean;
    deletedByReceiver: boolean;
    isFlagged: boolean;
    isReply: boolean;
    status: 'sent' | 'delivered' | 'seen'; // You might expand this
    createdAt: string;
    parent: Message | null; // For the actual parent object if loaded
    attachments: any[]; // Assuming attachments are an array, could be more specific
}

// Define the interface for the input formData
interface MessageFormData {
    conversationId: string;
    receiverId: string;
    content: string;
    parentId?: string | null; // Optional, if it's a reply
    attachments?: Array<{
        url: string;
        publicId: string;
        fileType: string;
        fileName: string;
        fileSize: number;
    }>;
    // You might also implicitly pass the senderId, or get it from context/auth
}

/**
 * Generates a full Message object from minimal form data.
 * @param formData - The input data for the message.
 * @param senderId - The ID of the user sending the message (typically from auth context).
 * @returns A complete Message object with default values.
 */
export function generateMessageObject(formData: MessageFormData, senderId: string): Message {
    const now = new Date(); // Get current date and time

    return {
        id: uuidv4(), // Generate a unique ID for the message
        senderId: senderId, // Provided as a parameter
        receiverId: formData.receiverId,
        conversationId: formData.conversationId,
        parentId: formData.parentId || null, // Use provided parentId or null
        content: sanitizeMessageContent(formData.content),
        isSeen: false,
        seenAt: null,
        editedAt: null,
        isDeleted: false,
        deletedAt: null,
        deletedBySender: false,
        deletedByReceiver: false,
        isFlagged: false,
        isReply: !!formData.parentId, // Set to true if parentId is provided
        status: 'sent', // Initial status
        createdAt: now.toISOString(), // ISO 8601 string for consistency
        parent: null, // This is typically populated by database relation loading, not on creation
        attachments: formData.attachments ? formData.attachments.map(attachment => ({
          ...attachment,
          fileName: sanitizeFilename(attachment.fileName)
        })) : [], // Include attachments if provided, with sanitized filenames
    };
}

// --- Example Usage ---

// Assume you have these values from your application context/props
const currentConversation = { id: "20e5ce1c-f440-4ac8-b56f-9ab573820a00" };
const peer = { id: "eaa8c952-084e-490a-83c4-20dc0018258d" };
const chatText = "hello here";
const loggedInSenderId = "388e7777-50a8-4453-af32-243212360d93"; // This would come from your auth context

// Case 1: New top-level message
const formDataForNewMessage = {
    conversationId: currentConversation.id,
    receiverId: peer.id,
    content: chatText,
};

const newMessage = generateMessageObject(formDataForNewMessage, loggedInSenderId);


/* Expected output (IDs and timestamps will vary):
New Message: {
  id: 'some-new-uuid-for-message',
  senderId: '388e7777-50a8-4453-af32-243212360d93',
  receiverId: 'eaa8c952-084e-490a-83c4-20dc0018258d',
  conversationId: '20e5ce1c-f440-4ac8-b56f-9ab573820a00',
  parentId: null,
  content: 'hello here',
  isSeen: false,
  seenAt: null,
  editedAt: null,
  isDeleted: false,
  deletedAt: null,
  deletedBySender: false,
  deletedByReceiver: false,
  isFlagged: false,
  isReply: false,
  status: 'sent',
  createdAt: '2025-07-13T21:37:26.000Z', // Current timestamp
  parent: null,
  attachments: []
}
*/

// Case 2: Reply message
const existingParentMessageId = "241b33ba-a628-4905-ae69-f1bd4a30168c"; // ID of the message being replied to
const replyText = "This is a reply!";

const formDataForReply = {
    conversationId: currentConversation.id,
    receiverId: peer.id, // Or the original sender's ID if direct reply
    content: replyText,
    parentId: existingParentMessageId,
};

const replyMessage = generateMessageObject(formDataForReply, loggedInSenderId);


/* Expected output (IDs and timestamps will vary):
Reply Message: {
  id: 'some-new-uuid-for-reply-message',
  senderId: '388e7777-50a8-4453-af32-243212360d93',
  receiverId: 'eaa8c952-084e-490a-83c4-20dc0018258d',
  conversationId: '20e5ce1c-f440-4ac8-b56f-9ab573820a00',
  parentId: '241b33ba-a628-4905-ae69-f1bd4a30168c',
  content: 'This is a reply!',
  isSeen: false,
  seenAt: null,
  editedAt: null,
  isDeleted: false,
  deletedAt: null,
  deletedBySender: false,
  deletedByReceiver: false,
  isFlagged: false,
  isReply: true, // This is now true
  status: 'sent',
  createdAt: '2025-07-13T21:37:26.000Z', // Current timestamp
  parent: null,
  attachments: []
}
*/