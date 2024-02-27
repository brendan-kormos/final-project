import { useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, Outlet, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppContext, AppContextValues } from './AppContext';
import { type Auth, signIn, signUp } from '../lib';

export default function NavBar() {
  const navigate = useNavigate();
  const { handleSignOut, user: signedIn } = useContext(AppContext)
  console.log(signedIn)
    useContext<AppContextValues>(AppContext);
  // const signedIn = context.user;
  const {pathname} = useLocation()
  console.log('pathname', pathname)
  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark w-100 bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/sign-up">
            Project Manager
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-md-0">
              {/* <li className="nav-item">
                <Link className="nav-link active" to="#">
                  Home
                </Link>
              </li> */}

              {signedIn && (
                <li
                  className={`nav-item${
                    pathname === '/projects' ? ' active' : ''
                  }`}>
                  {/* "active" is a class that could be used if the tab is currently open*/}
                  <Link
                    to="/projects"
                    className={`nav-link${
                      pathname === '/projects' ? ' active' : ''
                    }`}>
                    Projects
                  </Link>
                </li>
              )}

              {/* "active" is a class that could be used if the tab is currently open*/}
              {/* <li className="nav-item">
                <Link className="nav-link" href="#">
                  Link
                </Link>
              </li> */}

              {/* <li className="nav-item">
                <Link className="nav-link disabled" aria-disabled="true">
                  Disabled
                </Link>
              </li> */}
            </ul>

            <ul className="navbar-nav mb-md-0">
              {!signedIn && (
                // nav signin sign out buttons
                <>
                  <li className="nav-item me-3 d-none d-md-block">
                    <Link to="/sign-in" className="btn btn-outline-light ">
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item d-none d-md-block">
                    <Link to="/sign-up" className="btn btn-light">
                      Sign Up
                    </Link>
                  </li>

                  <li className="nav-item d-md-none">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      to="/sign-in">
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item d-md-none">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      to="/sign-up">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
              {signedIn && (
                <>
                  <li className="nav-item">
                    <Link
                      onClick={handleSignOut}
                      to="/sign-up"
                      className="nav-link">
                      Sign Out
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
