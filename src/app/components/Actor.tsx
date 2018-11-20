
import * as React from 'react';
import { Actor3D } from './Actor3D';

export default class Actor extends React.Component<any, any> {
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
      this.obj3d = new Actor3D({ ...this.props });
    }
  }
  render () {
    return null;
  }
}
