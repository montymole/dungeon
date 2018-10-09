import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import World from './World';
import HTML3D from './HTML3D';
import GL3D from './GL3D';

@observer
export class App extends React.Component<any, any> {

  saveWorld (world) {
    this.props.appState.saveWorld(world);
  }

  render () {
    const { appState } = this.props;
    const world = appState && appState.world;
    return (
      <div>
        <World onInit={world => this.saveWorld(world)}>
          <HTML3D position={{ x: Math.sin(this.props.appState.timer), y: 0, z: 2 }} world={world}>
            <h1>TOKA</h1>
          </HTML3D>
          <HTML3D position={{ x: 0, y: 1.6, z: 1 }} onClick={this.onReset} world={world}>
            TESTI1234 {this.props.appState.timer}
          </HTML3D>
          <GL3D position={{ x: 0, y: 1, z: Math.sin(this.props.appState.timer) }} world={world} />
          <GL3D position={{ x: 0, y: -1, z: 1 }} world={world} />
        </World>
        <DevTools />
        Time {this.props.appState.timer}
      </div>
    );
  }
  onReset = () => {
    this.props.appState.resetTimer();
  }
};
