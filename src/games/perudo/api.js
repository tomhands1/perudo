import { functionToCall } from '../../api/api';

export const rollDice = request => functionToCall('rollDice')(request).then(
    response => response.data
);

export const submitGuess = request => functionToCall('submitGuess')(request);

export const readyUp = request => functionToCall('readyUp')(request);

export const startGame = request => functionToCall('startGame')(request);

export const callNo = request => functionToCall('callNo')(request);

export const callExact = request => functionToCall('callExact')(request);
