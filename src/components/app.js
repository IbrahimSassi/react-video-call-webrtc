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
        console.log('Send signal ..');
        socket.emit('first:userJoin', {
          data: data,
          room: "room-168"
        });

      });


      //getting other data;      
      socket.on('put:other', (otherData) => {
        console.log('Get other id ..');
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
        <div className="well">
          <h5>You</h5>
          <video id="localVideo" autoPlay muted></video>
        </div>
        <div className="well">

          <h5>Him</h5>
          {this.state.loading && <span>Loading to establish connection , just a few seconds (30-40sc)
          <img src="https://design.printexpress.co.uk/wp-content/uploads/2015/10/04-spinner.gif" alt="" width="200" height="200" />
          </span>}
          <video id="remoteVideo" autoPlay></video>
        </div>
      </div>
    );
  }
}

App.propTypes = {
};



export default App;
