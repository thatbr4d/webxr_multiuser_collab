import * as THREE from "three";
import * as Colyseus from "colyseus.js";

var client = new Colyseus.Client("ws://webxrcollab.azurewebsites.net:2567");

client
  .joinOrCreate("ar_room")
  .then((room) => {
    console.log(room);
    console.log(room.sessionId, "joined", room.name);
  })
  .catch((e) => {
    console.log("JOIN ERROR", e);
  });
