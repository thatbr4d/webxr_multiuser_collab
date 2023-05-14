import { Room, Client } from "colyseus";
import { ARRoomState } from "./schema/ARRoomState";

export class ARRoom extends Room<ARRoomState> {

  onCreate (options: any) {
    this.setState(new ARRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
