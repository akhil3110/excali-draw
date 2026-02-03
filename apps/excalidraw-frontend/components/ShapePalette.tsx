"use client";

import { Shapes } from "@/draw";
import clsx from "clsx";
import { motion } from "motion/react";

const STROKE_COLORS = [
  "#D3D3D3",
  "#FF4D4D",
  "#4EA1FF",
  "#4ADE80",
  "#FACC15",
];

const TEXT_SIZES = [
  { label: "S", value: 14 },
  { label: "M", value: 18 },
  { label: "L", value: 24 },
  { label: "XL", value: 32 },
];



const STROKE_WIDTHS = [1, 2, 4, 6];

export default function ShapePalette({
  shape,
  onChange,
}: {
  shape: Shapes;
  onChange: (updates: Partial<Shapes>) => void;
}) {
    const currentColor = shape.strokeColor ?? "#D3D3D3";
    const currentWidth = shape.strokeWidth ?? 2;
    const isText = shape.type === "text";
    const currentFontSize = shape.type === "text" ? shape.fontSize : null;

  return (
    <motion.div
        onPointerDown={(e) => {
            e.preventDefault();     // ⬅️ THIS IS CRITICAL
            e.stopPropagation();
        }}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
      key={shape.id}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50
                 bg-zinc-900 border border-zinc-700 rounded-xl
                 p-4 w-56 shadow-xl space-y-5"
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
        <div className="rounded-md bg-zinc-800/80 border border-zinc-700 px-3 py-2">
            <p className="text-[12px] text-zinc-200 text-center leading-snug">
                Double-click to apply style
            </p>
        </div>
      {/* ---- STROKE COLOR ---- */}
        <div>
            <p className="text-xs font-medium text-zinc-400 mb-2">
                {isText ? "Text color" : "Stroke"}
            </p>

            <div className="flex gap-2 mb-3">
                {STROKE_COLORS.map((color) => (
                    <button
                        key={color}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => onChange({ strokeColor: color })}
                        className={clsx(
                            "w-7 h-7 rounded-md border transition",
                            currentColor === color
                                ? "border-white ring-2 ring-white/40"
                                : "border-zinc-700 hover:scale-105"
                        )}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={currentColor}
                    onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onChange={(e) =>
                        onChange({ strokeColor: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer bg-transparent"
                />
                <span className="text-xs text-zinc-400">Custom</span>
            </div>
        </div>

        {isText && (
            <div>
                <p className="text-xs font-medium text-zinc-400 mb-2">
                    Text size
                </p>

                <div className="flex gap-2">
                    {TEXT_SIZES.map((size) => (
                        <button
                            key={size.value}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={() =>
                                onChange({ fontSize: size.value })
                            }
                            className={clsx(
                                "flex-1 h-9 rounded-md border text-xs font-medium transition",
                                currentFontSize === size.value
                                    ? "border-white bg-zinc-800 text-white"
                                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            )}
                        >
                            {size.label}
                        </button>
                    ))}
                </div>
            </div>
        )}

       {!isText && (
            <div>
                <p className="text-xs font-medium text-zinc-400 mb-2">
                    Stroke width
                </p>

                <div className="flex gap-2">
                    {STROKE_WIDTHS.map((width) => (
                        <button
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            key={width}
                            onClick={() => onChange({ strokeWidth: width })}
                            className={clsx(
                                "flex-1 h-9 rounded-md border flex items-center justify-center transition",
                                currentWidth === width
                                    ? "border-white bg-zinc-800"
                                    : "border-zinc-700 hover:bg-zinc-800"
                            )}
                        >
                            <div
                                className="bg-zinc-200 rounded-full"
                                style={{
                                    height: width,
                                    width: "70%",
                                }}
                            />
                        </button>
                    ))}
                </div> 
            </div>
       )}
    </motion.div>
  );
}
