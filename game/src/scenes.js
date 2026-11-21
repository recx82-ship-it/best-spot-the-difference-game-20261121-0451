// Five original pictures, each drawn from code (canvas shapes only, no
// image files). A scene is drawn twice — variant 0 on the left, variant 1
// on the right — and the seven differences are the places where the two
// variants disagree. Every difference lists its centre and radius in the
// scene's own 600x440 space, which the click test uses directly.
function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function text(ctx, value, x, y, size, color, align = 'center') {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

// ---------------------------------------------------------------------------
// Scene 1 — Sunny Garden
// ---------------------------------------------------------------------------
function drawGarden(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#6ec1f5');
  sky.addColorStop(1, '#d8f1fd');
  rect(ctx, 0, 0, 600, 300, sky);
  rect(ctx, 0, 300, 600, 140, '#79c94f');
  ellipse(ctx, 300, 315, 320, 42, '#6ab844');

  // Sun (top left). In variant 1 it wears sunglasses.
  circle(ctx, 80, 70, 38, '#ffd93b');
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    line(ctx, 80 + Math.cos(a) * 46, 70 + Math.sin(a) * 46, 80 + Math.cos(a) * 58, 70 + Math.sin(a) * 58, '#ffd93b', 5);
  }
  if (v === 1) {
    circle(ctx, 66, 66, 10, '#222');
    circle(ctx, 94, 66, 10, '#222');
    line(ctx, 76, 66, 84, 66, '#222', 4);
  }
  // Clouds.
  ellipse(ctx, 210, 58, 52, 20, '#ffffff');
  ellipse(ctx, 240, 48, 38, 18, '#ffffff');
  ellipse(ctx, 520, 108, 46, 17, '#ffffff');
  // Bird (variant 1: gone).
  if (v === 0) {
    line(ctx, 400, 62, 412, 54, '#333', 3);
    line(ctx, 412, 54, 424, 62, '#333', 3);
    line(ctx, 436, 70, 448, 62, '#333', 3);
    line(ctx, 448, 62, 460, 70, '#333', 3);
  }
  // House.
  rect(ctx, 120, 210, 170, 120, '#f7d9a0');
  poly(ctx, [[105, 212], [205, 150], [305, 212]], '#d96a4f');
  rect(ctx, 185, 260, 40, 70, '#8b5a2b');
  circle(ctx, 218, 298, 4, '#ffd93b');
  rect(ctx, 140, 228, 44, 44, '#bfe3f2');
  rect(ctx, 246, 228, 44, 44, '#bfe3f2');
  line(ctx, 162, 228, 162, 272, '#8b5a2b', 3);
  line(ctx, 140, 250, 184, 250, '#8b5a2b', 3);
  line(ctx, 268, 228, 268, 272, '#8b5a2b', 3);
  line(ctx, 246, 250, 290, 250, '#8b5a2b', 3);
  // Curtains in the left window (variant 1: plain glass).
  if (v === 0) {
    rect(ctx, 140, 228, 10, 44, '#e2574c');
    rect(ctx, 174, 228, 10, 44, '#e2574c');
  }
  // Tree with apples (variant 1: one apple fewer).
  rect(ctx, 508, 220, 22, 110, '#7a4a21');
  circle(ctx, 470, 205, 42, '#3f9e3f');
  circle(ctx, 540, 195, 46, '#4cb04c');
  circle(ctx, 505, 165, 44, '#57b957');
  circle(ctx, 472, 212, 9, '#e23b3b');
  if (v === 0) circle(ctx, 520, 190, 9, '#e23b3b');
  circle(ctx, 544, 222, 9, '#e23b3b');
  // Butterfly (variant 1: flown away).
  if (v === 0) {
    ellipse(ctx, 470, 88, 12, 16, '#ff7ad9');
    ellipse(ctx, 492, 88, 12, 16, '#ff7ad9');
    ellipse(ctx, 472, 106, 9, 12, '#c94bff');
    ellipse(ctx, 490, 106, 9, 12, '#c94bff');
    line(ctx, 481, 82, 481, 104, '#333', 2);
  }
  // Path of stepping stones from the door (variant 1: middle stone gone).
  ellipse(ctx, 205, 345, 26, 10, '#cfc4b4');
  if (v === 0) ellipse(ctx, 200, 375, 26, 10, '#cfc4b4');
  ellipse(ctx, 205, 405, 26, 10, '#cfc4b4');
  // Flowers along the bottom (variant 1: the middle one is purple).
  const flowerXs = [60, 140, 220, 300, 380, 460, 540];
  for (let i = 0; i < flowerXs.length; i += 1) {
    const fx = flowerXs[i];
    const petal = i === 3 ? (v === 0 ? '#e23b3b' : '#8b5cf6') : ['#ff8fb3', '#ffb703', '#ff8fb3', '#e23b3b', '#ff8fb3', '#ffb703', '#ff8fb3'][i];
    line(ctx, fx, 385, fx, 415, '#2f7d32', 4);
    for (let p = 0; p < 5; p += 1) {
      const a = (p * Math.PI * 2) / 5;
      circle(ctx, fx + Math.cos(a) * 10, 378 + Math.sin(a) * 10, 7, petal);
    }
    circle(ctx, fx, 378, 7, '#ffd93b');
  }
}

// ---------------------------------------------------------------------------
// Scene 2 — Cosy Kitchen
// ---------------------------------------------------------------------------
function drawKitchen(ctx, v) {
  rect(ctx, 0, 0, 600, 300, '#f3e2c7');
  rect(ctx, 0, 300, 600, 140, '#c89b6a');
  rect(ctx, 0, 296, 600, 6, '#a67c52');
  // Window with sky (variant 1: curtains drawn shut).
  rect(ctx, 80, 60, 140, 140, '#8ec9ee');
  circle(ctx, 190, 95, 20, '#ffd93b');
  ellipse(ctx, 120, 90, 26, 10, '#ffffff');
  rect(ctx, 80, 60, 140, 140, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 6;
  ctx.strokeRect(80, 60, 140, 140);
  line(ctx, 150, 60, 150, 200, '#8b5a2b', 4);
  line(ctx, 80, 130, 220, 130, '#8b5a2b', 4);
  if (v === 0) {
    poly(ctx, [[72, 52], [108, 52], [96, 200], [72, 200]], '#e2574c');
    poly(ctx, [[228, 52], [192, 52], [204, 200], [228, 200]], '#e2574c');
  } else {
    rect(ctx, 80, 60, 70, 140, '#e2574c');
    rect(ctx, 150, 60, 70, 140, '#c94a41');
  }
  // Wall clock (variant 1: it reads five o'clock, not three).
  circle(ctx, 300, 90, 36, '#ffffff');
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 90, 36, 0, Math.PI * 2);
  ctx.stroke();
  line(ctx, 300, 90, 300, 62, '#333', 4);
  if (v === 0) line(ctx, 300, 90, 326, 90, '#333', 4);
  else line(ctx, 300, 90, 322, 108, '#333', 4);
  circle(ctx, 300, 90, 4, '#333');
  // Shelf with three jars (variant 1: the middle jar is gone).
  rect(ctx, 380, 130, 200, 10, '#8b5a2b');
  const jar = (x) => {
    rect(ctx, x, 92, 34, 38, '#bfe3f2');
    rect(ctx, x, 92, 34, 10, '#e2574c');
  };
  jar(410);
  if (v === 0) jar(465);
  jar(520);
  // Table, teapot and steam (variant 1: no steam).
  rect(ctx, 90, 300, 420, 16, '#8b5a2b');
  rect(ctx, 110, 316, 14, 60, '#6d4520');
  rect(ctx, 476, 316, 14, 60, '#6d4520');
  ellipse(ctx, 200, 282, 34, 26, '#4a90d9');
  rect(ctx, 192, 250, 16, 14, '#4a90d9');
  poly(ctx, [[232, 272], [258, 258], [258, 282]], '#4a90d9');
  if (v === 0) {
    ctx.strokeStyle = '#cfd8dc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(196, 240);
    ctx.quadraticCurveTo(188, 228, 196, 216);
    ctx.quadraticCurveTo(204, 204, 196, 192);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(210, 240);
    ctx.quadraticCurveTo(202, 228, 210, 216);
    ctx.stroke();
  }
  // Fruit bowl (variant 1: one apple fewer).
  ellipse(ctx, 350, 296, 46, 14, '#7a4a21');
  circle(ctx, 330, 278, 12, '#e23b3b');
  if (v === 0) circle(ctx, 356, 270, 12, '#e23b3b');
  circle(ctx, 376, 280, 12, '#7ec850');
  // Mug (variant 1: red instead of blue).
  rect(ctx, 104, 262, 32, 34, v === 0 ? '#4a90d9' : '#e23b3b');
  ctx.strokeStyle = v === 0 ? '#4a90d9' : '#e23b3b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(140, 279, 10, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Cat asleep on the chair (variant 1: the cat has wandered off).
  if (v === 0) {
    rect(ctx, 470, 330, 90, 12, '#8b5a2b');
    rect(ctx, 478, 342, 10, 50, '#6d4520');
    rect(ctx, 542, 342, 10, 50, '#6d4520');
    ellipse(ctx, 515, 322, 34, 16, '#f2a541');
    circle(ctx, 484, 316, 13, '#f2a541');
    poly(ctx, [[476, 308], [480, 296], [486, 308]], '#f2a541');
    poly(ctx, [[490, 308], [494, 296], [498, 308]], '#f2a541');
    line(ctx, 548, 322, 566, 312, '#f2a541', 6);
  }
}

// ---------------------------------------------------------------------------
// Scene 3 — Moonlit Camp
// ---------------------------------------------------------------------------
function drawCamp(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#0b1030');
  sky.addColorStop(1, '#2a3a6e');
  rect(ctx, 0, 0, 600, 320, sky);
  rect(ctx, 0, 320, 600, 120, '#1d3a24');
  // Stars (variant 1: one star is missing).
  const stars = [[60, 50], [150, 35], [240, 70], [330, 40], [420, 80], [520, 60], [560, 140], [300, 110], [180, 120]];
  for (let i = 0; i < stars.length; i += 1) {
    if (v === 1 && i === 5) continue;
    star(ctx, stars[i][0], stars[i][1], 7, '#fff7c0');
  }
  // Moon (variant 1: a crescent).
  circle(ctx, 90, 70, 34, '#f5f0c8');
  if (v === 1) circle(ctx, 104, 62, 30, '#1a2450');
  // Pine trees.
  const pine = (x, base) => {
    rect(ctx, x - 8, base - 20, 16, 22, '#5b3a1e');
    poly(ctx, [[x - 42, base - 14], [x, base - 90], [x + 42, base - 14]], '#14532d');
    poly(ctx, [[x - 34, base - 60], [x, base - 128], [x + 34, base - 60]], '#166534');
  };
  pine(60, 330);
  pine(545, 330);
  // Tent (variant 1: the door is zipped shut).
  poly(ctx, [[220, 330], [300, 220], [380, 330]], '#e07840');
  line(ctx, 300, 220, 300, 330, '#b45309', 3);
  if (v === 0) poly(ctx, [[282, 330], [300, 268], [318, 330]], '#3b1d0e');
  else poly(ctx, [[282, 330], [300, 268], [318, 330]], '#c2410c');
  // Sleeping bag.
  ellipse(ctx, 250, 372, 52, 18, '#2563eb');
  ellipse(ctx, 250, 366, 52, 14, '#3b82f6');
  // Campfire (variant 1: a smaller flame).
  ellipse(ctx, 430, 352, 46, 12, '#6b7280');
  line(ctx, 400, 348, 460, 336, '#5b3a1e', 8);
  line(ctx, 400, 336, 460, 348, '#5b3a1e', 8);
  if (v === 0) {
    ellipse(ctx, 430, 322, 26, 34, '#f97316');
    ellipse(ctx, 430, 316, 16, 24, '#facc15');
  } else {
    ellipse(ctx, 430, 336, 16, 16, '#f97316');
    ellipse(ctx, 430, 334, 9, 11, '#facc15');
  }
  // Marshmallow on a stick (variant 1: no marshmallow).
  line(ctx, 372, 356, 396, 322, '#8b5a2b', 4);
  if (v === 0) {
    rect(ctx, 388, 308, 16, 16, '#fff7ed');
    ctx.strokeStyle = '#d6c9b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(388, 308, 16, 16);
  }
  // Lantern on a post (variant 1: unlit).
  line(ctx, 150, 330, 150, 380, '#5b3a1e', 6);
  line(ctx, 150, 330, 132, 330, '#5b3a1e', 4);
  if (v === 0) {
    circle(ctx, 132, 344, 20, 'rgba(255, 209, 102, 0.35)');
    rect(ctx, 122, 334, 20, 22, '#ffd166');
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 3;
    ctx.strokeRect(122, 334, 20, 22);
  } else {
    rect(ctx, 122, 334, 20, 22, '#6b7280');
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.strokeRect(122, 334, 20, 22);
  }
  // Owl on the right tree's branch (variant 1: flown away).
  if (v === 0) {
    line(ctx, 505, 240, 555, 232, '#5b3a1e', 6);
    ellipse(ctx, 520, 212, 18, 24, '#8b5a2b');
    circle(ctx, 514, 200, 7, '#ffffff');
    circle(ctx, 528, 200, 7, '#ffffff');
    circle(ctx, 514, 200, 3, '#111');
    circle(ctx, 528, 200, 3, '#111');
    poly(ctx, [[518, 210], [524, 210], [521, 216]], '#f59e0b');
  }
}

// ---------------------------------------------------------------------------
// Scene 4 — Toy Room
// ---------------------------------------------------------------------------
function drawToyRoom(ctx, v) {
  rect(ctx, 0, 0, 600, 300, '#ffe9c9');
  rect(ctx, 0, 300, 600, 140, '#d9a066');
  // Shelf with books (variant 1: one book is missing).
  rect(ctx, 60, 104, 480, 12, '#8b5a2b');
  const books = ['#e23b3b', '#4a90d9', '#7ec850', '#f2c94c', '#8b5cf6'];
  for (let i = 0; i < books.length; i += 1) {
    if (v === 1 && i === 2) continue;
    rect(ctx, 270 + i * 26, 62, 22, 42, books[i]);
  }
  // Kite on the wall (variant 1: one tail bow fewer).
  poly(ctx, [[80, 130], [110, 165], [80, 200], [50, 165]], '#ff7ad9');
  line(ctx, 80, 200, 92, 250, '#333', 2);
  circle(ctx, 84, 214, 6, '#e23b3b');
  circle(ctx, 88, 232, 6, '#4a90d9');
  if (v === 0) circle(ctx, 91, 248, 6, '#7ec850');
  // Ball (variant 1: one stripe fewer).
  circle(ctx, 450, 200, 38, '#f2c94c');
  ctx.strokeStyle = '#e23b3b';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(450, 200, 30, -0.6, 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(450, 200, 30, Math.PI - 0.6, Math.PI + 0.6);
  ctx.stroke();
  if (v === 0) {
    ctx.beginPath();
    ctx.arc(450, 200, 16, -0.9, 0.9);
    ctx.stroke();
  }
  // Robot (variant 1: the antenna ball is gone).
  rect(ctx, 500, 240, 56, 64, '#9aa3b5');
  rect(ctx, 510, 212, 36, 28, '#c3cad6');
  circle(ctx, 520, 222, 4, '#111');
  circle(ctx, 536, 222, 4, '#111');
  line(ctx, 528, 212, 528, 192, '#666', 4);
  if (v === 0) circle(ctx, 528, 186, 8, '#e23b3b');
  line(ctx, 500, 258, 484, 276, '#666', 5);
  line(ctx, 556, 258, 572, 276, '#666', 5);
  rect(ctx, 510, 304, 14, 22, '#666');
  rect(ctx, 532, 304, 14, 22, '#666');
  // Teddy bear (variant 1: a blue bow instead of red).
  circle(ctx, 128, 236, 16, '#b07a45');
  circle(ctx, 172, 236, 16, '#b07a45');
  circle(ctx, 150, 258, 34, '#b07a45');
  ellipse(ctx, 150, 306, 40, 30, '#b07a45');
  circle(ctx, 142, 254, 5, '#111');
  circle(ctx, 158, 254, 5, '#111');
  ellipse(ctx, 150, 268, 10, 7, '#e8b48a');
  poly(ctx, [[140, 292], [150, 300], [160, 292], [150, 284]], v === 0 ? '#e23b3b' : '#3b82f6');
  // Toy train (variant 1: one carriage fewer).
  rect(ctx, 330, 330, 60, 34, '#e23b3b');
  rect(ctx, 336, 306, 34, 26, '#e23b3b');
  circle(ctx, 348, 368, 10, '#333');
  circle(ctx, 376, 368, 10, '#333');
  rect(ctx, 394, 336, 44, 28, '#4a90d9');
  circle(ctx, 406, 368, 9, '#333');
  circle(ctx, 426, 368, 9, '#333');
  if (v === 0) {
    rect(ctx, 442, 336, 44, 28, '#7ec850');
    circle(ctx, 454, 368, 9, '#333');
    circle(ctx, 474, 368, 9, '#333');
  }
  // Toy blocks (variant 1: the middle block says D, not B).
  const block = (x, letter, color) => {
    rect(ctx, x, 372, 40, 40, color);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, 372, 40, 40);
    text(ctx, letter, x + 20, 393, 26, '#fff');
  };
  block(210, 'A', '#e23b3b');
  block(254, v === 0 ? 'B' : 'D', '#4a90d9');
  block(298, 'C', '#7ec850');
}

// ---------------------------------------------------------------------------
// Scene 5 — Snowy Village
// ---------------------------------------------------------------------------
function drawVillage(ctx, v) {
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#2c3e6b');
  sky.addColorStop(1, '#8fb0e0');
  rect(ctx, 0, 0, 600, 320, sky);
  rect(ctx, 0, 320, 600, 120, '#f4f8ff');
  ellipse(ctx, 300, 330, 320, 26, '#e3ecf9');
  // Moon and stars.
  circle(ctx, 520, 70, 26, '#f5f0c8');
  star(ctx, 80, 60, 7, '#fff7c0');
  star(ctx, 200, 90, 6, '#fff7c0');
  star(ctx, 340, 50, 7, '#fff7c0');
  // Pine tree with a star on top (variant 1: no star).
  poly(ctx, [[30, 320], [60, 210], [90, 320]], '#14532d');
  poly(ctx, [[38, 260], [60, 170], [82, 260]], '#166534');
  rect(ctx, 54, 320, 12, 18, '#5b3a1e');
  if (v === 0) star(ctx, 60, 158, 12, '#ffd93b');
  // House one with chimney smoke (variant 1: no smoke).
  rect(ctx, 100, 230, 160, 100, '#c98f5f');
  poly(ctx, [[88, 232], [180, 170], [272, 232]], '#7a4a21');
  ellipse(ctx, 180, 182, 96, 16, '#ffffff');
  rect(ctx, 228, 178, 22, 44, '#8b5a2b');
  if (v === 0) {
    circle(ctx, 240, 158, 12, '#e5e7eb');
    circle(ctx, 246, 138, 15, '#e5e7eb');
    circle(ctx, 252, 116, 18, '#e5e7eb');
  }
  rect(ctx, 130, 262, 36, 36, '#ffd166');
  rect(ctx, 200, 262, 36, 36, '#bfe3f2');
  rect(ctx, 168, 280, 26, 50, '#5b3a1e');
  // House two (variant 1: its window is dark).
  rect(ctx, 340, 250, 160, 80, '#a9714b');
  poly(ctx, [[330, 252], [420, 196], [510, 252]], '#5b3a1e');
  ellipse(ctx, 420, 204, 86, 14, '#ffffff');
  rect(ctx, 368, 276, 34, 30, v === 0 ? '#ffd166' : '#3b4252');
  rect(ctx, 452, 276, 34, 30, '#bfe3f2');
  // Lamppost (variant 1: the lamp is off).
  rect(ctx, 296, 250, 8, 90, '#2f3542');
  if (v === 0) {
    circle(ctx, 300, 238, 22, 'rgba(255, 209, 102, 0.35)');
    circle(ctx, 300, 238, 10, '#ffd93b');
  } else {
    circle(ctx, 300, 238, 10, '#6b7280');
  }
  // Snowman (variant 1: no hat).
  circle(ctx, 500, 368, 30, '#ffffff');
  circle(ctx, 500, 322, 22, '#ffffff');
  circle(ctx, 500, 288, 16, '#ffffff');
  circle(ctx, 494, 286, 2, '#111');
  circle(ctx, 506, 286, 2, '#111');
  poly(ctx, [[500, 290], [516, 293], [500, 296]], '#f97316');
  if (v === 0) {
    rect(ctx, 486, 268, 28, 8, '#222');
    rect(ctx, 490, 250, 20, 20, '#222');
  }
  line(ctx, 472, 322, 452, 306, '#5b3a1e', 4);
  line(ctx, 528, 322, 548, 306, '#5b3a1e', 4);
  // Sled (variant 1: gone).
  if (v === 0) {
    line(ctx, 160, 392, 220, 392, '#8b5a2b', 6);
    line(ctx, 168, 392, 168, 404, '#8b5a2b', 4);
    line(ctx, 212, 392, 212, 404, '#8b5a2b', 4);
    poly(ctx, [[160, 392], [150, 378], [220, 378], [220, 392]], '#d96a4f');
  }
  // Bird on the fence (variant 1: flown away).
  line(ctx, 400, 380, 470, 380, '#8b5a2b', 5);
  line(ctx, 408, 380, 408, 404, '#8b5a2b', 4);
  line(ctx, 462, 380, 462, 404, '#8b5a2b', 4);
  if (v === 0) {
    ellipse(ctx, 430, 368, 12, 9, '#3b4252');
    circle(ctx, 440, 362, 6, '#3b4252');
    poly(ctx, [[445, 361], [451, 363], [445, 365]], '#f59e0b');
  }
}

export const SCENES = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    blurb: 'A cottage garden on a bright morning.',
    draw: drawGarden,
    diffs: [
      { x: 481, y: 95, r: 30, label: 'Butterfly' },
      { x: 80, y: 70, r: 42, label: 'Sun shades' },
      { x: 300, y: 378, r: 26, label: 'Flower colour' },
      { x: 420, y: 62, r: 26, label: 'Bird' },
      { x: 162, y: 250, r: 28, label: 'Curtains' },
      { x: 520, y: 190, r: 20, label: 'Apple' },
      { x: 200, y: 375, r: 24, label: 'Stepping stone' },
    ],
  },
  {
    id: 'kitchen',
    name: 'Cosy Kitchen',
    blurb: 'Tea is brewing and the cat is asleep.',
    draw: drawKitchen,
    diffs: [
      { x: 150, y: 130, r: 40, label: 'Curtains' },
      { x: 300, y: 90, r: 38, label: 'Clock hands' },
      { x: 482, y: 110, r: 22, label: 'Jar' },
      { x: 200, y: 222, r: 26, label: 'Steam' },
      { x: 356, y: 270, r: 20, label: 'Apple' },
      { x: 515, y: 322, r: 34, label: 'Cat' },
      { x: 120, y: 279, r: 22, label: 'Mug colour' },
    ],
  },
  {
    id: 'camp',
    name: 'Moonlit Camp',
    blurb: 'A campfire under the stars.',
    draw: drawCamp,
    diffs: [
      { x: 520, y: 60, r: 18, label: 'Star' },
      { x: 90, y: 70, r: 40, label: 'Moon' },
      { x: 300, y: 300, r: 26, label: 'Tent door' },
      { x: 430, y: 316, r: 30, label: 'Flame' },
      { x: 520, y: 208, r: 28, label: 'Owl' },
      { x: 396, y: 316, r: 20, label: 'Marshmallow' },
      { x: 132, y: 344, r: 26, label: 'Lantern' },
    ],
  },
  {
    id: 'toys',
    name: 'Toy Room',
    blurb: 'Toys everywhere after playtime.',
    draw: drawToyRoom,
    diffs: [
      { x: 322, y: 83, r: 22, label: 'Book' },
      { x: 150, y: 292, r: 22, label: 'Teddy bow' },
      { x: 464, y: 350, r: 26, label: 'Train carriage' },
      { x: 274, y: 392, r: 24, label: 'Block letter' },
      { x: 450, y: 200, r: 38, label: 'Ball stripes' },
      { x: 528, y: 192, r: 18, label: 'Antenna ball' },
      { x: 91, y: 248, r: 18, label: 'Kite bow' },
    ],
  },
  {
    id: 'village',
    name: 'Snowy Village',
    blurb: 'A quiet village on a snowy evening.',
    draw: drawVillage,
    diffs: [
      { x: 246, y: 138, r: 26, label: 'Chimney smoke' },
      { x: 385, y: 291, r: 24, label: 'Lit window' },
      { x: 500, y: 262, r: 24, label: 'Snowman hat' },
      { x: 60, y: 158, r: 20, label: 'Tree star' },
      { x: 300, y: 238, r: 24, label: 'Lamp light' },
      { x: 186, y: 388, r: 26, label: 'Sled' },
      { x: 430, y: 366, r: 22, label: 'Bird' },
    ],
  },
];
