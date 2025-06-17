import React from 'react';
import { useQuery, gql } from '@apollo/client';

// ⚡️ Remplace cette query par celle réellement utilisée côté backend
const GET_CONVERSATIONS = gql`
  query GetConversations($userId: String!) {
    userConversations(userId: $userId) {
      id
      nom
      createdAt
    }
  }
`;

function ConversationList({ userId, selectedId, onSelect }) {
    const { loading, error, data } = useQuery(GET_CONVERSATIONS, {
        variables: { userId },
    });

    if (loading) return <div className="p-3">Chargement...</div>;
    if (error) return <div className="text-danger p-3">Erreur : {error.message}</div>;


    const conversations = data?.userConversations || [];


    return (
        <div className="flex-grow-1 overflow-auto px-3 py-2">
            {conversations.length === 0 ? (
                <div className="text-muted text-center mt-3">Aucune conversation</div>
            ) : (
                conversations.map((conv) => (
                    <div className='d-flex justify-content-between'>
                        <div
                            key={conv.id}
                            className={`p-2 rounded mb-2 ${selectedId === conv.id ? 'bg-primary text-white' : 'bg-white text-dark'
                                } shadow-sm`}
                            onClick={() => onSelect(conv.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {conv.nom}
                        </div>
                        <div>
                            {new Date(conv.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ConversationList;
