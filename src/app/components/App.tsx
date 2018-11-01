
import * as React from 'react';
import { observer } from 'mobx-react';
import World from './World';
import HTML3D from './HTML3D';
import GL3D from './GL3D';

@observer
export class App extends React.Component<any, any> {

  async componentWillMount () {
    // await this.props.appState.loadMaterials();
    // await this.props.appState.loadObject(1);
    await this.props.sndState.init();
    this.props.sndState.startBgMusic();
  }

  oneShot (snd, volume = 1, pitch = 1) {
    if (!snd) return;
    const inst: any = {};
    try {
      snd.createInstance(inst);
      inst.val.setPitch(pitch);
      inst.val.setVolume(volume);
      inst.val.start();
      inst.val.release();
    } catch (e) {
      // just die trying
    }
  }

  boxCollision (e) {
    const relativeVelocity = Math.abs(Math.round(e.contact.getImpactVelocityAlongNormal()));
    if (relativeVelocity > 0) {
      const { events } = this.props.sndState;
      this.oneShot(events.WeaponsExplosion, relativeVelocity * 0.01, 2);
    }
  }

  letterCollision (e) {
    const relativeVelocity = Math.abs(Math.round(e.contact.getImpactVelocityAlongNormal()));
    if (relativeVelocity > 0) {
      const { events } = this.props.sndState;
      this.oneShot(events.WeaponsPistol, relativeVelocity * 0.001, 2);
    }
  }

  saveWorld (world) {
    this.props.appState.saveWorld(world);
  }

  render () {
    const { appState } = this.props;
    const world = appState && appState.world;
    const materials = appState && appState.materials;
    const objects3d = appState && appState.objects3d;
    if (!materials || !objects3d) return (<div style={{ margin: '25%' }}><h1>..loading</h1></div>);
    const test = 'FMOD'.split('');
    return (
      <div>
        <World onInit={world => this.saveWorld(world)} gravity={{ x: 0, y: 0, z: -9.8 }}>
          <GL3D position={{ x: 0, y: 0, z: 0 }} mass={0} world={world} shape="PLANE" material={materials.length && materials[0]} />
          {test.map((a, i) =>
            <HTML3D
              key={i}
              position={{ x: -20 + i * 2, y: 0, z: 10 * i }}
              world={world}
              mass={1}
              onCollide={e => this.letterCollision(e)}
            >
              <h1>{a}</h1>
            </HTML3D>)}
          {test.map((a, i) =>
            <GL3D
              key={i}
              position={{ x: 0, y: 10, z: 5 + i * 1.5 }}
              mass={1}
              world={world}
              shape="CUBE"
              material={materials.length && materials[0]}
              onCollide={e => this.boxCollision(e)} />)}
        </World>
      </div >
    );
  }
}

