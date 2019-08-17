import { observer } from 'mobx-react';
import { pick } from 'ramda';
import * as React from 'react';
import { TILE_TYPE } from '../../dungeon/constants';
import { CSSActor, Dungeon, Hud, Item, ItemDebug, MiniMap, Player, RoomDebug, World } from './';

const DEBUG = true;

@observer
export class Game extends React.Component<any, any> {
  async componentWillMount() {
    const { gameState, fmodState } = this.props;
    // await fmodState.init();
    await gameState.listSavedDungeons();
    const newSeed = window.location.href.split('#')[1];
    const oldSeed = gameState.dungeons && gameState.dungeons[0] && gameState.dungeons[0].seed;
    if (newSeed) {
      await gameState.getDungeon(newSeed, true);
    } else if (oldSeed) {
      // create from seeed
      await gameState.getDungeon(oldSeed);
    } else {
      await gameState.getDungeon('ROGUE', true);
    } // create initial dungeon
    //  fmodState.startBgMusic();
    gameState.bindEvents();
  }

  async componentWillUnmount() {
    const { gameState } = this.props;
    gameState.unbindvents();
  }

  async createDungeon(seed) {
    const { gameState } = this.props;
    await gameState.getDungeon(seed);
  }

  async tileClicked(tile) {
    console.log('TILE CLICKED', tile);
    if (tile.type === TILE_TYPE.FLOOR) {
      /* PASKAA
			const { gameState } = this.props;
      const pf = await gameState.pathFinder({ x: gameState.playerPosition.x, y: gameState.playerPosition.z }, { x: tile.x, y: tile.y });
			gameState.movePlayer[(pf.path.path]);
			*/
    }
  }

  render() {
    const { gameState } = this.props;
    const { world, dungeons, dungeonMap, visibleTiles, visibleItems, playerFov, cameraPosition, playerPosition, playerAction } = gameState;
    return (
      <World onInit={(world) => this.props.gameState.saveWorld(world)} camera={cameraPosition} width={window.innerWidth} height={window.innerHeight}>
        {Boolean(world && dungeonMap && playerFov) && (
          <Dungeon world={world} dungeonMap={dungeonMap} playerFov={playerFov} onClickTile={(tile) => this.tileClicked(tile)}>
            <Player world={world} position={playerPosition} action={playerAction} />
          </Dungeon>
        )}
        {DEBUG && <RoomDebug world={world} dungeonMap={dungeonMap} />}
        {DEBUG && <ItemDebug world={world} visibleItems={visibleItems} />}
        <Hud>
          <div className='dungeonTitle'>
            <h1>{dungeonMap && dungeonMap.seed}</h1>
          </div>
          <ul className='dungeonMenu'>
            {dungeons &&
              dungeons.map((d) => (
                <li key={d.id} onClick={() => this.createDungeon(d.seed)}>
                  {d.name}
                </li>
              ))}
          </ul>
          <MiniMap playerPosition={playerPosition} visibleTiles={visibleTiles} />
        </Hud>
      </World>
    );
  }
}
