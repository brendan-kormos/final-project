import './Projects.css';
import {
  createProject,
  Project as ProjectType,
  getProjects,
  Board,
} from '../lib';
import { AppContext } from '../Components/AppContext';
import NavBar from '../Components/NavBar';
import Project from '../Components/Project';
import * as Icons from 'react-bootstrap-icons';
import { useContext, useEffect, useState } from 'react';

// type BoardList =
export default function Projects() {
  const { user } = useContext(AppContext);
  const windowSize = window.innerWidth;
  const bigWindow = windowSize > 500;
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setRequesting] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    // get projects
    async function get() {
      if (!user) return;
      try {
        const result = await getProjects();
        setProjects(result.projects);
        setBoards(result.boards);
        setIsLoading(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    get();
  }, [user]);

  async function handleNewProjectClicked(event) {
    if (isRequesting || isLoading) return;
    event.preventDefault();
    try {
      setRequesting(true);
      console.log('user', user);
      if (user) {
        const { ownerId, projectId, title } = await createProject({
          title: 'New Project',
          ownerId: user.userId,
        });
        console.log('real does exist', ownerId, projectId, title);

        setProjects((array) => [...array, { ownerId, projectId, title }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRequesting(false);
    }
  }

  function handleNewBoard(board: Board) {
    setBoards((array) => [...array, board]);
  }

  if (!projects) return null;
  if (!boards) return null;
  return (
    <>
      <NavBar />

      <ul className="container pt-2 list-unstyled">
        {projects.length > 0 &&
          projects.map((project: ProjectType) => {
            return (
              <li key={project.projectId}>
                <Project
                  onNewBoard={handleNewBoard}
                  boards={boards}
                  title={project.title}
                  projectId={project.projectId}
                  ownerId={project.ownerId}
                />
              </li>
            );
          })}

        <button
          id="new-project-button"
          onClick={handleNewProjectClicked}
          className="btn bg-transparent border-0"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
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
      </ul>

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
