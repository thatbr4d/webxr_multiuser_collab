import express from "express";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { ARRoom } from "./rooms/ARRoom";

const port = Number(process.env.PORT || 2567);
const app = express();
app.use("/servermonitor", monitor());

const arServer = new Server({
    server: createServer(app)
});

arServer.define('ar_room', ARRoom);

arServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);