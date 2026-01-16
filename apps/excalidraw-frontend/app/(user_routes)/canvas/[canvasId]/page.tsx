"use client"
import { Button } from "@/components/ui/button";
import { draw } from "@/draw";
import { useEffect, useRef } from "react";
import { useParams } from 'next/navigation'
import { useSockets } from "@/hooks/useSockets";

const Canvas = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const params = useParams<{ canvasId: string }>()
    const {socket,loading} = useSockets()

    useEffect(() => {
        if (!canvasRef.current) return;
        if (!socket) return;
        if (!params.canvasId) return;
        
        
        const canvas = canvasRef.current;
        draw(canvas,params.canvasId,socket!);

        socket.send(JSON.stringify({
            type: 'join_room',
            roomId: params.canvasId
        }))

    },[socket,canvasRef])

    if(!params.canvasId){
        return <div>No Canvas ID Provided</div>
    }

    if(loading){
        return <div>Loading...</div>
    }

    return ( 
        <div className="relative">
            <div>{params.canvasId}</div>
            <canvas ref={canvasRef} className="bg-white" width={1080} height={600}></canvas>
            <div className="fixed top-16 bg-white p-5 right-[50%] translate-x-1/2 rounded-md shadow-md flex flex-row gap-x-2 items-center">
                <Button>Rectangle</Button>
                <Button>Circle</Button>
            </div>
        </div>
     );
}
 
export default Canvas;