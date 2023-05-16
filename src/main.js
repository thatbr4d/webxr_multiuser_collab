import Client from "./client";
import { ARInit, ARAnimate } from "./arsample";

let client = new Client();

client.createBtn.onclick = async function (e) {
  if (await client.joinRoom()) {
    ARInit();
    ARAnimate();
  }
};

// client.joinBtn.onclick = async function (e) {
//   if (await client.joinRoom(client.codeInputVal)) {
//     ARInit();
//     ARAnimate();
//   }
// };

client.backBtn.onclick = function (e) {
  window.location.reload();
};


var EXISTING_ROOMS_DATATABLE;
$(document).ready(function () {
  EXISTING_ROOMS_DATATABLE = $('#ExistingRoomsTable').DataTable({
    dom: "",
    responsive: true,
    autoWidth: false,
    paging: false,
    ordering: false,
    language: {
      "emptyTable": "No Rooms Available"
    },
    columnDefs: [
      {
        targets: [2],
        width: "50px",
        render: function (data, type, row, meta) {
          return '<button type="button" class="btn btn-secondary btn-sm btnJoinRoom" data-room-code="' + data + '"><span class="bi-people"></span> Join Room</button>';
        }
      }
    ]
  });

  setExistingRoomTable();
});


async function setExistingRoomTable() {

  var roomInfo = await client.getRooms();

  roomInfo.forEach((info) => {
    EXISTING_ROOMS_DATATABLE.row.add([info.roomId, info.clients, info.roomId]).draw(false);
  });
}

$(document).on('click', '.btnJoinRoom', function () {
  client.codeInput = $(this).data('room-code');
  joinRoom();
});

async function joinRoom(roomCode) {
  if (await client.joinRoom(client.codeInputVal)) {
    ARInit();
    ARAnimate();
  }
}