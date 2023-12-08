import { useEffect } from 'react';

import io from 'socket.io-client';

const url = 'localhost:3131';

const socket = io(url);

function onConnect() {
  console.log('- connect');
}

function onDisconnect() {
  console.log('- disconnect');
}

function checkUsername(username) {
  socket.emit('check', username, (err, response) => {
    if (err) {
      console.error(err);
    }

    console.log(response);
  });
}

function useCoordinator() {
  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
  }, []);

  return [ checkUsername, status ];
}

export default useCoordinator;
