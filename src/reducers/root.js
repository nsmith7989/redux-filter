import { combineReducers } from 'redux';

import { TOGGLE_FILTER, KEYWORD_SEARCH, TOGGLE_FILTER_ONLY, CLEAR_FILTERS, APPLY_SORT, CLEAR_ALL_FILTERS } from '../constants.js';

function toggleItem(arr, item) {
    arr = [...arr];
    const index = arr.indexOf(item);
    if (index === -1) {
        arr.push(item);
        return arr;
    } else {
        // remove
        arr.splice(index, 1);
        return arr;
    }
}

function appliedFilters(state = [], action = {}) {
    switch (action.type) {
        case TOGGLE_FILTER:
            return toggleItem(state, action.fn);
        case TOGGLE_FILTER_ONLY:
            return [].concat([action.fn]);
        case CLEAR_FILTERS:
        case CLEAR_ALL_FILTERS:
            return [];
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


export default combineReducers({
    appliedFilters,
    keywordSearch,
    subjectsCollection,
    filterFns,
    optionGroups,
    sortFn,
});