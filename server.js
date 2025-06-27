const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const games = {}; // Stores active games and their players
const playerNames = {}; // { CODE: [name1, name2, ...] }

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createGame", (code) => {
        games[code] = [socket.id];
        playerNames[code] = [];
        socket.join(code);
    });

    socket.on("joinGame", (code) => {
        if (games[code]) {
        games[code].push(socket.id);
        socket.join(code);
        }
    });

    socket.on("submitName", ({ code, name }) => {
        if (playerNames[code]) {
        playerNames[code].push(name);
        io.to(code).emit("updatePlayerList", playerNames[code]);
        }
    });

    socket.on("disconnect", () => {
        // Optional: clean up logic later
    });
});

server.listen(3000, () => {
    console.log("Game Show server running on http://localhost:3000");
});
