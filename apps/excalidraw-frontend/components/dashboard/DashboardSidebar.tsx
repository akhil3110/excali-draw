"use client";
import { Home, FolderOpen, Star, Clock, Users, Settings, HelpCircle, Plus, Trash2, X, User, LayoutDashboard, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useModalStore from "@/store/modal-store";
import { useShowCanvasStore } from "@/store/showCanvas-store";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
  userId?: string | null;
  name: string;
  count:number | 0;
  yourBoard: number | 0;
  invitedBoard: number | 0;
}

const DashboardSidebar = ({ isOpen, onClose, token, userId,name,count, yourBoard, invitedBoard }: DashboardSidebarProps) => {

  const {onOpen} = useModalStore();
  const router = useRouter()
  const { view, setView } = useShowCanvasStore();

  const mainItems: SidebarItem[] = [
    { 
      icon: <FolderOpen className="w-5 h-5" />, 
      label: "All Boards", 
      count: count, 
      active: view === "all",
      onClick: () => setView("all")
    },
    // { icon: <Star className="w-5 h-5" />, label: "Favorites", count: 5 },
    { 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: "Your Boards", count:yourBoard, 
      active: view==="created",
      onClick: () => setView("created")
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      label: "Shared with me", 
      count: invitedBoard, 
      active: view==="member",
      onClick: () => setView("member")
    },
    // { icon: <Trash2 className="w-5 h-5" />, label: "Trash" },
  ];
 
  

  function handleStartDrawing() {
    try {
      
      if(!token || !userId) {
        return toast.error("Please login to start drawing!");
      }

      onOpen("create-room-modal",{userId})

    } catch (error) {
      
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 h-screen bg-[hsl(222,47%,14%)] border-r border-[hsl(222,47%,25%)] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div  className="p-6 border-b border-[hsl(222,47%,25%)] flex items-center justify-between cursor-pointer">
          <div onClick={() => router.push("/")} className="flex items-center gap-3">
            
             <Pencil className="h-5 w-5 text-[hsl(174,72%,56%)]" />
            <span className="text-xl font-bold text-[hsl(210,40%,98%)]">SketchFlow</span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)] transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Board Button */}
        <div className="p-4">
          <Button onClick={handleStartDrawing} className="w-full bg-[hsl(174,72%,56%)] hover:bg-[hsl(174,72%,46%)] text-[hsl(222,47%,11%)] font-semibold gap-2">
            <Plus className="w-5 h-5" />
            New Board
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {mainItems.map((item, index) => (
              <li key={index} onClick={item.onClick}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    item.active
                      ? "bg-[hsl(174,72%,56%)]/10 text-[hsl(174,72%,56%)]"
                      : "text-[hsl(215,20%,65%)] hover:bg-[hsl(222,47%,20%)] hover:text-[hsl(210,40%,98%)]"
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.active 
                        ? "bg-[hsl(174,72%,56%)]/20 text-[hsl(174,72%,56%)]" 
                        : "bg-[hsl(222,47%,20%)] text-[hsl(215,20%,65%)]"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* User Profile */}
        <div className="p-4 border-t border-[hsl(222,47%,25%)]">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(270,60%,65%)] to-[hsl(174,72%,56%)] flex items-center justify-center">
              <span className="text-[hsl(210,40%,98%)] font-semibold text-sm">{name.at(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[hsl(210,40%,98%)]">{name}</p>
              <p className="text-xs text-[hsl(215,20%,65%)]">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
