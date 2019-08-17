require('./scss/main.scss');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Game } from './components/Game';
import { TestGround } from './components/TestGround';
import { FMODState, GameState } from './stores';

const gameState = new GameState();
const fmodState = new FMODState();
ReactDOM.render(<TestGround gameState={gameState} fmodState={fmodState} />, document.getElementById('root'));
