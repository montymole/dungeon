/**
 * scan tile hooks
 * @param o
 */
export function scan(o) {
  const sx = o.x;
  const sy = o.y;
  const { w, h, onTile, onNextRow } = o;
  const ex = sx + w;
  const ey = sy + h;
  for (let y = sy; y < ey; y++) {
    for (let x = sx; x < ex; x++) {
      onTile(`x${x}y${y}`, x, y);
    }
    if (onNextRow) {
      onNextRow(y);
    }
  }
}
