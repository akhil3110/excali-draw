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

// ✅ TYPE GUARD
function isPencil(shape: Shapes): shape is Extract<Shapes, { type: "pencil" }> {
  return shape.type === "pencil";
}


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


function getPointerPos(
  e: PointerEvent,
  canvas: HTMLCanvasElement
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}


// 🔥 ONLY SHOWING CHANGED PART (draw function)
// rest of your file remains EXACT SAME

export function draw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  tool:
    | "rectangle"
    | "circle"
    | "arrow"
    | "select"
    | "eraser"
    | "text"
    | "pencil",
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
  canvas.style.touchAction = "none";

  let selectedShape: Shapes | null = null;
  let isDragging = false;

  let dragOffsetX = 0;
  let dragOffsetY = 0;

  let startX = 0;
  let startY = 0;
  let clicked = false;

  let lastX = 0;
  let lastY = 0;

  let currentPencilShape: Extract<Shapes, { type: "pencil" }> | null = null;

  // ---------------- POINTER DOWN ----------------
  const handlePointerDown = (e: PointerEvent) => {
    const { x, y } = getPointerPos(e, canvas);

    if (tool === "pencil") {
      currentPencilShape = {
        id: uuidv4(),
        type: "pencil",
        points: [{ x, y }],
        strokeColor: activeStyle.strokeColor,
        strokeWidth: activeStyle.strokeWidth,
      };

      existingShapes.push(currentPencilShape);
      clicked = true;
      return;
    }

    if (tool === "select") {
      const shape = existingShapes.find((s) => {
        if (s.type === "rectangle")
          return x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height;

        if (s.type === "circle")
          return Math.hypot(x - s.x, y - s.y) <= s.radius;

        return false;
      });

      if (shape) {
        selectedShape = shape;
        setSelectedShapeId(shape.id);
        isDragging = true;

        if ("x" in shape) {
          dragOffsetX = x - shape.x;
          dragOffsetY = y - shape.y;
        }

        if (shape.type === "pencil") {
          lastX = x;
          lastY = y;
        }
      }

      return;
    }

    clicked = true;
    startX = x;
    startY = y;
  };

  // ---------------- POINTER MOVE ----------------
  const handlePointerMove = (e: PointerEvent) => {
    const { x, y } = getPointerPos(e, canvas);

    // ✅ FIXED HERE
    if (tool === "pencil" && clicked && currentPencilShape) {
      currentPencilShape.points.push({ x, y });
      clearCanvas(existingShapes, ctx, canvas);
      return;
    }

    if (tool === "select" && isDragging && selectedShape) {
      if (isPencil(selectedShape)) {
        const dx = x - lastX;
        const dy = y - lastY;

        selectedShape.points.forEach((p) => {
          p.x += dx;
          p.y += dy;
        });

        lastX = x;
        lastY = y;
      } else if ("x" in selectedShape) {
        selectedShape.x = x - dragOffsetX;
        selectedShape.y = y - dragOffsetY;
      }

      clearCanvas(existingShapes, ctx, canvas, selectedShape);
      return;
    }

    if (!clicked) return;

    clearCanvas(existingShapes, ctx, canvas);

    if (tool === "rectangle") {
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    }

    if (tool === "circle") {
      const r = Math.hypot(x - startX, y - startY);
      ctx.beginPath();
      ctx.arc(startX, startY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  // ---------------- POINTER UP ----------------
  const handlePointerUp = (e: PointerEvent) => {
    const { x, y } = getPointerPos(e, canvas);

    if (tool === "pencil" && currentPencilShape) {
      socket.send(
        JSON.stringify({
          type: "shapes",
          message: JSON.stringify({ shape: currentPencilShape }),
          roomId,
        })
      );

      currentPencilShape = null;
      clicked = false;
      return;
    }

    if (tool === "select") {
      isDragging = false;
      selectedShape = null;
      return;
    }

    clicked = false;

    let shape: Shapes | undefined;

    if (tool === "rectangle") {
      shape = {
        id: uuidv4(),
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
        id: uuidv4(),
        type: "circle",
        x: startX,
        y: startY,
        radius: Math.hypot(x - startX, y - startY),
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
      })
    );

    onShapeCreated?.();
  };

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);

  return () => {
    canvas.removeEventListener("pointerdown", handlePointerDown);
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("pointerup", handlePointerUp);
  };
}

// ---------------- CLEAR ----------------
export function clearCanvas(
  shapes: Shapes[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  selected?: Shapes | null
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  shapes.forEach((shape) => {
    ctx.strokeStyle = shape.strokeColor ?? "#D3D3D3";
    ctx.lineWidth = shape.strokeWidth ?? 2;

    if (shape.type === "rectangle") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }

    if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (shape.type === "pencil") {
      ctx.beginPath();
      shape.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  });
}


//todo


