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
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { createGenericBoardObject, getBoardObjects } from '../lib/boardApi';
import { useRouter } from 'next/router';
import { useLocation, useParams } from 'react-router-dom';
import { findDOMNode, render } from 'react-dom';
import { Navbar } from 'react-bootstrap';

type ProjectList = ProjectType[];
// type BoardList =

export default function BoardCanvas() {
  const { user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false); // request to server success
  // const []
  const { boardId } = useParams();
  const navBarRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    // get projects
    async function get() {
      if (!user) return;
      console.log('user is logged in, get projects');

      try {
        setIsLoading(true);
        const result = await getBoardObjects(boardId);
        if (result.length === 0) return;
        console.log('result', result);
        // const result2 = await createGenericBoardObject(boardId);
        if (result) {
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
    if (!loadSuccess) return;
    console.log('load success');
    // it should only run once at this point
    const $canvas: HTMLCanvasElement = canvasRef.current;
    const $container: HTMLElement = containerRef.current;
    const $html = document.documentElement;

    const stage = new createjs.Stage('board-canvas');

    const width = innerWidth;
    const height = innerHeight;
    const initialScale = 1;

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

    stage.scale = initialScale;
    stage.canvas.width = width;
    stage.canvas.height = height;
    stage.snapToPixel = true;

    function tick(event) {
      // stage.y += 1
      // stage.x += 1
      stage.update(event);
    }
    createjs.Ticker.on('tick', tick);
    createjs.Ticker.framerate = 60;

    function cursorPos(event): [x: number, y: number] {
      const { x, y } = $container.getBoundingClientRect(); //event.target is canvas
      return [event.x - x, event.y - y]; // x and y screen position relative to canvas.
    }

    const $button = document.createElement('div');
    $button.textContent = 'THIS IS MY TEST BUTTON!';
    $button.style.width = '300px';
    $button.style.height = '300px';
    $button.style.border = '1px solid black';
    console.log($button);
    $container.prepend($button);

    const domElement = new createjs.DOMElement($button);
    stage.addChild(domElement);
    domElement.parent = stage;
    domElement.x = innerWidth / 2;
    domElement.y = innerHeight / 2;

    document.oncontextmenu = function () {
      return false;
    };
    function onMouseDown(event) {
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

      [cursorX, cursorY] = cursorPos(event);

      const { x, y } = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale
      localCursorX = x;
      localCursorY = y;

      prevLocalCursorX = localCursorX;
      prevLocalCursorY = localCursorY;
      prevCursorX = cursorX;
      prevCursorY = cursorY;
    }

    function onMouseUp(event) {
      leftMouseDown = false;
      rightMouseDown = false;

      [cursorX, cursorY] = cursorPos(event);

      const localObj = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale
      const { x, y } = localObj;
      localCursorX = x;
      localCursorY = y;

      // console.log('localPos', localCursorX);
      // console.log('scaledPosX', scaledCursorPos(cursorX))
    }

    function onMouseOut(event) {
      const mouseTarget = document.elementFromPoint(event.x, event.y);

      //prevent mouse moving over elements within canvas from stopping mouse click
      if (!mouseTarget || !mouseTarget.closest('#canvas-container')) {
        leftMouseDown = false;
        rightMouseDown = false;
      }
    }

    let foundNan = false;
    function onMouseMove(event) {
      // get mouse position
      [cursorX, cursorY] = cursorPos(event);

      // const scaledX = scaledCursorPos(cursorX) - stage.x; // proper tested scaling -> world position aka globalToLocal position

      const { x, y } = stage.globalToLocal(cursorX, cursorY); // real position regardless of scale

      // x = Math.round(x);
      // y = Math.round(y);
      localCursorX = x;
      localCursorY = y;

      const xDiff = cursorX - prevCursorX;
      const yDiff = cursorY - prevCursorY;

      // if (leftMouseDown) {
      //   // add the line to our drawing history
      //   const length = drawings.push({
      //     x0: prevLocalCursorX,
      //     y0: prevLocalCursorY,
      //     x1: localCursorX,
      //     y1: localCursorY,
      //   });
      //   // draw a line
      //   const drawing = drawings[length - 1];
      //   shapes.push(stage.addChild(drawLine(drawing)));
      // }

      if (rightMouseDown) {
        // debugging stuff
        if (!foundNan) {
          if (isNaN(x)) {
            foundNan = !foundNan;
          }
          // prints go here

          // debugging stuff end
        }

        dragStageX += xDiff;
        dragStageY += yDiff;
        stage.x = scrollStageX + dragStageX;
        stage.y = scrollStageY + dragStageY;
      }

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
      const screenPosAfterScale = stage.localToGlobal(
        localCursorX,
        localCursorY
      );

      // increase the stage offset by the differende between the last screenPosition and the new one
      stage.x += mouseX - screenPosAfterScale.x;
      stage.y += mouseY - screenPosAfterScale.y;

      scrollStageX = stage.x;
      scrollStageY = stage.y;
    }

    $container.addEventListener('mousedown', onMouseDown);
    $container.addEventListener('mouseup', onMouseUp, false);
    $html.addEventListener('mouseout', onMouseOut, false); // unclick mouse if out of canvas
    $container.addEventListener('mousemove', onMouseMove, false);
    $container.addEventListener('wheel', onMouseWheel, false);

    return () => {
      //cleanup
      $container.removeEventListener('mousedown', onMouseDown);
      $container.removeEventListener('mouseup', onMouseUp);
      $html.removeEventListener('mouseout', onMouseOut); // unclick mouse if out of canvas
      $container.removeEventListener('mousemove', onMouseMove);
      $container.removeEventListener('wheel', onMouseWheel);
    };
  }, [loadSuccess]);

  return (
    <>
      <div
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

      <NavBar ref={navBarRef} />
    </>
  );
}
