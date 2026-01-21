import { backendUrl } from "@/config";
import { getEmail, getUserId } from "@/lib/getDetails";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const AddUserInRoom = async({
    params
}: {
     params: Promise<{ canvasId: string, adminId: string }>;
}) => {

    const {canvasId} = await params;
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    

    const email = getEmail(token!);
    console.log(email)

    if(!email || !token){
        return (
            <div className="h-full w-full flex flex-row justify-center items-center">
                <h1>You need to be logged in to join this room</h1>
                <a href="/auth/sign-in" className=" underline text-amber-200">Sign in</a>
            </div>
        )
    }

    const joinRoom = await axios.put(`${backendUrl}/canvas/adduser/${canvasId}`,{
        email
    },{
        withCredentials: true
    }).then(( res ) => {
        return redirect(`/canvas/${canvasId}`)
    }).catch((error) => {
        console.log(error)
    })

    return (
       <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-neutral-950">
            <div className="w-10 h-10 border-4 border-neutral-700 border-t-green-500 rounded-full animate-spin" />
            <p className="text-sm text-neutral-400">
                Joining canvas...
            </p>
        </div>
    )
}
 
export default AddUserInRoom;