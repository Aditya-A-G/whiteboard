import { RxCursorArrow } from "react-icons/rx";
import { TbRectangle } from "react-icons/tb";
import { GoCircle } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { GoDownload } from "react-icons/go";
import { Stage, Layer } from "react-konva";
import { useState } from "react";

export default function App() {
  const [fillColor, setFillColor] = useState("#FFFFFF");

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-4 py-2 px-4 w-fit mx-auto border shadow-lg rounded-lg">
          <button className="p-3 hover:bg-violet-200 rounded">
            <RxCursorArrow size="1.6rem" />
          </button>
          <button className="p-3 hover:bg-violet-200 rounded">
            <TbRectangle size="1.6rem" />
          </button>
          <button className="p-3 hover:bg-violet-200 rounded">
            <GoCircle size="1.6rem" />
          </button>
          <button className="p-3 hover:bg-violet-200 rounded">
            <GoArrowRight size="1.6rem" />
          </button>
          <button className="p-3 hover:bg-violet-200 rounded">
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

          <button className="p-3 hover:bg-violet-200 rounded">
            <GoDownload size={"1.6rem"} />
          </button>
        </div>
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer></Layer>
      </Stage>
    </div>
  );
}
