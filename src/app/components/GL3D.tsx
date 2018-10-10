
import * as React from 'react';
import { Actor } from '../gameobjects';

export default class GL3D extends React.Component<any, any> {
  obj3d: any;
  componentDidUpdate () {
    const { world, position, mass, type, color } = this.props;
    if (!this.obj3d && world) {
      this.obj3d = new Actor({ world, position, mass, type, color });
    }
  }
  render () {
    return null;
  }
}
