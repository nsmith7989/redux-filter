import { TOGGLE_FILTER, KEYWORD_SEARCH, TOGGLE_FILTER_ONLY, CLEAR_FILTERS } from '../constants.js';


export function toggleFilter(attribute, value) {
    return {
        type: TOGGLE_FILTER,
        filter: { attribute, value }
    }
}

export function toggleOnly(attribute, value) {
    return {
        type: TOGGLE_FILTER_ONLY,
        filter: { attribute, value }
    }
}

export function clearFilters(attribute) {
    return {
        type: CLEAR_FILTERS,
        filter: { attribute }
    }
}

export function keywordSearch(search) {
    return {
        type: KEYWORD_SEARCH,
        search
    }
}
