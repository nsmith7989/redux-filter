import { combineReducers } from 'redux';

import { TOGGLE_FILTER, KEYWORD_SEARCH, TOGGLE_FILTER_ONLY, CLEAR_FILTERS, APPLY_SORT, CLEAR_ALL_FILTERS, GO_TO_PAGE, UPDATE_SUBJECTS } from '../constants.js';
import toggle, {toggleOnly, clearFilter} from '../helpers/toggle.js';
import { buildInitialState } from '../store/index';

function appliedFilters(state = {}, action = null) {
    switch (action.type) {
        case TOGGLE_FILTER:
            let { attribute: key, value } = action.filter;
            return toggle(state, key, value);
        case TOGGLE_FILTER_ONLY:
            return toggleOnly(state, action.filter.attribute, action.filter.value);
        case CLEAR_FILTERS:
            return clearFilter(state, action.filter.attribute);
        case CLEAR_ALL_FILTERS:
            return {};
        default:
            return state;
    }
}
function keywordSearch(state = '', action = null) {
    switch (action.type) {
        case KEYWORD_SEARCH:
            return action.search;
        default:
            return state;
    }
}


function sortFn(state = { fn: (items) => items }, action = {}) {
    switch (action.type) {
        case APPLY_SORT:
            return action.func;
        default:
            return state;
    }
}

function page(state = 1, action = {}) {

    switch (action.type) {
        case GO_TO_PAGE:
            return action.page;
        case TOGGLE_FILTER:
        case TOGGLE_FILTER_ONLY:
        case CLEAR_FILTERS:
        case CLEAR_ALL_FILTERS:
        case KEYWORD_SEARCH:
            return 1; //
        default:
            return state;
    }
}

function subjectsCollection(state = []) {
    return state;
}

function filterFns(state = {}) {
    return state;
}

function optionGroups(state = {}) {
    return state;
}

export default function buildReducer(updateSubjects) {

    return function reducer(state = {}, action = {}) {

        const compiledState = {
            appliedFilters: appliedFilters(state.appliedFilters, action),
            keywordSearch: keywordSearch(state.keywordSearch, action),
            sortFn: sortFn(state.sortFn, action),
            page: page(state.page),
            subjectsCollection: subjectsCollection(state.subjectsCollection, action),
            filterFns: filterFns(state.filterFns, action),
            optionGroups: optionGroups(state.optionGroups, action)
        };

        switch (action.type) {
            case UPDATE_SUBJECTS:
                return {
                    ...compiledState,
                    ...updateSubjects(action.subjects)
                };
            default:
                return compiledState;
        }
    }
}
