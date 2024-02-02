import { Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

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

  function handleBoardClicked(){

  }
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
          className="position-absolute bg-transparent btn"
          style={{ right: 12, top: 16 }}>
          <Icon.ThreeDots size={16} />
        </button>
      </div>
    </>
  );
}

/* <p className="card-text">
            <small className="text-muted">Last updated 3 mins ago</small>
          </p> */
