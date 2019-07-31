import Procedural from './Procedural';

const RN0 = ['', 'the', 'el'];

const RN1 = [
  'shaft',
  'room',
  'hall',
  'chamber',
  'house',
  'arena',
  'box',
  'realm',
  'land',
  'palace',
  'castle',
  'terror',
  'blood',
  'death',
  'birth',
  'oasis',
  'shop',
  'ruin',
  'gydfydrr',
  'wrynntwyh',
  'red',
  'blue',
  'blackness',
  'oro',
  'darkness',
  'goblins',
  'horror',
  'echoes',
  'death',
  'blood',
  'massacre',
  'wonder',
  'pain',
  'realms',
  'terror',
  'eszelarion',
  'gold',
  'silver',
  'rock'
];

const SW1 = ['sword', 'dagger', 'rapier'];

export default class NameGenerator extends Procedural {
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
  get swordName() {
    return this.capFirst(
      `${this.word(RN0)} ${this.word(SW1)} of ${this.word(RN0)} ${this.word(
        RN1
      )}`.trim()
    );
  }
}
