export enum ConversationStatus {
  BOT = 'BOT',
  HUMAN = 'HUMAN',
  UNASSIGNED = 'UNASSIGNED',
  RESOLVED = 'RESOLVED',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

export enum ConversationTab {
  BOT = 'BOT',
  HUMAN = 'HUMAN',
  RESOLVED = 'RESOLVED',
}

export interface Label {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly content: string;
  readonly type: MessageType;
  readonly senderName: string;
  readonly senderId: string;
  readonly isFromLead: boolean;
  readonly mediaUrl: string | null;
  readonly createdAt: string;
}

export interface Conversation {
  readonly id: string;
  readonly leadId: string;
  readonly leadName: string;
  readonly leadPhone: string;
  readonly leadAvatar: string | null;
  readonly assignedAgentId: string | null;
  readonly assignedAgentName: string | null;
  readonly teamId: string | null;
  readonly status: ConversationStatus;
  readonly labels: ReadonlyArray<Label>;
  readonly lastMessage: string | null;
  readonly lastMessageAt: string | null;
  readonly unreadCount: number;
  readonly tenantId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ConversationFilters {
  readonly tab: ConversationTab;
  readonly search: string;
  readonly labelId: string | null;
  readonly agentId: string | null;
}

export interface TypingIndicator {
  readonly conversationId: string;
  readonly userName: string;
  readonly userId: string;
}

export interface SendMessagePayload {
  readonly conversationId: string;
  readonly content: string;
  readonly type: MessageType;
  readonly mediaUrl?: string;
}
