import fp from 'lodash/fp';

const getRoot = state => state.perudo;

export const getNumOfDice = fp.flow(
    getRoot,
    state => state.numOfDice
);

export const getRolling = fp.flow(
    getRoot,
    state => state.rolling
);

export const getGameId = props => fp.flow(
    fp.get('match'),
    fp.get('params'),
    fp.get('gameId')
)(props);

export const getGame = (state, props) => fp.flow(
    fp.get('firestore'),
    fp.get('data'),
    fp.get('games'),
    fp.get(getGameId(props))
)(state);

export const getPlayers = state => fp.flow(
    fp.get('firestore'),
    fp.get('data'),
    fp.get('players'),
)(state);

export const getRolls = state => fp.flow(
    fp.get('firestore'),
    fp.get('data'),
    fp.get('secretRolls'),
)(state);
