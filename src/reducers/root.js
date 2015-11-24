import { combineReducers } from 'redux';

import { TOGGLE_FILTER, KEYWORD_SEARCH, TOGGLE_FILTER_ONLY, CLEAR_FILTERS, APPLY_SORT, CLEAR_ALL_FILTERS, GO_TO_PAGE } from '../constants.js';
import toggle, {toggleOnly, clearFilter} from '../helpers/toggle.js';

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

function subjectsCollection(state = []) {
    return state;
}

function filterFns(state = {}) {
    return state;
}

function optionGroups(state = {}) {
    return state;
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

export default combineReducers({
    appliedFilters,
    keywordSearch,
    subjectsCollection,
    filterFns,
    optionGroups,
    sortFn,
    page
});