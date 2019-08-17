/**
 * generate landscape
 */
import Procedural from './Procedural';

export interface LandscapeOptions {
  detail: number;
  roughness?: number;
}

export class Landscape extends Procedural {
  size: number;
  detail: number;
  roughness: number;
  max: number;
  map: Float32Array;

  setPoint(x: number, y: number, val: number) {
    this.map[x + this.size * y] = val;
  }

  getPoint(x: number, y: number) {
    if (x < 0 || x > this.max || y < 0 || y > this.max) {
      return -1;
    }
    return this.map[x + this.size * y];
  }

  average(values) {
    const valid = values.filter(function(val) {
      return val !== -1;
    });
    const total = valid.reduce(function(sum, val) {
      return sum + val;
    }, 0);
    return total / valid.length;
  }

  square(x, y, size, offset) {
    const ave = this.average([
      this.getPoint(x - size, y - size), // upper left
      this.getPoint(x + size, y - size), // upper right
      this.getPoint(x + size, y + size), // lower right
      this.getPoint(x - size, y + size) // lower left
    ]);
    this.setPoint(x, y, ave + offset);
  }

  diamond(x, y, size, offset) {
    const ave = this.average([
      this.getPoint(x, y - size), // top
      this.getPoint(x + size, y), // right
      this.getPoint(x, y + size), // bottom
      this.getPoint(x - size, y) // left
    ]);
    this.setPoint(x, y, ave + offset);
  }

  divide(size) {
    let x,
      y,
      half = size / 2;
    const scale = this.roughness * this.size;
    if (half < 1) {
      return;
    }

    for (y = half; y < this.max; y += size) {
      for (x = half; x < this.max; x += size) {
        this.square(x, y, half, this.random(100) * scale * 2 - scale);
      }
    }
    for (y = 0; y <= this.max; y += half) {
      for (x = (y + half) % size; x <= this.max; x += size) {
        this.diamond(x, y, half, this.random(100) * scale * 2 - scale);
      }
    }
    this.divide(size / 2);
  }

  generate(opts: LandscapeOptions) {
    // set values
    this.size = Math.pow(2, opts.detail) + 1;
    this.max = this.size - 1;
    this.map = new Float32Array(this.size * this.size);
    this.roughness = opts.roughness || 0.001;

    // set corners
    this.setPoint(0, 0, this.max);
    this.setPoint(this.max, 0, this.max / 2);
    this.setPoint(this.max, this.max, 0);
    this.setPoint(0, this.max, this.max / 2);

    this.divide(this.max);
  }
}
