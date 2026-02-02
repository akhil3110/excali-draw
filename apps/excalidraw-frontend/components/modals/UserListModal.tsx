"use client";
import useModalStore from "@/store/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "@/config";
import toast from "react-hot-toast";
import ActionTooltip from "../action-tooltip";
import { Trash } from "lucide-react";


const UserListModal = () => {
    const { isOpen, onClose, type, data } = useModalStore();
    const isModalOpen = isOpen && type === "user-list-modal";
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter()


    useEffect(() => {},[])

    async function handleRemoveMember(memberId: string, canvasId: number) {
      toast.success("Member removed successfully",{
        position: "bottom-right"
      })
      onClose()
      try {
        setIsLoading(true)
        const deleteUser =await axios.delete(`${backendUrl}/canvas/deleteUser/${canvasId}/${memberId}`, {
          withCredentials: true,
        });
      } catch (error) {
        toast.error("Something went wrong")
        setIsLoading(false)
        console.log(error)
      } finally {
        setIsLoading(false)
        toast.success("User Remover successfully",{
          position: "bottom-right"
        })
        router.refresh()
        onClose()
      }
    }
  
    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-neutral-800 text-white p-0 rounded-lg shadow-lg overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-xl text-center font-semibold text-white">
              Manage Members
            </DialogTitle>
          </DialogHeader>
          <div className="theme-scrollbar max-h-[50vh] overflow-y-auto px-6 pb-4">
            <div className="space-y-2">
                {data?.members?.map((m) => (
                    <div
                      key={m.id}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 bg-neutral-800/60 hover:bg-neutral-700/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center font-semibold text-xs uppercase"
                        >
                          {m.user.name[0]} {data.canvasId}
                        </div>
                        <div className="flex flex-col"> 
                          <span className="text-sm font-medium text-white">
                            {m.user.name}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {m.user.email}
                          </span>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleRemoveMember(m.memberId, m.canvasId)}
                          disabled={isLoading}
                          className=" opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-500/10  transition">
                            <ActionTooltip label="Delete Member" side="right">
                              <Trash className="w-4 h-4" />
                            </ActionTooltip>
                          </button>
                      </div>
                      
                    </div>  
                  ))}
              </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

export default UserListModal;
  