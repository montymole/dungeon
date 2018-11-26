import * as randomSeed from "random-seed";
import { RANDOM_SEED } from "./constants";

const RN1 = [
  "room",
  "hall",
  "chamber",
  "house",
  "arena",
  "box",
  "realm",
  "land",
  "palace",
  "castle",
  "terror",
  "blood",
  "death",
  "birth",
  "oasis",
  "shop",
  "ruin"
];
const RN2 = [
  "in red",
  "in blue",
  "of orc",
  "of darkness",
  "of goblins",
  "of horror",
  "of echoes",
  "of death",
  "of blood",
  "of massacre",
  "of wonder",
  "of pain",
  "of realms",
  "of terror"
];

export default class {
  seed: string;
  random: any;
  constructor(seed = RANDOM_SEED) {
    this.seed = seed;
    this.random = new randomSeed(this.seed);
  }
  randomInt(n) {
    return Math.round(this.random(n));
  }
  capFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  get roomName() {
    return this.capFirst(
      `${RN1[this.randomInt(RN1.length)]} ${RN2[this.randomInt(RN2.length)]}`
    );
  }
}
