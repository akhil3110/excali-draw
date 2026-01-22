import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { verifyToken } from "@/lib/verifyToken";
import toast from "react-hot-toast";



const UserLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/auth/sign-in");
    }

    const tokenVerified = verifyToken(token);
   
    if(!tokenVerified){
        cookieStore.delete("token")
        toast.success("Your token has expired. Please sign in again.")
        redirect("/auth/sign-in");
    }

    return (
        <div className="h-full">
            <Navbar token={token} />
            <main className="pt-16 text-[hsl(215,20%,65%)]" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(174,72%,56%,0.15), transparent)' }}>
                {children}
            </main>
        </div>
    )
}

export default UserLayout;