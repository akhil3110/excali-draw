import { WebSocketServer } from 'ws';
import jwt, { type JwtPayload } from "jsonwebtoken"
import { JWT_SECERET } from './config';

const wss = new WebSocketServer({ port: 8080 });

console.log("!")

wss.on('connection', function connection(ws,request) {

    const url= request.url
    if(!url){
        return
    }

    const queryparams = new URLSearchParams(url.split('?')[1])
    const token  = queryparams.get("token") || ""
    
    const decoded = jwt.verify(token,JWT_SECERET) as JwtPayload

    if(!decoded || !decoded.userId){
        ws.close();
        return
    }

    ws.on('error', console.error);

    console.log("Websocket server connected")

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        ws.send(data.toString());
    });
});