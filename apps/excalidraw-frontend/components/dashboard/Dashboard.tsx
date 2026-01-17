"use client"
import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import WhiteboardCard from "@/components/dashboard/WhiteboardCard";
import { Grid, List } from "lucide-react";

const whiteboards = [
  { id: 1, title: "Product Roadmap 2024", lastEdited: "5 min ago", collaborators: 4, isFavorite: true, isShared: true },
  { id: 2, title: "User Flow Diagram", lastEdited: "2 hours ago", collaborators: 2, isFavorite: false, isShared: true },
  { id: 3, title: "Design System", lastEdited: "Yesterday", collaborators: 6, isFavorite: true, isShared: false },
  { id: 4, title: "Sprint Planning", lastEdited: "2 days ago", collaborators: 8, isFavorite: false, isShared: true },
  { id: 5, title: "API Architecture", lastEdited: "3 days ago", collaborators: 3, isFavorite: false, isShared: false },
  { id: 6, title: "Marketing Campaign", lastEdited: "1 week ago", collaborators: 5, isFavorite: true, isShared: true },
  { id: 7, title: "Wireframes v2", lastEdited: "1 week ago", collaborators: 2, isFavorite: false, isShared: false },
  { id: 8, title: "Brainstorming Session", lastEdited: "2 weeks ago", collaborators: 10, isFavorite: false, isShared: true },
];

const Dashboard = ({
  name,
  token,
  userId
}: { name: string, token: string, userId: string }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full w-full bg-[hsl(222,47%,11%)]">
      {/* Sidebar */}
      <DashboardSidebar userId={userId} token={token} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <DashboardHeader 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content Area */}
        <main className="pt-16 p-4 lg:p-6">
          {/* Welcome Section */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-xl lg:text-2xl font-bold text-[hsl(210,40%,98%)] mb-1">
              Welcome back, {name}! 👋
            </h1>
            <p className="text-sm lg:text-base text-[hsl(215,20%,65%)]">
              Here's what's happening with your whiteboards today.
            </p>
          </div>

          {/* Stats
          <StatsCards /> */}

          {/* Whiteboards Section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[hsl(210,40%,98%)]">Your Boards</h2>
            <div className="flex flex-row gap-x-2">
              <div className="hidden sm:flex items-center bg-[hsl(222,47%,20%)] rounded-md p-1">
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
              <button className="text-sm text-[hsl(174,72%,56%)] hover:text-[hsl(174,72%,66%)] transition-colors">
                View all
              </button>
            </div>
          </div>
          
          <div className={`grid gap-4 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {whiteboards.map((board) => (
              <WhiteboardCard
                key={board.id}
                title={board.title}
                lastEdited={board.lastEdited}
                collaborators={board.collaborators}
                isFavorite={board.isFavorite}
                isShared={board.isShared}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
