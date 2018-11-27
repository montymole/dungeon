import Procedural from "./Procedural";
import { ITEMS } from "./constants";
import NameGenerator from './NameGenerator';

export default class Item extends Procedural {
  id: number;
  x: number;
  y: number;
  mass: number;
  value: number;
  type: string;
  unique?: string;
  name: string;
  symbol: string;

  constructor(o) {
    super(o.seed);
    const { x, y, id } = o;
    this.id = id;
    this.x = x;
    this.y = y;
    this.randomItemClass();
  }
  randomItemClass () {
    const typeIds = Object.keys(ITEMS);
    this.type = typeIds[this.randomInt(typeIds.length)];
    const itemClass = ITEMS[this.type];
    Object.keys(itemClass).forEach(k => {
      this[k] = itemClass[k];
    });
    if (!this.name) {
      const nameGenerator = new NameGenerator(this.seed);
      if (this.unique) {
        this.name =
          nameGenerator[`${this.unique}Name`] ||
          nameGenerator.capFirst(this.unique);
      } else {
        this.name = nameGenerator.capFirst(this.type.toLowerCase().replace('_', ' '));
      }
    }
  }
}
