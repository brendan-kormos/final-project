import { Navbar } from 'react-bootstrap';
import Board from './Board';

export default function Project() {
  return (
    <>
      <div className="card mb-3 p-3">
        <h1 className="pb-1">Project Name</h1>
        <div className="line my-2 "></div>

        <div className="d-flex align-items-start align-content-start align-self-stretch flex-wrap gap-3" >
          {/* boards go here */}
          <Board className={""} />
          <Board />
          <Board />
          <Board />
          <Board />
        </div>
      </div>
    </>
  );
}
