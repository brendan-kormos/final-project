import { Route, Routes } from 'react-router-dom';
import { useState, useEffect, Context, createContext } from 'react';
import './App.css';

const ThemeContext = createContext('light');

import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './Components/Navbar';
import React from 'react';

export default function App() {
  // const found = ReactDOM.findDOMNode
  // console.log('found', found)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.classList.add('data-bs-theme', 'dark', 'h-100'); //<html>
    document.body.classList.add("bg-body-tertiary", "h-100")
    document.body.querySelector("#root").classList.add("h-100")
  }, []);
  return (
    <ThemeContext.Provider value={theme}>
      <Routes>
        {/* <Route path="/" element={<NavBar />}> */}
          <Route index path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        {/* </Route> */}
      </Routes>
    </ThemeContext.Provider>
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
