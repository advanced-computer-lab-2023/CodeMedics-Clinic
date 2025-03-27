import { io } from 'socket.io-client';
import { BACKEND_ROUTE } from 'src/utils/Constants';

const URL = 'http://localhost:8000';
const socket = io(BACKEND_ROUTE);

export default socket;