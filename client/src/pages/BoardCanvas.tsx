import './BoardCanvas.css';

import * as createjs from '@thegraid/createjs-module';

import { AppContext } from '../Components/AppContext';
import NavBar from '../Components/NavBar';
import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import {
  getBoardObjects,
  requestCreateButton,
  requestEditObject,
  ForkedStage,
  ForkedDomElement,
} from '../lib/boardApi';

import { Dropdown } from 'react-bootstrap';
import {
  BoardObjectData,
  getDOMElementByHTMLElement,
  renderInstance,
} from '../lib/canvas';
import CustomModal from '../Components/CustomModal';
import { useParams } from 'react-router-dom';
// type Stage = createjs.Stage & { htmlElement: HTMLElement };
// type DOMElement = createjs.DOMElement & { boardObjectId: number };

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

const essentialsObj: any = {
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
  const params = useParams();
  const boardId = Number(params.boardId);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [boardObjects, setBoardObjects] = useState<BoardObjectData[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titlePrompt, setTitlePrompt] = useState('');
  const [titleContent, setTitleContent] = useState('');
  const [bodyPrompt, setBodyPrompt] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [header, setHeader] = useState('');
  const [stage, setStage] = useState<ForkedStage | null>(null);
  // const [editing, setEditing] = useState(false);

  const [selectedObject, setSelectedObject] = useState<{
    boardObject: BoardObjectData;
    domElement: ForkedDomElement;
  } | null>(null);
  // const [editing, setEditing] = useState<{
  //   domElement: createjs.DOMElement;
  //   boardObject;
  // }>();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuItems, setContextMenuItems] = useState<string[]>([]);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  // const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  // const dropdownMenu = useRef(null);
  // const [dropdownItems, setDropdownItems] = useState();

  async function handleModalFormSubmit(title, content) {
    if (
      !selectedObject ||
      !selectedObject.boardObject ||
      !selectedObject.domElement
    ) {
      return;
    }
    const { boardObject, domElement } = selectedObject || {};
    if (!boardObject || !domElement) return;
    const { boardId, boardObjectId } = boardObject as {
      boardId: number;
      boardObjectId: number;
    };
    const newBoardObject: {
      boardId: number;
      boardObjectId: number;
      title?: string;
      content?: string;
    } = {
      boardId,
      boardObjectId,
    };
    //if nothing changed return
    if (title === boardObject.title && content === boardObject.content) return;
    if (title != boardObject.title) newBoardObject.title = title;
    if (content != boardObject.content) newBoardObject.content = content;
    try {
      if (isLoading) return;
      setIsLoading(true);
      const result = await requestEditObject(newBoardObject as BoardObjectData);
      // const stageIndex = getDOMElementIndexByBoardObjectId(boardObjectId);
      // type BoardObjects = Array<BoardObjectData>;

      setBoardObjects((objs: any) => {
        return objs.map((obj) => {
          if (obj.boardObjectId === boardObject.boardObjectId) {
            return result;
          } else return obj;
        });
      });
      if (
        domElement.htmlElement.firstChild !== null &&
        typeof domElement.htmlElement.firstChild.textContent === 'string'
      ) {
        const firstChild: any = domElement.htmlElement.firstChild;
        //could not figure out how to get textContent type error to stop yelling
        firstChild.textContent = result.title;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // get boardObjects
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

  function cursorPos(event): [x: number, y: number] {
    const $container = containerRef.current as HTMLElement | null;
    if (!$container) throw new Error('container does not exist');
    const { x, y } = $container.getBoundingClientRect(); //event.target is canvas
    return [event.clientX - x, event.clientY - y]; // x and y screen position relative to canvas.
  }

  function onButtonClick() {
    const button: ForkedDomElement = mouseDownOnButton;
    // const $button = button.htmlElement;
    const boardObject = boardObjects.find((value: BoardObjectData) => {
      return value.boardObjectId === button.boardObjectId;
    });
    if (!boardObject) return;
    setIsModalOpen(true);
    setSelectedObject({ domElement: button as ForkedDomElement, boardObject });
    // setEditing(true);
    setHeader('Manage Idea');
    setTitleContent(boardObject.title);
    setTitlePrompt('Edit Title');
    setBodyPrompt('Edit Body');
    setBodyContent(boardObject.content);
  }
  function onButtonRightClick() {
    console.log('button right click');
  }

  function onButtonDrag() {
    const button: createjs.DOMElement = mouseDownOnButton;

    button.x = gridLocked(localCursorX - buttonMouseOffsetX);
    button.y = gridLocked(localCursorY - buttonMouseOffsetY);
  }
  async function onButtonUndrag() {
    const data = {
      boardId,
      boardObjectId: mouseDownOnButton.boardObjectId,
      x: mouseDownOnButton.x,
      y: mouseDownOnButton.y,
    };

    try {
      if (isLoading) return;
      setIsLoading(true);
      await requestEditObject(data as BoardObjectData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateButton() {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const data = {
        x: gridLocked(localCursorX),
        y: gridLocked(localCursorY),
        type: 'button',
        title: 'New idea',
        content: '',
      };
      const result = await requestCreateButton(
        boardId,
        data as BoardObjectData
      );
      setBoardObjects((obj) => [...obj, ...result]);
      for (let i = 0; i < result.length; i++) {
        renderInstance(essentialsObj, result[i]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  function onCanvasClicked() {}

  function onCanvasRightClicked() {
    // contextMenuItems.splice(0, contextMenuItems.length, ...['test1', 'test222']);
    console.log('canvas right click');
  }

  function onMouseClick(event) {
    if (!stage) return;
    const $target = event.target;
    const [cursorX, cursorY] = cursorPos(event);
    const { x, y } = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale
    localCursorX = x;
    localCursorY = y;
    const mouseButton1Click = leftMouseDown && !rightMouseDown;
    const mouseButton2Click = rightMouseDown && !leftMouseDown;
    if (mouseButton1Click) {
      if ($target.id === 'board-canvas') onCanvasClicked();
      if (mouseDownOnButton) onButtonClick();
    } else if (mouseButton2Click) {
      if ($target.id === 'board-canvas') onCanvasRightClicked();
      if (mouseDownOnButton) onButtonRightClick();
    }

    prevLocalCursorX = localCursorX;
    prevLocalCursorY = localCursorY;
    prevCursorX = cursorX;
    prevCursorY = cursorY;
  }
  function onMouseDown(event: MouseEvent) {
    if (!stage) return;
    const $target = event.target as HTMLElement;
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

    const $dropdownMenu = $target.closest('.dropdown-menu');
    if (!$dropdownMenu) {
      setShowContextMenu(false);
    }

    const $button = $target?.closest('.canvas-button');
    if ($target.id === 'board-canvas') {
      mouseDownOnCanvas = true;
    } else if ($button) {
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
    if (!stage) return;
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

    [cursorX, cursorY] = cursorPos(event);
    if (cursorX === mouseDownStartX && cursorY === mouseDownStartY) {
      // mouseclick with no movement
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
      onButtonUndrag();
    }

    leftMouseDown = false;
    rightMouseDown = false;
    mouseDownOnCanvas = false;
    mouseDownOnButton = null;
    buttonMouseOffsetY = null;
    buttonMouseOffsetX = null;
  }

  let foundNan = false;
  function onMouseMove(event) {
    if (!stage) return;
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
        onButtonDrag();
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
    const stage = new createjs.Stage('board-canvas') as ForkedStage;
    if (canvasRef.current && containerRef.current) {
      essentialsObj.$canvas = canvasRef.current;
      essentialsObj.$container = containerRef.current;
    }

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
      $html.removeEventListener('mouseout', onMouseOut);
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
        stage.canvas = null as any;
      }
    };
  }, [loadSuccess]);

  function handleSelectedItem(item) {
    setShowContextMenu(false);
    switch (item) {
      case 'Create Idea':
        try {
          handleCreateButton();
        } catch (error) {
          console.error(error);
        }
        break;
    }
  }

  return (
    <>
      <div
        onContextMenu={(event: MouseEvent) => {
          event.preventDefault();
          const $target = event.target as HTMLInputElement;
          console.log(event);
          setShowContextMenu(true);
          const [x, y] = cursorPos(event);
          setContextMenuPos({ x, y });
          const $canvas = $target.id === 'board-canvas';
          const $button = $target.closest('.canvas-button');
          if ($canvas) setContextMenuItems(['Create Idea']);
          else if ($button) setContextMenuItems(['__divider', 'Delete Idea']);
        }}
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
        onClose={() => {
          // setEditing(false);
          setSelectedObject(null);
          setIsModalOpen(false);
        }}
        showBody={true}
        titlePrompt={titlePrompt}
        titleContent={titleContent}
        bodyContent={bodyContent}
        bodyPrompt={bodyPrompt}
        header={header}
        onSubmit={handleModalFormSubmit}
        isOpen={isModalOpen}
      />

      {showContextMenu ? (
        <Dropdown onSelect={handleSelectedItem} show>
          <Dropdown.Menu
            style={{ left: contextMenuPos.x, top: contextMenuPos.y }}>
            {contextMenuItems &&
              contextMenuItems.map((value: string) => {
                let classNames = 'btn btn-dark';
                switch (value) {
                  case '__divider':
                    return <Dropdown.Divider></Dropdown.Divider>;
                  default:
                    if (value.toLowerCase().includes('delete')) {
                      classNames = 'btn btn-danger';
                    }
                    return (
                      <Dropdown.Item className={classNames} eventKey={value}>
                        {value}
                      </Dropdown.Item>
                    );
                }
              })}
          </Dropdown.Menu>
        </Dropdown>
      ) : null}

      <NavBar />
    </>
  );
}
