import { Schema, Context, MapSchema, type } from "@colyseus/schema";

export class Collaborator extends Schema {
  @type("string") modelName: string = "";
  @type("string") userName: string = "";
}

export class ARRoomState extends Schema {
  @type({ map: Collaborator }) collaborators = new MapSchema<Collaborator>();
}
