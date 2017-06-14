import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import https from 'https';
import fs from 'fs';
import nodeStatic from 'node-static';
//import socket from './socket';


/* eslint-disable no-console */

const port = 11000;
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
      open(`https://localhost:${port}/#init`);
    }
  });

const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('Connected');
  // send the new user their name and a list of users

  socket.on('first:userJoin', (data) => {
    console.log('first:userJoin');
    socket.broadcast.to(data.room).emit('put:other',
      data.data)
  });

  socket.on('room', (data) => {
    console.log('new room', data.room);
    socket.join(data.room);
  }); 

});



app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});


