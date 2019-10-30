import { functionToCall } from '../../api/api';

// eslint-disable-next-line import/prefer-default-export
export const createGame = request => functionToCall('games-createGame')(request).then(response => response.data);
