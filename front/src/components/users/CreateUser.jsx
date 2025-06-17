// src/components/CreateUser.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
    }
  }
`;

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: ['users'], 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ variables: { input: { username, email } } });
    setUsername('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Créer un utilisateur</h3>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        Créer
      </button>
      {error && <p>Erreur : {error.message}</p>}
    </form>
  );
}
