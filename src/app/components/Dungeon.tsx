
import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import World from './World';
import GL3D from './GL3D';
import Hud from './Hud';
import { TILE_TYPE } from '../../dungeon/constants';

@observer
export class Dungeon extends React.Component<any, any> {
  tiles:any;
  async componentWillMount () {
    await this.props.appState.createDungeonArea();
  }

  saveWorld (world) {
    this.props.appState.saveWorld(world);
  }

  render () {
    const { appState } = this.props;
    const  { world, tiles } = appState;
    return (
      <div>
        <World onInit={world => this.saveWorld(world)} gravity={{ x: 0, y: 0, z: -9.8 }} width={640} height={400}>
          <GL3D position={{ x: 0, y: 0, z: 0 }} mass={0} world={world} shape="PLANE"/>
          {tiles && tiles.map((tile) => 
              <GL3D 
                key={tile.key}
                position={{ x:tile.x, y:tile.y, z:tile.type === TILE_TYPE.WALL ? 1.0 : 0.1 }}
                scale={{ x:0.5, y:0.5, z:tile.type === TILE_TYPE.WALL ? 1.0 : 0.1 }}
                world={world}

                shape="CUBE"/>
            )}
          <Hud>
            <div style={{position:'relative',top:'50px',left:'50px'}}>
              {tiles && tiles.map((tile) => <div key={tile.key} style={{position:'absolute',left:tile.x*8+'px',top:tile.y*8+'px'}}>{tile.symbol}</div>)}
            </div>
          </Hud>
        </World>
      </div >
    );
  }
}

