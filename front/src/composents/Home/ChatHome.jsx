import ConversationList from '../Conversation/ConversationList';
import CreateConversation from '../Conversation/CreateConversation';
import EditUserForm from '../User/EditUserForm';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ConversationDetails from '../Conversation/ConversationDetails';

function ChatHome({ currentUser, onLogout }) {

  const [selectedConvId, setSelectedConvId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);

  const userId = decoded.sub;

  // Callback quand une nouvelle conversation est créée
  const handleNewConversation = (newConv) => {
    setShowModal(false);       
    setSelectedConvId(newConv.id);
  };

  const handleSaveUser = (updatedFields) => {
    console.log('Modifications à envoyer au backend:', updatedFields);
    setShowEditUserModal(false);
  }
    const handleLogout = () => {
      localStorage.removeItem('token');
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

            <Button variant="outline-secondary" className="w-100 mb-2" onClick={() => setShowEditUserModal(true)}>
              👤 Gestion du profil
            </Button>
            <Button variant="btn btn-danger w-100" className="w-100 mb-2" onClick={onLogout}>
              🔓 Déconnexion
            </Button>
          </div>
        </div>

        {/* Zone principale droite */}
        <div className="flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1">
            <ConversationDetails conversationId={selectedConvId} />
          </div>

          {/* Formulaire d'envoi de message */}
          {/* <div className="border-top p-3 bg-white">
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
        </div> */}
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

        <Modal show={showEditUserModal} onHide={() => setShowEditUserModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Modifier l'utilisateur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditUserForm
              user={currentUser}
              onSave={handleSaveUser}
              onClose={() => setShowEditUserModal(false)}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  export default ChatHome;
