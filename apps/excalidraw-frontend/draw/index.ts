import { backendUrl } from "@/config";
import { shapes } from "@repo/db/schema";
import axios from "axios";


type InteractionMode =
  | "idle"
  | "drawing"
  | "moving"
  | "resizing"
  | "rotating";

  
type Shapes = {
    id:string;
    type: 'rectangle' ;
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id:string
    type: 'circle' ;
    x: number;
    y: number;
    radius: number;
} | {
    id:string
    type: "arrow";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

type BaseShape = {
  id: string;
  x: number;
  y: number;
  rotation: number;
};

type RectangleShape = BaseShape & {
  type: "rectangle";
  width: number;
  height: number;
};

type CircleShape = BaseShape & {
  type: "circle";
  radius: number;
};

type ArrowShape = BaseShape & {
  type: "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type Shape = RectangleShape | CircleShape | ArrowShape;

// const existingShapes: Shapes[] = [];
function drawArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const headLength = 12;
  const angle = Math.atan2(endY - startY, endX - startX);

  // main line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // arrow head
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.stroke();
}

function isPointInRectangle(x: number, y: number, r: any) {
  return (
    x >= r.x &&
    x <= r.x + r.width &&
    y >= r.y &&
    y <= r.y + r.height
  );
}

function isPointInCircle(x: number, y: number, c: any) {
  return Math.hypot(x - c.x, y - c.y) <= c.radius;
}

function isPointNearArrow(x: number, y: number, a: any) {
  const A = { x: a.startX, y: a.startY };
  const B = { x: a.endX, y: a.endY };

  const dist =
    Math.abs(
      (B.y - A.y) * x -
      (B.x - A.x) * y +
      B.x * A.y -
      B.y * A.x
    ) /
    Math.hypot(B.y - A.y, B.x - A.x);

  return dist < 6;
}


export function draw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  tool: "rectangle" | "circle" | 'arrow' | 'select' | 'eraser' ,
  shapesRef: React.MutableRefObject<Shapes[]>
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const existingShapes = shapesRef.current;

    canvas.style.backgroundColor = "#121212";
    ctx.strokeStyle = "#D3D3D3";

    clearCanvas(existingShapes, ctx, canvas);

    let startX = 0;
    let startY = 0;
    let clicked = false;

    const getMousePos = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const data = JSON.parse(message.message);

            if (data.action === "delete") {
                console.log(data)
                const shape = data.shape

                 const index = existingShapes.findIndex(
                    (s) => s.id === data.shape.id
                );
                console.log("Existing shapes", existingShapes)
                if (index !== -1) {
                    existingShapes.splice(index, 1);
                    console.log("after Existing Shapes before clear canvas", existingShapes)
                    clearCanvas(existingShapes, ctx, canvas);
                    console.log("after Existing Shapes", existingShapes)
                }
                return;
            }
            existingShapes.push(data.shape);
            clearCanvas(existingShapes, ctx, canvas);
        }
    };

    canvas.onmousedown = (e) => {
        const { x, y } = getMousePos(e);
  // ERASER MODE
        if (tool === "eraser") {
            const index = existingShapes.findIndex((shape) => {
                if (shape.type === "rectangle")
                    return isPointInRectangle(x, y, shape);

                if (shape.type === "circle")
                    return isPointInCircle(x, y, shape);

                if (shape.type === "arrow")
                    return isPointNearArrow(x, y, shape);

                return false;
            });

            if (index !== -1) {
                const deletedShape = existingShapes[index];
                socket.send(
                    JSON.stringify({
                        type: "chat",
                        message: JSON.stringify({
                        action: "delete",
                        shape: deletedShape,
                    }),
                    roomId,
                }));
            }   
        return;
    }

        if (tool === "select") return;

        
        clicked = true;
        startX = x;
        startY = y;
        if (tool === "arrow") {
            startX = e.clientX - canvas.getBoundingClientRect().left;
            startY = e.clientY - canvas.getBoundingClientRect().top;
            clicked = true;
        }
    }

    canvas.onmousemove = (e) => {
        if (!clicked || tool === "select") return;

        const { x, y } = getMousePos(e);
        clearCanvas(existingShapes, ctx, canvas);

        if (tool === "rectangle") {
            ctx.strokeRect(startX, startY, x - startX, y - startY);
        }

        if (tool === "circle") {
            const radius = Math.hypot(x - startX, y - startY);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (tool === "arrow" && clicked) {
            clearCanvas(existingShapes, ctx, canvas);

            const currentX = e.clientX - canvas.getBoundingClientRect().left;
            const currentY = e.clientY - canvas.getBoundingClientRect().top;

            drawArrow(ctx, startX, startY, currentX, currentY);
        }

       
    };

    canvas.onmouseup = (e) => {
        if (tool === "select" || tool === "eraser") return;

        clicked = false;
        const { x, y } = getMousePos(e);

        let shape: Shapes | undefined;

        if (tool === "rectangle") {
            shape = {
                id: crypto.randomUUID(),
                type: "rectangle",
                x: startX,
                y: startY,
                width: x - startX,
                height: y - startY,
            };
        }

        if (tool === "circle") {
            shape = {
                id: crypto.randomUUID(),
                type: "circle",
                x: startX,
                y: startY,
                radius: Math.hypot(x - startX, y - startY),
            };
        }

        if (tool === "arrow") {
            const endX = e.clientX - canvas.getBoundingClientRect().left;
            const endY = e.clientY - canvas.getBoundingClientRect().top;

            shape={
                id: crypto.randomUUID(),
                type: "arrow",
                startX,
                startY,
                endX,
                endY
            };
        }

        if (!shape) return;

        existingShapes.push(shape);

        socket.send(
            JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId,
        }));
    };

    canvas.style.cursor = tool === "eraser" ? "not-allowed" : tool === "select" ? "default" : "crosshair";

  return () => {
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
  };
}


function clearCanvas(existingShapes: Shapes[],ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement,) {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    canvas.style.backgroundColor = '#121212';
    ctx.strokeStyle = '#D3D3D3';

    existingShapes.map((shape) => {
        if(shape.type === 'rectangle'){
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else  if (shape.type === "arrow") {
            drawArrow(
                ctx,
                shape.startX,
                shape.startY,
                shape.endX,
                shape.endY
            );
        }
    })
}


//todo
async function getExistingShapes(roomId: string   ) {
    const res = await axios.get(`${backendUrl}/chats/${roomId}`)
    const data = res.data.messages;
    

    const shapes = data.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message);
        return messageData
    })

    return shapes;
}

