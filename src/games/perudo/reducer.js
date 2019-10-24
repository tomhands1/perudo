import fp from 'lodash/fp';

import * as actions from './actions';

const initState = {
    guess: { quantity: 0, value: 0, lastDice: false },
    numOfDice: 5,
    diceArray: [],
    shakerUp: false,
    diceFetched: false,
    isReady: ''
};

const perudoReducer = (state = initState, action) => {
    switch (action.type) {
    case actions.RESTART_GAME: {
        return fp.set('numOfDice', initState.numOfDice)(state);
    }
    case actions.NEW_ROUND: {
        return fp.set('shakerUp', false)(state);
    }
    case actions.DICE_ROLL_SUCCESS: {
        return fp.flow(
            fp.set('shakerUp', true),
            fp.set('diceFetched', true),
            fp.set('diceArray', action.diceArray),
            fp.set('numOfDice', action.diceArray.length)
        )(state);
    }
    case actions.SUBMIT_GUESS_SUCCESS: {
        return fp.set('guess', action.guess)(state);
    }
    case actions.TOGGLE_SHAKER: {
        return fp.set('shakerUp', !state.shakerUp)(state);
    }
    case actions.READY_TO_PLAY: {
        return fp.set('isReady', 'PREPARING')(state);
    }
    case actions.READY_UP_SUCCESS: {
        return fp.set('isReady', 'READY')(state);
    }
    case actions.READY_UP_ERROR: {
        return fp.flow(
            fp.set('isReady', 'ERROR'),
            fp.set('readyUpError', action.errorMessage),
        )(state);
    }
    default:
        return state;
    }
};

export default perudoReducer;
