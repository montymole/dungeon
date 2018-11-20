require('./scss/main.scss');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GameState, FMODState } from './stores';
import { Game } from './components/Game';

const gameState = new GameState();
const fmodState = new FMODState();
ReactDOM.render(<Game gameState={gameState} fmodState={fmodState} />, document.getElementById('root'));
