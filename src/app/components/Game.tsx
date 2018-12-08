import * as React from "react";
import { pick } from "ramda";
import { observer } from "mobx-react";
import { World, Dungeon, Player, Item, Hud, MiniMap, CSSActor, RoomDebug, ItemDebug } from "./";
import { TILE_TYPE } from "../../dungeon/constants";
import { GameState } from "../stores/GameState";
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
    console.log("TILE CLICKED", tile);
    if (tile.type === TILE_TYPE.FLOOR) {
      const { gameState } = this.props;
      const path = await gameState.pathFinder(gameState.playerPosition, pick(["x", "y", "z"], tile));
      console.log("PATH", path);
    }
  }

  render() {
    const DEBUG = false;
    const { gameState } = this.props;
    const { world, dungeons, dungeonMap, visibleTiles, visibleItems, playerFov, cameraPosition, playerPosition } = gameState;
    return (
      <World onInit={world => this.props.gameState.saveWorld(world)} camera={cameraPosition} width={window.innerWidth} height={window.innerHeight}>
        {Boolean(world && dungeonMap && playerFov) && (
          <Dungeon world={world} dungeonMap={dungeonMap} playerFov={playerFov} onClickTile={tile => this.tileClicked(tile)}>
            <Player world={world} position={playerPosition} />
          </Dungeon>
        )}
        {DEBUG && <RoomDebug world={world} dungeonMap={dungeonMap} />}
        {DEBUG && <ItemDebug world={world} visibleItems={visibleItems} />}
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
