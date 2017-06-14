/* eslint-disable no-console */

import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './components/app';

render(
	<App />,
	document.getElementById('app')
)
	;
