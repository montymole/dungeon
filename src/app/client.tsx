require('./scss/main.scss');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppState, SndState } from './stores';
import { App } from './components/App';

const appState = new AppState();
const sndState = new SndState();
ReactDOM.render(<App appState={appState} sndState={sndState} />, document.getElementById('root'));
