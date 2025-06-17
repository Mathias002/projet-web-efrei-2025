import React, { useState } from 'react';
import SignupForm from './composents/User/SignupForm';
import LoginForm from './composents/User/LoginForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <div className="App">
      {!currentUser ? (
        hasAccount ? (
          <LoginForm onLogin={setCurrentUser} />
        ) : (
          <SignupForm onSignup={setCurrentUser} />
        )
      ) : (
        <ChatInterface currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
      )}

      <div className="text-center mt-3">
        <button className="btn btn-link" onClick={() => setHasAccount(!hasAccount)}>
          {hasAccount ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </div>
  );
}

export default App;
