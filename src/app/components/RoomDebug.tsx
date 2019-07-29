import * as React from 'react';
import { CSSActor } from './';

export class RoomDebug extends React.Component<any, any> {
  synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
  }
  render() {
    const { world, dungeonMap } = this.props;
    return (
      (dungeonMap &&
        dungeonMap.rooms.map((room) => (
          <CSSActor
            key={`r_${room.id}`}
            world={world}
            position={{
              x: room.x - 1 + Math.round(room.w / 2),
              z: room.y - 1 + Math.round(room.h / 2),
              y: 3.5
            }}
            rotation={{ y: 0, x: -90 * (Math.PI / 180), z: 0 }}
          >
            <h2
              onClick={() => this.synthVoice(room.name)}
              style={{
                width: room.w * 10 + 'px',
                height: room.h * 10 + 'px'
              }}
            >
              {room.name}
            </h2>
          </CSSActor>
        ))) ||
      null
    );
  }
}
