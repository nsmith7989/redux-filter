import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root.js';
import { INIT } from '../constants';

export default function buildStore(initialState, middleware) {

    const middlewares = [
        thunk, ...middleware
    ];

    const finalStore = applyMiddleware(...middlewares)(createStore);

    const store = finalStore(
        combineReducers({
            filter: rootReducer
        }),
        initialState
    );

    store.dispatch({
        type: INIT
    });

    return store;
}
