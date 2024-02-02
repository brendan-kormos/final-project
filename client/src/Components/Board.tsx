import { Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
export default function Board({ className }) {
  const numItems = 3;
  return (
    <>
      <div className={`card ${className}`}>
        <Icon.Diagram2
          size={30}
          className="position-absolute"
          style={{ top: 16, left: 12 }}
        />
        <div className="card-body ps-5">
          <h5 className="card-title ">Card title</h5>
          <p className="card-text">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
        </div>
        <button className="position-absolute bg-transparent btn" style={{ right: 12, top: 16 }}>
          <Icon.ThreeDots size={16} />
        </button>
      </div>
    </>
  );
}

/* <p className="card-text">
            <small className="text-muted">Last updated 3 mins ago</small>
          </p> */
