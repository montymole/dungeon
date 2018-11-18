
import * as React from 'react';
import { observer } from 'mobx-react';
import World from './World';
import GL3D from './GL3D';
import Room from './Room';
import Hud from './Hud';

@observer
export class Dungeon extends React.Component<any, any> {
  tiles:any;
  async componentWillMount () {
    const { appState } = this.props;
    await appState.createDungeonArea();
    appState.bindKeyboardEvents();
  }

  async componentWillUnmount() {
    const { appState } = this.props;
    appState.unbindKeyboardEvents();
  }

  saveWorld (world) {
    this.props.appState.saveWorld(world);
  }

  render () {
    const { appState } = this.props;
    const  { world, tiles, cameraPosition  } = appState;
    return (
      <div>
        <World 
          onInit={world => this.saveWorld(world)}
          gravity={{ x: 0, y: 0, z: -9.8 }}
          camera={cameraPosition}
          width={800}
          height={600}>
          
          {tiles && tiles.length && <Room world={world} tiles={tiles}/>}
          <Hud>
            <div className="miniMap"><div>
              {tiles && tiles.map((tile) => <div className="tile" key={tile.key} style={{left:tile.x*8+'px',top:tile.y*8+'px'}}>{tile.symbol}</div>)}
            </div></div>
          </Hud>
        </World>
      </div >
    );
  }
}

