import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

// mutation pour s'inscrire
const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      access_token
      user {
        id
        username
        email
      }
    }
  }
`;

function SignupForm({ onSignupSuccess }) {

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      onSignupSuccess(); // dirige vers la page de login
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
  });

  // met à jour dynamiquement l’état form selon le nom du champ
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    registerUser({ variables: { input: form } });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
      <h2>Inscription</h2>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="mb-3">
        <label>Nom d'utilisateur</label>
        <input
          name="username"
          type="text"
          className="form-control"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          name="email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Mot de passe</label>
        <input
          name="password"
          type="password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button className="btn btn-success w-100" disabled={loading}>
        {loading ? 'Création...' : "S'inscrire"}
      </button>
    </form>
  );
}

export default SignupForm;
