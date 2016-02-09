import Fuse from 'fuse.js';
import { createSelector } from 'reselect';
import { buildOptionsList } from '../helpers/buildOptions';

const subjects = state => state.subjects;
const filterableCriteria = state => state.filterableCriteria;
const filterableCriteriaSortOptions = state => state.filterableCriteriaSortOptions;

const appliedFilters = state => state.appliedFilters;
const keywordSearch = state => state.keywordSearch;

const filterFns = state => state.filterFns;

const searchKeys = state => state.searchKeys;
const sortFn = state => state.sortFn;
const searchThreshold = state => state.searchThreshold;

function keywordFilter(items, searchText, keys, searchThreshold) {

    if (searchText === undefined || searchText === '') return items;

    var f = new Fuse(items, {
        caseSensitive: false,
        includeScore: false,
        shouldSort: false,
        threshold: searchThreshold,
        keys: keys || searchKeys
    });

    return f.search(searchText);

}


function filter(appliedFilters, collection, functions) {

    return collection.filter(item => {

        if (!Object.keys(appliedFilters).length) return true;

        return Object.keys(appliedFilters).every(key => {
            return appliedFilters[key].some(value => {
                const fn = functions[key + '__' + value];
                return (typeof fn === 'function') ? fn(item) : false;
            });
        });
    });

}

const multiPartFilter = (appliedFilters, keyword, subjectsCollection, functions, sortFn, searchThreshold) => {
    const filteredResults = filter(appliedFilters, subjectsCollection, functions);
    const keywordFiltered = keywordFilter(filteredResults, keyword, searchThreshold);
    return sortFn.fn(keywordFiltered);
};


export const collection = createSelector(
    [appliedFilters, keywordSearch, subjects, filterFns, sortFn, searchThreshold],
    multiPartFilter
);

export const optionGroups = createSelector(
    [subjects, filterableCriteria, filterableCriteriaSortOptions],
    buildOptionsList
);
