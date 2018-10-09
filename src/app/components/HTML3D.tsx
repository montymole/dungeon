
import * as React from 'react';
import { CSSActor } from '../gameobjects';

export default class HTML3D extends React.Component<any, any> {
  domRoot: HTMLElement;
  obj3d: any;
  componentDidUpdate () {
    const { world, position, rotation } = this.props;
    if (!this.obj3d && world) {
      console.log('CSSobj');
      this.obj3d = new CSSActor({ position, rotation, element: this.domRoot });
      world.css3DScene.add(this.obj3d);
    }
    if (this.obj3d) {
      this.obj3d.update({ position, rotation });
    }
  }
  render () {
    return (<div ref={domRoot => this.domRoot = domRoot}>{this.props.children}</div>);
  }
}
