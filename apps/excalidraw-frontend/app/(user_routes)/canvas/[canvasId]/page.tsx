import CanvasBoard from "@/components/CanvasBoard";
import { getUserId } from "@/lib/getDetails";
import { isUserMemberOrAdmin } from "@/lib/isUserMember";
import { cookies } from "next/headers";

const Canvas = async ({
    params
}: {
     params: Promise<{ canvasId: string }>;
}) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const {canvasId} = await params;
    const userId = getUserId(token!);


    const hasAccess = await isUserMemberOrAdmin(
        userId,
        canvasId
    );

    if (!hasAccess) {
        return <div>You are not authorized to access this canvas</div>;
    }

    if(!canvasId){
        return <div>No Canvas ID Provided</div>
    }

    if(!token){
        return <div>Please log in to access the canvas.</div>
    }

    return ( 
        <CanvasBoard canvasId={canvasId} token={token} />
     );
}
 
export default Canvas;