import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Sketch flow is a collaborative whiteboard tool for designers and developers.",
  icons: {
    icon: "/favicon.ico",
  },
};


const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
   
    return (
        <div className="h-full w-full">
            {children}
        </div>
    )
}

export default DashboardLayout;