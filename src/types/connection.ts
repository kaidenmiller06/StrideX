export type ConnectionStatus = 'none' | 'outgoing' | 'incoming' | 'connected';

export type ConnectResult = 'created' | 'accepted' | 'pending' | 'connected';

export type ConnectionAction = 'connect' | 'accept' | 'cancel' | 'remove' | 'reject';