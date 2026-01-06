import { http_backend_url } from "@/config";
import axios from "axios";
import { ChatRoomClient } from "./chatRoomClient";

interface ChatRoomProps {
  id: string;
}

async function getChats(roomId: string) {
    const response =await  axios.get(`${http_backend_url}/chats/${roomId}`);
    return response.data.messages;
}

export async function ChatRoom({id}: ChatRoomProps) {

    const messages = await getChats(id);


    return <ChatRoomClient messages={messages} id={id} />;
}