"use client"
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WhiteboardCard from "@/components/dashboard/WhiteboardCard";
import { Grid, List } from "lucide-react";
import useWhiteBoardStore from "@/store/whiteBoard-store";
import { backendUrl } from "@/config";
import axios from "axios";
import toast from "react-hot-toast";
import useModalStore from "@/store/modal-store";
import useMemberWhiteBoardStore from "@/store/memberWhiteBoard-store";
import { useShowCanvasStore } from "@/store/showCanvas-store";

// const whiteboards = [
//   { id: 1, title: "Product Roadmap 2024", lastEdited: "5 min ago", collaborators: 4, isFavorite: true, isShared: true },
//   { id: 2, title: "User Flow Diagram", lastEdited: "2 hours ago", collaborators: 2, isFavorite: false, isShared: true },
//   { id: 3, title: "Design System", lastEdited: "Yesterday", collaborators: 6, isFavorite: true, isShared: false },
//   { id: 4, title: "Sprint Planning", lastEdited: "2 days ago", collaborators: 8, isFavorite: false, isShared: true },
//   { id: 5, title: "API Architecture", lastEdited: "3 days ago", collaborators: 3, isFavorite: false, isShared: false },
//   { id: 6, title: "Marketing Campaign", lastEdited: "1 week ago", collaborators: 5, isFavorite: true, isShared: true },
//   { id: 7, title: "Wireframes v2", lastEdited: "1 week ago", collaborators: 2, isFavorite: false, isShared: false },
//   { id: 8, title: "Brainstorming Session", lastEdited: "2 weeks ago", collaborators: 10, isFavorite: false, isShared: true },
// ];


 

const Dashboard = ({
  name,
  token,
  userId
}: { name: string, token: string, userId: string }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {whiteboards, setWhiteboards} = useWhiteBoardStore()
  const {memberWhiteboards, setMemberWhiteboards} = useMemberWhiteBoardStore()
  const {onOpen} = useModalStore()
  const { view } = useShowCanvasStore();

  const showCreated = view==="all" || view === "created";
  const showMember =  view==="all" || view === "member";

  useEffect(() => {

    async function getWhiteBoard(){
      try {
        setLoading(true)
        const data = await axios.get(`${backendUrl}/canvas`,{
          withCredentials: true,
        })
        
        if(!data.data){
          toast.error("Something went wrong")
          return
        }
        

        console.log(data.data)
        if(data.data.canvases){
          setWhiteboards(data.data.canvases)
        }

        if(data.data.memberCanvas){
          setMemberWhiteboards(data.data.memberCanvas)
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
      }

    }

    getWhiteBoard()

  },[])

  async function handleCreateCanvas(){
    onOpen("create-room-modal")
  }



  return (
    <div className="h-full w-full bg-[hsl(222,47%,11%)]">
      {/* Sidebar */}
      <DashboardSidebar 
        name={name} 
        userId={userId} 
        token={token} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        count={whiteboards.length+memberWhiteboards.length} 
        yourBoard={whiteboards.length}
        invitedBoard={memberWhiteboards.length}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <DashboardHeader 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          onMenuClick={() => setSidebarOpen(true)}
          token={token} 
        />

        {/* Content Area */}
        <main className="pt-16 p-4 lg:p-6 scroll-auto">
          {/* Welcome Section */}
          <div className="mb-6 lg:mb-8 flex flex-row justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-[hsl(210,40%,98%)] mb-1">
                Welcome back, {name}! 👋
              </h1>
              <p className="text-sm lg:text-base text-[hsl(215,20%,65%)]">
                Here's what's happening with your whiteboards today.
              </p>
            </div>
            <div className={`flex items-center mb-4 justify-between`}>
              <div className="flex flex-row gap-x-3">
                <div className="hidden sm:flex items-center bg-[hsl(222,47%,20%)] rounded-md p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-[hsl(174,72%,56%)] text-[hsl(222,47%,11%)]"
                      : "text-[hsl(215,20%,65%)] hover:text-[hsl(165,40%,98%)]"
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
              </div>
            </div>    
          </div>

          {/* Stats
          <StatsCards /> */}

          {loading && (
            <div className="h-full w-full flex items-center justify-center bg-[hsl(222,47%,11%)]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[hsl(174,72%,56%)] border-t-transparent" />
                <p className="text-sm text-[hsl(215,20%,65%)]">
                  Loading your whiteboards...
                </p>
              </div>
            </div>
          )}

          {/* Whiteboards Section */}
            
          {whiteboards.length>0 && showCreated  && ( 
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[hsl(210,40%,98%)]">Your Boards</h2>
              </div>
            
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
              }`}
            >
              {whiteboards.map((board) => (
                <WhiteboardCard 
                  key={board.id}
                  id={board.id}
                  title={board.name}
                  collaborators={Number(board.canvasUsers.length+1)}
                  isFavorite={board.isFavorite}
                  isShared={board.isShared}
                  isAdmin = {board.adminId === userId}
                  email= {board.admin.email}
                  members={board.canvasUsers}
                />
              ))}
            </div>
            </div>
          )}
              
            

          {/* Member Section */}
          {memberWhiteboards.length > 0 && showMember && (
            <div className=" mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[hsl(210,40%,98%)]">Boards you are a member of</h2>
              </div>
          
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
                }`}>
                  {memberWhiteboards.map((board) => (
                    <WhiteboardCard 
                      key={board.id}
                      id={board.id}
                      title={board.name}
                      collaborators={Number(board.canvasUsers.length+1)}
                      isFavorite={board.isFavorite}
                      isShared={board.isShared}
                      isAdmin = {board.adminId === userId}
                    />
                  ))}
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
