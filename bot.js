const WebSocket = require('ws');
const {
  calcNearestPlayer,
  calcRotate,
  calcDistance,
  fire,
} = require('./functions');

// ws://tokyo.thuc.space/socket

const ws = new WebSocket('ws://localhost:8091/socket?key=bot&name=bot', {
  perMessageDeflate: false,
});

let myId;
let tick = 0;
let tickFire = 0;

ws.on('message', function incoming(message) {
  const msg = JSON.parse(message);
  if (msg.e === 'id') {
    myId = msg.data;
  }
  const { players, bullets } = msg.data;
  const milis = Date.now();
  if (milis - tick > 100) {
    ws.send(JSON.stringify({ e: 'throttle', data: 1 }));
    if (myId && msg.e === 'state') {
      tick = milis;
      try {
        const myPos = players.find((e) => e.id === myId);
        const nearestPlayer = calcNearestPlayer(myPos, players);
        const rotate = calcRotate(myPos, nearestPlayer);

        ws.send(JSON.stringify({ e: 'rotate', data: rotate * Math.PI }));
      } catch {}
    }
  }
});
