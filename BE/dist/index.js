"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const allSockets = []; // [{socket1 , roomid: 12}, {socket2, roomid:13}]
wss.on("connection", (socket) => {
    console.log("User connected!");
    socket.on("message", (message) => {
        // The message response will always be in string or binary.
        // To get the JSON data, we need to parse it.
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "join") {
            const { roomid } = parsedMessage.payload;
            allSockets.push({ socket, roomid });
            socket.send(`You joined room: ${roomid} successfully`);
        }
        if (parsedMessage.type === "chat") {
            const { roomid, message } = parsedMessage.payload;
            const currentUser = allSockets.find((i) => i.socket === socket);
            const currentUserRoom = currentUser === null || currentUser === void 0 ? void 0 : currentUser.roomid;
            if (currentUserRoom === roomid) {
                allSockets
                    .filter((user) => user.roomid === roomid)
                    .forEach((el) => {
                    el.socket.send(message);
                });
            }
            else {
                socket.send(`You haven't joined room: ${roomid}`);
            }
        }
    });
});
