import React, { useEffect, useState } from 'react';
import SignupForm from './composents/User/SignupForm';
import LoginForm from './composents/User/LoginForm';
import ChatHome from './composents/Home/ChatHome';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasAccount, setHasAccount] = useState(true);

  // Vérifie le token au lancement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem('token');
        } else {
          setCurrentUser({ id: decoded.sub, email: decoded.email, username: decoded.username });
        }
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // supprime le token de l'utilisateur du local storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <div className="App">
      {!currentUser ? (
        <>
          {hasAccount ? (
            <LoginForm onLogin={setCurrentUser} />
          ) : (
            <SignupForm onSignupSuccess={() => setHasAccount(true)} />
          )}

          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={() => setHasAccount(!hasAccount)}>
              {hasAccount ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </>
      ) : (
        <ChatHome currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
