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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "@/config";
import toast from "react-hot-toast";
import useWhiteBoardStore from "@/store/whiteBoard-store";


const DeleteCanvasModal = () => {
    const { isOpen, onClose, type, data } = useModalStore();
    const isModalOpen = isOpen && type === "delte-canvas-modal";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {whiteboards, setWhiteboards} = useWhiteBoardStore()

    async function handleDeleteCanvas() {
      try {
        setIsLoading(true)
        const remainingCanvas =await axios.delete(`${backendUrl}/canvas/${data!.canvasId}`, {
          withCredentials: true,
        });
        setWhiteboards(remainingCanvas.data.canvas)
        setIsLoading(false)
        toast.success("Canvas deleted successfully")
        router.refresh()
        onClose()
      } catch (error) {
        toast.error("Something went wrong")
        setIsLoading(false)
        console.log(error)
      }
    }  
  
    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-neutral-800 text-white p-0 rounded-lg shadow-lg overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-xl text-center font-semibold text-white">
              Are you sure you want to Delete this Canvas?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="bg-neutral-900 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button
                onClick={() => onClose()}
                variant="ghost"
                className="bg-neutral-700 text-white hover:bg-neutral-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCanvas}
                disabled={isLoading}
                className="bg-red-600 text-white hover:bg-red-500"
              >
                Logout
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

export default DeleteCanvasModal;
  