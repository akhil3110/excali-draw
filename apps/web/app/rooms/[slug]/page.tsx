import { ChatRoom } from "@/components/chatRoom";
import { http_backend_url } from "@/config";
import axios from "axios";



async function getRoomDetails(roomId: string) {
  try {
    const response = await fetch(`${http_backend_url}/rooms/${roomId}`);

    console.log("Response status:", response.status);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    console.log("Room data:", data.roomDetails.id);
    return data.roomDetails.id;
  } catch (error) {
    console.error("Error fetching room details:", error);
    return null;
  }
}


export default async function RoomIdPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const roomId = await getRoomDetails(slug);

  if (!roomId) {
    return <div>Room not found</div>;
  }

  return (
    <ChatRoom id={roomId} />
  )
}
