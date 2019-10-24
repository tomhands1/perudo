import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import { connectRouter } from 'connected-react-router';
import authReducer from './auth/reducer';
import perudoReducer from './games/perudo/reducer';
import * as authActions from './auth/actions';

const appReducer = history => combineReducers({
    auth: authReducer,
    perudo: perudoReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    router: connectRouter(history)
});

const rootReducer = history => (state, action) => {
    if (action.type === authActions.SIGN_OUT_SUCCESS) {
        // eslint-disable-next-line no-param-reassign
        state = undefined;
    }
    return appReducer(history)(state, action);
};

export default rootReducer;
