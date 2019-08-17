import { observer } from 'mobx-react';
import { pick } from 'ramda';
import * as React from 'react';
import { CSSActor, Ground, Player, World } from './';

const DEBUG = true;

@observer
export class TestGround extends React.Component<any, any> {
  async componentWillMount() {
    const { gameState } = this.props;
    gameState.bindEvents();
  }

  async componentWillUnmount() {
    const { gameState } = this.props;
    gameState.unbindvents();
  }

  render() {
    const { gameState } = this.props;
    const { world, cameraPosition, playerPosition, playerAction } = gameState;
    return (
      <World onInit={(world) => this.props.gameState.saveWorld(world)} camera={cameraPosition} width={window.innerWidth} height={window.innerHeight}>
        <Ground world={world}>
          <Player world={world} position={playerPosition} action={playerAction} />
        </Ground>
      </World>
    );
  }
}
