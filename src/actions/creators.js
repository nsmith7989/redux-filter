import { TOGGLE_FILTER, KEYWORD_SEARCH, TOGGLE_FILTER_ONLY, CLEAR_FILTERS, APPLY_SORT, CLEAR_ALL_FILTERS, GO_TO_PAGE, UPDATE_SUBJECTS, INIT } from '../constants.js';


export function toggleFilter(attribute, value) {
    return {
        type: TOGGLE_FILTER,
        filter: { attribute, value }
    };
}

export function toggleOnly(attribute, value) {
    return {
        type: TOGGLE_FILTER_ONLY,
        filter: { attribute, value }
    };
}

export function clearFilters(attribute) {
    return {
        type: CLEAR_FILTERS,
        filter: { attribute }
    };
}

export function keywordSearch(search) {
    return {
        type: KEYWORD_SEARCH,
        search
    };
}

export function applySort(func) {
    return {
        type: APPLY_SORT,
        func
    };
}

export function clearAllFilters() {
    return {
        type: CLEAR_ALL_FILTERS
    };
}

export function goToPage(page) {
    return {
        type: GO_TO_PAGE,
        page
    };
}

export function updateSubjects(subjects) {
    return {
        type: UPDATE_SUBJECTS,
        subjects
    };
}

export function init() {
    return {
        type: INIT
    };
}
