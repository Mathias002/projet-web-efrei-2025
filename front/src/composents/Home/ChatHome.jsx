import ConversationList from '../Conversation/ConversationList';
import CreateConversation from '../Conversation/CreateConversation';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function ChatHome({ currentUser, onLogout }) {

  const [selectedConvId, setSelectedConvId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);

  const userId = decoded.sub;

  // Callback quand une nouvelle conversation est créée
  const handleNewConversation = (newConv) => {
    // Ici tu peux rafraîchir ta liste de conversations ou ajouter la conversation au state
    setShowModal(false);       // ferme la popup
    setSelectedConvId(newConv.id); // optionnel : sélectionne directement la nouvelle conversation
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // ou sessionStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar gauche */}
      <div className="d-flex flex-column border-end bg-light" style={{ width: '350px' }}>
        <div className="p-3 border-bottom">
          <h5>Conversations</h5>
        </div>

        {/* Liste des conversations */}
        <div className="flex-grow-1 overflow-auto px-3">
          <ConversationList
            userId={userId} // à remplacer plus tard par l’ID dynamique du user connecté
            selectedId={selectedConvId}
            onSelect={setSelectedConvId}
          />
        </div>

        {/* Boutons en bas */}
        <div className="p-3 border-top">
          <Button
            variant="primary"
            className="w-100 mb-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Nouvelle conversation
          </Button>

          <Button variant="outline-secondary" className="w-100">
            👤 Gestion du profil
          </Button>

          <button className="btn btn-danger w-100" onClick={handleLogout}>
            🔓 Déconnexion
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

      {/* Modal pour créer une conversation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Créer une nouvelle conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateConversation
            creatorId={userId}
            onCreated={handleNewConversation}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ChatHome;
