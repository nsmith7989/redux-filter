import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root.js';
import {buildOptionsList} from '../helpers/buildOptions';


export function buildInitialState({filterableCriteria, filterableCriteriaSortOptions}) {

    return function rebuild(subjects) {
        const {filterFns, optionGroups} = buildOptionsList(subjects, filterableCriteria, filterableCriteriaSortOptions);
        return {filterFns, optionGroups, subjectsCollection: subjects};
    };
}

export default function buildStore(subjectsCollection, config, middleware, initialState) {

    const middlewares = [
        thunk, ...middleware
    ];
    const finalStore = applyMiddleware(...middlewares)(createStore);

    const {filterableCriteria, filterableCriteriaSortOptions} = config;

    const updateSubjects = buildInitialState({filterableCriteria, filterableCriteriaSortOptions});

    return finalStore(rootReducer(updateSubjects), {
        ...initialState,
        ...updateSubjects(subjectsCollection)
    });
}
