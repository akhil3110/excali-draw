"use client";

import { Button } from "@/components/ui/button";
import { Square, Circle, ArrowLeft, ArrowRight, ArrowDownRight, MousePointer, Eraser } from "lucide-react";
import { useRouter } from "next/navigation";
import ActionTooltip from "./action-tooltip";

export default function TopToolbar({ tool, setTool }: any) {
  const router = useRouter();

  return (
    <>
      {/* Back Button */}
      <ActionTooltip label="Dashboard">
        <div className="fixed top-4 left-4 z-50">
            <Button
                variant="secondary"
                size="icon"
                onClick={() => router.push("/dashboard")}
            >
            <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      </ActionTooltip>

      {/* Toolbar */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2
        bg-zinc-900 border border-zinc-700
        rounded-lg shadow-lg px-3 py-2
        flex gap-2 z-50"
      >
        <ActionTooltip label="Select">
            <Button
                size="icon"
                variant={tool === "select" ? "default" : "ghost"}
                onClick={() => setTool("select")}
            >
                <MousePointer className="h-5 w-5" />
            </Button>
        </ActionTooltip>

        <ActionTooltip label="rectangle">
            <Button
                size="icon"
                variant={tool === "rectangle" ? "default" : "ghost"}
                onClick={() => setTool("rectangle")}
            >
                <Square className="h-5 w-5" />
            </Button>
        </ActionTooltip>

        <ActionTooltip label="circle">
            <Button
                size="icon"
                variant={tool === "circle" ? "default" : "ghost"}
                onClick={() => setTool("circle")}
            >
                <Circle className="h-5 w-5" />
            </Button>
        </ActionTooltip>

        <ActionTooltip label="arrow">
            <Button
                size="icon"
                variant={tool === "arrow" ? "default" : "ghost"}
                onClick={() => setTool("arrow")}
            >
                <ArrowDownRight className="h-5 w-5" />
            </Button>
        </ActionTooltip>

        <ActionTooltip label="Eraser">
            <Button
                size="icon"
                variant={tool === "eraser" ? "default" : "ghost"}
                onClick={() => setTool("eraser")}
            >
                <Eraser className="h-5 w-5" />
            </Button>
        </ActionTooltip>
      </div>
    </>
  );
}
