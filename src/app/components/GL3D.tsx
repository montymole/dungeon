
import * as React from 'react';
import { Actor } from '../gameobjects';

export default class GL3D extends React.Component<any, any> {
  obj3d: any;
  componentDidUpdate () {
    const { world, position, rotation } = this.props;
    if (!this.obj3d && world) {
      this.obj3d = new Actor({ position, rotation });
      world.scene.add(this.obj3d);
    }
    if (this.obj3d) {
      this.obj3d.update({ position, rotation });
    }
  }
  render () {
    return null;
  }
}
