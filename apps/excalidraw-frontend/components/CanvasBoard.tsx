"use client"
import { draw } from "@/draw";
import { useSockets } from "@/hooks/useSockets"
import { useEffect, useRef } from "react"
import { Button } from "./ui/button";

interface CanvasBoardProps {
    canvasId: string;
    token: string;
}

const CanvasBoard = ({ canvasId, token }: CanvasBoardProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {socket,loading} = useSockets(token)

    useEffect(() => {
        if (!canvasRef.current) return;
        if (!socket) return;
        if (!canvasId) return;
        
        
        const canvas = canvasRef.current;
        draw(canvas,canvasId,socket!);

        socket.send(JSON.stringify({
            type: 'join_room',
            roomId: canvasId
        }))

    },[socket,canvasRef])

    if(!canvasId){
        return <div>No Canvas ID Provided</div>
    }

    if(loading){
        return <div>Loading...</div>
    }

    return ( 
        <div className="relative">
            <div>{canvasId}</div>
            <canvas ref={canvasRef} className="bg-white" width={1080} height={600}></canvas>
            <div className="fixed top-16 bg-white p-5 right-[50%] translate-x-1/2 rounded-md shadow-md flex flex-row gap-x-2 items-center">
                <Button>Rectangle</Button>
                <Button>Circle</Button>
            </div>
        </div>
     );
}
 
export default CanvasBoard;