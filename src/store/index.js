import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root.js';
import { buildOptionsList } from '../helpers/buildOptions';

export function buildInitialState({subjectsCollection,
    filterableCriteria,
    filterableCriteriaSortOptions}) {

    const { filterFns, optionGroups } = buildOptionsList(
        subjectsCollection, filterableCriteria, filterableCriteriaSortOptions
    );

    return {
        filterFns,
        optionGroups,
        subjectsCollection
    };
}

export default function buildStore(subjectsCollection, config, middleware, initialState) {

    const middlewares = [thunk, ...middleware];
    const finalStore = applyMiddleware(...middlewares)(createStore);

    const { filterableCriteria, filterableCriteriaSortOptions } = config;

    return finalStore(rootReducer, {
        ...initialState,
        ...buildInitialState({
            subjectsCollection,
            filterableCriteria,
            filterableCriteriaSortOptions
        })
    });
}
