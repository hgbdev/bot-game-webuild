const WebSocket = require('ws');
const {
  calcNearestPlayer,
  calcRotate,
  calcDistance,
  fire,
} = require('./functions');

// ws://tokyo.thuc.space/socket

const ws = new WebSocket('ws://tokyo.thuc.space/socket?key=hgb&name=hgb', {
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
        console.log('🚀 ~ file: index.js ~ line 26 ~ incoming ~ myPos', myPos);
        const nearestPlayer = calcNearestPlayer(myPos, players);
        const nearestDistance = calcDistance(myPos, nearestPlayer);
        const rotate = calcRotate(myPos, nearestPlayer);
        if (nearestDistance < 550) {
          if (milis - tickFire > 200) {
            fire(rotate, ws);
            tickFire = milis;
          }
          if (nearestDistance < 250) {
            ws.send(
              JSON.stringify({
                e: 'rotate',
                data: Math.abs(rotate - 1.75) * Math.PI,
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                e: 'rotate',
                data: Math.abs(rotate - 0.75) * Math.PI,
              })
            );
          }
        } else {
          ws.send(JSON.stringify({ e: 'rotate', data: rotate * Math.PI }));
        }
      } catch {}
    }
  }
});
