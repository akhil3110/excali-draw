import Dashboard from "@/components/dashboard/Dashboard";
import { getName } from "@/lib/getDetails";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value;

  console.log("Dashboard token:", token);
  if(!token){
    return <div>Please login to access dashboard</div>
  }

  const name = getName(token)
  return (
    <Dashboard name={name} />
  )
}
