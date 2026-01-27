
import { db } from "@repo/db/db";
import { shapes } from "@repo/db/schema";
import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";


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

    if (Number.isNaN(canvasId)) {
      return res.status(400).json({ error: "Invalid canvas id" });
    }

    const result = await db
      .select()
      .from(shapes)
      .where(eq(shapes.canvasId, canvasId))
      .orderBy(shapes.createdAt);

    // Return only shape data (frontend-friendly)
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