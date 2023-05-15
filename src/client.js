import * as Colyseus from "colyseus.js";

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
  }

  get codeInputVal() {
    return this.codeInput.value;
  }

  async joinRoom(code) {
    if (code !== undefined && code !== "") {
      this.client
        .joinById(code)
        .then((room) => {
          console.log(room);
          console.log(room.sessionId, "joined", room.name);

          this.createJoinRoomWrapper.style.display = "none";
          this.roomInfo.innerHTML = room.id;
        })
        .catch((e) => {
          console.log("JOIN ERROR", e);
        });

      return true;
    } else {
      this.client
        .create("ar_room")
        .then((room) => {
          console.log(room);
          console.log(room.sessionId, "joined", room.name);

          this.createJoinRoomWrapper.style.display = "none";
          this.roomInfo.innerHTML = room.id;
        })
        .catch((e) => {
          console.log("JOIN ERROR", e);
        });

      return true;
    }
  }
}
