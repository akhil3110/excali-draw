import WebSocket, { WebSocketServer } from 'ws';
import jwt, { type JwtPayload } from "jsonwebtoken"
import { JWT_SECERET } from '@repo/backend-common/secret';
import {pushMessage} from "@repo/redis/queue"
import { redisPublisher } from '@repo/redis/client';

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket
    rooms: string[],
    userId: string
}

const users: User[] = []



function CheckUser (token: string) {
    try {
        const decoded = jwt.verify(token,JWT_SECERET) as JwtPayload;
        if(!decoded){
            return null;
        }
    
        return decoded.userId
    } catch (error) {
        console.log(error)
        return null
    }
}

wss.on('connection', function connection(ws,request) {

    console.log("New websocket connection")

    const url= request.url
    if(!url){
        return
    }

    const queryparams = new URLSearchParams(url.split('?')[1])
    const token  = queryparams.get("token")

    console.log(token)
    if(!token){
        ws.close();
        return
    }
    
    const UserId = CheckUser(token)
    console.log("UserId:",UserId)
    if(!UserId){
        console.log("user Disconected")
        ws.close()
        return
    }

    users.push({
        userId: UserId.toString(),
        rooms: [],
        ws
    })

    ws.on('error', console.error);

    console.log("Websocket server connected")

    ws.on('message', async function msg(data) {

        const parsedData = JSON.parse(data as unknown as string);
        console.log(parsedData)

//         {
//              type: "join_room",
//              roomId: 1
//          }
        if(parsedData.type === "join_room"){
            users.find((u) =>  u.ws === ws)?.rooms.push(parsedData.roomId)
            ws.send("User %s" + UserId +" joined "+ parsedData.roomId)
            
        }

        if (parsedData.type === "leave_room") {
            const user = users.find(u => u.ws === ws)
            if (!user) return

            user.rooms = user.rooms.filter(
                roomId => roomId !== parsedData.roomId
            )
        }


        // {
        //     "type": "chat",
        //     "roomId": 1,
        //     "message": "Hello everyone"
        // }
        if(parsedData.type === "chat"){
            try {
                console.log("chat recieved")
            const roomId  = parsedData.roomId
            const message = parsedData.message

            //queu implementetion
           const payload = {
                message,
                roomId,
                userId: UserId
            };
            users.forEach((u) => {
                if(u.rooms.includes(roomId) && u.ws != ws){
                    u.ws.send(JSON.stringify({
                        type: "chat",
                        roomId: Number(roomId),
                        message,
                    }))
                    // u.ws.send(message)
                }
            })

            pushMessage(payload);
            } catch (error) {
                console.log("chat:",error)
            }
        }
        

        ws.send(data.toString());

    });
});