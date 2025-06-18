import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

// mutation pour se connecter
const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        username
        email
      }
    }
  }
`;

function LoginForm({ onLogin }) {

  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: ({ login }) => {
      localStorage.setItem('token', login.access_token); // ✅ JWT stocké
      onLogin(login.user); // ✅ passe le user au parent
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    loginUser({ variables: { input: form } });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
      <h2>Connexion</h2>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

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

      <button className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}

export default LoginForm;
