import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      id
      username
      email

    }
  }

`;

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: { input: form } });
      const user = data.loginUser;
      onLogin(user); // callback pour stocker l'utilisateur côté app
      // Optionnel : stocker le token
      // localStorage.setItem('token', user.token);
    } catch (err) {
      console.error('Erreur login', err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
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
          <label className="form-label">Mot de passe</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="text-danger">Erreur : {error.message}</div>}
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
