import ConversationList from '../Conversation/ConversationList';
import React, { useState } from 'react';

function ChatHome({ currentUser, onLogout }) {

  const [selectedConvId, setSelectedConvId] = useState(null);

  return (
    <div className="d-flex vh-100">
      {/* Sidebar gauche */}
      <div className="d-flex flex-column border-end bg-light" style={{ width: '300px' }}>
        <div className="p-3 border-bottom">
          <h5>Conversations</h5>
        </div>

        {/* Liste des conversations */}
        <div className="flex-grow-1 overflow-auto px-3">
            <ConversationList
                userId="0d413f71-5986-42dc-a1ac-096b3b98629e" // à remplacer plus tard par l’ID dynamique du user connecté
                selectedId={selectedConvId}
                onSelect={setSelectedConvId}
            />
        </div>

        {/* Boutons en bas */}
        <div className="p-3 border-top">
          <button className="btn btn-primary w-100 mb-2">
            ➕ Nouvelle conversation
          </button>
          <button className="btn btn-outline-secondary w-100" onClick={onLogout}>
            👤 Gestion utilisateur
          </button>
        </div>
      </div>

      {/* Zone principale droite */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header conversation */}
        <div className="border-bottom p-3 bg-white shadow-sm">
          <h5 className="mb-0"># Général</h5>
        </div>

        {/* Zone des messages */}
        <div className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: '#f8f9fa' }}>
          {/* TODO: Afficher les messages ici */}
          <div className="mb-2">
            <strong>Alice:</strong> Salut tout le monde !
          </div>
          <div className="mb-2">
            <strong>Bob:</strong> Hello ! 👋
          </div>
        </div>

        {/* Formulaire d'envoi de message */}
        <div className="border-top p-3 bg-white">
          <form className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Tapez votre message..."
            />
            <button type="submit" className="btn btn-primary">
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatHome;
