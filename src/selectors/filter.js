import { filterFn, collection } from '../config.js';
import { createSelector } from 'reselect';
import keywordFilter from '../helpers/keywordFilter.js'


function filter(appliedFilters, collection) {

    return collection.filter(item => {

        if (!appliedFilters.size) return true;

        // filters can either be AND or OR between groups, change filterFn in config.js (always AND within group)
        // todo: signature of these filters is wrong
        return filterFn((attribute, map) => {
            return some((key) => {
                const fn = attributeFilterFn[attribute + '__' + key];
                return (typeof fn === 'function') ? fn(item) : false;
            }, map);
        }, appliedFilters);

    });

}

const composedSelector = (appliedFilters, keyword) => {
    const filteredResults = filter(appliedFilters, collection);
    const keywordFiltered = keywordFilter(filteredResults, keyword);
    // other filters or sorts go here
    return keywordFiltered;
};

const appliedFiltersSelector = state => state.appliedFilters;
const keywordSelector = state => state.searchKeyword;

export default createSelector(
    [appliedFiltersSelector, keywordSelector],
    composedSelector
);