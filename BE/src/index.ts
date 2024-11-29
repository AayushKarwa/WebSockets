import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    roomid: string;
}

interface JoinMessage {
    type: "join";
    payload: {
        roomid: string;
    };
}

interface ChatMessage {
    type: "chat";
    payload: {
        roomid: string;
        message: string;
    };
}

type Message = JoinMessage | ChatMessage;

const allSockets: User[] = []; // [{socket1 , roomid: 12}, {socket2, roomid:13}]

wss.on("connection", (socket) => {
    console.log("User connected!");

    socket.on("message", (message) => {
        // The message response will always be in string or binary.
        // To get the JSON data, we need to parse it.
        const parsedMessage: Message = JSON.parse(message.toString());

        if (parsedMessage.type === "join") {
            const { roomid } = parsedMessage.payload;
            allSockets.push({ socket, roomid });
            socket.send(`You joined room: ${roomid} successfully`);
        }

        if (parsedMessage.type === "chat") {
            const { roomid, message } = parsedMessage.payload;

            const currentUser = allSockets.find((i) => i.socket === socket);
            const currentUserRoom = currentUser?.roomid;

            if (currentUserRoom === roomid) {
                allSockets
                    .filter((user) => user.roomid === roomid)
                    .forEach((el) => {
                        el.socket.send(message);
                    });
            } else {
                socket.send(`You haven't joined room: ${roomid}`);
            }
        }
    });
});
