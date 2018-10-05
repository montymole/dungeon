import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import World from './World';
import HTML3D from './HTML3D';

@observer
export class App extends React.Component<{ appState: any }, {}> {
  render () {
    return (
      <div>
        <World>
          <HTML3D position={{ x: 0, y: 0, z: 2 }}>
            <h1>TOKA</h1>
          </HTML3D>
          <HTML3D position={{ x: 0, y: 1.6, z: 1 }} onClick={this.onReset}>
            TESTI1234 {this.props.appState.timer}
          </HTML3D>
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
