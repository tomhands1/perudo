import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

import * as api from './api';
import * as actions from './actions';

function* getDice(action) {
    try {
        const diceRolled = yield call(api.rollDice, { gameId: action.gameId });
        yield put(actions.diceRollSuccess(diceRolled));
    } catch (error) {
        yield put(actions.diceRollError(error));
    }
}

function* readyUp(action) {
    try {
        yield call(api.readyUp, { gameId: action.gameId });
        yield put(actions.readyUpSuccess());
    } catch (error) {
        yield put(actions.readyUpError(error));
    }
}

function* startGame(action) {
    try {
        yield call(api.startGame, { gameId: action.gameId });
        yield put(actions.startGameSuccess());
    } catch (error) {
        yield put(actions.startGameError(error));
    }
}

function* submitGuess(action) {
    try {
        yield call(api.submitGuess, {
            gameId: action.gameId,
            bid:
            {
                quantity: action.quantity,
                value: action.value
            }
        });
        yield put(actions.submitGuessSuccess({ quantity: action.quantity, value: action.value }));
    } catch (error) {
        yield put(actions.submitGuessError(error));
    }
}

function* callNo(action) {
    try {
        yield call(api.callNo, { gameId: action.gameId });
        yield put(actions.callNoSuccess());
    } catch (error) {
        yield put(actions.callNoError(error));
    }
}

function* callExact(action) {
    try {
        yield call(api.callExact, { gameId: action.gameId });
        yield put(actions.callExactSuccess());
    } catch (error) {
        yield put(actions.callExactError(error));
    }
}

function* quitGame(action) {
    try {
        yield call(api.quitGame, { gameId: action.gameId });
        yield put(actions.quitGameSuccess());
        yield put(push('/'));
    } catch (error) {
        yield put(actions.quitGameError(error));
    }
}

export default function* perudoSaga() {
    yield all([
        takeEvery(actions.DICE_ROLL_STARTED, getDice),
        takeEvery(actions.READY_TO_PLAY, readyUp),
        takeEvery(actions.START_GAME, startGame),
        takeEvery(actions.SUBMIT_GUESS, submitGuess),
        takeEvery(actions.CALL_NO, callNo),
        takeEvery(actions.CALL_EXACT, callExact),
        takeEvery(actions.QUIT_GAME, quitGame)
    ]);
}
