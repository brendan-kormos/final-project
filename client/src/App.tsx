import { useNavigate, Route, Routes } from 'react-router-dom';
import { useState, useEffect, Context, createContext } from 'react';
import './App.css';


import { AppContext } from './Components/AppContext';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NavBar from './Components/Navbar';
import React from 'react';

import { Auth, User } from './lib';

const tokenKey = 'react-context-jwt';

export default function App() {

  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  const navigate = useNavigate();
  const contextValue = { user, token, handleSignIn, handleSignOut };

  useEffect(() => {
    // If user logged in previously on this browser, authorize them
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth);
      setUser(a.user);
      setToken(a.token);
    }
    setIsAuthorizing(false);
  }, []);



   function handleSignIn(auth: Auth) {
     localStorage.setItem(tokenKey, JSON.stringify(auth));
     setUser(auth.user);
     setToken(auth.token);
   }

   function handleSignOut() {
     localStorage.removeItem(tokenKey);
     setUser(undefined);
     setToken(undefined);
   }




  useEffect(() => {
    document.documentElement.classList.add('data-bs-theme', 'dark', 'h-100'); //<html>
    document.body.classList.add('bg-body-tertiary', 'h-100');
    document.body.querySelector('#root').classList.add('h-100');
  }, []);

  if (isAuthorizing) return null;
  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        {/* <Route path="/" element={<NavBar />}> */}
        <Route index path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn onSignIn={handleSignIn} />} />
        <Route path="*" element={<SignUp />} />
        {/* </Route> */}
      </Routes>
    </AppContext.Provider>
  );
}

// export default function App() {
//   const [serverData, setServerData] = useState('');

//   useEffect(() => {
//     async function readServerData() {
//       const resp = await fetch('/api/hello');
//       const data = await resp.json();

//       console.log('Data from server:', data);

//       setServerData(data.message);
//     }

//     readServerData();
//   }, []);

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank" rel="noreferrer">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>{serverData}</h1>
//     </>
//   );
// }
