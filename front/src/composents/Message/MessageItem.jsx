import React from 'react';
import EditMessageButton from './EditMessageButton';
import DeleteMessageButton from './DeleteMessageButton';

function MessageItem({ msg, currentUserId, refetchMessages }) {
  const isMine = msg.sender?.id === currentUserId;

  return (
    <div className="container-message border-top pt-3">
      <div className="mb-3 div-message">
        <strong>{msg.sender?.username || 'Utilisateur inconnu'}</strong> —{' '}
        <small>{new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit',
        })}</small>
        <div>{msg.content}</div>
      </div>

      {isMine && (
        <div className="container-icon">
          <EditMessageButton message={msg} currentUserId={currentUserId} />
          <DeleteMessageButton messageId={msg.id} currentUserId={currentUserId} refetchMessages={refetchMessages} />
        </div>
      )}
    </div>
  );
}

export default MessageItem;
