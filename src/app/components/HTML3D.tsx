
import * as React from 'react';
import { CSSActor } from '../gameobjects';

export default class HTML3D extends React.Component<any, any> {
  domRoot: HTMLElement;
  componentDidMount () {
    const { onReady, position, rotation } = this.props;
    if (onReady)
      onReady(new CSSActor({ position, rotation, element: this.domRoot }));
  }
  render () {
    return (<div ref={domRoot => this.domRoot = domRoot}>{this.props.children}</div>);
  }
}
