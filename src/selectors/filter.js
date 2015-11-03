import Fuse from 'fuse.js';
import { createSelector } from 'reselect';

export default function(searchKeys, searchThreshold) {

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


    function filter(appliedFilters, collection) {

        return collection.filter(item => {

            if (!Object.keys(appliedFilters).length) return true;
            // must pass all
            return appliedFilters.every(fn => fn(item));

        });

    }

    const composedSelector = (appliedFilters, keyword, subjectsCollection, functions, sortFn) => {
        const filteredResults = filter(appliedFilters, subjectsCollection, functions);
        const keywordFiltered = keywordFilter(filteredResults, keyword);
        return sortFn.fn(keywordFiltered);

    };

    const appliedFiltersSelector = state => state.appliedFilters;
    const keywordSelector = state => state.keywordSearch;
    const functions = state => state.filterFns;
    const subjectsCollection = state => state.subjectsCollection;
    const sortFn = state => state.sortFn;



    return createSelector(
        [appliedFiltersSelector, keywordSelector, subjectsCollection, functions, sortFn],
        composedSelector
    );
}