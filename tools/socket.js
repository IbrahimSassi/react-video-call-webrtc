export default socket => {

    socket.on('connection', (socket) => {
        console.log('Connected');
    });
    // send the new user their name and a list of users
    socket.emit('init', {
        message: "Hello"
    });
    /*
      // notify other clients that a new user has joined
      socket.broadcast.emit('user:join', {
        name: name
      });
    
      // broadcast a user's message to other users
      socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
          user: name,
          text: data.text
        });
      });
    
      // validate a user's name change, and broadcast it on success
      socket.on('change:name', function (data, fn) {
        if (userNames.claim(data.name)) {
          var oldName = name;
          userNames.free(oldName);
    
          name = data.name;
          
          socket.broadcast.emit('change:name', {
            oldName: oldName,
            newName: name
          });
    
          fn(true);
        } else {
          fn(false);
        }
      });
      */

}
