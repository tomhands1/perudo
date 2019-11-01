import fp from 'lodash/fp';

import * as actions from './actions';

const initState = {
    guess: { quantity: 0, value: 0 },
    numOfDice: 5,
    diceArray: [],
    shakerUp: false,
    diceFetched: false
};

const perudoReducer = (state = initState, action) => {
    switch (action.type) {
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
    default:
        return state;
    }
};

export default perudoReducer;
