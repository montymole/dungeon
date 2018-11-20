
import * as React from 'react';
import { Dungeon3D } from './Dungeon3D';

export class Dungeon extends React.Component<any, any> {
  obj3d: any;
  componentDidMount () {
    this.init();
  }
  componentDidUpdate () {
    this.init();
  }
  init () {
    const { world } = this.props;
    if (!this.obj3d && world) {
      this.obj3d = new Dungeon3D({ ...this.props });
    }
  }
  render () { return null; }
}
