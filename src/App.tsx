import { v4 as uuidv4 } from "uuid";
import { RxCursorArrow } from "react-icons/rx";
import { TbRectangle } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { GoDownload } from "react-icons/go";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Arrow,
  Transformer,
} from "react-konva";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";

enum WhiteboardElementType {
  Cursor = "Cursor",
  Rect = "Rect",
  Circle = "Circle",
  Arrow = "Arrow",
  Scribble = "Scribble",
}

interface WhiteboardElement {
  id: string;
  type: WhiteboardElementType;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
  fillColor: string;
  radius?: number;
  points?: number[];
}

export default function App() {
  const strokeColor = "#000";
  const [fillColor, setFillColor] = useState("#FFFFFF");
  const [currTool, setCurrTool] = useState<WhiteboardElementType>(
    WhiteboardElementType.Cursor
  );
  const [elements, setElements] = useState<Map<string, WhiteboardElement>>(
    new Map()
  );
  const [zIndexOrder, setZIndexOrder] = useState<string[]>([]);

  const currentElementId = useRef<string | null>(null);
  const isPainting = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

  const isDraggable = currTool === WhiteboardElementType.Cursor;


  function handlePointerDown() {
    if (currTool === WhiteboardElementType.Cursor || !stageRef.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition() as Vector2d;
    const id = uuidv4();

    currentElementId.current = id;
    isPainting.current = true;

    let newElement: WhiteboardElement;

    switch (currTool) {
      case WhiteboardElementType.Rect:
        newElement = {
          id,
          type: currTool,
          x,
          y,
          height: 50,
          width: 50,
          fillColor,
        };
        break;
      case WhiteboardElementType.Circle:
        newElement = {
          id,
          type: currTool,
          x,
          y,
          radius: 20,
          fillColor,
        };
        break;
      case WhiteboardElementType.Arrow:
        newElement = {
          id,
          type: currTool,
          points: [x, y, x + 20, y + 20],
          fillColor,
        };
        break;
      case WhiteboardElementType.Scribble:
        newElement = {
          id,
          type: currTool,
          points: [x, y],
          fillColor,
        };
        break;
    }

    setElements((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, newElement);
      return newMap;
    });
    setZIndexOrder((prev) => [...prev, id]);
  }

  function handlePointerMove() {
    if (
      currTool === WhiteboardElementType.Cursor ||
      !isPainting.current ||
      !currentElementId.current ||
      !stageRef.current
    )
      return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition() as Vector2d;

    setElements((prev) => {
      const newMap = new Map(prev);
      const element = newMap.get(currentElementId.current as string);
      if (element) {
        switch (element.type) {
          case WhiteboardElementType.Rect:
            element.height = y - (element.y as number);
            element.width = x - (element.x as number);
            break;
          case WhiteboardElementType.Circle:
            element.radius =
              ((y - (element.y as number)) ** 2 +
                (x - (element.x as number)) ** 2) **
              0.5;
            break;
          case WhiteboardElementType.Arrow:
            element.points = [
              (element.points as number[])[0],
              (element.points as number[])[1],
              x,
              y,
            ];
            break;
          case WhiteboardElementType.Scribble:
            element.points = [...(element.points as number[]), x, y];
            break;
        }
        newMap.set(currentElementId.current as string, element);
      }

      return newMap;
    });
  }

  function handlePointerUp() {
    isPainting.current = false;
  }

  function handleDownload() {
    if (!stageRef.current) return;

    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.href = uri;
    link.download = "whiteboard.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleElementClick(e: Konva.KonvaEventObject<MouseEvent>) {
    if (currTool !== WhiteboardElementType.Cursor || !transformerRef.current)
      return;

    const target = e.currentTarget;
    currentElementId.current = target.id();
    transformerRef.current.nodes([target]);
  }

  function handleDragStart(e: Konva.KonvaEventObject<DragEvent>) {
    const draggedElementId = e.target.id();
    if (!draggedElementId) return;

    // Move the dragged element to the end of the zIndexOrder array
    setZIndexOrder((prevOrder) => {
      const newOrder = prevOrder.filter((elId) => elId !== draggedElementId); // Remove the element
      return [...newOrder, draggedElementId]; // Add it to the end (front)
    });
  }

  function handleDragEnd(e: Konva.KonvaEventObject<MouseEvent>) {
    const draggedElementId = e.target.id();
    if (!draggedElementId) return;

    const target = e.target;
    const newX = target.x();
    const newY = target.y();

    setElements((prev) => {
      const newMap = new Map(prev);
      const element = newMap.get(draggedElementId);

      if (!element) return newMap;

      if (
        element.type === WhiteboardElementType.Arrow ||
        element.type === WhiteboardElementType.Scribble
      ) {
        const points = target.attrs.points;
        element.points = points;
      } else {
        // Update position for Rect and Circle
        element.x = newX;
        element.y = newY;
      }

      newMap.set(draggedElementId, element);
      return newMap;
    });
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Backspace" && currentElementId.current) {
        const elementToDelete = currentElementId.current;


        setElements((prev) => {
          const newMap = new Map(prev);
          newMap.delete(elementToDelete);
          return newMap;
        });

        setZIndexOrder((prev) => {
          return prev.filter((id) => id !== elementToDelete);
        });
        currentElementId.current = null;

        if (transformerRef.current) {
          transformerRef.current.nodes([]);
        }

      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-4 py-2 px-4 w-fit mx-auto border shadow-lg rounded-lg">
          <button
            className="p-3 hover:bg-violet-200 rounded"
            onClick={() => setCurrTool(WhiteboardElementType.Cursor)}
          >
            <RxCursorArrow size="1.6rem" />
          </button>
          <button
            className="p-3 hover:bg-violet-200 rounded"
            onClick={() => setCurrTool(WhiteboardElementType.Rect)}
          >
            <TbRectangle size="1.6rem" />
          </button>
          <button
            className="p-3 hover:bg-violet-200 rounded"
            onClick={() => setCurrTool(WhiteboardElementType.Circle)}
          >
            <GoCircle size="1.6rem" />
          </button>
          <button
            className="p-3 hover:bg-violet-200 rounded"
            onClick={() => setCurrTool(WhiteboardElementType.Arrow)}
          >
            <GoArrowRight size="1.6rem" />
          </button>
          <button
            className="p-3 hover:bg-violet-200 rounded"
            onClick={() => setCurrTool(WhiteboardElementType.Scribble)}
          >
            <GoPencil size="1.6rem" />
          </button>

          <button className="p-3 hover:bg-violet-200 rounded">
            <input
              className="w-6 h-6 border-2 border-black "
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
            />
          </button>

          <button
            className="p-3 hover:bg-violet-200 rounded"
            onClick={handleDownload}
          >
            <GoDownload size={"1.6rem"} />
          </button>
        </div>
      </div>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            height={window.innerHeight}
            width={window.innerWidth}
            fill="#ffffff"
            id="bg"
            onClick={() => {
              if (!transformerRef.current) return;
              transformerRef.current.nodes([]);
            }}
          />

          {zIndexOrder.map((id) => {
            const element = elements.get(id);
            if (!element) return null;

            switch (element.type) {
              case WhiteboardElementType.Rect:
                return (
                  <Rect
                    key={element.id}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={element.fillColor}
                    height={element.height}
                    width={element.width}
                    draggable={isDraggable}
                    onClick={handleElementClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                );
              case WhiteboardElementType.Circle:
                return (
                  <Circle
                    key={element.id}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    radius={element.radius || 50}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={element.fillColor}
                    draggable={isDraggable}
                    onClick={handleElementClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                );
              case WhiteboardElementType.Arrow:
                return (
                  <Arrow
                    key={element.id}
                    id={element.id}
                    points={element.points as number[]}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={element.fillColor}
                    draggable={isDraggable}
                    onClick={handleElementClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                );
              case WhiteboardElementType.Scribble:
                return (
                  <Line
                    key={element.id}
                    id={element.id}
                    lineCap="round"
                    lineJoin="round"
                    points={element.points}
                    stroke={strokeColor}
                    strokeWidth={2}
                    fill={element.fillColor}
                    draggable={isDraggable}
                    onClick={handleElementClick}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                );
              default:
                return null;
            }
          })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}
