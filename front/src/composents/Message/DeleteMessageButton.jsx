import React from 'react';
import { useMutation, gql } from '@apollo/client';

// mutation pour supprimer un message
const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: String!, $userId: String!) {
    deleteMessage(messageId: $messageId, userId: $userId){
        id,
        content,
        conversationId,
        createdAt,
        senderId,
        deleted,
        updatedAt,
    }
  }
`;

function DeleteMessageButton({ messageId, refetchMessages, currentUserId }) {
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  const handleDelete = async () => {
    // affiche une boîte de dialogue pour confirmer la suppression
    if (window.confirm('Supprimer ce message ?')) {
      try {
        // appelle la mutation après confirmation
        await deleteMessage({ variables: { messageId: messageId, userId: currentUserId } });
        // rafraîchit l'affichage
        refetchMessages();
      } catch (err) {
        console.error('Erreur suppression :', err.message);
      }
    }
  };

  return (
    <span className="icon-message delete-message" onClick={handleDelete}>
      ❌
    </span>
  );
}

export default DeleteMessageButton;
