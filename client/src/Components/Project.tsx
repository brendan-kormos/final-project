import { Navbar } from 'react-bootstrap';
import Board from './Board';
import * as Icon from 'react-bootstrap-icons';
import CustomModal from './CustomModal';
import { useEffect, useState } from 'react';
import { createBoard, createProject, deleteProject, editProject } from '../lib';
import { useNavigate } from 'react-router-dom';
type Props = {
  title: string;
  ownerId: number;
  projectId: number;
  boards: [];
  onNewBoard: (board: any) => void;
};
export default function Project({
  title,
  ownerId,
  projectId,
  boards,
  project,
  onNewBoard,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [header, setHeader] = useState('a');
  const [titlePrompt, setTitlePrompt] = useState('a');
  const [bodyPrompt, setBodyPrompt] = useState('a');
  const [action, setAction] = useState('');
  const [showBody, setShowBody] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  async function handleModalFormSubmit(title, body) {
    console.log(projectId, title, body);
    console.log('action', action);
    try {
      if (isLoading) return;
      setIsLoading(true);
      if (action === 'create-project') {
        console.log('create!');
        const result = await createBoard({
          projectId,
          title,
          body,
        });
        onNewBoard(result);
      } else if (action === 'edit-project') {
        console.log('edit project pre');
        const result = await editProject(projectId, title);
        console.log('edit project', result);
        navigate(0);
        // onNewProject(result);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const targetId = `#modal-menu${projectId}`;
  const targetIdNoTag = `modal-menu${projectId}`;

  useEffect(() => {
    console.log('header', header);
  }, [header]);

  function handleNewBoardClicked(event) {
    console.log('new board clicked', projectId);
    setIsModalOpen(true);
    setHeader('Create a new board');
    setTitlePrompt('Set a title');
    setBodyPrompt('Set a description');
    setAction('create-project');
    setShowBody(true);
  }

  function handleEditProjectClicked(event) {
    setIsModalOpen(true);
    setHeader('Edit Title');
    setTitlePrompt('Set a title');
    setBodyPrompt('Set a description');
    setAction('edit-project');
    setShowBody(false);
  }

  async function handleDeleteProjectClicked(event) {
    try {
      if (isLoading) return;
      setIsLoading(true);
      console.log('delete  pre');
      console.log('projectId', projectId);
      const result = await deleteProject(projectId);
      console.log('delete post', result);
      navigate(0);
      // onNewProject(result);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={'card mb-3 p-3'}>
        <h1 className="pb-1">{title}</h1>
        <div className="line my-2 "></div>

        <div className="row ms-0 me-0 no-gutter gap-3 col-auto">
          {/* boards go here */}
          {/* <ul className="list-unstyled"> */}
          {boards &&
            boards
              .filter((element) => {
                return element.projectId === projectId;
              })
              .map((element) => {
                return (
                  // <li key={element.boardId}>
                  <Board
                    projectId={projectId}
                    boardId={element.boardId}
                    title={element.title}
                    description={element.description}
                  />
                  // </li>
                );
              })}
          {/* </ul> */}
        </div>
        <div
          className="bg-transparent btn-group position-absolute"
          style={{ right: 16, top: 16 }}>
          <button
            className="bg-transparent btn btn-secondary border-0 bg-transparent"
            data-bs-toggle="dropdown">
            <Icon.ThreeDots color={'black'} size={16} />
          </button>

          <ul className="dropdown-menu">
            <li>
              <button
                onClick={handleNewBoardClicked}
                className="dropdown-item btn btn-dark">
                New Board
              </button>
            </li>
            <li>
              <button
                data-bs-toggle="modal"
                data-bs-target={targetId}
                onClick={handleEditProjectClicked}
                className="dropdown-item btn btn-dark">
                Edit Project
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                onClick={handleDeleteProjectClicked}
                className="dropdown-item btn btn-danger">
                Delete Project
              </button>
            </li>
          </ul>
        </div>
      </div>
      <CustomModal
        onClose={() => setIsModalOpen(false)}
        showBody={showBody}
        titlePrompt={titlePrompt}
        bodyPrompt={bodyPrompt}
        header={header}
        onSubmit={handleModalFormSubmit}
        isOpen={isModalOpen}
      />
    </>
  );
}
