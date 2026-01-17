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

const LogoutModal = () => {
    const { isOpen, onClose, type } = useModalStore();
    const isModalOpen = isOpen && type === "logout-modal";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        setIsLoading(true)
        await axios.post(`${backendUrl}/sign-out`, {}, {
          withCredentials: true
        });
        setIsLoading(false)
        router.push("/")
        router.refresh()
        onClose()
    }  
  
    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-neutral-800 text-white p-0 rounded-lg shadow-lg overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold text-white">
              Are you sure you want to logout?
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
                onClick={handleLogout}
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

export default LogoutModal;
  