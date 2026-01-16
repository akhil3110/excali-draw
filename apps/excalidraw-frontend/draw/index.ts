import { backendUrl } from "@/config";
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

let existingShapes: Shapes[] = [];

export function draw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) { 


    const ctx = canvas.getContext('2d');           
    if(!ctx) return;
    canvas.style.backgroundColor = '#121212';
    ctx.strokeStyle = '#D3D3D3';

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if(message.type === 'chat'){
            console.log("Message received:", message);
            console.log("parsed message:", JSON.parse(message.message).shape);
            existingShapes.push(JSON.parse(message.message).shape);
            clearCanvas(existingShapes, ctx, canvas);
        }
    }

    let startX = 0 , startY=0;

    let clicked = false;
    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        // console.log('Mouse down at', e.clientX, e.clientY);
        startX=e.clientX
        startY=e.clientY
    })

    canvas.addEventListener('mouseup', (e) => {
        // console.log('Mouse up at', e.clientX, e.clientY);
        clicked = false;    
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const shape: Shapes = {
            type: "rectangle",
            x: startX,
            y: startY,
            width,
            height
        }

        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({shape}),
            roomId: roomId
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if(clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, ctx, canvas);
            ctx.strokeRect(startX, startY, width, height);
            ctx.strokeStyle = '#D3D3D3'
        }
    })

}

function clearCanvas(existingShapes: Shapes[],ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement,) {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    canvas.style.backgroundColor = '#121212';
    ctx.strokeStyle = '#D3D3D3';

    existingShapes.map((shape) => {
        if(shape.type === 'rectangle'){
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
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

