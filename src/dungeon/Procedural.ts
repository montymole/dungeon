import * as randomSeed from 'random-seed';
import { RANDOM_SEED } from './constants';

export default class Procedural {
  seed: string;
  random: any;
  constructor(seed: string = RANDOM_SEED) {
    this.seed = seed;
    this.random = new randomSeed(this.seed);
  }
  rollChance(c: number) {
    return this.random(100) <= c;
  }
  randomInt(n) {
    return Math.round(this.random(n));
  }
}
