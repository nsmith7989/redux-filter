import filter from './filter';

export default function selector(state) {
    return {
        collection: filter(state),
        appliedFilters: state.appliedFilters,
        keywordSearch: state.keywordSearch
    }
}