import { ws_backend_url } from "@/config";
import { useEffect, useState } from "react";

export function useSockets() {
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${ws_backend_url}?token=eyJhbGciOiJIUzI1NiJ9.Z2d4cDY4YjU2M3dma2k4bHJpajNpd3Bp.a28uwf0oLUkn6SUfAVjpTB_P432aI8txJrRVQcuFU4A`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    },[])

    return {socket,loading};
}