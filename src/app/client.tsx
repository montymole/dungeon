require('./scss/main.scss');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppState } from './stores';
import { App } from './components/App';

const appState = new AppState();
ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
