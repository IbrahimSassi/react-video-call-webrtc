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

      this.state = {
        loading: true
      };
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      socket.emit('room', { room: "room-168" });

    }
  }


  componentWillMount() {

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true, video: { width: 720, height: 430 } },
        (stream) => {
          let video = document.querySelector('#localVideo');
          video.src = window.URL.createObjectURL(stream);
          video.onloadedmetadata = (e) => {
            video.play();
          };
        },
        (err) => {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }



    getUserMedia({ video: true, audio: false }, (err, stream) => {
      if (err) return console.error(err);
      const Peer = require('simple-peer');
      const peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream: stream
      });

      peer.on('signal', (data) => {
        socket.emit('first:userJoin', {
          data: data,
          room: "room-168"
        });

      });


      //getting other data;      
      socket.on('put:other', (otherData) => {
        peer.signal(otherData);
      });



      //lunching stream
      peer.on('stream', (stream) => {
        this.setState({
          loading: false
        });
        console.log("Go to stream");
        let video = document.querySelector('#remoteVideo');
        video.src = window.URL.createObjectURL(stream);
        video.play();
      });
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div >
          <h5>You</h5>
          <video id="localVideo" autoPlay muted></video>
        </div>
        <h5>Him</h5>
        {this.state.loading && <span>Loading to establish connection , just a few seconds
          <img src="https://thomas.vanhoutte.be/miniblog/wp-content/uploads/light_blue_material_design_loading.gif" alt="" />
        </span>}
        <video id="remoteVideo" autoPlay></video>

      </div>
    );
  }
}

App.propTypes = {
};



export default App;
