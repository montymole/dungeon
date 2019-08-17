import { Landscape } from './Landscape';

const l = new Landscape('LAND');
l.generate({ detail: 5 });

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

// draw it
for (let y = 0; y < l.size; y++) {
  let s = '';
  for (let x = 0; x < l.size; x++) {
    s += clamp(Math.round((l.getPoint(x, y) / l.max) * 9), 0, 9);
  }
  console.log(s);
}
