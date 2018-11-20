
import * as React from 'react';
import { CSSActor3D } from './CSSActor3D';

export class CSSActor extends React.Component<any, any> {
  element: HTMLElement;
  obj3d: any;
  componentDidUpdate () {
    const { world, position, mass, force } = this.props;
    const { element } = this;
    if (!this.obj3d && world) {
      this.obj3d = new CSSActor3D({ element, ...this.props });
    }
  }
  render () {
    return (<div ref={element => this.element = element}>{this.props.children}</div>);
  }
}
