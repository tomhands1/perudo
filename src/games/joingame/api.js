import { functionToCall } from '../../api/api';

// eslint-disable-next-line import/prefer-default-export
export const joinGame = request => functionToCall('games-joinGame')(request);
