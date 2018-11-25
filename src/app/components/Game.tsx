import * as React from "react";
import { observer } from "mobx-react";
import { World, Dungeon, Player, Hud, MiniMap, CSSActor } from "./";
import { VIEW_RADIUS } from "../../dungeon/constants";

@observer
export class Game extends React.Component<any, any> {
  tiles: any;
  async componentWillMount() {
    const seed = window.location.href.split("#")[1];
    const { gameState } = this.props;
    await gameState.createDungeonArea(seed);
    gameState.bindKeyboardEvents();
  }

  async componentWillUnmount() {
    const { gameState } = this.props;
    gameState.unbindKeyboardEvents();
  }

  saveWorld(world) {
    this.props.gameState.saveWorld(world);
  }

  render() {
    const { gameState } = this.props;
    const {
      world,
      dungeonMap,
      tiles,
      FOV,
      cameraPosition,
      playerPosition
    } = gameState;
    const playerFov =
      FOV && FOV.fovPos(playerPosition.x, playerPosition.z, VIEW_RADIUS);
    const visibleTiles =
      playerFov &&
      playerFov.map(k => dungeonMap && dungeonMap.tiles[k]).filter(t => t);
    return (
      <div>
        <World
          onInit={world => this.saveWorld(world)}
          gravity={{ x: 0, y: 0, z: -9.8 }}
          camera={cameraPosition}
          width={1024}
          height={800}
        >
          {tiles && tiles.length && (
            <Dungeon world={world} tiles={tiles} playerFov={playerFov} />
          )}
          <Player world={world} position={playerPosition} />
          {dungeonMap &&
            dungeonMap.rooms.map(room => (
              <CSSActor
                key={room.id}
                world={world}
                position={{
                  x: room.x - 1 + Math.round(room.w / 2),
                  z: room.y - 1 + Math.round(room.h / 2),
                  y: 2
                }}
                rotation={{ y: 0, x: -90 * (Math.PI / 180), z: 0 }}
              >
                <h2
                  style={{
                    width: room.w * 10 + "px",
                    height: room.h * 10 + "px"
                  }}
                >
                  Room {room.id}
                </h2>
              </CSSActor>
            ))}
          <Hud>
            <div className="compass">
              <div className="n">N</div>
              <div className="e">E</div>
              <div className="w">W</div>
              <div className="s">S</div>
              <h1>{dungeonMap && dungeonMap.seed}</h1>
            </div>
            <MiniMap
              playerPosition={playerPosition}
              visibleTiles={visibleTiles}
            />
          </Hud>
        </World>
      </div>
    );
  }
}
