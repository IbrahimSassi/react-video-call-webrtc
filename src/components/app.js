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

      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;



      socket.emit('room', { room: "room-168" })

      if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true, video: { width: 1280, height: 720 } },
          function (stream) {
            var video = document.querySelector('#localVideo');
            video.src = window.URL.createObjectURL(stream);
            video.onloadedmetadata = function (e) {
              video.play();
            };
          },
          function (err) {
            console.log("The following error occurred: " + err.name);
          }
        );
      } else {
        console.log("getUserMedia not supported");
      }



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

        })


        socket.on('put:other', (otherData) => {
          console.log("get other data");
          otherId = otherData;
          console.log("myId", myId);
          console.log("otherId", otherId);

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
  }

  render() {
    return (
      <div className="container-fluid">
        <video id="localVideo" autoplay muted></video>

      </div>
    );
  }
}

App.propTypes = {
};



export default App;
