import { Navbar } from 'react-bootstrap';
import Board from './Board';

type Props = {
  title: string;
  ownerId: number;
  projectId: number;
};
export default function Project({ title, ownerId, projectId }: Props) {
  return (
    <div className="card mb-3 p-3" >
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
    </div>
  );
}
