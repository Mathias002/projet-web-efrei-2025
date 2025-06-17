import React, { useState } from 'react';
import { useLazyQuery, useMutation, gql } from '@apollo/client';

const CREATE_CONVERSATION = gql`
  mutation CreateConversationSimple($participantId: String!, $creatorId: String!, $nom: String!) {
    createConversation(
      input: { participantId: $participantId, nom: $nom },
      creatorId: $creatorId
    ) {
      id
      nom
    }
  }
`;

const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      email
      username
    }
  }
`;

function CreateConversation({ creatorId, onCreated }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [participantId, setParticipantId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [getUserByEmail, { loading: loadingUser, data: userData, error: userError }] = useLazyQuery(GET_USER_BY_EMAIL, {
    onCompleted: (data) => {
      if (data.userByEmail) {
        setParticipantId(data.userByEmail.id);
        setErrorMsg('');
        
        createConversation({
          variables: {
            participantId: data.userByEmail.id,
            creatorId,
            nom,
          },
        });
      } else {
        setErrorMsg('Utilisateur non trouvé avec cet email');
      }
    },
  });

  const [createConversation, { loading: loadingCreate, error: createError }] = useMutation(CREATE_CONVERSATION, {
    onCompleted: (data) => {
      onCreated(data.createConversation);
      setNom('');
      setEmail('');
      setParticipantId(null);
      setErrorMsg('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom || !email) {
      setErrorMsg('Merci de saisir un nom et un email');
      return;
    }
    setErrorMsg('');
    getUserByEmail({ variables: { email } });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Nom de la conversation"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="form-control"
          disabled={loadingUser || loadingCreate}
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          placeholder="Email du participant"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          disabled={loadingUser || loadingCreate}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loadingUser || loadingCreate}>
        {loadingUser || loadingCreate ? 'Traitement...' : 'Créer'}
      </button>

      {(errorMsg || userError || createError) && (
        <div className="text-danger mt-2">
          {errorMsg || userError?.message || createError?.message}
        </div>
      )}
    </form>
  );
}

export default CreateConversation;
