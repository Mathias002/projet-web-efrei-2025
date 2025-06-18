import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

// mutation pour envoyer un message
const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: String!, $senderId: String!, $content: String!) {
    sendMessage(
    input: {
    content: $content,
    senderId: $senderId,
    conversationId: $conversationId
}){
      id
      content
      senderId
      createdAt
    }
  }
`;

function MessageInput({ conversationId, senderId, onMessageSent }) {
    const [content, setContent] = useState('');
    const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

    const handleSend = async (e) => {
        e.preventDefault();
        // ignore les messages vides
        if (!content.trim()) return;

        try {
            const { data } = await sendMessage({
                variables: {
                    conversationId,
                    senderId,
                    content,
                },
            });

            if (onMessageSent) onMessageSent(data.sendMessage);

            setContent('');
        } catch (err) {
            console.error('Erreur lors de l’envoi du message:', err.message);
        }
    };

    return (
        <form onSubmit={handleSend} className="d-flex border-top p-3 input-message">
            <input
                className="form-control me-2"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrire un message..."
                disabled={loading}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
                Envoyer
            </button>
        </form>
    );
}

export default MessageInput;
