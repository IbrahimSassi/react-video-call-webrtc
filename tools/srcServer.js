import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import https from 'https';
import fs from 'fs';
import nodeStatic from 'node-static';


/* eslint-disable no-console */

const port = 9001;
const app = express();
const compiler = webpack(config);

const options = {
  key: fs.readFileSync('server.key').toString(),
  cert: fs.readFileSync('server.crt').toString()
};



app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

let server = https.createServer(options, app)
.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    open(`https://localhost:${port}`);
  }
});

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, '../src/index.html'));
});


