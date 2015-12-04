import filterFactory from './filter.js';

export default function buildSelector(searchKeys = [], searchThreshold = .6, sortItems, stateResolver = state => state) {
    // build filter selector
    const filter = filterFactory(searchKeys, searchThreshold, sortItems, stateResolver);
    return function(state) {
        return {
            collection: filter(state),
            appliedFilters: stateResolver(state).appliedFilters,
            keyword: stateResolver(state).keywordSearch,
            optionGroups: stateResolver(state).optionGroups,
            sortFn: stateResolver(state).sortFn,
            currentPage: stateResolver(state).page
        };
    };
}
