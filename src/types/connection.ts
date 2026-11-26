export type ConnectionStatus = 'none' | 'outgoing' | 'incoming' | 'connected';

export type ConnectResult = 'created' | 'accepted' | 'pending' | 'connected';

export type ConnectionAction = 'connect' | 'accept' | 'cancel' | 'remove' | 'reject';

export type Connection = {
  id: string;
  status: string;
  requesterId: string;
  recipientId: string;
  userId: string;
  username: string;
  name: string;
  image: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  lastMessageSenderId: string | null;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}