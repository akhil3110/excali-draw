import { ws_backend_url } from "@/config";
import { useEffect, useState } from "react";

export function useSockets(token: string) {
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${ws_backend_url}?token=${token}`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    },[])

    return {socket,loading};
}