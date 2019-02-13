import * as React from "react";
import MusicController from '../audio/MusicController';

export class AudioEditor extends React.Component<any, any> {
  music: MusicController;
  async componentDidMount() {
    this.music = new MusicController();
  }
  test() {
    console.log('testing now...');
    this.music.begin();
  }
  render() {
    return <button onClick={() => this.test()}>Toimii</button>
  }
}