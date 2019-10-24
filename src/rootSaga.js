import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import gameSaga from './games/creategame/sagas';
import perudoSaga from './games/perudo/saga';
import joinGameSaga from './games/joingame/sagas';

export default function* rootSaga() {
    yield all([
        authSaga(),
        gameSaga(),
        perudoSaga(),
        joinGameSaga()
    ]);
}
