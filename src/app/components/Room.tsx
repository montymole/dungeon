
import * as React from 'react';
import { Level } from '../gameobjects';

export default class Room extends React.Component<any, any> {
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
      this.obj3d = new Level({ ...this.props });
    }
  }
  render () {
    return null;
  }
}
