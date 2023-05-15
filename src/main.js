import Client from "./client";
import { ARInit, ARAnimate } from "./arsample";

let client = new Client();

client.createBtn.onclick = async function (e) {
  if (await client.joinRoom()) {
    ARInit();
    ARAnimate();
  }
};

client.joinBtn.onclick = async function (e) {
  if (await client.joinRoom(client.codeInputVal)) {
    ARInit();
    ARAnimate();
  }
};
