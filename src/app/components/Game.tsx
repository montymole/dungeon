import * as React from "react";
import { observer } from "mobx-react";
import { World, Dungeon, Player, Item, Hud, MiniMap, CSSActor } from "./";
import { VIEW_RADIUS } from "../../dungeon/constants";

@observer
export class Game extends React.Component<any, any> {

  async componentWillMount () {
    const { gameState } = this.props;
    await gameState.listSavedDungeons();
    const newSeed = window.location.href.split("#")[1];
    const oldSeed =
      gameState.dungeons && gameState.dungeons[0] && gameState.dungeons[0].seed;
    if (newSeed) await gameState.getDungeon(newSeed, true);
    // create from seeed
    else if (oldSeed) await gameState.getDungeon(oldSeed);
    // old seed
    else await gameState.getDungeon("ROGUE", true); // create initial dungeon
    gameState.bindKeyboardEvents();
  }

  async componentWillUnmount () {
    const { gameState } = this.props;
    gameState.unbindKeyboardEvents();
  }

  async createDungeon (seed) {
    const { gameState } = this.props;
    await gameState.getDungeon(seed);
  }

  saveWorld (world) {
    this.props.gameState.saveWorld(world);
  }

  synthVoice (text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
  }

  render () {
    const { gameState } = this.props;
    const {
      world,
      dungeons,
      dungeonMap,
      visibleTiles,
      visibleItems,
      playerFov,
      cameraPosition,
      playerPosition
    } = gameState;
    return (
      <div>
        <World
          onInit={world => this.saveWorld(world)}
          gravity={{ x: 0, y: 0, z: -9.8 }}
          camera={cameraPosition}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          {dungeonMap &&
            <Dungeon world={world} dungeonMap={dungeonMap} playerFov={playerFov} />
          }
          {visibleItems &&
            visibleItems.map(item => (
              <CSSActor
                key={item.id}
                world={world}
                position={{ x: item.x, z: item.y, y: 2 }}
                rotation={{ y: 0, x: -90 * (Math.PI / 180), z: 0 }}
              >
                <small>{item.symbol}</small>
                <Item
                  key={item.id}
                  world={world}
                  position={{ x: item.x, z: item.y, y: 0.15 }}
                />
              </CSSActor>
            ))}
          <Player world={world} position={playerPosition} />
          {dungeonMap &&
            dungeonMap.rooms.map(room => (
              <CSSActor
                key={`r_${room.id}`}
                world={world}
                position={{
                  x: room.x - 1 + Math.round(room.w / 2),
                  z: room.y - 1 + Math.round(room.h / 2),
                  y: 2
                }}
                rotation={{ y: 0, x: -90 * (Math.PI / 180), z: 0 }}
              >
                <h2
                  onClick={() => this.synthVoice(room.name)}
                  style={{
                    width: room.w * 10 + "px",
                    height: room.h * 10 + "px"
                  }}
                >
                  {room.name}
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
            <ul className="dungeonMenu">
              {dungeons &&
                dungeons.map(d => (
                  <li key={d.id} onClick={() => this.createDungeon(d.seed)}>
                    {d.name}
                  </li>
                ))}
            </ul>
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
