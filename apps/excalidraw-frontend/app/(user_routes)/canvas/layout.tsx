import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verifyToken";
import toast from "react-hot-toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sketch Flow",
  description: "Your Canvas",
  icons: {
    icon: "/favicon.ico",
  },
};

const CanvasLayout = async ({
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
        <div className="h-full w-full overflow-hidden">
            <main className="pt-16 text-[hsl(215,20%,65%)]" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(174,72%,56%,0.15), transparent)' }}>
                {children}
            </main>
        </div>
    )
}

export default CanvasLayout;