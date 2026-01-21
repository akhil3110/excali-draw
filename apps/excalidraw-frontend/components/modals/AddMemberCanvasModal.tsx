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
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "@/config";
import { set, z } from "zod"
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
import { Check, Copy } from "lucide-react";
import { i } from "motion/react-client";


const formSchema = z.object({
  email: z.email().nonempty({
    message: "Enter a valid email address",
  }),
  link: z.string()
})

const AddMemberCanvasModal = () => {
    const { isOpen, onClose, type, data } = useModalStore();
    const isModalOpen = isOpen && type === "addMember-canvas-modal";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        link: "",
      },
    })

    useEffect(() => {
      if (isModalOpen && data?.canvasId) {
        form.reset({
          email: "",
          link: `https://.com/rooms/${data.canvasId}`,
      });
  }
}, [isModalOpen, data?.canvasId, form]);

    console.log(data)
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        setIsLoading(true)
        const {email} = values
        const AddMember =  await axios.put(`${backendUrl}/canvas/adduser/${data!.canvasId}`,{
            email
        },{
            withCredentials: true
        }).then(( res ) => {
            console.log(res)
            if(res.data.userNotExists){
                form.reset()
                onClose()
                setIsLoading(false)
                return toast.error("User not found")
            }

            if(res.data.userAlreadyMember){
                form.reset()
                onClose()
                setIsLoading(false)
                return toast.error("User already member")
            }

            form.reset()
            onClose()
            setIsLoading(false)
            return toast.success("Member added to canvas")
        }).catch((error) => {
            toast.error("Something went wrong!")
            form.reset()
            onClose()
            console.log(error)
        })
        


      } catch (error) {
        toast.error("Something went wrong!")
        form.reset()
        onClose()
        console.log(error)
      }
    }

    const handleCopy = async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Link copied");

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      } catch (err) {
        toast.error("Failed to copy");
      }
    };

    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-neutral-800 text-white p-0 rounded-lg shadow-lg overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-xl font-bold text-white">
              Add  New Member to your Canvas            
            </DialogTitle>
            <DialogDescription>
              Enter email of the member to add
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2 px-6">
            <Form {...form}>
              <form id="create-room-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField 
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="a1@gmial.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter email of the member to add
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
  control={form.control}
  name="link"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Link</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            readOnly
            {...field}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => handleCopy(field.value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </FormControl>
      <FormDescription>
        Share this link to invite members
      </FormDescription>
    </FormItem>
  )}
/>
              </form>
              <FormMessage />
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
                Add Member
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

export default AddMemberCanvasModal;
  