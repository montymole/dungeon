
import * as React from 'react';
import { Actor } from '../gameobjects';

export default class GL3D extends React.Component<any, any> {
  obj3d: any;
  componentDidMount () {
    this.init();
  }
  componentDidUpdate () {
    this.init();
  }
  init() {
    const { world } = this.props;
    if (!this.obj3d && world) {
      this.obj3d = new Actor({ ...this.props });
    }
  }
  render () {
    return null;
  }
}
