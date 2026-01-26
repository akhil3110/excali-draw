"use client"
import * as motion from "motion/react-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, MoveLeftIcon } from "lucide-react"
import Link from "next/link"
import { email, z } from "zod"
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
import axios from "axios"
import { backendUrl } from "@/config"
import { useState } from "react"


const formSchema = z.object({
    email: z.email().nonempty({
        message: "Please Enter valid Email"
    }),
    password: z.string().min(2, {
        message: "Please Enter Valid Password"
    })
})

const Login = () => {

    const router = useRouter() 
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const user = await axios.put(
                `${backendUrl}/sign-in`,
                {
                    email: values.email,
                    password: values.password
                },
                {
                    withCredentials: true
                }
            )

            // ✅ redirect ONLY on success
            return router.push("/")
        } catch (error: any) {
            // ✅ production-grade error handling
            const message =
                error?.response?.data?.message || "Invalid credentials"

            form.setError("root", {
                type: "manual",
                message
            })

            // ⛔ VERY IMPORTANT
            return
        }
}

    return ( 
        <div className="h-full w-full flex flex-row justify-center items-center bg-[hsl(222,47%,14%)]">
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    scale: { type: "spring", visualDuration: 0.5, bounce: 0.5 },
                }}
            >
                <Card
                    className="w-[350px] md:w-[400px] bg-[hsl(222,47%,20%)] border border-[hsl(222,47%,25%)]/50 shadow-2xl"
                >
                    <CardHeader className="text-[hsl(210,40%,98%)]">
                        <CardTitle>
                            <div className="flex flex-col gap-y-4">
                                <Link href="/" className="flex flex-row h-full items-center gap-x-1 cursor-pointer">
                                    <MoveLeftIcon className="h-3 w-3" />
                                    <div className="text-xs">
                                        Go Back
                                    </div>
                                </Link>
                                <div>
                                    Login to your account
                                </div>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Enter your details below to login to your account
                        </CardDescription>
                        <CardAction>
                            <Button 
                                onClick={() => router.push("/auth/sign-up")} 
                                variant="link"
                                className="cursor-pointer"
                            >
                                Sign Up
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={ ({field}) => (
                                        <FormItem>
                                            <FormLabel  className="text-[hsl(210,40%,98%)] font-semibold">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="text-[hsl(210,40%,98%)] font-semibold"
                                                    type="text" 
                                                    placeholder="email" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter Your Email
                                            </FormDescription>
                                        </FormItem>
                                    ) }
                                />
                                <FormField 
                                    control={form.control}
                                    name="password"
                                    render={ ({field}) => (
                                        <FormItem>
                                            <FormLabel  className="text-[hsl(210,40%,98%)] font-semibold">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        className="text-[hsl(210,40%,98%)] font-semibold" 
                                                        placeholder="Password" 
                                                        type={showPassword ? "text" : "password"}
                                                        {...field} 
                                                    />
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-white"
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Enter Your Password
                                            </FormDescription>
                                        </FormItem>
                                    ) }
                                />
                            <FormMessage  />
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        {form.formState.errors.root && (
                            <p className="min-h-[20px]  text-sm font-medium text-red-500 text-center">
                                {form.formState.errors.root.message}
                            </p>
                        )}
                        <Button 
                            form="login-form" 
                            variant="hero" 
                            type="submit" 
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                             {form.formState.isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
     );
}
 
export default Login;