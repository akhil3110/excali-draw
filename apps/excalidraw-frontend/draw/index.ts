import { v4 as uuidv4 } from "uuid";



  
export type Shapes =
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
      strokeColor?: string;
      strokeWidth?: number;
    }
  | {
      id: string;
      type: "circle";
      x: number;
      y: number;
      radius: number;
      strokeColor?: string;
      strokeWidth?: number;
    }
  | {
      id: string;
      type: "arrow";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      strokeColor?: string;
      strokeWidth?: number;
    }
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize: number;
      strokeColor?: string;
      strokeWidth?: number;
    }
  | {
      id: string;
      type: "pencil";
      points: { x: number; y: number }[];
      strokeColor?: string;
      strokeWidth?: number;
    };


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

function isPointInText(
  x: number,
  y: number,
  t: any,
  ctx: CanvasRenderingContext2D
) {
  const { width, height } = getTextBounds(
    ctx,
    t.text,
    t.fontSize
  );

  return (
    x >= t.x &&
    x <= t.x + width &&
    y >= t.y &&
    y <= t.y + height
  );
}

function getShapeIndexAtPoint(
  x: number,
  y: number,
  shapes: Shapes[],
  ctx: CanvasRenderingContext2D 
): number | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];

    if (shape.type === "rectangle" && isPointInRectangle(x, y, shape))
      return i;

    if (shape.type === "circle" && isPointInCircle(x, y, shape))
      return i;

    if (shape.type === "arrow" && isPointNearArrow(x, y, shape))
      return i;
    if(shape.type === "text" && isPointInText(x,y,shape,ctx))
        return i
    if (shape.type === "pencil" && isPointNearPencil(x, y, shape))
        return i;
  }
  return null;
}

function distancePointToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return Math.hypot(px - x1, py - y1);
  }

  const t =((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

  const clampedT = Math.max(0, Math.min(1, t));

  const closestX = x1 + clampedT * dx;
  const closestY = y1 + clampedT * dy;

  return Math.hypot(px - closestX, py - closestY);
}


function isPointNearPencil(
    x: number,
    y: number,
    pencil: any,
    tolerance =6
) {
    const points =pencil.points;

    for(let i=0; i<points.length-1 ; i++){
        const p1 = points[i];
        const p2 = points[i+1]

        const dist = distancePointToSegment(x,y,p1.x,p1.y,p2.x,p2.y)

        if(dist <= tolerance) return true
    }
}

function getPencilBounds(points: { x: number; y: number }[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  points.forEach(p => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}



export function drawSelectionOutline(
  ctx: CanvasRenderingContext2D,
  shape: Shapes
) {
    ctx.save();
    ctx.strokeStyle = "#4EA1FF";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;

    if (shape.type === "rectangle") {
        ctx.strokeRect(
            shape.x - 4,
            shape.y - 4,
            shape.width + 8,
            shape.height + 8
        );
    }

    if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(
            shape.x,
            shape.y,
            shape.radius + 6,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    if (shape.type === "arrow") {
        const minX = Math.min(shape.startX, shape.endX);
        const minY = Math.min(shape.startY, shape.endY);
        const maxX = Math.max(shape.startX, shape.endX);
        const maxY = Math.max(shape.startY, shape.endY);

        ctx.strokeRect(
            minX - 6,
            minY - 6,
            maxX - minX + 12,
            maxY - minY + 12
        );
    }

    if(shape.type === "text"){
        const { width, height } = getTextBounds(
            ctx,
            shape.text,
            shape.fontSize
        );


        ctx.strokeRect(
            shape.x -4,
            shape.y - 4,
            width + 8,
            height + 8
        )
    }

    if(shape.type === "pencil"){
        const bounds  =  getPencilBounds(shape.points)

        ctx.save()
        ctx.setLineDash([6,4])
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1;

        ctx.strokeRect(
            bounds.x - 4,
            bounds.y - 4,
            bounds.width + 8,
            bounds.height + 8
        )

        ctx.restore()
        return
    }

    ctx.restore();
}


export function drawShape(ctx: CanvasRenderingContext2D, shape: Shapes) {
  ctx.strokeStyle = shape.strokeColor || "#D3D3D3";
  ctx.lineWidth = shape.strokeWidth || 2;

  switch (shape.type) {
    case "rectangle":
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      break;
    case "circle":
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius || 0, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    // add arrow, text, pencil if needed
  }
}

export function getTextBounds(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number
) {
  ctx.font = `${fontSize}px Arial`;
  return {
    width: ctx.measureText(text).width,
    height: fontSize,
  };
}



export function draw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  tool: "rectangle" | "circle" | 'arrow' | 'select' | 'eraser'| "text" | "pencil" ,
  shapesRef: React.MutableRefObject<Shapes[]>,
  selectedShapeId: string | null,
  setSelectedShapeId: (id: string | null) => void,
  activeStyle: { strokeColor: string; strokeWidth: number },
  onShapeCreated?: () => void
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const existingShapes = shapesRef.current;

    canvas.style.backgroundColor = "#121212";
    ctx.strokeStyle = "#D3D3D3";

    let selectedShape: Shapes | null = null;
    let selectedShapeIndex: number | null = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isDragging = false;

    let lastMouseX = 0;
    let lastMouseY = 0;

    let startX = 0;
    let startY = 0;
    let clicked = false;

    let textInput: HTMLTextAreaElement | null = null;
    let currentPencilShape: Shapes | null = null;


    clearCanvas(existingShapes, ctx, canvas, selectedShape);

    

    const getMousePos = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    // socket.onmessage = (event) => {
    //     const message = JSON.parse(event.data);

    //     // if (message.type !== "chat") return;
    //     if(message.type !== "shapes") return

        
    //     const data = JSON.parse(message.message)
        

    //     if (!data || !data.shape || !data.shape.id) {
    //         return;
    //     }

    //     if (data.action === "delete") {
    //         const shape = data.shape

    //         const index = existingShapes.findIndex(
    //             (s) => s.id === shape.id
    //         );

    //         if (index !== -1) {
    //             existingShapes.splice(index, 1);
    //         } 

    //         if(selectedShape?.id === shape.id){
    //             selectedShape = null
    //             selectedShapeIndex = null
    //         }

    //         clearCanvas(existingShapes, ctx, canvas, selectedShape);
    //         return;
    //     }

    //     const shape = data.shape;
    //     const index = existingShapes.findIndex(
    //         (s) => s.id === shape.id
    //     );

    //     if (index === -1) {
    //         // New shape
    //         existingShapes.push(shape);
    //     } else {
    //         // Existing shape moved / updated
    //         existingShapes[index] = shape;
    //     }

    //     clearCanvas(existingShapes, ctx, canvas, selectedShape);

    //     // if (message.type === "chat") {
    //     //     const data = JSON.parse(message.message);
    //     //     existingShapes.push(data.shape);
    //     //     clearCanvas(existingShapes, ctx, canvas, selectedShape);
    //     // }
    // };

    canvas.onmousedown = (e) => {
        const { x, y } = getMousePos(e);

        if(tool === "pencil"){
            const {x,y} = getMousePos(e)

            currentPencilShape = {
                id:  uuidv4(),
                type: "pencil",
                points: [{x,y}],
                strokeColor: activeStyle.strokeColor,
                strokeWidth: activeStyle.strokeWidth,
            };

            existingShapes.push(currentPencilShape)
            clicked=true
            return
        }

        if(tool === "text"){

            if(textInput){
                textInput.remove()
                textInput = null
            }

            const input = document.createElement("textarea");
            input.style.position = "absolute"
            input.style.left = `${canvas.offsetLeft + x}px`
            input.style.top = `${canvas.offsetTop + y}px`
            input.style.background= "transparent"
            input.style.color = "#D3D3D3"
            input.style.border = "1px dashed #4EA1FF"
            input.style.outline = "none"
            input.style.resize = "none"
            input.style.fontSize = "18px"
            input.style.fontFamily = "Arial"
            input.rows = 1

            document.body.appendChild(input)

            input.onblur = () => {
                const value = input.value.trim()
                if(!value){
                    input.remove()
                    textInput = null 
                    return
                }

                const shape: Shapes = {
                    id:  uuidv4(),
                    type: "text",
                    x,
                    y,
                    text: value,
                    fontSize: 18
                }

                existingShapes.push(shape)

                socket.send(
                    JSON.stringify({
                        type: "shapes",
                        message: JSON.stringify({shape}),
                        roomId
                    })
                )

                input.remove()
                textInput = null

                clearCanvas(existingShapes,ctx,canvas,null)
            }

            return

        }

         if (tool === "select") {
            selectedShapeIndex = getShapeIndexAtPoint(x,y,existingShapes,ctx);

            if (selectedShapeIndex !== null) {
                selectedShape = existingShapes[selectedShapeIndex]
                setSelectedShapeId(selectedShape?.id)
                isDragging = true;

                if (selectedShape.type === "rectangle" || selectedShape.type === "circle") {
                    dragOffsetX = x - selectedShape.x;
                    dragOffsetY = y - selectedShape.y;
                }

                if (selectedShape.type === "arrow") {
                    dragOffsetX = x - selectedShape.startX;
                    dragOffsetY = y - selectedShape.startY;
                }

                if (selectedShape.type === "text"){
                    dragOffsetX = x  - selectedShape.x
                    dragOffsetY = y - selectedShape.y
                }

                if(selectedShape.type === "pencil"){
                    lastMouseX = x
                    lastMouseY = y
                }

                

                clearCanvas(existingShapes, ctx, canvas, selectedShape);
            }
            return;
        }
  // ERASER MODE
        if (tool === "eraser") {
            const index = existingShapes.findIndex((shape) => {
                if (shape.type === "rectangle")
                    return isPointInRectangle(x, y, shape);
                if (shape.type === "circle")
                    return isPointInCircle(x, y, shape);

                if (shape.type === "arrow")
                    return isPointNearArrow(x, y, shape);
                if (shape.type === "text"){
                    return isPointInText(x,y,shape,ctx)
                }
                if(shape.type === "pencil"){
                    return isPointNearPencil(x,y,shape)
                }

                return false;
            });

            if (index !== -1) {
                const deletedShape = existingShapes[index];
                existingShapes.splice(index,1)

                if(selectedShape?.id === deletedShape.id){
                    selectedShape = null
                    selectedShapeIndex = null
                }

                clearCanvas(existingShapes,ctx,canvas, null)

                socket.send(
                    JSON.stringify({
                        type: "shapes",
                        message: JSON.stringify({
                        action: "delete",
                        shape: deletedShape,
                    }),
                    roomId,
                }));
            }   
            return;
        }
        
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
        const { x, y } = getMousePos(e);

        if(tool==="pencil" && clicked && currentPencilShape){
            const {x,y} = getMousePos(e)

            if(currentPencilShape.type === "pencil"){
                currentPencilShape.points.push({x,y})
            }

            clearCanvas(existingShapes,ctx,canvas,null)
            return
        }

        if(tool === "select" && isDragging && selectedShape){
            clearCanvas(existingShapes, ctx, canvas, selectedShape);

            if(selectedShape.type === "text") {
                selectedShape.x = x - dragOffsetX
                selectedShape.y = y - dragOffsetY
            } else if(selectedShape.type === "rectangle" || selectedShape.type==="circle"){
                selectedShape.x = x - dragOffsetX
                selectedShape.y = y - dragOffsetY
            }else if(selectedShape.type === "arrow"){
                const dx = x - dragOffsetX
                const dy = y - dragOffsetY

                const w = selectedShape.endX - selectedShape.startX
                const h = selectedShape.endY - selectedShape.startY

                selectedShape.startX = dx
                selectedShape.startY = dy
                selectedShape.endX = dx + w
                selectedShape.endY = dy + h
            }

            if(selectedShape.type === "pencil"){
                const dx = x - lastMouseX
                const dy = y - lastMouseY

                selectedShape.points.forEach(p => {
                    p.x +=dx;
                    p.y +=dy
                })

                lastMouseX = x
                lastMouseY = y

                clearCanvas(existingShapes, ctx, canvas, selectedShape);
                return
            }
            clearCanvas(existingShapes, ctx, canvas, selectedShape);
            return
        }

        if(!clicked || tool === "select") return

        clearCanvas(existingShapes, ctx, canvas, selectedShape);

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
            clearCanvas(existingShapes, ctx, canvas, selectedShape);

            const currentX = e.clientX - canvas.getBoundingClientRect().left;
            const currentY = e.clientY - canvas.getBoundingClientRect().top;

            drawArrow(ctx, startX, startY, currentX, currentY);
        }

       
    };

    canvas.onmouseup = (e) => {

        if(tool === "pencil" && currentPencilShape){
            
            socket.send(
                JSON.stringify({
                    type: "shapes",
                    message: JSON.stringify({
                        shape: currentPencilShape
                    }),
                    roomId
                })
            )
            currentPencilShape = null
            clicked = false
            return
        }

        if(tool === "select"){
           
            if(selectedShape){
                socket.send(
                JSON.stringify({
                    type: "shapes",
                    message: JSON.stringify({
                        shape: selectedShape,
                        action: "update"
                    }),
                    roomId
                }))    
            }

            isDragging = false;

            clearCanvas(existingShapes, ctx, canvas, selectedShape);

            selectedShape = null
            selectedShapeIndex = null
        }

        if ( tool === "eraser") return;

        clicked = false;
        const { x, y } = getMousePos(e);

        let shape: Shapes | undefined;

        if (tool === "rectangle") {
            shape = {
                id:  uuidv4(),
                type: "rectangle",
                x: startX,
                y: startY,
                width: x - startX,
                height: y - startY,
                strokeColor: activeStyle.strokeColor,
                strokeWidth: activeStyle.strokeWidth,

            };
        }

        if (tool === "circle") {
            shape = {
                id:  uuidv4(),
                type: "circle",
                x: startX,
                y: startY,
                radius: Math.hypot(x - startX, y - startY),
                strokeColor: activeStyle.strokeColor,
                strokeWidth: activeStyle.strokeWidth,
            };
        }

        if (tool === "arrow") {
            const endX = e.clientX - canvas.getBoundingClientRect().left;
            const endY = e.clientY - canvas.getBoundingClientRect().top;

            shape={
                id:  uuidv4(),
                type: "arrow",
                startX,
                startY,
                endX,
                endY,
                strokeColor: activeStyle.strokeColor,
                strokeWidth: activeStyle.strokeWidth,
            };
        }

        if (!shape) return;

        existingShapes.push(shape);

        socket.send(
            JSON.stringify({
            type: "shapes",
            message: JSON.stringify({ shape }),
            roomId,
        }));

        onShapeCreated?.()
        
    };

    canvas.style.cursor =
        tool === "eraser"
            ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='10' fill='none' stroke='%23D3D3D3' stroke-width='2'/></svg>") 12 12, auto`
            : tool === "select" ? "default" : "crosshair";

  return () => {
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
  };
}


export function clearCanvas(
    existingShapes: Shapes[],
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    selectedShape?: Shapes | null
) {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    ctx.setLineDash([]);

    existingShapes.map((shape) => {
        ctx.strokeStyle = shape.strokeColor ?? "#D3D3D3";
        ctx.lineWidth = shape.strokeWidth ?? 2;
        ctx.fillStyle = shape.strokeColor ?? "#D3D3D3";

        
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
        } else if(shape.type === "text"){
            ctx.fillStyle = shape.strokeColor ?? "#D3D3D3";
            ctx.font = `${shape.fontSize}px Arial`
            ctx.textBaseline = "top"
            ctx.fillText(shape.text, shape.x, shape.y)
        } else if(shape.type === "pencil"){
            ctx.beginPath()
            shape.points.forEach((point,index) => {
                if(index === 0){
                    ctx.moveTo(point.x,point.y)
                } else {
                    ctx.lineTo(point.x,point.y)
                }
            })
            ctx.stroke()
        }
    })
    if (selectedShape) {
        drawSelectionOutline(ctx, selectedShape);
    }
}


//todo


