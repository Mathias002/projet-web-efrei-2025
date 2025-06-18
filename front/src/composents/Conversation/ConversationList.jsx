import React from 'react';
import { useQuery, gql } from '@apollo/client';

// requête pour récupérer toutes les conversations d'un user
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
        <div className="flex-grow-1 overflow-auto py-2">
            {conversations.length === 0 ? (
                <div className="text-muted text-center mt-3">Aucune conversation</div>
            ) : (
                conversations.map((conv) => (
                    <div 
                        key={conv.id}
                        className={`d-flex justify-content-between div-conv mb-2 ${conv.id === selectedId ? 'bg-primary text-white font-bold' : 'bg-light'}`} 
                        onClick={() => onSelect(conv.id)}
                    >
                        <div
                            className={`p-2 rounded mb-2 weight-500`}
                        >
                            {conv.nom}
                        </div>
                        <div 
                            className={`p-2 rounded mb-2 weight-500`}
                        >
                            {new Date(conv.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ConversationList;
