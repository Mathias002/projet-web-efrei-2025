// src/composents/Conversation/Conversation.jsx

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import MessageInput from '../Message/MessageInput';
import { jwtDecode } from 'jwt-decode';
import MessageItem from '../Message/MessageItem';

// requête pour récupérer une conversation via son id
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

function ConversationDetails({ conversationId }) {
  const { data, loading, error, refetch } = useQuery(GET_CONVERSATION_BY_ID, {
    variables: { id: conversationId },
    // empêche la requête si conversationId est null
    skip: !conversationId,
  });

  if (!conversationId) return <p className="text-center align-middle mh-100 p-3">Aucune conversation sélectionnée</p>;
  if (loading) return <p className="p-3">Chargement des messages...</p>;
  if (error) return <p className="text-danger p-3">Erreur : {error.message}</p>;

  const conversation = data.conversation;

  // récupère l’id de l’utilisateur connecté à partir du jwt stocké en local storage
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.sub;

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
              <MessageItem
                key={msg.id}
                msg={msg}
                currentUserId={currentUserId}
                refetchMessages={refetch}
              />
            ))
          )}
        </div>
      </div>
      <MessageInput
        conversationId={conversationId}
        senderId={currentUserId}
        onMessageSent={handleNewMessage}
      />
    </div>
  );
}

export default ConversationDetails;
