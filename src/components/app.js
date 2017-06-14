/**
 * Created by Ibrahim on 10/03/2017.
 */

import React, { PropTypes } from 'react';
import getUserMedia from 'getusermedia';
const io = require('socket.io-client');
const socket = io();

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    {
      socket.emit('room', { room: "room-168" })

      getUserMedia({ video: true, audio: false }, function (err, stream) {
        if (err) return console.error(err);

        var myId = {};
        var otherId = {};
        var Peer = require('simple-peer');
        var peer = new Peer({
          initiator: location.hash === '#init',
          trickle: false,
          stream: stream
        });

        peer.on('signal', function (data) {
          console.log("signal called");
          myId = data;
          console.log("myId", myId);
          console.log("otherId", otherId);
          //if (myId == {})
            socket.emit('first:userJoin', {
              data: data,
              room: "room-168"
            });

          document.getElementById('yourId').value = JSON.stringify(data);
        })


        socket.on('put:other', (otherData) => {
          console.log("get other data");
          otherId = otherData;
          console.log("myId", myId);
          console.log("otherId", otherId);

          document.getElementById('otherId').value = JSON.stringify(otherData);
          peer.signal(otherId);
        })
        
        document.getElementById('connect').addEventListener('click', function () {
          var otherId = JSON.parse(document.getElementById('otherId').value);
          peer.signal(otherId);
        })
        

        peer.on('stream', function (stream) {
          console.log("Go to stream");
          let video = document.createElement('video');
          document.body.appendChild(video);

          video.src = window.URL.createObjectURL(stream);
          video.play();
        })
      })

    }
  }


  componentDidMount() {
    /*
    socket.on('send:message', this._messageRecieve);
    socket.on('user:join', this._userJoined);
    socket.on('user:left', this._userLeft);
    socket.on('change:name', this._userChangedName);
    */
  }

  render() {
    return (
      <div className="container-fluid">
        <label>Your ID:</label><br />
        <textarea id="yourId"></textarea><br />
        <label>Other ID:</label><br />
        <textarea id="otherId"></textarea>
        <button id="connect">connect</button><br />

        <label>Enter Message:</label><br />
        <textarea id="yourMessage"></textarea>
        <button id="send">send</button>
        <pre id="messages"></pre>
      </div>
    );
  }
}

App.propTypes = {
};



export default App;
