import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root.js';
import { buildOptionsList } from '../helpers/buildOptions';

export default function buildStore(subjectsCollection, config, middleware, initialState) {

    const middlewares = [thunk, ...middleware];
    const finalStore = applyMiddleware(...middlewares)(createStore);

    const { filterFns, optionGroups } = buildOptionsList(
        subjectsCollection, config.filterableCriteria, config.filterableCriteriaSortOptions
    );
    return finalStore(rootReducer, {
        ...initialState,
        subjectsCollection,
        filterFns,
        optionGroups
    });
}
