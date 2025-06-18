import ConversationList from '../Conversation/ConversationList';
import CreateConversation from '../Conversation/CreateConversation';
import EditUserForm from '../User/EditUserForm';
import DeleteUser from '../User/DeleteUser';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ConversationDetails from '../Conversation/ConversationDetails';

function ChatHome({ currentUser, onLogout }) {

  const [selectedConvId, setSelectedConvId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [user, setUser] = useState(currentUser);

  const token = localStorage.getItem('token');

  const decoded = jwtDecode(token);

  const userId = decoded.sub;

  // callback quand une nouvelle conversation est créée
  const handleNewConversation = (newConv) => {
    setShowModal(false); // ferme la popup
    setSelectedConvId(newConv.id); // sélectionne directement la nouvelle conversation
  };

  // enregistre les nouvelles données
  const handleSaveUser = (updatedUser) => {
    setUser(updatedUser);
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
          <h5>Conversations de { user.username }</h5>
        </div>

          {/* Liste des conversations */}
          <div className="flex-grow-1 overflow-auto px-3">
            <ConversationList
              userId={userId}
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
            <Button variant="btn btn-danger w-100" className="w-100 mb-2" onClick={handleLogout}>
              🔓 Déconnexion
            </Button>
          </div>
        </div>

        {/* Zone principale droite */}
        <div className="flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1">
            <ConversationDetails conversationId={selectedConvId} />
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

      {/* Modal pour modifier les informations */}
      <Modal show={showEditUserModal} onHide={() => setShowEditUserModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditUserForm
            user={user}
            onSave={handleSaveUser}
            onClose={() => setShowEditUserModal(false)}
          />
          <DeleteUser
            userId={user.id}
            onDeleted={() => {
              alert('Utilisateur supprimé !');
              onLogout();
            }} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ChatHome;
