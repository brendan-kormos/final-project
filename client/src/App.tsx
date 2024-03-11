import { useNavigate, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

import { AppContext } from './Components/AppContext';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import BoardCanvas from './pages/BoardCanvas';

import { Auth, User } from './lib';
import Projects from './pages/Projects';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  const navigate = useNavigate();
  const contextValue = { user, token, handleSignIn, handleSignOut };

  useEffect(() => {
    // If user logged in previously on this browser, authorize them
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (user && token) {
      const u = JSON.parse(user);
      setUser(u);
      setToken(token);
    }
    setIsAuthorizing(false);
  }, []);

  function handleSignIn(auth: Auth) {
    console.log('AUTH', auth);
    sessionStorage.setItem('token', auth.token);
    sessionStorage.setItem('user', JSON.stringify(auth.user));
    setUser(auth.user);
    setToken(auth.token);
    navigate('/projects');
  }

  function handleSignOut() {
    sessionStorage.removeItem('token');
    setUser(undefined);
    setToken(undefined);
  }

  useEffect(() => {
    document.documentElement.classList.add('data-bs-theme', 'dark', 'h-100'); //<html>
    document.body.classList.add('bg-body-tertiary', 'h-100');
    document?.body?.querySelector('#root')?.classList.add('h-100');
  }, []);

  if (isAuthorizing) return null;
  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route index path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn onSignIn={handleSignIn} />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/board/:boardId" element={<BoardCanvas />} />
        <Route path="*" element={<SignUp />} />

        {/* </Route> */}
      </Routes>
    </AppContext.Provider>
  );
}
