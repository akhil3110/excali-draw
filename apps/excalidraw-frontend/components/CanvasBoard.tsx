"use client";

import { clearCanvas, draw, drawSelectionOutline, drawShape, getTextBounds, Shapes } from "@/draw";
import { useSockets } from "@/hooks/useSockets";
import { useEffect, useRef, useState } from "react";
import TopToolbar from "./TopToolbar";
import axios from "axios";
import { backendUrl } from "@/config";
import { isUserAdmin } from "@/lib/isUserAdmin";
import { CanvasLoader } from "./CanvasLoader";
import toast from "react-hot-toast";
import useModalStore from "@/store/modal-store";
import ShapePalette from "./ShapePalette";
import { AnimatePresence } from "framer-motion";


const CanvasBoard = ({ canvasId, token }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket, loading } = useSockets(token);

  const shapesRef = useRef<Shapes[]>([]);
  const hydratedRef = useRef(false);

  const [hydrated, setHydrated] = useState(false);
  const [tool, setTool] = useState<"rectangle" | "circle" | "arrow" | "select" | "eraser"| "text" | "pencil">("select");
  const [isClearing, setIsClearing] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState({
    strokeColor: "#D3D3D3",
    strokeWidth: 2,
  });
  


  const {onOpen} = useModalStore()

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

    const cleanup = draw(
      canvas, 
      canvasId, 
      socket, 
      tool, 
      shapesRef,
      selectedShapeId,
      setSelectedShapeId,
      activeStyle,
      () => {setTool("select")}
    );

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cleanup?.();
    };
  }, [tool, socket,hydrated]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const selected = shapesRef.current.find(
      (s) => s.id === selectedShapeId
    ) ?? null;

    clearCanvas(
      shapesRef.current,
      ctx,
      canvas,
      selected
    );
};

  useEffect(() => {
    if(!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        if(msg.type === "canvas_cleared"){
            shapesRef.current = [];
            setIsClearing(false)
            redrawCanvas()
            return
        }

        if (msg.type !== "shapes") return;

        const data = JSON.parse(msg.message);
        if (!data || !data.shape || !data.shape.id) return;

        const existingShapes = shapesRef.current;


        if (data.action === "delete") {
          const index = existingShapes.findIndex(
            (s) => s.id === data.shape.id
          );

          if (index !== -1) {
            existingShapes.splice(index, 1);
          }
          redrawCanvas()
          return
        }

        const index = existingShapes.findIndex(
          (s) => s.id === data.shape.id
        );

        if (index === -1) {
          // new shape
          existingShapes.push(data.shape);
        } else {
          // moved / updated shape
          existingShapes[index] = data.shape;
        }

        redrawCanvas()
      }   catch (error) {
        console.log(error);
      }
    };

    const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          
          shapesRef.current.forEach((shape) => {
            // force redraw by re-running draw
            draw(canvas, canvasId, socket!, tool, shapesRef,selectedShapeId,setSelectedShapeId,activeStyle ,() => {});
          });
        }
      }

    socket.addEventListener("message", handleMessage);
    
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  },[socket,canvasId]);

  const  clearAllShapes= async () => {
    try {

      if(shapesRef.current.length === 0) {
        return toast.error("Canvas is empty. Nothing to clear.",{
          duration:2000,
          position: "bottom-right"
        })
      }

      setIsClearing(true)
      await axios.delete(
        `${backendUrl}/shapes/deleteAll/${canvasId}`,
        { withCredentials: true }
      );

      // Optimistic update
      shapesRef.current = [];

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      socket?.send(
        JSON.stringify({
          type: "canvas_cleared",
          canvasId,
        })
      );

    } catch (err) {
      console.error("Failed to clear canvas", err);
    } finally {
      setIsClearing(false)
    }
  };

  const onManageUsers = () => {
    onOpen("user-list-modal",{canvasId})
  }
  
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `canvas-${canvasId}.png`;
    link.href = canvas.toDataURL("image/png");

    link.click();
  };

  const selectedShape = shapesRef.current.find(
  (s) => s.id === selectedShapeId
  );
  const isReady = loading || hydrated;

  

  return (
    <div className="fixed inset-0 overflow-hidden">
      <AnimatePresence>
        { selectedShape && (
          <ShapePalette
            key={selectedShape.id}
            shape={selectedShape}
            onChange={(updates) => {
              if(!selectedShape) return

              let remainingUpdates = {...updates}

              if(selectedShape.type === "text" && "fontSize" in updates &&  typeof updates.fontSize === "number"){
                const canvas = canvasRef.current
                if(!canvas) return

                const ctx = canvas.getContext("2d")
                if(!ctx) return

                const oldBounds = getTextBounds(ctx,selectedShape.text,selectedShape.fontSize)

                const centerX = selectedShape.x + oldBounds.width / 2;
                const centerY = selectedShape.y + oldBounds.height / 2;

                selectedShape.fontSize = updates.fontSize

                const newBounds  = getTextBounds(ctx,selectedShape.text,selectedShape.fontSize)

                selectedShape.x = centerX - newBounds.width / 2;
                selectedShape.y = centerY - newBounds.height / 2;

                delete (remainingUpdates as any).fontSize
              }


              Object.assign(selectedShape, updates);
              setActiveStyle((prev) => ({...prev, ...updates}))

              redrawCanvas()
              socket?.send(
                JSON.stringify({
                    type: "shapes",
                    message: JSON.stringify({
                      shape: selectedShape,
                      action: "update",
                    }),
                  roomId: canvasId,
                })
              );
            }}
          />
        )}
      </AnimatePresence>

      {!isReady && <CanvasLoader/>}
      <TopToolbar tool={tool} setTool={setTool} onClear={clearAllShapes} onManageUsers={onManageUsers} onDownload={downloadCanvas}  />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {isClearing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center gap-3 rounded-xl bg-white/90 px-6 py-4 shadow-lg">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            <span className="text-sm font-medium text-gray-800">
              Clearing your canvas…
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasBoard;
