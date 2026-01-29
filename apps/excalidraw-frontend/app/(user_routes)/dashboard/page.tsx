import Dashboard from "@/components/dashboard/Dashboard";
import { getName, getUserId } from "@/lib/getDetails";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value;
  
  if(!token){
    return <div>Please login to access dashboard</div>
  }

  const name = getName(token)
  const userId = getUserId(token!);
  return (
    <Dashboard name={name} token={token} userId={userId} />
  )
}
