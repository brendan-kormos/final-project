import * as createjs from '@thegraid/createjs-module';

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
  content?: string;
  createdAt?: number;
  anchorMiddle?:boolean;
};

export function renderInstance(essentials: Essentials, data: BoardObjectData) {
  const { $html, $container, $canvas, stage } = essentials;
  let width = 250, height = 100
  const $button = document.createElement('div');
  $button.textContent = data.content;
  $button.style.width = width+"px"
  $button.style.height = height+"px"
  $button.style.border = '1px solid black';
  $container.prepend($button);

  const domElement = new createjs.DOMElement($button);
  stage.addChild(domElement);
  domElement.parent = stage;
  domElement.x = data.anchorMiddle ? data.x - (width/2) : data.x
  domElement.y = data.anchorMiddle ? data.y - (height/2) : data.y
}
