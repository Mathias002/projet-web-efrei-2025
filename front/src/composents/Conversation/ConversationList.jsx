import React from 'react';

function ConversationList({ conversations, selectedId, onSelect }) {
  return (
    <div className="flex-grow-1 overflow-auto px-3 py-2">
      {conversations.length === 0 ? (
        <div className="text-muted text-center mt-3">Aucune conversation</div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-2 rounded mb-2 ${
              selectedId === conv.id ? 'bg-primary text-white' : 'bg-white text-dark'
            } shadow-sm cursor-pointer`}
            onClick={() => onSelect(conv.id)}
            style={{ cursor: 'pointer' }}
          >
            {conv.name}
          </div>
        ))
      )}
    </div>
  );
}

export default ConversationList;
