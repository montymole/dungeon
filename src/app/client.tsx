require('./scss/main.scss');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppState, SndState } from './stores';
import { Dungeon } from './components/Dungeon';

const appState = new AppState();
const sndState = new SndState();
ReactDOM.render(<Dungeon appState={appState} sndState={sndState} />, document.getElementById('root'));
