import * as actions from './actions';

const initState = {
    guess: { quantity: 4, value: 6 },
    loading: false
};

const perudoReducer = (state = initState, action) => {
    switch (action.type) {
    case actions.SUBMIT_GUESS_STARTED: {
        return {
            ...state,
            loading: true
        };
    }
    case actions.SUBMIT_GUESS_SUCCESS: {
        return {
            ...state,
            loading: false,
            guess: action.guess
        };
    }
    case actions.RECEIVED_GUESS_SUCCESS: {
        return {
            ...state,
            loading: false,
            guess: action.guess
        };
    }
    default:
        return state;
    }
};

export default perudoReducer;
