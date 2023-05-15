import { Schema, Context, MapSchema, type } from "@colyseus/schema";

export class Collaborator extends Schema {
  @type("number") modelIndex: number = 0;
  @type("string") userName: string = "";
}

export class ARRoomState extends Schema {
  @type({ map: Collaborator }) collaborators = new MapSchema<Collaborator>();
}
