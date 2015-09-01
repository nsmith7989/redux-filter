import { TOGGLE_FILTER, KEYWORD_SEARCH } from '../constants.js';


export function toggleFilter(filter) {
    return {
        type: TOGGLE_FILTER,
        filter
    }
}

export function keywordSearch(search) {
    return {
        type: KEYWORD_SEARCH,
        search
    }
}