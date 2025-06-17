// src/components/UserList.jsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const USERS_QUERY = gql`
  query {
    users {
      id
      username
      email
      createdAt
      updatedAt
      deleted
    }
  }
`;

export default function UsersList({ onEdit }) {
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {data.users.map(user => (
          <li key={user.id}>
            <strong>{user.username}</strong> – {user.email}
            {user.deleted && <span style={{ color: 'red' }}> (supprimé)</span>}
            <button onClick={() => onEdit(user)}>✏️ Modifier</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
