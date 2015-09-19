import { TOGGLE_FILTER, KEYWORD_SEARCH } from '../constants.js';


export function toggleFilter(attribute, value) {
    return {
        type: TOGGLE_FILTER,
        filter: { attribute, value }
    }
}

export function keywordSearch(search) {
    return {
        type: KEYWORD_SEARCH,
        search
    }
}
