// DeleteUserButton.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap';

const DELETE_USER = gql`
  mutation DeletedUser($userId: String!) {
    deleteUser(userId: $userId) {
      id
      username
      email
      createdAt
      updatedAt
      deleted
    }
  }
`

export default function DeleteUserButton({ userId, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const [deleteUser, { loading, error }] = useMutation(DELETE_USER, {
    variables: { userId },
    onCompleted: () => {
      setShowConfirm(false);
      if (onDeleted) onDeleted();
    },
    onError: (err) => {
      console.error("Erreur de suppression :", err.message);
    },
  });

  return (
    <>
      <Button variant="danger" onClick={() => setShowConfirm(true)}>
        Supprimer
      </Button>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() => deleteUser()} disabled={loading}>
            Oui, supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
