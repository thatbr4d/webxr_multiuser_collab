import * as Colyseus from "colyseus.js";
import { AddCollaborator, RemoveCollaborator } from "./arsample";

export default class Client {
  createBtn;
  joinBtn;

  constructor() {
    //var client = new Colyseus.Client("wss://webxrcollab.azurewebsites.net:2567");
    this.client = new Colyseus.Client("ws://localhost:2567");

    this.createJoinRoomWrapper = document.getElementById(
      "CreateJoinRoomWrapper"
    );

    this.joinBtn = document.getElementById("BtnJoinRoom");
    this.createBtn = document.getElementById("BtnCreateRoom");

    this.codeInput = document.getElementById("RoomCode");
    this.roomInfo = document.getElementById("RoomInfo");
    this.userName = document.getElementById("UserName");
  }

  get codeInputVal() {
    return this.codeInput.value;
  }

  async joinRoom(code) {
    if (code !== undefined && code !== "") {
      this.client
        .joinById(code, {name: this.userName.value})
        .then((room) => {
          console.log(room);

          this.initializeRoom(room);
        })
        .catch((e) => {
          console.log("JOIN ERROR", e);
        });

      return true;
    } else {
      this.client
        .create("ar_room", {name: this.userName.value})
        .then((room) => {
          console.log(room);

          this.initializeRoom(room);
        })
        .catch((e) => {
          console.log("JOIN ERROR", e);
        });

      return true;
    }
  }

  initializeRoom(room) {
    this.createJoinRoomWrapper.style.display = "none";
    this.roomInfo.innerHTML = room.id;
    
    this.myKey = room.sessionId;

    room.state.collaborators.onAdd = function (collaborator, key) {
      if(key !== room.sessionId)
        AddCollaborator(key, collaborator.modelIndex, collaborator.userName);
    }

    room.state.collaborators.onRemove = function (collaborator, key) {
      if(key !== room.sessionId)
        RemoveCollaborator(key);
    }

  }
  

}
