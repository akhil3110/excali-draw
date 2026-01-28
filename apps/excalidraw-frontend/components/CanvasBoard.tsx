"use client";

import { draw } from "@/draw";
import { useSockets } from "@/hooks/useSockets";
import { useEffect, useRef, useState } from "react";
import TopToolbar from "./TopToolbar";
import axios from "axios";
import { backendUrl } from "@/config";
import { isUserAdmin } from "@/lib/isUserAdmin";


type Shapes = {
    id: string
    type: 'rectangle' ;
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id: string
    type: 'circle' ;
    x: number;
    y: number;
    radius: number;
} | {
    id: string
    type: 'arrow';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    id:string
    type: "text";
    x: number;
    y: number;
    text: string
    fontSize: number;
} | {
    id: string
    type: "pencil"
    points: { x: number; y: number }[]
}



const CanvasBoard = ({ canvasId, token }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket, loading } = useSockets(token);

  const shapesRef = useRef<Shapes[]>([]);
  const hydratedRef = useRef(false);

  const [hydrated, setHydrated] = useState(false);
  
  const [tool, setTool] = useState<"rectangle" | "circle" | "arrow" | "select" | "eraser"| "text" | "pencil">("select");

  async function fetchExistingShapes(canvasId: string) {
    const res = await axios.get(`${backendUrl}/shapes/${canvasId}`,{
      withCredentials: true
    });
    return res.data; // array of Shapes
  }

  useEffect(() => {
    if (!canvasId || hydratedRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        const shapes = await fetchExistingShapes(canvasId);

        if(cancelled) return

        shapesRef.current = shapes ?? [];
        hydratedRef.current = true;
        setHydrated(true)
      } catch (error) {
        console.log(error)
      }
    })()

    return () =>{
      cancelled = true
    }
    
  }, [canvasId]);

  useEffect(() => {
    if (!socket || !canvasId) return;
    
    const joinRoom = () => {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: canvasId,
        })
      );
    };
 
    if(socket.readyState === WebSocket.OPEN){
      joinRoom();
    } else {
      socket.onopen = joinRoom;
    }
  }, [socket, canvasId]);

  useEffect(() => {
    if (!canvasRef.current || !socket || !hydrated) return;

    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const cleanup = draw(canvas, canvasId, socket, tool, shapesRef);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cleanup?.();
    };
  }, [tool, socket,hydrated]);


  useEffect(() => {
    if(!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "canvas_cleared" && msg.canvasId === canvasId) {
          shapesRef.current = [];

          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    socket.addEventListener("message", handleMessage);
    
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  },[socket,canvasId]);

  const clearCanvas = async () => {
    try {
      await axios.delete(
        `${backendUrl}/shapes/deleteAll/${canvasId}`,
        { withCredentials: true }
      );

      // Optimistic update
      shapesRef.current = [];

      socket?.send(
        JSON.stringify({
          type: "canvas_cleared",
          canvasId,
        })
      );

    } catch (err) {
      console.error("Failed to clear canvas", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen overflow-hidden">
      <TopToolbar tool={tool} setTool={setTool} onClear={clearCanvas} />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default CanvasBoard;
