import {
    all, takeEvery, put, call
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

import * as actions from './actions';
import * as api from './api';

function* createGame(action) {
    try {
        const game = yield call(api.createGame, { name: action.name });
        yield put(actions.createGameSuccess(game));
        yield put(push(`/game/${game.id}`));
    } catch (error) {
        yield put(actions.createGameError(error));
    }
}
export default function* creatGameSaga() {
    yield all([
        takeEvery(actions.CREATE_GAME_REQUEST, createGame)
    ]);
}
