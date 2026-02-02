"use client";

import { Button } from "@/components/ui/button";
import { Square, Circle, ArrowLeft, ArrowRight, ArrowDownRight, MousePointer, Eraser, Text, Type, Pencil, Trash2, User2, Users, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import ActionTooltip from "./action-tooltip";
import { useEffect } from "react";

const tools = [
  { id: "select", icon: MousePointer, key: "1", label: "Select" },
  { id: "pencil", icon: Pencil, key: "2", label: "Pencil" },
  { id: "text", icon: Type, key: "3", label: "Text" },
  { id: "rectangle", icon: Square, key: "4", label: "Rectangle" },
  { id: "circle", icon: Circle, key: "5", label: "Circle" },
  { id: "arrow", icon: ArrowDownRight, key: "6", label: "Arrow" },
  { id: "eraser", icon: Eraser, key: "7", label: "Eraser" },
];

export default function TopToolbar({ tool, setTool,onClear,admin, onManageUsers,onDownload }: any) {
    const router = useRouter();
    
    useEffect(() => {   
        const handler = (e: KeyboardEvent) =>{
            const found  = tools.find((t) => t.key === e.key)
            if (found) setTool(found.id)
        }

        window.addEventListener("keydown",handler)
        return () => window.removeEventListener("keydown",handler)
    },[])


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
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700rounded-lg shadow-lg px-3 py-2 flex gap-2 z-50 rounded-md">
        {tools.map(({id,icon:Icon,key,label}) => {
            const active = tool=== id

            return(
                <ActionTooltip key={id} label={label}>
                    <button
                        onClick={() => setTool(id)}
                        className={`
                                relative h-10 w-10 rounded-md
                                flex items-center justify-center
                                transition
                                ${
                                    active ? "bg-zinc-700 text-white" : "bg-transparent text-zinc-400 hover:bg-zinc-800"
                                }
                            `}
                    >
                        <Icon className="h-5 w-5" />
                        <span className=" absolute bottom-0.5 right-0.5 text-[10px] font-medium text-zinc-400">
                            {key}
                        </span>
                    </button>
                </ActionTooltip>
                
            )
        })}
        </div>
        {/* {admin && ( */}
            <div className="fixed top-4 right-4 z-50">
                <div className="flex flex-col gap-y-2">
                    <ActionTooltip label="Clear Canvas">
                        <Button
                            size="icon"
                            onClick={onClear}
                            className="group h-11 w-11 rounded-xl bg-transparent border-2 border-red-500/70 flex items-center justify-center transition-all duration-200 hover:bg-red-500/10 hover:border-red-500 active:scale-95"
                        >
                            <Trash2 className="h-5 w-5 text-red-400 transition-colors group-hover:text-red-500" />
                        </Button>
                    </ActionTooltip>
                    <ActionTooltip label="Download Canvas" side="bottom">
                        <Button
                            size="icon"
                            onClick={onDownload}
                             className="group h-11 w-11 rounded-xl bg-transparent border-2 border-[#d3d3d3] flex items-center justify-center transition-all duration-200 hover:bg-[#d3d3d3]/10 active:scale-95"
                        >
                            <Download className="h-5 w-5  text-[#d3d3d3] transition-colors  group-hover:text-white" />
                        </Button>
                    </ActionTooltip>
                    {/* <ActionTooltip label="Manage Users" side="bottom">
                        <Button
                            size="icon"
                            onClick={onManageUsers}
                            className="font-extrabold"
                        >
                            <Users className="h-5 w-5" />
                        </Button>
                    </ActionTooltip> */}
                </div>
            </div>
        {/* )} */}
    </>
  );
}
