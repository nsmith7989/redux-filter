import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from '../middleware/logger.js';
import hasher from '../middleware/hasher.js';
import rootReducer from '../reducers/root.js';

const middlewares = [thunk, logger, hasher];

const finalStore = applyMiddleware(...middlewares)(createStore);

// todo: read initial state from url hash


export default finalStore(rootReducer, {

});

