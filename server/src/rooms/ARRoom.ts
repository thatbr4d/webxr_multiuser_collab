import { Room, Client } from "colyseus";
import { ARRoomState, Collaborator } from "./schema/ARRoomState";


export class ARRoom extends Room<ARRoomState> {

  onCreate (options: any) {
    this.setState(new ARRoomState());

  }

  onJoin(client: Client, options: any) {
    let collab = new Collaborator();
    collab.userName = options.name;

    this.state.collaborators.set(client.sessionId, collab);

    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.collaborators.has(client.sessionId)) {
      this.state.collaborators.delete(client.sessionId);
    }
    
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
