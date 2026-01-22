import { backendUrl } from "@/config";
import { shapes } from "@repo/db/schema";
import axios from "axios";

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

// const existingShapes: Shapes[] = [];

export function draw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  tool: "rectangle" | "circle",
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
            existingShapes.push(JSON.parse(message.message).shape);
            clearCanvas(existingShapes, ctx, canvas);
        }
    };

    canvas.onmousedown = (e) => {
        clicked = true;
        const { x, y } = getMousePos(e);
        startX = x;
        startY = y;
    ;

    canvas.onmousemove = (e) => {
        if (!clicked) return;

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
    };

    canvas.onmouseup = (e) => {
        clicked = false;
        const { x, y } = getMousePos(e);

        let shape: Shapes | undefined;

        if (tool === "rectangle") {
            shape = {
                type: "rectangle",
                x: startX,
                y: startY,
                width: x - startX,
                height: y - startY,
            };
    }

    if (tool === "circle") {
      shape = {
        type: "circle",
        x: startX,
        y: startY,
        radius: Math.hypot(x - startX, y - startY),
      };
    }

    if (!shape) return;

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId,
      })
    );
  };

  return () => {
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
  };
}
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

