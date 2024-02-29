import * as createjs from '@thegraid/createjs-module';
import { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export type Essentials = {
  $html: HTMLElement;
  $container: HTMLElement;
  $canvas: HTMLCanvasElement;
  stage: createjs;
};

export type Types = 'button';

export type BoardObjectData = {
  boardId?: number;
  boardObjectId?: number;
  x: number;
  y: number;
  type: Types;
  title?: string;
  content?: string;
  createdAt?: number;
  anchorMiddle?: boolean;
};
{
  /* <div className="card-body ps-5">
  <Link to={'/board/' + boardId} className="btn p-0 text-start bg-transparent ">
    <h5 className="card-title text-start h5">{title}</h5>
  </Link>

  <p className="card-text text-start">
    {description}
  </p>
</div>; */
}

export function getDOMElementByHTMLElement(
  stage: createjs.Stage,
  $element: Element
) {
  return stage.children.find((value, index) => {
    if (value.htmlElement === $element){
      return $element
    }
  });
}

function Button({ title, content }) {
  return (
    <button className="canvas-button card btn btn-light">
      {/* <div className="card-body "> */}

      <p className="card-text text-start">{title}</p>
      {/* </div> */}
    </button>
  );
}

function convertReactToHtml(
  func: (any) => ReactElement,
  data: BoardObjectData
) {
  const htmlString = renderToStaticMarkup(func(data));
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const domNode = tempDiv.firstChild;
  return domNode;
}

export function renderInstance(essentials: Essentials, data: BoardObjectData) {
  const { $html, $container, $canvas, stage } = essentials;
  let width = 250,
    height = 100;

  let $element;
  if (data.type === 'button') {
    $element = convertReactToHtml(Button, data);
  }

  // $element.textContent = data.content;
  $element.style.width = width + 'px';
  $element.style.height = height + 'px';
  // $element.style.border = '1px solid black';
  $container.prepend($element);

  const domElement = new createjs.DOMElement($element);
  stage.addChild(domElement);
  domElement.parent = stage;
  domElement.boardObjectId = data.boardObjectId
  console.log('domElement', domElement);
  console.dir($element);
  domElement.x = data.anchorMiddle ? data.x - width / 2 : data.x;
  domElement.y = data.anchorMiddle ? data.y - height / 2 : data.y;
}
