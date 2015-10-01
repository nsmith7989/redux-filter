import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from '../middleware/logger.js';
import hasher from '../middleware/hasher.js';
import rootReducer from '../reducers/root.js';
import { buildOptionsList } from '../helpers/buildOptions';

export default function buildStore(subjectsCollection, config, middleware) {

    const middlewares = [thunk, hasher, ...middleware];
    const finalStore = applyMiddleware(...middlewares)(createStore);

    const { filterFns, optionGroups } = buildOptionsList(
        subjectsCollection, config.filterableCriteria, config.filterableCriteriaSortOptions
    );
    return finalStore(rootReducer, {
        subjectsCollection,
        filterFns,
        optionGroups
    });
}
