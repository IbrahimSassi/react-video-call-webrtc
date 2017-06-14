/* eslint-disable no-console */

import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

//import "/socket.io/socket.io.js";

import App from './components/app';

render(
	<App />,
	document.getElementById('app')
)
	;
