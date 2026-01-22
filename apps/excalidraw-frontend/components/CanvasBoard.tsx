"use client";

import { draw } from "@/draw";
import { useSockets } from "@/hooks/useSockets";
import { useEffect, useRef, useState } from "react";
import TopToolbar from "./TopToolbar";


type Shapes = {
    type: 'rectangle' ;
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: 'circle' ;
    x: number;
    y: number;
    radius: number;
}


const CanvasBoard = ({ canvasId, token }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket, loading } = useSockets(token);
  const shapesRef = useRef<Shapes[]>([]);
  
  const [tool, setTool] = useState<"rectangle" | "circle">("rectangle");

  useEffect(() => {
    if (!canvasRef.current || !socket) return;

    const canvas = canvasRef.current;

    // resize ONCE
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // draw ONCE
    const cleanup = draw(canvas, canvasId, socket, tool, shapesRef)

    socket.send(
      JSON.stringify({
        type: "join_room",
        roomId: canvasId,
      })
    );

    return () => {
     
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [socket, tool, canvasId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen overflow-hidden">
      <TopToolbar tool={tool} setTool={setTool} />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default CanvasBoard;
