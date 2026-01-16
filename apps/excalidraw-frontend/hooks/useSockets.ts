import { ws_backend_url } from "@/config";
import { useEffect, useState } from "react";

export function useSockets() {
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${ws_backend_url}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJnZ3hwNjhiNTYzd2ZraThscmlqM2l3cGkiLCJpYXQiOjE3Njg0NTk1MjQsImV4cCI6MTc2OTA2NDMyNH0.x9UieXFbSKqJYOTzjUXh3eAaR-u1Lo6Zx8E2qhfnSeQ`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    },[])

    return {socket,loading};
}