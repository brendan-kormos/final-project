import { Navbar } from "react-bootstrap";
import Board from "./Board";


export default function Project() {
  return (
    <>

      <div className="card mb-3 p-3">
        <h1 className="pb-1">Project Name</h1>
        <div className="line my-2"></div>
        <div className="card-body">
          <h5 className="card-title ">Card title</h5>
          <p className="card-text">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
          {/* <p className="card-text">
            <small className="text-muted">Last updated 3 mins ago</small>
          </p> */}
        </div>
      </div>
    </>
  );
}
