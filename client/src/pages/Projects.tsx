import './Projects.css';
import { type Auth, signIn, signUp, createProject } from '../lib';
import { AppContext } from '../Components/AppContext';
import NavBar from '../Components/NavBar';
import Project from '../Components/Project';
import * as Icons from 'react-bootstrap-icons';
import { useContext, useState } from 'react';

export default function Projects() {
  const { user } = useContext(AppContext);
  const windowSize = window.innerWidth;
  const bigWindow = windowSize > 500;
  const [isRequesting, setRequesting] = useState(false);

  async function handleNewProjectClicked(event) {
    console.log('click');
    event.preventDefault();
    try {
      setRequesting(true);
      console.log('user', user);
      if (user) {
        console.log('in');
        await createProject({ title: 'test-title', ownerId: user.userId });
        console.log('after');
      }
    } catch (err) {
      console.error(err);
      alert('err', err);
    } finally {
      setRequesting(false);
    }
  }
  return (
    <>
      <NavBar />

      <div className="container pt-2">
        <Project title="project name" />
        <button
          id="new-project-button"
          onClick={handleNewProjectClicked}
          className="btn bg-transparent border-0"
          style={{
            position: 'fixed',
            bottom: 20,
            right: bigWindow ? 726 / 2 : 20,
            borderRadius: '100%',
          }}>
          <Icons.PlusLg
            size={bigWindow ? 75 : 50}
            className="bg-dark"
            color="white"
            style={{
              boxShadow: '-1px 1px 5.3px 1px rgba(0, 0, 0, 0.25)',

              borderRadius: '100%',

              padding: 10,
            }}></Icons.PlusLg>
        </button>
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
