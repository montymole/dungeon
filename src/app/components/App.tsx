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
    const test = 'HELLLOO WORLD JEEE JEE'.split('');
    return (
      <div>
        <World onInit={world => this.saveWorld(world)} gravity={{ x: 0, y: 0, z: -9.8 }}>
          <GL3D position={{ x: 0, y: 0, z: 0 }} mass={0} world={world} type="PLANE" color={0x20a020} />

          {test.map((a, i) =>
            <HTML3D position={{ x: -20 + i * 2, y: 0, z: 10 * i }} world={world} mass={1}>
              😀<h1>{a}</h1>
            </HTML3D>)}

          {test.map((a, i) => <GL3D position={{ x: 0, y: 10, z: 5 + i * 1.5 }} mass={1} world={world} type="CUBE" color={0xa01010 * i} />)}
        </World>
        <DevTools />
        <div> Time {this.props.appState.timer}</div>

      </div>
    );
  }
  onReset = () => {
    this.props.appState.resetTimer();
  }
};
