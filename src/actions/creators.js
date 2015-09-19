import { TOGGLE_FILTER, KEYWORD_SEARCH, CLEAR_FILTERS } from '../constants.js';


export function toggleFilter(attribute, value) {
    return {
        type: TOGGLE_FILTER,
        filter: { attribute, value }
    }
}

export function clearFilters() {
    return {
        type: CLEAR_FILTERS
    }
}

export function keywordSearch(search) {
    return {
        type: KEYWORD_SEARCH,
        search
    }
}
