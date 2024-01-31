import { Route, Routes } from 'react-router-dom';

import './App.css';


import Login from './pages/Login';
import Register from './pages/Register'
import NavBar from './Components/Navbar';

export default function App() {
  // const found = ReactDOM.findDOMNode
  // console.log('found', found)

  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>

    </Routes>
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
