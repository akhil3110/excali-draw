import CanvasBoard from "@/components/CanvasBoard";
import { cookies } from "next/headers";

const Canvas = async ({
    params
}: {
     params: Promise<{ canvasId: string }>;
}) => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value;

    const {canvasId} = await params;
    console.log("Canvas ID:", canvasId);

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