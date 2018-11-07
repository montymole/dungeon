
import * as React from 'react';

export default class Hid extends React.Component<any, any> {

  render () {
    return (<div className="hud">{this.props.children}</div>);
  }
}
