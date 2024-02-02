import { Navbar } from 'react-bootstrap';
import Board from './Board';
import * as Icon from 'react-bootstrap-icons';
import ModalTitleBodyEdit from './ModalTitleBodyEdit';
import { useState } from 'react';
import { createBoard } from '../lib';
type Props = {
  title: string;
  ownerId: number;
  projectId: number;
};
export default function Project({ title, ownerId, projectId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [header, setHeader] = useState('a');
  const [titlePrompt, setTitlePrompt] = useState('a');
  const [bodyPrompt, setBodyPrompt] = useState('a');
  const [action, setAction] = useState('');

  async function handleModalFormSubmit(title, body) {
    console.log(title, body);
    if (action === 'create-board') {
      try {
        setIsLoading(true);
        console.log('attempting');
        const result = await createBoard({ projectId, title, body });
        console.log(result);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleNewBoardClicked(event) {
    setHeader('Create a new board');
    setTitlePrompt('Set a title');
    setBodyPrompt('Set a description');
    setAction('create-board');
  }

  return (
    <>
      <div className="card mb-3 p-3">
        <h1 className="pb-1">{title}</h1>
        <div className="line my-2 "></div>

        <div className="row ms-0 me-0 no-gutter gap-3 col-auto">
          {/* boards go here */}
          <Board
            title={'testTitle'}
            description="DESCRITPION YUH"
            className={'col-sm bg-secondary-subtle'}
          />
          <Board className={'col-sm bg-secondary-subtle'} />
          <Board className={'col-sm bg-secondary-subtle'} />
        </div>
        <div
          className="bg-transparent btn-group position-absolute"
          style={{ right: 16, top: 16 }}>
          <button
            className="bg-transparent btn btn btn-secondary border-0 bg-transparent"
            data-bs-toggle="dropdown">
            <Icon.ThreeDots color={'black'} size={16} />
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                data-bs-toggle="modal"
                data-bs-target="#project-dropdown-modal"
                onClick={handleNewBoardClicked}
                className="dropdown-item btn btn-dark">
                New Board
              </button>
            </li>
            <li>
              <button className="dropdown-item btn btn-dark">
                Edit Project
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item btn btn-danger">
                Delete Project
              </button>
            </li>
          </ul>
        </div>
      </div>
      <ModalTitleBodyEdit
        titlePrompt={titlePrompt}
        bodyPrompt={bodyPrompt}
        header={header}
        onModalSubmit={handleModalFormSubmit}
        targetName="project-dropdown-modal"
      />
    </>
  );
}
