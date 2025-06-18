import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Button } from 'react-bootstrap';

// mutation pour modifier un utilisateur via son id
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

export default function EditUserForm({ user, onSave, onClose = () => { } }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [editUser] = useMutation(EDIT_USER, {
    refetchQueries: ['users'],
    onError: (error) => setErrorMsg(error.message),
  });

  // charge les données de l'utilisateur à l'ouverture
  useEffect(() => {
    if (user) {
      setUsername(user.username );
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await editUser({
        variables: {
          userId: user.id,
          input: {
            username: username || undefined,
            email: email || undefined,
            password: password || undefined,
          },
        },
      }).then((res) => {
        if (onSave) onSave(res.data.editUser); // renvoie les nouvelles infos
        onClose();
      });
    } catch (err) {
      setErrorMsg('Une erreur est survenue.');
    }
  };

  return (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Enregistrer
        </Button>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          </div>
        </form>
  );
}
