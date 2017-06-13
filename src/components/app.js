/**
 * Created by Ibrahim on 10/03/2017.
 */

import React, { PropTypes } from 'react';
import getUserMedia from 'getusermedia';
class App extends React.Component {

  constructor(props, context) {
    super(props, context)
    {
      getUserMedia({ video: true, audio: false }, function (err, stream) {
        if (err) return console.error(err)

        var Peer = require('simple-peer')
        var peer = new Peer({
          initiator: location.hash === '#init',
          trickle: false,
          stream: stream
        })

        peer.on('signal', function (data) {
          document.getElementById('yourId').value = JSON.stringify(data)
        })

        document.getElementById('connect').addEventListener('click', function () {
          var otherId = JSON.parse(document.getElementById('otherId').value)
          peer.signal(otherId)
        })

        document.getElementById('send').addEventListener('click', function () {
          var yourMessage = document.getElementById('yourMessage').value
          peer.send(yourMessage)
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
