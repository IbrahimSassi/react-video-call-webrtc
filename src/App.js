import React, { Component } from 'react';
import './App.css';
import getUserMedia from 'getusermedia';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    getUserMedia({ video: true, audio: false }, (err, stream) => {
      if (err) return console.error(err)

      var Peer = require('simple-peer')
      var peer = new Peer({
        initiator: window.location.hash === '#init',
        trickle: false,
        stream: stream
      })

      peer.on('signal', function (data) {
        console.log(JSON.stringify(data));
        document.getElementById('yourId').value = JSON.stringify(data)
      })

      document.getElementById('connect').addEventListener('click', function () {
        var otherId = JSON.parse(document.getElementById('otherId').value)
        peer.signal(otherId)
      })

      peer.on('data', function (data) {
        document.getElementById('messages').textContent += data + '\n'
      })

      peer.on('stream', function (stream) {
        var video = document.createElement('video')
        document.body.appendChild(video)

        video.src = window.URL.createObjectURL(stream)
        video.play()
      })
    })
  }

  render() {
    return (
      <div className="App">
        <label>Your ID:</label><br />
        <textarea id="yourId"></textarea><br />
        <label>Other ID:</label><br />
        <textarea id="otherId"></textarea>
        <button id="connect">connect</button><br />
      </div>
    );
  }
}

export default App;
