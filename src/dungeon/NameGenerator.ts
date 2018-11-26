import * as randomSeed from "random-seed";
import { RANDOM_SEED } from "./constants";

const RN0 = ["", "the", "el"];

const RN1 = [
  "shaft",
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
  "ruin",
  "gydfydrr",
  "wrynntwyh",
  "red",
  "blue",
  "blackness",
  "oro",
  "darkness",
  "goblins",
  "horror",
  "echoes",
  "death",
  "blood",
  "massacre",
  "wonder",
  "pain",
  "realms",
  "terror",
  "eszelarion",
  "gold",
  "silver",
  "rock"
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
  word(a) {
    return a[this.randomInt(a.length)];
  }
  get roomName() {
    return this.capFirst(
      `${this.word(RN0)} ${this.word(RN1)} of ${this.word(RN0)} ${this.word(
        RN1
      )}`.trim()
    );
  }
}
