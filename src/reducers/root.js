import { TOGGLE_FILTER, KEYWORD_SEARCH, TOGGLE_FILTER_ONLY, CLEAR_FILTERS, APPLY_SORT, CLEAR_ALL_FILTERS, GO_TO_PAGE, UPDATE_SUBJECTS, INIT } from '../constants.js';
import toggle, { toggleOnly, clearFilter } from '../helpers/toggle.js';
import { combineReducers } from 'redux';
import { buildOptionsList } from '../helpers/buildOptions';


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

function page(state = 0, action = {}) {

    switch (action.type) {
        case GO_TO_PAGE:
            return action.page;
        case TOGGLE_FILTER:
        case TOGGLE_FILTER_ONLY:
        case CLEAR_FILTERS:
        case CLEAR_ALL_FILTERS:
        case KEYWORD_SEARCH:
            return 0; // reset to zero
        default:
            return state;
    }
}

function optionGroups(state = {}) {
    return state;
}

function subjects(state = [], action = {}) {
    switch (action.type) {
        case UPDATE_SUBJECTS:
            return action.subjects;
        default:
            return state;
    }
}

function identity(state = {}) {
    return state;
}

const combinedReducers = combineReducers({
    appliedFilters,
    keywordSearch,
    sortFn,
    page,
    optionGroups,

    // previously global config options

    subjects,
    filterableCriteria: identity,
    filterableCriteriaSortOptions: identity,
    searchKeys: identity,
    sortItems: identity,
    searchThreshold: identity,
    filterFns: identity
});

export default function reducer(state = {}, action = {}) {
    const compiledState = combinedReducers(state, action);

    if (action.type == UPDATE_SUBJECTS || action.type == INIT) {
        const { filterFns, optionGroups } =
            buildOptionsList(
                compiledState.subjects,
                compiledState.filterableCriteria,
                compiledState.filterableCriteriaSortOptions
            );

        return {...compiledState, filterFns, optionGroups};
    }
    return compiledState;

}
