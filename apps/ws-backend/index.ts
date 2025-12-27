import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log("!")

wss.on('connection', function connection(ws) {

    ws.on('error', console.error);

    console.log("Websocket server connected")

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        ws.send(data.toString());
    });
});