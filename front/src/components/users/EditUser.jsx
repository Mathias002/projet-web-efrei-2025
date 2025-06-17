// src/components/EditUser.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const EDIT_USER = gql`
  mutation($userId: String!, $input: EditUserInput!) {
    editUser(userId: $userId, input: $input) {
      id
      username
      email
      updatedAt
    }
  }
`;

export default function EditUser({ user, onClose }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const [editUser] = useMutation(EDIT_USER, {
    refetchQueries: ['users'],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editUser({ variables: { userId: user.id, input: { username, email } } });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Modifier utilisateur</h3>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Enregistrer</button>
      <button type="button" onClick={onClose}>Annuler</button>
    </form>
  );
}
