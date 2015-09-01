import { filterFn, collection } from '../config.js';
import { createSelector } from 'reselect';
import keywordFilter from '../helpers/keywordFilter.js'


function filter(appliedFilters, collection, functions) {

    return collection.filter(item => {

        if (!appliedFilters.size) return true;

        // filters can either be AND or OR between groups, change filterFn in config.js (always AND within group)
        return item[filterFn](attribute => {
           return attribute.some(key => {
               const fn = functions[attribute + '__' + key];
               return (typeof fn === 'function') ? fn(item) : false;
           });
        });
    });

}

const composedSelector = (appliedFilters, keyword, functions) => {
    const filteredResults = filter(appliedFilters, collection, functions);
    const keywordFiltered = keywordFilter(filteredResults, keyword);
    // other filters or sorts go here
    return keywordFiltered;
};

const appliedFiltersSelector = state => state.appliedFilters;
const keywordSelector = state => state.searchKeyword;
const functions = state => state.filterFns;

export default createSelector(
    [appliedFiltersSelector, keywordSelector, functions],
    composedSelector
);