
import * as React from 'react';

export class Hud extends React.Component<any, any> {
  render () {
    return (<div className="hud">{this.props.children}</div>);
  }
}
