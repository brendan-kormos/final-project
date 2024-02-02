import { Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalTitleBodyEdit from './ModalTitleBodyEdit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  projectId: number;
  boardId: number;
  title: string;
  description: string;
  className?: string;
};
export default function Board({
  className,
  title,
  description,
  boardId,
  projectId,
}: Props) {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);

  const [header, setHeader] = useState('a');
  const [titlePrompt, setTitlePrompt] = useState('a');
  const [bodyPrompt, setBodyPrompt] = useState('a');
  const [action, setAction] = useState('');
  const [showBody, setShowBody] = useState(true);

  async function handleModalFormSubmit(title, body) {
    try {
      if (isLoading) return;
      setIsLoading(true);
      if (action === 'create-board') {
        const result = await createBoard({
          projectId,
          title,
          body,
        });
        // onNewBoard(result);
        // navigate(0)

      } else if (action === 'edit-project') {
        console.log('edit project pre');
        const result = await editBoard(projectId, title);
        console.log('edit project', result);
        // onNewProject(result);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEditBoardClicked(event) {
    setHeader('Edit Title');
    setTitlePrompt('Set a title');
    setBodyPrompt('Set a description');
    setAction('edit-board');
    setShowBody(false);
  }

  async function handleDeleteBoardClicked(event) {
    try {
      if (isLoading) return;
      setIsLoading(true);
      console.log('delete  pre');
      console.log('projectId', projectId);
      const result = await deleteBoard(projectId);
      console.log('delete post', result);
      // navigate(0);
      // onNewProject(result);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  const targetId = `#modal-menu${boardId}`;
  const targetIdNoTag = `modal-menu${boardId}`;

  // console.log('board projectId', projectId)
  return (
    <>
      <div
        className={`card board-card col-sm bg-secondary-subtle ${className} `}
        style={{ minWidth: 296 }}>
        <Icon.Diagram2
          size={30}
          className="position-absolute"
          style={{ top: 16, left: 12 }}
        />
        <div className="card-body ps-5">
          <a
            href="http://localhost:5174/createjs.html"
            className="btn p-0 text-start bg-transparent ">
            <h5 className="card-title text-start h5">{title}</h5>
          </a>

          <p className="card-text text-start">
            {description}
            {/* This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer. */}
          </p>
        </div>
        <button
          data-bs-toggle="dropdown"
          className="position-absolute btn border-0 bg-transparent"
          style={{ right: 12, top: 16 }}>
          <Icon.ThreeDots size={16} />
        </button>
        <ul className="dropdown-menu">
          <li>
            <button
              data-bs-toggle="modal"
              data-bs-target={targetId}
              onClick={handleEditBoardClicked}
              className="dropdown-item btn btn-dark ">
              Edit Board
            </button>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button
              onClick={handleDeleteBoardClicked}
              className="dropdown-item btn btn-danger">
              Delete Board
            </button>
          </li>
        </ul>
        <ModalTitleBodyEdit
          showBody={showBody}
          titlePrompt={titlePrompt}
          bodyPrompt={bodyPrompt}
          header={header}
          onSubmit={handleModalFormSubmit}
          targetName={targetIdNoTag}
        />
      </div>
    </>
  );
}

/* <p className="card-text">
            <small className="text-muted">Last updated 3 mins ago</small>
          </p> */
