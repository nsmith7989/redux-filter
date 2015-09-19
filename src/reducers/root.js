import { combineReducers } from 'redux';

import { TOGGLE_FILTER, KEYWORD_SEARCH } from '../constants.js';
import toggle from '../helpers/toggle.js'

function appliedFilters(state = {}, action = null) {
    switch (action.type) {
        case TOGGLE_FILTER:
            const { attribute: key, value } = action.filter;
            return toggle(state, key, value);
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

function subjectsCollection(state = [], action = {}) {
    return state;
}

function filterFns(state = {}, action = {}) {
    return state;
}

function optionGroups(state = {}, action = {}) {
    return state;
}


export default combineReducers({
    appliedFilters,
    keywordSearch,
    subjectsCollection,
    filterFns,
    optionGroups,
})