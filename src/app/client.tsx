require('./scss/main.scss');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GameState, WorldState } from './stores';
import { Game } from './components/Game';
import { AudioEditor } from './components/AudioEditor';
import { Xenocide } from './components/Xenocide';

let App;

switch (window['app']) {
  case 'audio':
    App = <AudioEditor />;
    break;
  case 'xenocide':
    App = <Xenocide worldState={new WorldState()} />;
    break;
  default:
    const gameState = new GameState();
    App = <Game gameState={gameState} />;
}
ReactDOM.render(App, document.getElementById('root'));
