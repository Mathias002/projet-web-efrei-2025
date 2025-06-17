// src/pages/UserPage.jsx
import React, { useState } from 'react';
import CreateUser from '../components/users/CreateUser';
import UserList from '../components/users/UsersList';
import EditUser from '../components/users/EditUser';

export default function UserPage({ onBack }) {
  const [userToEdit, setUserToEdit] = useState(null);

  return (
    <div className="user-page" style={{ 
      width: '800px',
      maxHeight: '600px',
      overflowY: 'auto',
      backgroundColor: 'white'
    }}>
      <div className="user-page-header" style={{ 
        padding: '1.5rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>👤 Gestion des utilisateurs</h1>
        <button 
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ✕ Fermer
        </button>
      </div>
      
      <div className="user-page-content" style={{
        padding: '1.5rem',
        display: 'grid',
        gap: '1.5rem'
      }}>
        <CreateUser />
        <UserList onEdit={setUserToEdit} />
        
        {userToEdit && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}>
            <EditUser user={userToEdit} onClose={() => setUserToEdit(null)} />
          </div>
        )}
      </div>
    </div>
  );
}