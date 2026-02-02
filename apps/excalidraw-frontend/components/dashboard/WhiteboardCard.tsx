"use client"
import { Users, Trash, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import useModalStore from "@/store/modal-store";
import ActionTooltip from "../action-tooltip";

interface canvasMemberData {
  id: number;
  canvasId: number;
  memberId: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}

interface WhiteboardCardProps {
  id: number;
  title: string;
  collaborators: number;
  isFavorite?: boolean;
  isShared?: boolean;
  isAdmin?: boolean;
  members?: canvasMemberData[];
  email?: string
}

const WhiteboardCard = ({
  id,
  title,
  collaborators,
  isFavorite = false,
  isShared = false,
  isAdmin,
  members,
  email
}: WhiteboardCardProps) => {

  const router = useRouter()
  const {onOpen} = useModalStore()

  return (
    <div
      className="group bg-[hsl(222,47%,14%)] border border-[hsl(222,47%,25%)] rounded-xl overflow-hidden hover:border-[hsl(174,72%,56%)]/50 hover:shadow-lg hover:shadow-[hsl(174,72%,56%)]/5 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="h-40 bg-[hsl(222,47%,18%)] relative overflow-hidden">
        {/* Sketch Preview Placeholder */}
        <svg className="w-full h-full opacity-30" viewBox="0 0 200 120">
          <rect x="20" y="20" width="60" height="40" rx="4" fill="none" stroke="hsl(174,72%,56%)" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="140" cy="40" r="25" fill="none" stroke="hsl(270,60%,65%)" strokeWidth="2" />
          <line x1="40" y1="80" x2="160" y2="100" stroke="hsl(210,40%,98%)" strokeWidth="2" strokeLinecap="round" />
          <path d="M80 70 Q100 50 120 70 T160 70" fill="none" stroke="hsl(174,72%,56%)" strokeWidth="2" />
        </svg>
        
        {/* Hover Overlay */}
        <div onClick={() => router.push(`/canvas/${id}`)} className="absolute inset-0 bg-[hsl(222,47%,11%)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-4 py-2 bg-[hsl(174,72%,56%)] text-[hsl(222,47%,11%)] font-semibold rounded-lg">
            Open Board
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-y-2">
            <ActionTooltip label="Add members">
              <Button onClick={() =>onOpen("addMember-canvas-modal",{email})} className="p-1.5 rounded-lg bg-[hsl(222,47%,11%)]/60 text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] backdrop-blur-sm transition-colors cursor-pointer">
                <UserRoundPlus className="w-4 h-4" />
              </Button>
            </ActionTooltip>
            <ActionTooltip label="Delete canvas" side="bottom">
              <Button onClick={() =>onOpen("delte-canvas-modal", {canvasId:id })} className="p-1.5 rounded-lg bg-[hsl(222,47%,11%)]/60 text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] backdrop-blur-sm transition-colors cursor-pointer">
                <Trash className="w-4 h-4" />
            </Button>
            </ActionTooltip>
          </div>
        </div>

        {/* Shared Badge */}
        {isShared && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-[hsl(270,60%,65%)]/20 text-[hsl(270,60%,65%)] text-xs font-medium rounded-md backdrop-blur-sm">
              Shared
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-row justify-between">
          <h3 className="text-[hsl(210,40%,98%)] font-semibold mb-2 truncate">{title}</h3>
          {isAdmin ?  (
            <ActionTooltip label="Manage Members" side="bottom">
              <button
                onClick={() => onOpen("user-list-modal", { isAdmin, members  })}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs backdrop-blur-sm transition-all duration-200 bg-[hsl(222,47%,11%)]/60 text-[hsl(215,20%,65%)] cursor-pointer hover:bg-[hsl(222,47%,18%)] hover:text-[hsl(210,40%,98%)] hover:shadow-[0_0_0_1px_hsl(210,40%,98%,0.15)] hover:scale-[1.03]"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{collaborators}</span>
              </button>
            </ActionTooltip>
            ) : (
              <button
                disabled
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs backdrop-blur-sm bg-[hsl(222,47%,11%)]/60 text-[hsl(215,20%,65%)] opacity-70 cursor-default "
              >
                <Users className="w-3.5 h-3.5" />
                <span>{collaborators}</span>
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default WhiteboardCard;