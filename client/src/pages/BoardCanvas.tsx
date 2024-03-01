import './BoardCanvas.css';

import * as createjs from '@thegraid/createjs-module';

import {
  type Auth,
  signIn,
  signUp,
  createProject,
  Project as ProjectType,
  getProjects,
  Board,
} from '../lib';

import { AppContext } from '../Components/AppContext';
import NavBar from '../Components/NavBar';
import {
  MouseEvent,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  createGenericBoardObject,
  getBoardObjects,
  requestCreateButton,
  requestEditObject,
} from '../lib/boardApi';
import { useRouter } from 'next/router';
import { useLocation, useParams } from 'react-router-dom';
import { findDOMNode, render } from 'react-dom';
import { Navbar } from 'react-bootstrap';
import {
  BoardObjectData,
  getDOMElementByHTMLElement,
  renderInstance,
} from '../lib/canvas';
import CustomModal from '../Components/CustomModal';

type ProjectList = ProjectType[];
// type BoardList =

let dragStageX = 0;
let dragStageY = 0;
let scrollStageX = 0;
let scrollStageY = 0;

let leftMouseDown = false;
let rightMouseDown = false;

// coordinates in the LOCAL canvas WORLD SPACE
let localCursorX, localCursorY;
let prevLocalCursorX, prevLocalCursorY;

//screen coordinate relative to canvas origin point in SCREEN SPACE
let cursorX, cursorY;
let prevCursorX, prevCursorY;

let mouseDownStartX, mouseDownStartY;
let mouseDownOnCanvas;
let mouseDownOnButton;
let buttonMouseOffsetX, buttonMouseOffsetY;

const gridLockIncrement = 5;

function gridLocked(num: number) {
  return gridLockIncrement * Math.round(num / gridLockIncrement);
}

const essentialsObj = {
  // $canvas,
  // $container,
  // $html,
  // stage,
};

export default function BoardCanvas() {
  const { user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false); // request to server success
  // const []
  const { boardId } = useParams();
  const navBarRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [boardObjects, setBoardObjects] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titlePrompt, setTitlePrompt] = useState('');
  const [titleContent, setTitleContent] = useState('');
  const [bodyPrompt, setBodyPrompt] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [header, setHeader] = useState('');
  const [stage, setStage] = useState<createjs.Stage | null>(null);
  const [editing, setEditing] = useState<{
    domElement: createjs.DOMElement;
    boardObject;
  }>();

  async function handleModalFormSubmit(title, body) {
    console.log('submit', title, body);

    const { boardObject, domElement } = editing;
    console.log(boardObject, domElement);
    try {
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {}, []);

  useEffect(() => {
    // get projects
    async function get() {
      if (!user) return;
      try {
        setIsLoading(true);
        const result = await getBoardObjects(boardId);
        // const $canvas: HTMLCanvasElement = canvasRef.current;
        // const $container: HTMLElement = containerRef.current;
        // const $html = document.documentElement;

        if (result) {
          setBoardObjects(result);
          setLoadSuccess(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    get();
  }, [user]);

  useEffect(() => {
    console.log('boardObjects', boardObjects);
  }, [boardObjects]);

  function cursorPos(event): [x: number, y: number] {
    const $container: Element = containerRef.current;
    if (!$container) throw new Error('container does not exist');
    const { x, y } = $container.getBoundingClientRect(); //event.target is canvas
    return [event.clientX - x, event.clientY - y]; // x and y screen position relative to canvas.
  }

  document.oncontextmenu = function () {
    return false;
  };

  function onButtonClick(event) {
    const button: createjs.DOMElement = mouseDownOnButton;
    const $button = button.htmlElement;
    const boardObject = boardObjects.find((value) => {
      return value.boardObjectId === button.boardObjectId;
    });
    setIsModalOpen(true);
    setEditing({ domElement: button, boardObject });
    setHeader('Manage Idea');
    setTitleContent(boardObject.title);
    setTitlePrompt('Edit Title');
    setBodyPrompt('Edit Body');
    setBodyContent(boardObject.content);
  }

  function onButtonDrag(event) {
    const button: createjs.DOMElement = mouseDownOnButton;
    const $button = button.htmlElement;

    button.x = gridLocked(localCursorX - buttonMouseOffsetX);
    button.y = gridLocked(localCursorY - buttonMouseOffsetY);
  }
  async function onButtonUndrag(event) {
    const data = {
      boardId,
      boardObjectId: mouseDownOnButton.boardObjectId,
      x: mouseDownOnButton.x,
      y: mouseDownOnButton.y,
    };
    try {
      const result = await requestEditObject(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function onCanvasClicked(event) {
    const data = {
      x: gridLocked(localCursorX),
      y: gridLocked(localCursorY),
      type: 'button',
      title: 'New idea',
      content: '',
    };
    try {
      const result = await requestCreateButton(boardId, data);
      setBoardObjects((obj) => [...obj, ...result]);
      for (let i = 0; i < result.length; i++) {
        renderInstance(essentialsObj, result[i]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onMouseClick(event) {
    const $target = event.target;
    const [cursorX, cursorY] = cursorPos(event);

    const { x, y } = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale
    localCursorX = x;
    localCursorY = y;
    if ($target.id === 'board-canvas') onCanvasClicked(event);
    if (mouseDownOnButton) onButtonClick(event);

    prevLocalCursorX = localCursorX;
    prevLocalCursorY = localCursorY;
    prevCursorX = cursorX;
    prevCursorY = cursorY;
  }
  function onMouseDown(event: MouseEvent) {
    const $target: HTMLElement = event.target;
    // detect left clicks
    if (event.button == 0) {
      leftMouseDown = true;
      rightMouseDown = false;
    }

    // detect right clicks
    if (event.button == 2) {
      rightMouseDown = true;
      leftMouseDown = false;
    }
    const $button = $target?.closest('.canvas-button');
    if ($target.id === 'board-canvas') {
      mouseDownOnCanvas = true;
    } else if ($button) {
      console.log('button', $button);
      mouseDownOnButton = getDOMElementByHTMLElement(stage, $button);
      buttonMouseOffsetX = prevLocalCursorX - mouseDownOnButton.x;
      buttonMouseOffsetY = prevLocalCursorY - mouseDownOnButton.y;
    }
    const [cursorX, cursorY] = cursorPos(event);
    mouseDownStartX = cursorX;
    mouseDownStartY = cursorY;
    const { x, y } = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale
    localCursorX = x;
    localCursorY = y;

    prevLocalCursorX = localCursorX;
    prevLocalCursorY = localCursorY;
    prevCursorX = cursorX;
    prevCursorY = cursorY;
  }

  function onMouseWheel(event) {
    const mouseX = stage.mouseX;
    const mouseY = stage.mouseY;

    const { x: localCursorX, y: localCursorY } = stage.globalToLocal(
      mouseX,
      mouseY
    );

    const delta = event.deltaY;
    let factor = 0.8;
    if (delta < 0) {
      factor = 1 / factor;
    }

    const newScale = stage.scale * factor;

    //reset drag offset so that dragging screen isn't funky
    dragStageX = 0;
    dragStageY = 0;

    // change scale to new scale
    stage.scale = newScale;

    // because scale changes, we need a new screenPosition
    // it will be different than the last mouseX and mouseY
    const screenPosAfterScale = stage.localToGlobal(localCursorX, localCursorY);

    // increase the stage offset by the differende between the last screenPosition and the new one
    stage.x += mouseX - screenPosAfterScale.x;
    stage.y += mouseY - screenPosAfterScale.y;

    scrollStageX = stage.x;
    scrollStageY = stage.y;
  }

  function onMouseUp(event) {
    if (!stage) return;
    leftMouseDown = false;
    rightMouseDown = false;

    [cursorX, cursorY] = cursorPos(event);
    if (cursorX === mouseDownStartX && cursorY === mouseDownStartY) {
      //mouseclick with no movement
      onMouseClick(event);
    }
    const localObj = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale
    const { x, y } = localObj;
    localCursorX = x;
    localCursorY = y;

    if (
      mouseDownOnButton &&
      (cursorX != mouseDownStartX || cursorY != mouseDownStartY)
    ) {
      onButtonUndrag(event);
    }

    mouseDownOnCanvas = false;
    mouseDownOnButton = null;
    buttonMouseOffsetY = null;
    buttonMouseOffsetX = null;
  }

  let foundNan = false;
  function onMouseMove(event) {
    if (!stage) return;
    const $target = event.target;
    // get mouse position
    const [cursorX, cursorY] = cursorPos(event);

    const { x, y } = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale

    localCursorX = x;
    localCursorY = y;

    const xDiff = cursorX - prevCursorX;
    const yDiff = cursorY - prevCursorY;

    if (leftMouseDown) {
      // debugging stuff
      if (!foundNan) {
        if (isNaN(x)) {
          foundNan = !foundNan;
        }
        // prints go here

        // debugging stuff end
      }

      if (mouseDownOnCanvas) {
        dragStageX += xDiff;
        dragStageY += yDiff;
        stage.x = scrollStageX + dragStageX;
        stage.y = scrollStageY + dragStageY;
      } else if (mouseDownOnButton) {
        onButtonDrag(event);
      }
    }

    prevLocalCursorX = localCursorX;
    prevLocalCursorY = localCursorY;
    prevCursorX = cursorX;
    prevCursorY = cursorY;
  }

  function onMouseOut(event) {
    const mouseTarget = document.elementFromPoint(event.x, event.y);

    //prevent mouse moving over elements within canvas from stopping mouse click
    if (!mouseTarget || !mouseTarget.closest('#canvas-container')) {
      leftMouseDown = false;
      rightMouseDown = false;
    }
  }

  useEffect(() => {
    if (!loadSuccess) return;
    const stage = new createjs.Stage('board-canvas');
    essentialsObj.$canvas = canvasRef.current;
    essentialsObj.$container = containerRef.current;
    essentialsObj.$html = document.documentElement;
    essentialsObj.stage = stage;

    setStage(stage);

    for (let i = 0; i < boardObjects.length; i++) {
      const obj = boardObjects[i];
      renderInstance(essentialsObj, obj);
    }

    const $html = document.documentElement;
    $html.addEventListener('mouseout', onMouseOut, false); // unclick mouse if out of canvas
    function tick(event) {
      stage.update(event);
    }

    const initialScale = 1;

    stage.scale = initialScale;
    stage.canvas.width = innerWidth;
    stage.canvas.height = innerHeight;
    stage.snapToPixel = true;

    createjs.Ticker.on('tick', tick);
    createjs.Ticker.framerate = 60;
    window.onresize = function () {
      stage.canvas.width = innerWidth;
      stage.canvas.height = innerHeight;
    };

    return () => {
      console.log('cleanup');
      $html.removeEventListener('mouseout', onMouseOut);
      document.oncontextmenu = null;
      if (stage) {
        for (let i = 0; i < stage.children.length; i++) {
          stage.children[i].htmlElement.remove();
        }

        createjs.Ticker.off('tick', tick);
        window.onresize = null;

        stage.removeAllChildren();
        stage.enableMouseOver(-1);
        stage.enableDOMEvents(false);
        stage.removeAllEventListeners();
        stage.canvas = null;
      }
    };
  }, [loadSuccess]);
  console.log('rerender');
  return (
    <>
      <div
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onWheel={onMouseWheel}
        id="canvas-container"
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0 }}>
        <canvas
          ref={canvasRef}
          id="board-canvas"
          className=""
          style={{
            width: '100%',
            height: '100%',
          }}></canvas>
      </div>
      <CustomModal
        onClose={() => setIsModalOpen(false)}
        showBody={true}
        titlePrompt={titlePrompt}
        titleContent={titleContent}
        bodyContent={bodyContent}
        bodyPrompt={bodyPrompt}
        header={header}
        onSubmit={handleModalFormSubmit}
        isOpen={isModalOpen}
      />
      <NavBar ref={navBarRef} />
    </>
  );
}
