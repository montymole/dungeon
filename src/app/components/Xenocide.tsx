import * as React from "react";
import { observer } from "mobx-react";
import { World, XenoLevel } from "./";

@observer
export class Xenocide extends React.Component<any, any> {
  render() {
    const { worldState } = this.props;
    const { world } = worldState;
    const cameraPosition = { x: -10, y: -10, z: 10 };

    return (
      <World onInit={world => this.props.worldState.saveWorld(world)} camera={cameraPosition} width={window.innerWidth} height={window.innerHeight}>
        <XenoLevel world={world} />
      </World>
    )
  }
}