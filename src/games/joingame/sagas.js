import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

import * as actions from './actions';
import * as api from './api';

function* joinGame(action) {
    try {
        yield call(api.joinGame, { gameId: action.gameId, name: action.name });
        yield put(actions.joinGameSuccess());
        yield put(push(`/game/${action.gameId}`));
    } catch (error) {
        yield put(actions.joinGameError(error));
    }
}
export default function* joinGameSaga() {
    yield all([
        takeEvery(actions.JOIN_GAME_REQUEST, joinGame)
    ]);
}
