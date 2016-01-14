import Fuse from 'fuse.js';
import { createSelector } from 'reselect';

export default function(searchKeys, searchThreshold, sortItems, stateResolver = state => state) {

    function keywordFilter(items, searchText, keys) {

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

    const composedSelector = (appliedFilters, keyword, subjectsCollection, functions, sortFn) => {
        const filteredResults = filter(appliedFilters, subjectsCollection, functions);
        const keywordFiltered = keywordFilter(filteredResults, keyword);
        return sortFn.fn(keywordFiltered);
    };

    const appliedFiltersSelector = state => stateResolver(state).appliedFilters;
    const keywordSelector = state => stateResolver(state).keywordSearch;
    const functions = state => stateResolver(state).filterFns;
    const subjectsCollection = state => stateResolver(state).subjectsCollection;
    const sortFn = state => stateResolver(state).sortFn;


    return createSelector(
        [appliedFiltersSelector, keywordSelector, subjectsCollection, functions, sortFn],
        composedSelector
    );
}
