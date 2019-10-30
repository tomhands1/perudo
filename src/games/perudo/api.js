import { functionToCall } from '../../api/api';

export const rollDice = request => functionToCall('perudo-rollDice')(request).then(
    response => response.data
);

export const submitGuess = request => functionToCall('perudo-submitGuess')(request);

export const readyUp = request => functionToCall('games-readyUp')(request);

export const startGame = request => functionToCall('games-startGame')(request);

export const callNo = request => functionToCall('perudo-callNo')(request);

export const callExact = request => functionToCall('perudo-callExact')(request);

export const quitGame = request => functionToCall('games-quitGame')(request);
