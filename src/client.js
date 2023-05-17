import * as Colyseus from "colyseus.js";
import { AddCollaborator, RemoveCollaborator } from "./arsample";

export default class Client {
  createBtn;
  joinBtns;
  backBtn;

  constructor() {
    //var client = new Colyseus.Client("wss://webxrcollab.azurewebsites.net:2567");
    this.client = new Colyseus.Client("ws://localhost:2567");
    this.body = document.body;
    this.createJoinRoomWrapper = document.getElementById(
      "CreateJoinRoomWrapper"
    );

    this.joinBtns = document.getElementsByClassName("btnJoinRoom");
    this.createBtn = document.getElementById("BtnCreateRoom");
    this.backBtn = document.getElementById("BtnGoBack");

    this.codeInput = "";
    // this.codeInput = document.getElementById("RoomCode");
    this.goBack = document.getElementById("GoBackWrapper");
    this.roomInfo = document.getElementById("RoomInfo");
    this.roomCodeDisplay = document.getElementById("RoomCodeDisplay");
    this.userName = document.getElementById("UserName");
    this.modelName = "shiba";
  }



  get codeInputVal() {
    //return this.codeInput.value;
    return this.codeInput;
  }

  async getRooms() {
    var roomInfo = [];
    var rooms = await this.client.getAvailableRooms();
    rooms.forEach((room) => {
      console.log(rooms);
      roomInfo.push({ roomId: room.roomId, clients: room.clients });
    });

    return roomInfo;
  }

  async joinRoom(code) {
    if (code !== undefined && code !== "") {
      this.client
        .joinById(code, { name: this.userName.value, modelName: this.modelName })
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
        .create("ar_room", { name: this.userName.value, modelName: this.modelName })
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
    this.body.style.backgroundColor = "black";
    this.roomCodeDisplay.innerText = room.id;
    this.goBack.classList.remove("d-none");
    this.roomInfo.classList.remove("d-none");

    this.myKey = room.sessionId;

    room.state.collaborators.onAdd = function (collaborator, key) {
      if (key !== room.sessionId)
        AddCollaborator(key, collaborator.modelName, collaborator.userName);
    }

    room.state.collaborators.onRemove = function (collaborator, key) {
      if (key !== room.sessionId)
        RemoveCollaborator(key);
    }

  }
}
