import * as React from 'react';
import { CSSActor, Item } from './';

export class ItemDebug extends React.Component<any, any> {
  synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
  }
  render() {
    const { world, visibleItems } = this.props;
    return (
      (visibleItems &&
        visibleItems.map((item) => (
          <CSSActor key={item.id} world={world} position={{ x: item.x, z: item.y, y: 2 }} rotation={{ y: 0, x: -90 * (Math.PI / 180), z: 0 }}>
            <small>{item.symbol}</small>
            <Item key={item.id} world={world} position={{ x: item.x, z: item.y, y: 0.15 }} />
          </CSSActor>
        ))) ||
      null
    );
  }
}
