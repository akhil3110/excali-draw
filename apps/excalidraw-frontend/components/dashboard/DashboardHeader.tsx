import { Search, Bell, Grid, List, Filter, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onMenuClick: () => void;
}

const DashboardHeader = ({ viewMode, setViewMode, onMenuClick }: DashboardHeaderProps) => {
  return (
    <header className="h-16 bg-[hsl(222,47%,14%)] border-b border-[hsl(222,47%,25%)] flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 lg:left-64 right-0 z-10">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)] transition-all duration-200 mr-2"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(215,20%,65%)]" />
        <Input
          type="text"
          placeholder="Search boards..."
          className="pl-10 pr-4 py-2 w-full bg-[hsl(222,47%,20%)] border-[hsl(222,47%,25%)] text-[hsl(210,40%,98%)] placeholder:text-[hsl(215,20%,65%)] focus:border-[hsl(174,72%,56%)] focus:ring-[hsl(174,72%,56%)]/20 rounded-lg"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Filter - Hidden on mobile */}
        <Button
          variant="ghost"
          className="hidden md:flex gap-2 text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)]"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden lg:inline">Filter</span>
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* View Toggle - Hidden on small mobile */}
        <div className="hidden sm:flex items-center bg-[hsl(222,47%,20%)] rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-[hsl(174,72%,56%)] text-[hsl(222,47%,11%)]"
                : "text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)]"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === "list"
                ? "bg-[hsl(174,72%,56%)] text-[hsl(222,47%,11%)]"
                : "text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)]"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[hsl(215,20%,65%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,20%)] transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[hsl(174,72%,56%)] rounded-full"></span>
        </button>

        {/* User Avatar */}
        <button className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(270,60%,65%)] to-[hsl(174,72%,56%)] flex items-center justify-center">
          <span className="text-[hsl(210,40%,98%)] font-semibold text-sm">JD</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
