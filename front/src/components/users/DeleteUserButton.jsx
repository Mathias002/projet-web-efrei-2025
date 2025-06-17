// src/components/DeleteUserButton.jsx
import { gql, useMutation } from '@apollo/client';

const DELETE_USER = gql`
  mutation($userId: String!) {
    deleteUser(userId: $userId) {
      id
      deleted
    }
  }
`;

export default function DeleteUserButton({ userId }) {
  const [deleteUser, { loading }] = useMutation(DELETE_USER, {
    refetchQueries: ['users'],
  });

  return (
    <button onClick={() => deleteUser({ variables: { userId } })} disabled={loading}>
      🗑 Supprimer
    </button>
  );
}
