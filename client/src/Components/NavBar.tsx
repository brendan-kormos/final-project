import { Button } from 'react-bootstrap';
import { Outlet, Route } from 'react-router-dom';


export default function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-auto w-100">
        <div className="navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="text-white nav-item nav-link">hello</li>
          </ul>
        </div>
      </nav>
      {/* <Outlet /> */}
    </>
  );
}
