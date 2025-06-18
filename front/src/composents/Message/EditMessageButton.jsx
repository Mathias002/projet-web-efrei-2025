import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// mutation pour mettre à jour un message via son id
export const UPDATE_MESSAGE = gql`
  mutation EditMessage($messageId: String!, $newContent: String!, $userId: String!) {
    editMessage(
      userId: $userId
      input: { messageId: $messageId, newContent: $newContent },
    ) {
      id
      content
      updatedAt
    }
  }
`;

function EditMessageButton({ message, currentUserId }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const [updateMessage] = useMutation(UPDATE_MESSAGE);

  const handleEdit = async () => {
    try {
      // exécute la mutation avec les données nécessaires 
      await updateMessage({ variables: { userId: currentUserId, messageId: message.id, newContent: content } });
      // quitte le mode édition
      setEditing(false);
    } catch (err) {
      console.error('Erreur modification :', err.message);
    }
  };

  if (editing) {
    return (
      <div className="edit-form">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-control mb-1"
        />
        <button onClick={handleEdit} className="btn btn-sm btn-success me-1">✅</button>
        <button onClick={() => setEditing(false)} className="btn btn-sm btn-secondary">❌</button>
      </div>
    );
  }

  return (
    <span className="icon-message edit-message" onClick={() => setEditing(true)}>
      ✏️
    </span>
  );
}

export default EditMessageButton;
