// src/composents/Conversation/Conversation.jsx

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import MessageInput from '../Message/MessageInput';
import { jwtDecode } from 'jwt-decode';

const GET_CONVERSATION_BY_ID = gql`
  query GetConversationById($id: String!) {
    conversation(id: $id) {
      id
      nom
      messages {
        id
        content
        senderId
        createdAt
        sender {
        id
        username
      }
      }
    }
  }
`;

function Conversation({ conversationId }) {
  const { data, loading, error } = useQuery(GET_CONVERSATION_BY_ID, {
    variables: { id: conversationId },
    skip: !conversationId,
  });

  if (!conversationId) return <p className="p-3">Aucune conversation sélectionnée</p>;
  if (loading) return <p className="p-3">Chargement des messages...</p>;
  if (error) return <p className="text-danger p-3">Erreur : {error.message}</p>;

  const conversation = data.conversation;

  const token = localStorage.getItem('token');
  const { sub: senderId } = jwtDecode(token);

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className='container-chat'>
      <div className="d-flex flex-column flex-grow-1 p-3">
        <h4>{conversation.nom}</h4>
        <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '60vh' }}>
          {conversation.messages.length === 0 ? (
            <p className="text-muted">Aucun message</p>
          ) : (
            conversation.messages.map((msg) => (
              <div key={msg.id} className="mb-3">
                <strong>{msg.sender?.username || 'Utilisateur inconnu'}</strong> —{' '}
                <small>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                <div>{msg.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <MessageInput
        conversationId={conversationId}
        senderId={senderId}
        onMessageSent={handleNewMessage}
      />
    </div>
  );
}

export default Conversation;
