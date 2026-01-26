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
        <div className="pt-16">
            {children}
        </div>
    )
}

export default DashboardLayout;