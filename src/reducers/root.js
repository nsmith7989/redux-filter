import { combineReducers } from 'redux';
import { TOGGLE_FILTER, KEYWORD_SEARCH } from '../constants.js';

function appliedFilters(state = {}, action = null) {
    switch (action.type) {
        case TOGGLE_FILTER:
            return action.filter;
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

export default combineReducers({
    appliedFilters,
    keywordSearch
})