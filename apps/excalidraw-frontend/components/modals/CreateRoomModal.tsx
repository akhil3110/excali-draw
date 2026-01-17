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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast";


const formSchema = z.object({
  room: z.string().min(2).max(50).nonempty(),
})

const CreateRoomModal = () => {
    const { isOpen, onClose, type } = useModalStore();
    const isModalOpen = isOpen && type === "create-room-modal";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        room: "",
      },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        const {room} = values
        setIsLoading(true)

        const newRoom = await axios.post(`${backendUrl}/create-canvas`, {
          name: room
        },{
          withCredentials: true
        })

        if(!newRoom.data.canvasId){
          toast.error("Something went wrong!")
          form.reset()
          onClose()
          return
        }

        form.reset()
        setIsLoading(false)
        onClose()
        router.push(`/canvas/${newRoom.data.canvasId}`)
      } catch (error) {
        toast.error("Something went wrong!")
        form.reset()
        onClose()
        console.log(error)
      }
    }

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
            <DialogTitle className="text-xl font-bold text-white">
              Create New White Board
            </DialogTitle>
            <DialogDescription>
              Enter Details to create a new board
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2 px-6">
            <Form {...form}>
              <form id="create-room-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField 
                  control={form.control}
                  name="room"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Room Name</FormLabel>
                      <FormControl>
                        <Input placeholder="room-1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter you room name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
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
                type="submit"
                form="create-room-form"
                disabled={isLoading}
                className="bg-green-600 text-white hover:bg-green-500"
              >
                Create
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

export default CreateRoomModal;
  