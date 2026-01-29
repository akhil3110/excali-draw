
import { db } from "@repo/db/db";
import { shapes } from "@repo/db/schema";
import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import type { Shapes } from "@repo/common/types";
import { redisPublisher } from "@repo/redis/client";



export async function createShapesRoute(req: Request, res: Response) {
  try {
    const { id, canvasId, type, data } = req.body;
    const userId = req.userId;
    
    if (!id || !canvasId || !type || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.insert(shapes).values({
      id,
      canvasId,
      userId,
      type,
      data,
    });

    return res.status(201).json({
      success: true,
      shape: data,
    });
  } catch (err: any) {
    if (err.code === "23505") {
      // primary key conflict (extremely unlikely)
      return res.status(409).json({ error: "Shape already exists" });
    }

    console.error(err);
    return res.status(500).json({ error: "Failed to create shape" });
  }
}


export async function getAllShapesInCanvasRoute(req: Request, res: Response) {
  try {
    const canvasId = Number(req.params.id);

    if (!canvasId) {
      return res.status(400).json({ error: "Invalid canvas id" });
    }

    const result = await db
      .select()
      .from(shapes)
      .where(eq(shapes.canvasId, canvasId))
      .orderBy(shapes.createdAt);

    
    const response = result.map((s) => s.data);

    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch shapes" });
  }
}

export async function deleteShapesByIdRoute(req: Request, res: Response) {
  try {
    const shapeId = req.params.id;
    const userId = req.userId; // set by middleware

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!shapeId) {
      return res.status(400).json({ error: "Shape id is required" });
    }

    const deleted = await db
      .delete(shapes)
      .where(
        and(
          eq(shapes.id, shapeId),
          eq(shapes.userId, userId)
        )
      )
      .returning({ id: shapes.id });

    if (deleted.length === 0) {
      return res.status(404).json({ error: "Shape not found" });
    }

    return res.json({
      success: true,
      deletedId: deleted[0]!.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete shape" });
  }
}


export async function moveShapeByIdRoute(req: Request, res: Response) {
  try {
    const shapeId = req.params.id;
    const userId = req.userId;
    const updates = req.body;

    if (!shapeId) return res.status(400).json({ error: "Shape id is required" });
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const [existing] = await db
      .select()
      .from(shapes)
      .where(and(eq(shapes.id, shapeId), eq(shapes.userId, userId)));

    if (!existing) return res.status(404).json({ error: "Shape not found" });

    // cast unknown to Shapes so we can spread
    const existingData = existing.data as Shapes;
    const newData: Shapes = { ...existingData };

    // merge updates based on shape type
    switch (existingData.type) {
      case "rectangle":
      {
        const shape = newData as Extract<Shapes, { type: "rectangle" }>;
        if (updates.x !== undefined) shape.x = updates.x;
        if (updates.y !== undefined) shape.y = updates.y;
        if (updates.width !== undefined) shape.width = updates.width;
        if (updates.height !== undefined) shape.height = updates.height;
      }
      break;

      case "circle":
      {
        const shape = newData as Extract<Shapes, { type: "circle" }>;
        if (updates.x !== undefined) shape.x = updates.x;
        if (updates.y !== undefined) shape.y = updates.y;
        if (updates.radius !== undefined) shape.radius = updates.radius;
      }
      break;

    case "text":
      {
        const shape = newData as Extract<Shapes, { type: "text" }>;
        if (updates.x !== undefined) shape.x = updates.x;
        if (updates.y !== undefined) shape.y = updates.y;
        if (updates.text !== undefined) shape.text = updates.text;
        if (updates.fontSize !== undefined) shape.fontSize = updates.fontSize;
      }
      break;

    case "arrow":
      {
        const shape = newData as Extract<Shapes, { type: "arrow" }>;
        if (updates.startX !== undefined) shape.startX = updates.startX;
        if (updates.startY !== undefined) shape.startY = updates.startY;
        if (updates.endX !== undefined) shape.endX = updates.endX;
        if (updates.endY !== undefined) shape.endY = updates.endY;
      }
      break;

    case "pencil":
      {
        const shape = newData as Extract<Shapes, { type: "pencil" }>;
        if (updates.points) shape.points = updates.points;
      }
      break;

    default:
      return res.status(400).json({ error: "Unknown shape type" });
  }


    const [updated] = await db
      .update(shapes)
      .set({ data: newData, updatedAt: new Date() })
      .where(and(eq(shapes.id, shapeId), eq(shapes.userId, userId)))
      .returning({ id: shapes.id, data: shapes.data });

    return res.json({ success: true, shape: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to move shape" });
  }
}


export async function deleteAllShapesInCanvasRoute(req: Request, res: Response) {
  try {
    const canvasId = Number(req.params.id);
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!canvasId) return res.status(400).json({ error: "Canvas id is required" });

    const deleted = await db
      .delete(shapes)
      .where(and(eq(shapes.canvasId, canvasId), eq(shapes.userId, userId)))
      .returning({ id: shapes.id });

    if (deleted.length === 0) return res.status(404).json({ error: "Shape not found" });

    return res.json({
      success: true,
      deletedId: deleted[0]!.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete shape" });
  }
}
