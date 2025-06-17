import './assets/styles.scss';
import DiscussionList from './components/DiscussionList';
import MessageView from './components/MessageView';
import MessageInput from './components/MessageInput';
import NewDiscussion from './components/NewDiscussion';
import { useState } from 'react';
import UserPage from './pages/UserPage';

const App = () => {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <h2>Discussions</h2>
          <NewDiscussion />
          <DiscussionList onSelect={setSelectedDiscussion} />
        </div>
        <div>
          <h2>Utilisateurs</h2>
          <button onClick={() => setShowUserModal(true)}>👤 Gérer les utilisateurs</button>
        </div>
      </aside>
      <main className="chat-area">
        {selectedDiscussion ? (
          <>
            <MessageView discussion={selectedDiscussion} />
            <MessageInput discussion={selectedDiscussion} />
          </>
        ) : (
          <p>Select a discussion to start chatting</p>
        )}
      </main>
      
      {/* Modal de gestion des utilisateurs */}
      {showUserModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '0',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}>
            <UserPage onBack={() => setShowUserModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;