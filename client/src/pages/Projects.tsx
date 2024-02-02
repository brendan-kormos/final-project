import './Projects.css';
import { type Auth, signIn, signUp } from '../lib';

import NavBar from '../Components/NavBar';
import Project from '../Components/Project';
export default function Projects() {
  return (
    <>
      <NavBar />

      <div className="container py-2">
        <Project />
      </div>

      {/* <div className="card">
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
          <p className="card-text">
            <small className="text-muted">Last updated 3 mins ago</small>
          </p>
        </div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
          className="card-img-top"
          alt="..."
        />
      </div> */}
    </>
  );
}
