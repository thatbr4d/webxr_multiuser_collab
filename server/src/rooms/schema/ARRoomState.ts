import { Schema, Context, type } from "@colyseus/schema";

export class ARRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

}
