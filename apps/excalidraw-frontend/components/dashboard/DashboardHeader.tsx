"use-client"
import { Search, Bell, Grid, List, Filter, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal-store";


interface DashboardHeaderProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onMenuClick: () => void;
  token: string
}

const DashboardHeader = ({ viewMode, setViewMode, onMenuClick,token }: DashboardHeaderProps) => {

  const {onOpen} = useModalStore()

  function handleLogout() {
    onOpen("logout-modal")
  }
  return (
    <header className="h-16 bg-[hsl(222,47%,14%)] border-b border-[hsl(222,47%,25%)] flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 lg:left-64 right-0 z-10">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)] transition-all duration-200 mr-2"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex flex-row justify-end w-full">
        {token && (
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleLogout} 
              variant="ghost" size="sm" 
              className="text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)]"
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
