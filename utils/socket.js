import {io} from 'socket.io-client'

// const socket = io('https://chatchit-server.herokuapp.com');
const socket = io('http://localhost:1405');

export default socket