"use client";

import { useSockets } from "@/hooks/useSockets";
import { useEffect, useState } from "react";

interface ChatRoomClientProps {
    messages: {message: string}[];
    id: string
}


export function ChatRoomClient({
    messages,
    id
}: ChatRoomClientProps) {
    const {socket,loading} = useSockets()
    const [chats,setChats] = useState(messages);
    const [currentMessage,setCurrentMessage] = useState("")

    useEffect(() => {

        console.log("chats", chats)
        if(!loading && socket) {

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))

            const handler = (event: MessageEvent) => {
                try {
                    const parsedData = JSON.parse(event.data)
                    if (parsedData.type === "chat") {
                        setChats(c => [...c, { message: parsedData.message }])
                    }
                } catch {}
            }

            socket.addEventListener("message", handler)

            return () => {
                socket.removeEventListener("message", handler)
             }
        }

    },[socket,loading,id])

    return  (
        <div>
            {chats.map((chat,index) => (
                <div key={index}>{chat.message}</div>
            ))} 
            <input 
                type="text" 
                placeholder="Type a message..." 
                onChange={e => {
                    setCurrentMessage(e.target.value)
                }}
                value={currentMessage}
            >
            </input>
            <button 
                onClick={() => {
                    if(socket) {

                        const data = JSON.stringify({
                            type: "chat",
                            roomId: id,
                            message: currentMessage
                        });

                        socket.send(data)
                        setCurrentMessage("")
                    }
                }}
                className="bg-sky-600 p-2 m-2"
            >
                Send Message
            </button>
        </div>
    )
}