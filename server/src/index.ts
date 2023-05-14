import express from "express";
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { ARRoom } from "./rooms/ARRoom";

const port = Number(process.env.PORT || 2567);
const app = express();

const arServer = new Server({
    server: createServer(app)
});

arServer.define('ar_room', ARRoom);

arServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);