export default io => {

  io.on('connection', (socket) => {

    //connection established
    console.log('Connected');

    //creating room for each users
    socket.on('room', (data) => {
      console.log('new room', data.room);
      socket.join(data.room);
    });

    //waiting for the first who connect to extract his data and send it
    socket.on('first:userJoin', (data) => {
      console.log('first:userJoin');
      //sending to specific users
      socket
        .broadcast.to(data.room)
        .emit('put:other',
        data.data)
    });



  });


}
