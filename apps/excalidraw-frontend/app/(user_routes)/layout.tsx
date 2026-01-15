import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

const UserLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    return (
        <div className="min-h-screen">
            <Navbar token={token} />
            <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 text-[hsl(215,20%,65%)]" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(174,72%,56%,0.15), transparent)' }}>
                {children}
            </main>
        </div>
    )
}

export default UserLayout;