export interface IStartConversationResponse {
    conversationId: string;
    expires_in: number;
    referenceGrammarId: string;
    streamUrl: string;
    token: string;    
}