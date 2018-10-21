
import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import World from './World';
import HTML3D from './HTML3D';
import GL3D from './GL3D';
import { default as FModController } from '../audio/FModController';

@observer
export class App extends React.Component<any, any> {
  fmod: FModController;
  gEventInstance: any;
  gSurfaceIndex: any;

  async componentWillMount () {
    this.fmod = new FModController({
      preloadFiles: [
        '/fmod/Master_Bank.bank',
        '/fmod/Master_Bank.strings.bank',
        '/fmod/SFX.bank'
      ],
      initApp: () => this.fmodMounted()
    });
    await this.props.appState.loadMaterials();
    await this.props.appState.loadObject(1);
  }
  fmodMounted () {
    const { fmod } = this;
    console.log('DO SOMETIN...');
    fmod.loadBank('Master_Bank.bank');
    fmod.loadBank('Master_Bank.strings.bank');
    fmod.loadBank('SFX.bank');
    const eventDescription: any = {};
    fmod.checkResult(fmod.gSystem.getEvent('event:/Character/Player Footsteps', eventDescription));
    const paramDesc: any = {};
    fmod.checkResult(eventDescription.val.getParameter('Surface', paramDesc));
    this.gSurfaceIndex = paramDesc.index;
    const eventInstance: any = {};
    fmod.checkResult(eventDescription.val.createInstance(eventInstance));
    this.gEventInstance = eventInstance.val;
    fmod.checkResult(this.gEventInstance.setParameterValueByIndex(this.gSurfaceIndex, 1.0));
    const surfaceParameterValue = 1;
    fmod.checkResult(this.gEventInstance.setParameterValueByIndex(this.gSurfaceIndex, 1.0));
    fmod.checkResult(this.gEventInstance.getParameterValueByIndex(this.gSurfaceIndex, surfaceParameterValue, null));
  }
  testFmod () {
    const { fmod, gEventInstance, gSurfaceIndex } = this;
    if (gEventInstance) {
      fmod.checkResult(gEventInstance.setParameterValueByIndex(gSurfaceIndex, Math.random() * 3.0));
      fmod.checkResult(gEventInstance.start());
    }
    fmod.checkResult(fmod.gSystem.update());

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
    const test = 'HELLLOO WORLD JEEE JEE'.split('');
    return (
      <div>
        <button onClick={() => this.testFmod()}>FMOD TEST</button>
        {/*
        <World onInit={world => this.saveWorld(world)} gravity={{ x: 0, y: 0, z: -9.8 }}>
          <GL3D position={{ x: 0, y: 0, z: 0 }} mass={0} world={world} shape="PLANE" material={materials[0]} />
          <GL3D position={{ x: 2, y: 2, z: 2 }} mass={0} world={world} instance={objects3d[1]} />
          {test.map((a, i) =>
            <HTML3D position={{ x: -20 + i * 2, y: 0, z: 10 * i }} world={world} mass={1}>
              😀<h1>{a}</h1>
            </HTML3D>)}
          {test.map((a, i) => <GL3D position={{ x: 0, y: 10, z: 5 + i * 1.5 }} mass={1} world={world} shape="CUBE" material={materials[Math.round(Math.random() * materials.length)]} />)}
        </World>
          */}
        <DevTools />
        <div> Time {this.props.appState.timer}</div>
      </div>
    );
  }
  onReset = () => {
    this.props.appState.resetTimer();
  }
}

