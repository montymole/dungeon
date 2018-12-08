import * as React from "react";
import { observer } from "mobx-react";
import { World, Dungeon, Player, Item, Hud, MiniMap, CSSActor, RoomDebug, ItemDebug } from "./";
@observer
export class Game extends React.Component<any, any> {
  async componentWillMount() {
    const { gameState } = this.props;
    await gameState.listSavedDungeons();
    const newSeed = window.location.href.split("#")[1];
    const oldSeed = gameState.dungeons && gameState.dungeons[0] && gameState.dungeons[0].seed;
    if (newSeed) await gameState.getDungeon(newSeed, true);
    // create from seeed
    else if (oldSeed) await gameState.getDungeon(oldSeed);
    // old seed
    else await gameState.getDungeon("ROGUE", true); // create initial dungeon
    gameState.bindKeyboardEvents();
  }

  async componentWillUnmount() {
    const { gameState } = this.props;
    gameState.unbindKeyboardEvents();
  }

  async createDungeon(seed) {
    const { gameState } = this.props;
    await gameState.getDungeon(seed);
  }

  render() {
    const { gameState } = this.props;
    const { world, dungeons, dungeonMap, visibleTiles, visibleItems, playerFov, cameraPosition, playerPosition } = gameState;
    return (
      <World onInit={world => this.props.gameState.saveWorld(world)} camera={cameraPosition} width={window.innerWidth} height={window.innerHeight}>
        {Boolean(world && dungeonMap && playerFov) && (
          <Dungeon world={world} dungeonMap={dungeonMap} playerFov={playerFov}>
            <Player world={world} position={playerPosition} />
          </Dungeon>
        )}

        <RoomDebug world={world} dungeonMap={dungeonMap} />
        <ItemDebug world={world} visibleItems={visibleItems} />
        <Hud>
          <div className="dungeonTitle">
            <h1>{dungeonMap && dungeonMap.seed}</h1>
          </div>
          <ul className="dungeonMenu">
            {dungeons &&
              dungeons.map(d => (
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
