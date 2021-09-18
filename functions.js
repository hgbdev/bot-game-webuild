function pow2(num) {
  return Math.pow(num, 2);
}

function calcDistance(myPos, player) {
  return Math.sqrt(pow2(myPos.x - player.x) + pow2(myPos.y - player.y));
}

function calcNearestPlayer(myPos, arr) {
  const players = arr.filter((e) => e.id !== myPos.id);
  let nearest = players[0];
  if (players.length > 1)
    for (let i = 1; i < players.length; i++) {
      if (calcDistance(myPos, players[i]) < calcDistance(myPos, nearest)) {
        nearest = players[i];
      }
    }
  return nearest;
}

function calcRotate(myPos, player) {
  const width = Math.abs(myPos.x - player.x);
  const height = Math.abs(myPos.y - player.y);
  const degrees = (Math.atan(height / width) * 180) / Math.PI;
  const tmp = (degrees * 0.5) / 90;
  if (myPos.x <= player.x && myPos.y <= player.y) {
    return tmp;
  } else if (myPos.x > player.x && myPos.y <= player.y) {
    return 0.5 - tmp + 0.5;
  } else if (myPos.x > player.x && myPos.y > player.y) {
    return tmp + 1;
  } else if (myPos.x <= player.x && myPos.y > player.y) {
    return 0.5 - tmp + 1.5;
  }

  return 0;
}

function fire(rotate, ws) {
  ws.send(JSON.stringify({ e: 'rotate', data: Math.abs(rotate) * Math.PI }));
  ws.send(JSON.stringify({ e: 'fire' }));
}

module.exports = { calcNearestPlayer, calcRotate, calcDistance, fire };
